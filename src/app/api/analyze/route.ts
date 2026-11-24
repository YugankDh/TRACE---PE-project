import { NextRequest, NextResponse } from 'next/server';
import { analyzeScreenshotWithGemini, analyzeScreenshotLocally } from '@/lib/gemini';

export const runtime = 'nodejs';
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { imageBase64, fileName, mimeType, userApiKey } = body;

    if (!imageBase64) {
      return NextResponse.json({ error: 'Missing imageBase64' }, { status: 400 });
    }

    const apiKey = userApiKey || process.env.GEMINI_API_KEY;

    if (apiKey && apiKey.trim() !== '') {
      try {
        const analysis = await analyzeScreenshotWithGemini(
          imageBase64,
          mimeType || 'image/jpeg',
          apiKey
        );
        return NextResponse.json({
          success: true,
          mode: 'gemini',
          analysis,
        });
      } catch (geminiError: any) {
        console.warn('Gemini API call failed, falling back to local OCR analysis:', geminiError?.message || geminiError);
        const fallback = await analyzeScreenshotLocally(imageBase64, fileName || 'screenshot.png');
        return NextResponse.json({
          success: true,
          mode: 'fallback',
          warning: 'Gemini API was unreachable or key was invalid. Used local OCR and entity extractor.',
          analysis: fallback,
        });
      }
    } else {
      // Local OCR and intelligent entity extractor
      const localResult = await analyzeScreenshotLocally(imageBase64, fileName || 'screenshot.png');
      return NextResponse.json({
        success: true,
        mode: 'local-ocr',
        warning: 'Running local OCR engine. For Gemini multimodal AI, provide a key in Settings.',
        analysis: localResult,
      });
    }
  } catch (err: any) {
    console.error('API /api/analyze error:', err);
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}
