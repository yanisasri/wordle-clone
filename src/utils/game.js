import { WORDS } from '../data/words';

export const WORD_LENGTH = 5;
export const MAX_GUESSES = 6;

/** Deterministic daily word from the word list (same word all day). */
export function getDailyWord(date = new Date()) {
  const dateStr = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
  let hash = 0;
  for (let i = 0; i < dateStr.length; i++) {
    hash = (hash << 5) - hash + dateStr.charCodeAt(i);
    hash |= 0;
  }
  return WORDS[Math.abs(hash) % WORDS.length];
}

export function isValidGuess(word) {
  return word.length === WORD_LENGTH && WORDS.includes(word.toUpperCase());
}

/** Wordle-style letter evaluation: correct | present | absent */
export function evaluateGuess(guess, answer) {
  const result = Array(WORD_LENGTH).fill('absent');
  const answerChars = answer.split('');
  const guessChars = guess.split('');
  const used = Array(WORD_LENGTH).fill(false);

  for (let i = 0; i < WORD_LENGTH; i++) {
    if (guessChars[i] === answerChars[i]) {
      result[i] = 'correct';
      used[i] = true;
    }
  }

  for (let i = 0; i < WORD_LENGTH; i++) {
    if (result[i] === 'correct') continue;
    const idx = answerChars.findIndex(
      (ch, j) => !used[j] && ch === guessChars[i]
    );
    if (idx !== -1) {
      result[i] = 'present';
      used[idx] = true;
    }
  }

  return result;
}

/** Best keyboard hint for a letter (correct > present > absent). */
const STATUS_RANK = { correct: 3, present: 2, absent: 1 };

export function buildKeyboardStatus(guesses) {
  const status = {};
  for (const { word, evaluation } of guesses) {
    for (let i = 0; i < word.length; i++) {
      const letter = word[i];
      const rank = STATUS_RANK[evaluation[i]];
      if (!status[letter] || rank > STATUS_RANK[status[letter]]) {
        status[letter] = evaluation[i];
      }
    }
  }
  return status;
}
