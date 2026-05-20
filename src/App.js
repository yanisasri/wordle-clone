import Grid from './components/Grid';
import Keyboard from './components/Keyboard';
import { useWordle } from './hooks/useWordle';
import './App.css';

function App() {
  const {
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
  } = useWordle();

  const isRevealing = revealingRow !== null;
  const gameOver = gameStatus !== 'playing';

  return (
    <div className="app">
      <header className="app__header">
        <div className="streak streak--current" title="Current win streak">
          <span className="streak__label">Streak</span>
          <span className="streak__value">{streak.currentStreak}</span>
        </div>
        <h1 className="app__title">Wordle</h1>
        <div className="streak streak--best" title="Best win streak">
          <span className="streak__label">Best</span>
          <span className="streak__value">{streak.bestStreak}</span>
        </div>
      </header>

      {message && (
        <div className="toast" role="status">
          {message}
        </div>
      )}

      <main className="app__main">
        <Grid
          guesses={guesses}
          currentGuess={currentGuess}
          currentRow={currentRow}
          revealingRow={revealingRow}
          pendingReveal={pendingReveal}
          shake={shake}
        />

        {gameOver && (
          <div className="game-over" role="alert">
            {gameStatus === 'won' ? (
              <p className="game-over__message game-over__message--win">
                You got it! 🎉
              </p>
            ) : (
              <p className="game-over__message game-over__message--lose">
                Game over — the word was <strong>{answer}</strong>
              </p>
            )}
          </div>
        )}
      </main>

      <Keyboard
        onKey={handleKey}
        keyboardStatus={keyboardStatus}
        disabled={gameOver || isRevealing}
      />
    </div>
  );
}

export default App;
