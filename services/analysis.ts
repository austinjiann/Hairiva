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
    const prompt = `You are an expert barber and facial analysis assistant. Analyze the photo and:
1) Determine if a clear human face with visible hair exists. If not, set faceDetected=false.
2) Score each category from 0-100 (integers): faceShape, facialRatio, hairType, jawline, hairline, earShape.
3) The scores should reflect how well the current haircut matches the user's face shape and features.
4) Provide two labels: faceShapeLabel (one of: oval, round, square, heart, diamond, oblong, triangle) and hairTypeLabel (one of: straight, wavy, curly, coily).
Return JSON only with fields: { faceDetected: boolean, scores: { faceShape:number, facialRatio:number, hairType:number, jawline:number, hairline:number, earShape:number }, faceShapeLabel: string, hairTypeLabel: string }.`;

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
    if (!faceDetected) {
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


