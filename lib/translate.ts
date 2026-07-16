import "server-only";

import Anthropic from "@anthropic-ai/sdk";

import { serverEnv } from "@/lib/env";

export interface TranslatableFields {
  nameSq: string;
  taglineSq: string;
  descriptionSq: string;
  careSq: string;
  materialsSq: string;
}

export interface TranslatedFields {
  nameEn: string;
  taglineEn: string;
  descriptionEn: string;
  careEn: string;
  materialsEn: string;
}

const SYSTEM_PROMPT = `You translate product copy for Passion Dream, a hand-finished jewelry and beauty brand in Vlorë, Albania, from Albanian into English.

The brand voice is warm, understated luxury — editorial, never salesy. Match the register of this existing copy:
- "Delicate necklaces of pearl, starfish and mother-of-pearl — worn alone or layered."
- "Cherry-red glass drops suspended from a delicate gold knot. Arrives in our signature box — ready to gift."

Rules:
- Translate meaning and tone, not word-for-word.
- Keep it about the same length as the Albanian.
- Do not invent details that are not in the source: no materials, no prices, no claims, no origins that were not stated.
- If a source field is empty, return an empty string for it.
- Use the em dash sparingly, as above.
- Return only the JSON object. No preamble.`;

const RESPONSE_SCHEMA = {
  type: "object" as const,
  properties: {
    nameEn: { type: "string" as const },
    taglineEn: { type: "string" as const },
    descriptionEn: { type: "string" as const },
    careEn: { type: "string" as const },
    materialsEn: { type: "string" as const },
  },
  required: ["nameEn", "taglineEn", "descriptionEn", "careEn", "materialsEn"],
  additionalProperties: false,
};

/**
 * Translates the Albanian fields to English.
 *
 * The client can always overwrite the result by hand, so a soft failure here
 * must never block a save: on any error we return empty strings and let the
 * caller keep whatever English already exists.
 */
export async function translateProduct(
  fields: TranslatableFields,
): Promise<TranslatedFields | null> {
  // Nothing to translate.
  if (!fields.nameSq.trim()) return null;

  try {
    const client = new Anthropic({ apiKey: serverEnv.anthropicApiKey() });

    const response = await client.messages.create({
      model: "claude-opus-4-8",
      max_tokens: 2000,
      system: SYSTEM_PROMPT,
      output_config: { format: { type: "json_schema", schema: RESPONSE_SCHEMA } },
      messages: [
        {
          role: "user",
          content: `Translate these product fields from Albanian to English:

${JSON.stringify(
  {
    name: fields.nameSq,
    tagline: fields.taglineSq,
    description: fields.descriptionSq,
    care: fields.careSq,
    materials: fields.materialsSq,
  },
  null,
  2,
)}`,
        },
      ],
    });

    if (response.stop_reason === "refusal") return null;

    const textBlock = response.content.find((b) => b.type === "text");
    if (!textBlock || textBlock.type !== "text") return null;

    const parsed = JSON.parse(textBlock.text) as TranslatedFields;

    return {
      nameEn: String(parsed.nameEn ?? "").slice(0, 120),
      taglineEn: String(parsed.taglineEn ?? "").slice(0, 160),
      descriptionEn: String(parsed.descriptionEn ?? "").slice(0, 2000),
      careEn: String(parsed.careEn ?? "").slice(0, 600),
      materialsEn: String(parsed.materialsEn ?? "").slice(0, 300),
    };
  } catch {
    // Log nothing: the payload is user content and the error may carry the key.
    return null;
  }
}
