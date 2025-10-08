// Réponses possibles
type HintSuccess = {
  ok: true;
  hint: string;
  coolDownMs: number;
  serverNow: number;
  nextAllowedAt: number;
};
type HintCooldown = {
  ok: false;
  message: string;
  coolDownMs: number;
  serverNow: number;
  nextAllowedAt: number;
};
export type HintResponse = HintSuccess | HintCooldown;

const LS_KEY = (lobbyId: string) => `hintNextAllowedAt:${lobbyId}`;

export function useHint() {
  const { public: pub } = useRuntimeConfig();

  const loading = ref(false);
  const nextAllowedAt = ref<number | null>(null);

  // "horloge" après avoir posé la question
  const now = ref(Date.now());
  let interval: number | undefined;

  onMounted(() => {
    if (process.client) {
      interval = window.setInterval(() => {
        now.value = Date.now();
      }, 1000);
    }
  });
  onBeforeUnmount(() => {
    if (interval) window.clearInterval(interval);
  });

  // secondes restantes (>= 0)
  const remaining = computed(() => {
    if (!nextAllowedAt.value) return 0;
    const left = Math.ceil((nextAllowedAt.value - now.value) / 1000);
    return left > 0 ? left : 0;
  });

  // Affichage pratique "15 min (899s)"
  const remainingLabel = computed(() => {
    const s = remaining.value;
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m} min (${s}s)`;
  });

  function loadCooldown(lobbyId: string) {
    const raw = process.client ? localStorage.getItem(LS_KEY(lobbyId)) : null;
    nextAllowedAt.value = raw ? Number(raw) : null;
  }
  function saveCooldown(lobbyId: string, ts: number) {
    nextAllowedAt.value = ts;
    if (process.client) localStorage.setItem(LS_KEY(lobbyId), String(ts));
  }

  // roomId/state optionnels => à mettre en place dans le futur pour faire le lien de la question en fonction de la salle
  async function askHint(payload: {
    lobbyId: string;
    question: string;
    roomId?: number;
    state?: any;
    puzzleId?: string;
    contextNote?: string;
  }): Promise<HintResponse> {
    loading.value = true;
    try {
      const res = await $fetch<HintResponse>("/api/hint", {
        method: "POST",
        body: payload,
      });
      if (res.nextAllowedAt) saveCooldown(payload.lobbyId, res.nextAllowedAt);
      return res;
    } finally {
      loading.value = false;
    }
  }

  return {
    loading,
    askHint,
    remaining, 
    remainingLabel,
    hintCooldownSec: pub.hintCooldownSec,
    loadCooldown,
  };
}
