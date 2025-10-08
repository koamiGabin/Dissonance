import { defineEventHandler, readBody, createError } from "h3";
import OpenAI from "openai";
import scenario from "../scenario.json" assert { type: "json" };

const COOLDOWN_MS = 15 * 60 * 1000;
const hits = new Map<string, number>();

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event);
  const body = await readBody<{
    lobbyId: string;
    question: string;
    roomId?: number;
    state?: Record<string, any>;
    contextNote?: string; // Permettra d'ajouter un contexte supplementaire quand Godot sera connecté
  }>(event);

  if (!body?.lobbyId || !body?.question || !body.question.trim()) {
    throw createError({
      statusCode: 400,
      statusMessage: "Paramètres manquants",
    });
  }
  body.question = body.question.trim();

  const now = Date.now();
  const last = hits.get(body.lobbyId) || 0;
  if (now - last < COOLDOWN_MS) {
    const nextAllowedAt = last + COOLDOWN_MS;
    return {
      ok: false as const,
      hint: undefined,
      message: "Indice indisponible pour le moment.",
      coolDownMs: nextAllowedAt - now,
      serverNow: now,
      nextAllowedAt,
    };
  }

  let roomName = "";
  let roomGoals: string[] = [];

  if (body.roomId) {
    const room = (scenario as any).rooms?.find(
      (r: any) => r.id === body.roomId
    );
    if (room) {
      roomName = room.name;
      roomGoals = room.goals || [];
    }
  }

  const contextUsed = {
    roomName: roomName || null,
    goals: roomGoals,
    state: body.state || null,
    contextNote: body.contextNote || null,
    question: body.question,
  };

const system = [
  "Tu es le maître du jeu d’un escape game web (thème : Industrie / anticapitalisme).",
  "Donne un INDICE CONCIS (1–2 phrases) sans révéler la solution ni des calculs explicites.",
  "Si la question est vague mais liée au jeu (ex. 'le nom de la salle a-t-il un lien ?'), ne refuse pas : demande UNE précision utile.",
  "Ne refuse que si la question est clairement hors univers (conseils d’investissement réel, actu boursière, IA, politique, vie perso, technique du projet).",
  "En cas de refus, reste poli et oriente vers une question liée à la salle et aux objectifs.",
].join(" ");

  // 'contexte' envoyé à GPT est ce bloc texte :
  const user = [
    
    roomName ? `Salle: ${roomName}` : "Salle: (non précisée)",
    roomGoals.length
      ? `Objectifs: ${roomGoals.join(", ")}`
      : "Objectifs: (non précisés)",
    body.state
      ? `État joueur: ${JSON.stringify(body.state)}`
      : "État joueur: (non fourni)",
    body.contextNote ? `Contexte additionnel: ${body.contextNote}` : null,
    `Question: "${body.question}"`,
  ]
    .filter(Boolean)
    .join("\n");

  // ---------- Appel OpenAI ----------
  const client = new OpenAI({ apiKey: config.openaiApiKey });

  let hint: string;
  try {
    const chat = await client.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.4,
      max_tokens: 180,
      messages: [
        { role: "system", content: system },
        { role: "user", content: user }, 
      ],
    });
    hint =
      chat.choices?.[0]?.message?.content?.trim() || "Aucun indice disponible.";
  } catch {
    throw createError({
      statusCode: 502,
      statusMessage: "Le service d’indices est momentanément indisponible.",
    });
  }

  // ---------- cooldown ----------
  hits.set(body.lobbyId, now);
  const nextAllowedAt = now + COOLDOWN_MS;

  return {
    ok: true as const,
    hint, // l'indice de ChatGPT
    contextUsed, // ce qu'on a envoyé comme contexte
    message: undefined,
    coolDownMs: COOLDOWN_MS,
    serverNow: now,
    nextAllowedAt,
  };
});
