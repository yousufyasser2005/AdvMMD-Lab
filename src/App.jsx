import { useState } from 'react';
import CallView from './components/CallView';
import Ladder from './components/Ladder';
import CandidatePanel from './components/CandidatePanel';
import { parseRawSip } from './lib/sipParser';
import './App.css';

const initialParticipants = [
  { id: 101, name: 'Alice', muted: false, speaking: true },
  { id: 102, name: 'Bob', muted: true, speaking: false },
  { id: 103, name: 'Charlie', muted: false, speaking: false }
];
let nextId = 104;

function App() {
  const [view, setView] = useState('week3'); // Default to week 3

  // Week 1 State
  const [status, setStatus] = useState('idle');
  const [participants, setParticipants] = useState(initialParticipants);
  
  // Week 2 State
  const [messages, setMessages] = useState(parseRawSip());

  // Week 1 Handlers
  const addParticipant = () => setParticipants([...participants, { id: nextId++, name: `User ${nextId}`, muted: false, speaking: false }]);
  const removeParticipant = () => {
    const mid = Math.floor(participants.length / 2);
    setParticipants(participants.filter((_, i) => i !== mid));
  };
  const toggleMute = (id) => setParticipants(participants.map(p => p.id === id ? { ...p, muted: !p.muted } : p));

  // Week 2 Handler (Testing keys)
  const removeMiddleMessage = () => {
    const mid = Math.floor(messages.length / 2);
    setMessages(messages.filter((_, i) => i !== mid));
  };

  return (
    <div className="app-container">
      <h2>MMD 410 - Term Project Shell</h2>
      
      <div className="nav-bar">
        <button onClick={() => setView('week1')}>Week 1: Call Grid</button>
        <button onClick={() => setView('week2')}>Week 2: SIP Ladder</button>
        <button onClick={() => setView('week3')}>Week 3: ICE Candidates</button>
      </div>

      {/* WEEK 1 VIEW */}
      {view === 'week1' && (
        <div className="view-container">
          <div className="state-controls">
            <button onClick={() => setStatus('idle')}>Set Idle</button>
            <button onClick={() => setStatus('connecting')}>Set Connecting</button>
            <button onClick={() => setStatus('connected')}>Set Connected</button>
            <button onClick={() => setStatus('reconnecting')}>Set Reconnecting</button>
            <button onClick={() => setStatus('failed')}>Set Failed</button>
          </div>

          <div className="main-view">
            {status === 'idle' && (
              <div className="state-screen">
                <button className="action-btn" onClick={() => setStatus('connecting')}>Join Call</button>
              </div>
            )}

            {status === 'connecting' && (
              <div className="state-screen">
                <div className="spinner"></div>
                <p>Connecting...</p>
              </div>
            )}

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

            {status === 'reconnecting' && (
              <div className="call-container">
                <div className="banner">Reconnecting to server...</div>
                <CallView participants={participants} />
              </div>
            )}

            {status === 'failed' && (
              <div className="state-screen">
                <p>Connection Failed.</p>
                <button className="action-btn" onClick={() => setStatus('idle')}>Retry</button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* WEEK 2 VIEW */}
      {view === 'week2' && (
        <div className="view-container">
          <div className="ladder-controls">
            <button onClick={removeMiddleMessage}>Remove Middle Message (Test Keys)</button>
            <button onClick={() => setMessages(parseRawSip())} className="reset-btn">Reset</button>
          </div>
          <Ladder messages={messages} />
        </div>
      )}

      {/* WEEK 3 VIEW */}
      {view === 'week3' && (
        <div className="view-container">
          <CandidatePanel />
        </div>
      )}
    </div>
  );
}

export default App;