import Row from './Row';
import { MAX_GUESSES } from '../utils/game';
import './Grid.css';

function Grid({
  guesses,
  currentGuess,
  currentRow,
  revealingRow,
  pendingReveal,
  shake,
}) {
  return (
    <div className="grid">
      {Array.from({ length: MAX_GUESSES }, (_, i) => {
        const isRevealing = revealingRow === i;
        const isCurrent = i === currentRow && revealingRow === null;

        if (isRevealing && pendingReveal) {
          return (
            <Row
              key={i}
              guess={pendingReveal.word}
              evaluation={pendingReveal.evaluation}
              isRevealing
            />
          );
        }

        if (i < guesses.length) {
          const { word, evaluation } = guesses[i];
          return (
            <Row key={i} guess={word} evaluation={evaluation} />
          );
        }

        if (isCurrent) {
          return (
            <Row
              key={i}
              currentLetters={currentGuess}
              shake={shake}
            />
          );
        }

        return <Row key={i} />;
      })}
    </div>
  );
}

export default Grid;
