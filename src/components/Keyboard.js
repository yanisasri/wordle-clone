import './Keyboard.css';

const ROWS = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'BACK'],
];

function Keyboard({ onKey, keyboardStatus, disabled }) {
  return (
    <div className="keyboard">
      {ROWS.map((row, rowIndex) => (
        <div key={rowIndex} className="keyboard__row">
          {row.map((key) => {
            const isWide = key === 'ENTER' || key === 'BACK';
            const label = key === 'BACK' ? '⌫' : key;
            const status = key.length === 1 ? keyboardStatus[key] : undefined;
            return (
              <button
                key={key}
                type="button"
                className={[
                  'keyboard__key',
                  isWide && 'keyboard__key--wide',
                  status && `keyboard__key--${status}`,
                ]
                  .filter(Boolean)
                  .join(' ')}
                onClick={() =>
                  onKey(key === 'BACK' ? 'BACKSPACE' : key)
                }
                disabled={disabled}
              >
                {label}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}

export default Keyboard;
