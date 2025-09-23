import { Env } from '@/constants/env';
import * as FileSystem from 'expo-file-system';

/**
 * Hair analysis service using Gemini vision models
 * 
 * Current: Uses gemini-1.5-pro for facial analysis and hair compatibility scoring
 * Future: Will use gemini-2.5-flash-image-preview (nano banana) for image generation features
 */

export type HairMetrics = {
  faceShape: number;
  facialRatio: number;
  hairType: number;
  jawline: number;
  hairline: number;
  earShape: number;
};

export type AnalysisOutcome =
  | { ok: true; metrics: HairMetrics; average: number; faceShapeLabel: string; hairTypeLabel: string }
  | { ok: false; reason: 'no_face' | 'api_error'; message: string };

function clampToRange(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function computeAverage(metrics: HairMetrics): number {
  const values = Object.values(metrics);
  const avg = values.reduce((a, b) => a + b, 0) / values.length;
  return Math.round(avg);
}

/**
 * Calls Gemini to analyze a photo for hairstyle-to-face compatibility.
 * Ensures: 40 <= metric <= 80, and returns average as integer.
 */
export async function analyzeHairMatch(imageUri: string): Promise<AnalysisOutcome> {
  if (!Env.geminiApiKey) {
    return { ok: false, reason: 'api_error', message: 'Missing API key' };
  }

  try {
    const base64 = await FileSystem.readAsStringAsync(imageUri, { encoding: FileSystem.EncodingType.Base64 });

    // Use Gemini 1.5 Pro for vision analysis (facial recognition)
    // Note: For future image generation, use gemini-2.5-flash-image-preview (nano banana)
    const endpoint = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent';
    const prompt = `You are an expert barber and facial analysis assistant. Analyze the photo STRICTLY and return structured JSON only.

Validation requirements (gate):
- The person's FULL head (front or side/profile is acceptable) including hair must be fully inside the frame, sharp, and reasonably well-lit.
- The head should not be heavily obstructed (no large hats/hoodies covering hair) and should not be cropped at the top or bottom.
- If these requirements are NOT met, set faceDetected=false.

If faceDetected=true, compute objective compatibility scores from 0-100 (integers) that make sense given visible features (avoid rounding everything to 0/5). Use natural variety.

Return JSON EXACTLY in this shape:
{
  "faceDetected": boolean,
  "validation": {
    "headFullyVisible": boolean,
    "hairClearlyVisible": boolean,
    "lightingOk": boolean
  },
  "scores": {
    "faceShape": number,
    "facialRatio": number,
    "hairType": number,
    "jawline": number,
    "hairline": number,
    "earShape": number
  },
  "faceShapeLabel": "oval|round|square|heart|diamond|oblong|triangle",
  "hairTypeLabel": "straight|wavy|curly|coily"
}`;

    const body = {
      contents: [
        {
          role: 'user',
          parts: [
            { text: prompt },
            {
              inlineData: {
                mimeType: 'image/jpeg',
                data: base64,
              },
            },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.2,
        responseMimeType: 'application/json',
        maxOutputTokens: 1024,
      },
    } as const;

    const res = await fetch(`${endpoint}?key=${Env.geminiApiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const errorText = await res.text();
      console.error('Gemini API Error:', res.status, errorText);
      const message = res.status === 403 
        ? 'API key invalid or lacks vision model access'
        : res.status === 400
        ? 'Invalid request format'
        : `API error (${res.status}): ${errorText}`;
      return { ok: false, reason: 'api_error', message };
    }
    const data = await res.json();
    console.log('Gemini API Response:', JSON.stringify(data, null, 2));
    
    const text = data?.candidates?.[0]?.content?.parts?.find((p: any) => typeof p?.text === 'string')?.text;
    if (!text) {
      console.error('No text found in response:', data);
      return { ok: false, reason: 'api_error', message: 'No response from model' };
    }
    let parsed: any;
    try {
      parsed = typeof text === 'string' ? JSON.parse(text) : text;
    } catch (e) {
      return { ok: false, reason: 'api_error', message: 'Invalid JSON from model' };
    }

    const faceDetected: boolean = Boolean(parsed?.faceDetected);
    const validation = parsed?.validation ?? {};
    const fullOk = Boolean(validation?.headFullyVisible ?? validation?.faceFullyVisible) && Boolean(validation?.hairClearlyVisible);
    if (!faceDetected || !fullOk) {
      return { ok: false, reason: 'no_face', message: 'No clear face/hair detected' };
    }

    const raw = parsed?.scores ?? {};
    // Baseline constraints: 40–85
    const clamped: HairMetrics = {
      faceShape: clampToRange(Number(raw.faceShape ?? 62), 40, 85),
      facialRatio: clampToRange(Number(raw.facialRatio ?? 62), 40, 85),
      hairType: clampToRange(Number(raw.hairType ?? 62), 40, 85),
      jawline: clampToRange(Number(raw.jawline ?? 62), 40, 85),
      hairline: clampToRange(Number(raw.hairline ?? 62), 40, 85),
      earShape: clampToRange(Number(raw.earShape ?? 62), 40, 85),
    };

    const average = clampToRange(computeAverage(clamped), 40, 85);
    const faceShapeLabel = String(parsed?.faceShapeLabel ?? 'oval');
    const hairTypeLabel = String(parsed?.hairTypeLabel ?? 'straight');
    return { ok: true, metrics: clamped, average, faceShapeLabel, hairTypeLabel };
  } catch (e: any) {
    return { ok: false, reason: 'api_error', message: String(e?.message ?? e) };
  }
}


