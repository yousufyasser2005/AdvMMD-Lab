import Tile from './Tile';

function CallView({ participants }) {
  return (
    <div className="grid">
      {participants.map(p => (
        <Tile 
          key={p.id} 
          name={p.name} 
          muted={p.muted} 
          speaking={p.speaking} 
        />
      ))}
    </div>
  );
}

export default CallView;