import Tile from './Tile';
import { WORD_LENGTH } from '../utils/game';
import './Row.css';

const FLIP_STAGGER_MS = 300;

function Row({ guess, evaluation, currentLetters, isRevealing, shake }) {
  const letters = guess
    ? guess.split('')
    : currentLetters
      ? currentLetters.padEnd(WORD_LENGTH, ' ').split('')
      : Array(WORD_LENGTH).fill('');

  return (
    <div className={`row${shake ? ' row--shake' : ''}`}>
      {letters.map((letter, i) => (
        <Tile
          key={i}
          letter={letter.trim() || ''}
          status={evaluation?.[i]}
          isFilled={Boolean(letter.trim())}
          isRevealing={isRevealing}
          flipDelay={i * FLIP_STAGGER_MS}
        />
      ))}
    </div>
  );
}

export default Row;
