import { useEffect, useRef } from 'react';

function Tile({ id, name, muted, speaking, raisedHand, isLocal, stream, onMute, onRaiseHand, onRemove }) {
  const initials = name.substring(0, 2).toUpperCase();
  const videoRef = useRef(null);

  // Attach the media stream to the video element
  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <div className={`tile ${speaking ? 'speaking' : ''} ${muted ? 'muted' : ''} ${raisedHand ? 'raised-hand' : ''}`}>
      <div className="tile-header">
        {/* Hide avatar if local video is active */}
        {isLocal && stream ? null : <div className="avatar">{initials}</div>}
        <h3>
          {name} 
          {raisedHand && <span className="hand-icon">✋</span>}
        </h3>
        {muted && <span className="mute-icon">🔇</span>}
      </div>
      
      {/* Render Video instead of Note Input if local stream exists */}
      {isLocal && stream ? (
        <video ref={videoRef} autoPlay muted playsInline className="tile-video" />
      ) : (
        <input type="text" placeholder="Note..." className="note-input" />
      )}

      {/* Hide Mute and Remove buttons for the local "You" tile */}
      {!isLocal && (
        <div className="tile-controls">
          <button onClick={() => onMute(id)} className="tile-btn">
            {muted ? '🎤 Unmute' : '🔇 Mute'}
          </button>
          <button onClick={() => onRaiseHand(id)} className={`tile-btn ${raisedHand ? 'active' : ''}`}>
            ✋ Hand
          </button>
          <button onClick={() => onRemove(id)} className="tile-btn danger">
            🚪 Remove
          </button>
        </div>
      )}
    </div>
  );
}

export default Tile;