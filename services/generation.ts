import { Env } from '@/constants/env';
import * as FileSystem from 'expo-file-system';

/**
 * Generate or edit hairstyle images with Gemini 2.5 Flash Image (aka Nano Banana).
 * Returns local file URIs of generated images written to cache.
 */
function buildHairOnlyPrompt(userPrompt: string): string {
  const trimmed = userPrompt.trim();
  return [
    'Edit ONLY the hairstyle of the person in the provided photo.',
    'Keep the same person, identity, background, lighting, pose, framing, and clothes.',
    'Do NOT add or replace subjects, objects, animals, text, logos, or scenes.',
    'Do NOT generate a new scene; perform an image edit of the input photo.',
    'Change HAIR ONLY based on the request. No makeup or face reshaping. Maintain photorealism.',
    `User hair request: ${trimmed || 'subtle improvement with natural volume and texture'}`,
  ].join('\n');
}

export async function generateHairImages(prompt: string, baseImageUri?: string): Promise<string[]> {
  if (!Env.geminiApiKey) throw new Error('Missing EXPO_PUBLIC_GEMINI_API_KEY');
  if (!baseImageUri) throw new Error('A base image is required to edit the hairstyle.');

  const base64 = await FileSystem.readAsStringAsync(baseImageUri, { encoding: FileSystem.EncodingType.Base64 });
  const inlinePart = { inlineData: { mimeType: 'image/jpeg', data: base64 } };
  const hairOnlyPrompt = buildHairOnlyPrompt(prompt);

  const endpoint = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image-preview:generateContent';
  const contents = [{
    role: 'user',
    parts: [{ text: hairOnlyPrompt }, inlinePart],
  }];

  const body = {
    contents,
    generationConfig: {
      temperature: 0.4,
      // For image generation, do NOT set responseMimeType to JSON; we want inline image data
    },
  } as const;

  const res = await fetch(`${endpoint}?key=${Env.geminiApiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const msg = await res.text();
    throw new Error(`Gemini image error (${res.status}): ${msg}`);
  }
  const data = await res.json();

  // Collect all inline image parts from the first candidate
  const parts: any[] = data?.candidates?.[0]?.content?.parts ?? [];
  const images: string[] = [];
  for (let i = 0; i < parts.length; i++) {
    const p = parts[i];
    const b64 = p?.inlineData?.data || p?.inline_data?.data;
    if (b64) {
      const dataStr = String(b64);
      const file = `${FileSystem.cacheDirectory}hairiva-gen-${Date.now()}-${i}.png`;
      await FileSystem.writeAsStringAsync(file, dataStr, { encoding: FileSystem.EncodingType.Base64 });
      images.push(file);
    }
  }

  if (images.length === 0) {
    // Some responses may encode images under text with a data url; handle fallback naive parse
    const textPart = parts.find((p) => typeof p?.text === 'string')?.text as string | undefined;
    const match = textPart?.match(/"data"\s*:\s*"([A-Za-z0-9+/=]+)"/);
    if (match?.[1]) {
      const file = `${FileSystem.cacheDirectory}hairiva-gen-${Date.now()}-0.png`;
      await FileSystem.writeAsStringAsync(file, match[1], { encoding: FileSystem.EncodingType.Base64 });
      images.push(file);
    }
  }

  return images;
}


