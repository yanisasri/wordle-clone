import './Tile.css';

function Tile({ letter, status, isFilled, isRevealing, flipDelay }) {
  const classes = [
    'tile',
    isFilled && 'tile--filled',
    isRevealing && 'tile--flip',
    status && `tile--${status}`,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={classes}>
      <div
        className="tile__inner"
        style={isRevealing ? { animationDelay: `${flipDelay}ms` } : undefined}
      >
        <span className="tile__front">{letter}</span>
        <span className="tile__back">{letter}</span>
      </div>
    </div>
  );
}

export default Tile;
