import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  MAX_GUESSES,
  WORD_LENGTH,
  buildKeyboardStatus,
  evaluateGuess,
  getDailyWord,
  isValidGuess,
} from '../utils/game';
import { loadStreak, recordLoss, recordWin } from '../utils/streak';

const FLIP_MS = 300;
const FLIP_STAGGER_MS = 300;

export function useWordle() {
  const answer = useMemo(() => getDailyWord(), []);
  const [guesses, setGuesses] = useState([]);
  const [currentGuess, setCurrentGuess] = useState('');
  const [gameStatus, setGameStatus] = useState('playing');
  const [revealingRow, setRevealingRow] = useState(null);
  const [pendingReveal, setPendingReveal] = useState(null);
  const [shake, setShake] = useState(false);
  const [message, setMessage] = useState('');
  const [streak, setStreak] = useState(loadStreak);

  const currentRow = guesses.length;
  const isRevealing = revealingRow !== null;
  const keyboardStatus = useMemo(
    () => buildKeyboardStatus(guesses),
    [guesses]
  );

  const showMessage = useCallback((text) => {
    setMessage(text);
    setTimeout(() => setMessage(''), 2000);
  }, []);

  const submitGuess = useCallback(() => {
    if (gameStatus !== 'playing' || isRevealing) return;

    const word = currentGuess.toUpperCase();
    if (word.length < WORD_LENGTH) {
      showMessage('Not enough letters');
      setShake(true);
      return;
    }
    if (!isValidGuess(word)) {
      showMessage('Not in word list');
      setShake(true);
      return;
    }

    const evaluation = evaluateGuess(word, answer);
    const rowIndex = currentRow;
    setPendingReveal({ word, evaluation });
    setRevealingRow(rowIndex);
    setCurrentGuess('');

    const totalFlipTime =
      (WORD_LENGTH - 1) * FLIP_STAGGER_MS + FLIP_MS + 100;

    setTimeout(() => {
      setGuesses((prev) => [...prev, { word, evaluation }]);
      setRevealingRow(null);
      setPendingReveal(null);

      if (word === answer) {
        setGameStatus('won');
        setStreak(recordWin());
      } else if (rowIndex + 1 >= MAX_GUESSES) {
        setGameStatus('lost');
        setStreak(recordLoss());
      }
    }, totalFlipTime);
  }, [
    answer,
    currentGuess,
    currentRow,
    gameStatus,
    isRevealing,
    showMessage,
  ]);

  const addLetter = useCallback(
    (letter) => {
      if (gameStatus !== 'playing' || isRevealing) return;
      if (currentGuess.length >= WORD_LENGTH) return;
      setCurrentGuess((g) => g + letter.toUpperCase());
    },
    [currentGuess.length, gameStatus, isRevealing]
  );

  const removeLetter = useCallback(() => {
    if (gameStatus !== 'playing' || isRevealing) return;
    setCurrentGuess((g) => g.slice(0, -1));
  }, [gameStatus, isRevealing]);

  const handleKey = useCallback(
    (key) => {
      if (key === 'ENTER') submitGuess();
      else if (key === 'BACKSPACE') removeLetter();
      else if (/^[A-Z]$/.test(key)) addLetter(key);
    },
    [addLetter, removeLetter, submitGuess]
  );

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      const key = e.key.toUpperCase();
      if (key === 'ENTER' || key === 'BACKSPACE' || /^[A-Z]$/.test(key)) {
        e.preventDefault();
        handleKey(key === 'BACKSPACE' ? 'BACKSPACE' : key);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [handleKey]);

  useEffect(() => {
    if (!shake) return;
    const t = setTimeout(() => setShake(false), 500);
    return () => clearTimeout(t);
  }, [shake]);

  return {
    answer,
    guesses,
    currentGuess,
    currentRow,
    gameStatus,
    revealingRow,
    pendingReveal,
    keyboardStatus,
    shake,
    message,
    handleKey,
    streak,
  };
}
