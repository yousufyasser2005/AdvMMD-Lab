// src/components/Ladder.jsx
function Ladder({ messages }) {
  if (!messages || messages.length === 0) {
    return <div className="ladder-empty">No messages to display</div>;
  }

  return (
    <div className="ladder-container">
      <div className="ladder-header">
        <span>Caller</span>
        <span>Callee</span>
      </div>
      <div className="ladder-body">
        {messages.map((msg) => {
          // If the message is FROM the caller, it goes right. If FROM callee, it goes left.
          const isRight = msg.from === 'caller';
          
          return (
            <div key={msg.id} className={`ladder-row kind-${msg.kind}`}>
              <span className="timestamp">{msg.t.toFixed(3)}s</span>
              
              <div className={`arrow-line ${isRight ? 'right' : 'left'}`}>
                <span className="arrow-head">{isRight ? '➤' : '➤'}</span>
                <span className={`arrow-label ${isRight ? 'right' : 'left'}`}>
                  {msg.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Ladder;