import { useState } from 'react';
import CallView from './components/CallView';
import './App.css';

// Starts with 3 fake participants, unique IDs are NOT array positions
const initialParticipants = [
  { id: 101, name: 'Alice', muted: false, speaking: true },
  { id: 102, name: 'Bob', muted: true, speaking: false },
  { id: 103, name: 'Charlie', muted: false, speaking: false }
];

let nextId = 104;

function App() {
  const [status, setStatus] = useState('idle');
  const [participants, setParticipants] = useState(initialParticipants);

  // Task 3: Add participant (creates NEW array)
  const addParticipant = () => {
    setParticipants([
      ...participants,
      { id: nextId++, name: `User ${nextId}`, muted: false, speaking: false }
    ]);
  };

  // Task 3: Remove participant from the middle (creates NEW array)
  const removeParticipant = () => {
    if (participants.length <= 1) return;
    const middleIndex = Math.floor(participants.length / 2);
    setParticipants(participants.filter((_, index) => index !== middleIndex));
  };

  // Task 3: Toggle mute (creates NEW array)
  const toggleMute = (id) => {
    setParticipants(
      participants.map(p => 
        p.id === id ? { ...p, muted: !p.muted } : p
      )
    );
  };

  return (
    <div className="app-container">
      <h2>MMD 410 - Lab 1</h2>

      {/* Task 5: Connection State Machine Controls */}
      <div className="state-controls">
        <button onClick={() => setStatus('idle')}>Set Idle</button>
        <button onClick={() => setStatus('connecting')}>Set Connecting</button>
        <button onClick={() => setStatus('connected')}>Set Connected</button>
        <button onClick={() => setStatus('reconnecting')}>Set Reconnecting</button>
        <button onClick={() => setStatus('failed')}>Set Failed</button>
      </div>

      <div className="main-view">
        {/* IDLE */}
        {status === 'idle' && (
          <div className="state-screen">
            <button className="action-btn" onClick={() => setStatus('connecting')}>Join Call</button>
          </div>
        )}

        {/* CONNECTING */}
        {status === 'connecting' && (
          <div className="state-screen">
            <div className="spinner"></div>
            <p>Connecting...</p>
          </div>
        )}

        {/* CONNECTED */}
        {status === 'connected' && (
          <div className="call-container">
            <div className="grid-controls">
              <button onClick={addParticipant}>Add Participant</button>
              <button onClick={removeParticipant}>Remove Middle</button>
              {participants.map(p => (
                <button key={p.id} onClick={() => toggleMute(p.id)}>
                  Toggle Mute: {p.name}
                </button>
              ))}
            </div>
            <CallView participants={participants} />
          </div>
        )}

        {/* RECONNECTING */}
        {status === 'reconnecting' && (
          <div className="call-container">
            <div className="banner">Reconnecting to server...</div>
            <CallView participants={participants} />
          </div>
        )}

        {/* FAILED */}
        {status === 'failed' && (
          <div className="state-screen">
            <p>Connection Failed.</p>
            <button className="action-btn" onClick={() => setStatus('idle')}>Retry</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;