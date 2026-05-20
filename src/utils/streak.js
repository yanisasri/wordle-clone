const STORAGE_KEY = 'wordle-streak';

export function dateKey(date = new Date()) {
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
}

function yesterdayKey(date = new Date()) {
  const d = new Date(date);
  d.setDate(d.getDate() - 1);
  return dateKey(d);
}

export function loadStreak() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        currentStreak: parsed.currentStreak ?? 0,
        bestStreak: parsed.bestStreak ?? 0,
        lastWinDate: parsed.lastWinDate ?? null,
      };
    }
  } catch {
    /* ignore corrupt data */
  }
  return { currentStreak: 0, bestStreak: 0, lastWinDate: null };
}

function saveStreak(streak) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(streak));
}

/** Call when the player wins. Returns updated streak (no-op if already won today). */
export function recordWin() {
  const streak = loadStreak();
  const today = dateKey();

  if (streak.lastWinDate === today) {
    return streak;
  }

  const currentStreak =
    streak.lastWinDate === yesterdayKey()
      ? streak.currentStreak + 1
      : 1;
  const bestStreak = Math.max(streak.bestStreak, currentStreak);
  const updated = { currentStreak, bestStreak, lastWinDate: today };
  saveStreak(updated);
  return updated;
}

/** Call when the player loses. Resets the current streak. */
export function recordLoss() {
  const streak = loadStreak();
  const updated = { ...streak, currentStreak: 0 };
  saveStreak(updated);
  return updated;
}
