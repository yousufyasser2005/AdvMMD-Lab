import Tile from './Tile';

function CallView({ participants, onMute, onRaiseHand, onRemove }) {
  return (
    <div className="grid">
      {participants.map(p => (
        <Tile 
          key={p.id}
          id={p.id}
          name={p.name} 
          muted={p.muted} 
          speaking={p.speaking} 
          raisedHand={p.raisedHand}
          isLocal={p.isLocal}
          stream={p.stream}
          onMute={onMute}
          onRaiseHand={onRaiseHand}
          onRemove={onRemove}
        />
      ))}
    </div>
  );
}

export default CallView;