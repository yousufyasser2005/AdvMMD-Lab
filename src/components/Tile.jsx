function Tile({ name, muted, speaking }) {
  return (
    <div className={`tile ${speaking ? 'speaking' : ''} ${muted ? 'muted' : ''}`}>
      <h3>{name}</h3>
      <input type="text" placeholder="Note..." className="note-input" />
      {muted && <span className="mute-icon">🔇</span>}
    </div>
  );
}
export default Tile;