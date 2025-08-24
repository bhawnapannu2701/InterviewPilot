import OpenAI from "openai";
import { env } from "../config/env";
import { Readable } from "stream";

const client = new OpenAI({ apiKey: env().OPENAI_API_KEY });

/**
 * Transcribe audio buffer to text.
 * - Accepts browser‑recorded audio (webm/wav/m4a/mp3).
 * - Returns plain text (empty string on failure to avoid hard errors).
 */
export async function transcribeAudio(buffer: Buffer, filename = "audio.webm"): Promise<string> {
  try {
    // Convert Buffer to Readable for SDK
    const stream = Readable.from(buffer);
    // Model choice kept flexible: prefer gpt-4o-transcribe if available; fallback to whisper-1.
    const model = process.env.OPENAI_STT_MODEL || "whisper-1";

    const resp = await client.audio.transcriptions.create({
      file: {
        // @ts-expect-error: the SDK accepts { data, name } objects for files
        data: stream as any,
        name: filename,
      },
      model,
      // language hint optional: "en" | "hi" etc.
      // language: "en",
      response_format: "text",
      temperature: 0,
    } as any);

    // SDK returns { text } or raw text depending on version/format
    // We handle either shape:
    const text = (resp as any)?.text ?? (typeof resp === "string" ? resp : "");
    return (text || "").trim();
  } catch {
    // Don't break the session if STT fails—just return empty string.
    return "";
  }
}
