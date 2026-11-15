import { useState, useEffect } from 'react';
import CallView from './components/CallView';
import Ladder from './components/Ladder';
import CandidatePanel from './components/CandidatePanel';
import { parseRawSip } from './lib/sipParser';
import { canTransition } from './lib/stateMachine';
import { pickRandomSpeaker } from './lib/pickRandomSpeaker';
import { useCamera } from './hooks/useCamera'; // Import custom hook
import './App.css';

const initialParticipants = [
  { id: 101, name: 'Alice', muted: false, speaking: false, raisedHand: false },
  { id: 102, name: 'Bob', muted: true, speaking: false, raisedHand: false },
  { id: 103, name: 'Charlie', muted: false, speaking: false, raisedHand: true }
];
let nextId = 104;

function App() {
  const [view, setView] = useState('week1');
  const [status, setStatus] = useState('idle');
  const [networkUp, setNetworkUp] = useState(true);
  const [participants, setParticipants] = useState(initialParticipants);
  const [messages, setMessages] = useState(parseRawSip());
  
  // Use custom hook for camera logic
  const camera = useCamera();

  useEffect(() => {
    if (status !== 'connecting' && status !== 'reconnecting') return;
    const delay = networkUp ? 2000 : 5000;
    const timer = setTimeout(() => {
      const nextState = networkUp ? 'connected' : 'failed';
      if (canTransition(status, nextState)) setStatus(nextState);
    }, delay);
    return () => clearTimeout(timer);
  }, [status, networkUp]);

  useEffect(() => {
    if (!networkUp && status === 'connected') {
      if (canTransition(status, 'reconnecting')) setStatus('reconnecting');
    }
  }, [networkUp, status]);

  useEffect(() => {
    if (status !== 'connected') return;
    const interval = setInterval(() => {
      setParticipants(prev => {
        const speaker = pickRandomSpeaker(prev);
        return prev.map(p => ({ ...p, speaking: speaker ? p.id === speaker.id : false }));
      });
    }, 1500);
    return () => clearInterval(interval);
  }, [status]);

  const handleJoinCall = () => { if (canTransition(status, 'connecting')) setStatus('connecting'); };
  const handleRetry = () => { if (canTransition(status, 'connecting')) setStatus('connecting'); };
  const handleHome = () => { if (canTransition(status, 'idle')) setStatus('idle'); };
  
  // Hook camera stop into leave call
  const handleLeaveCall = () => {
    if (canTransition(status, 'idle')) {
      setStatus('idle');
      camera.stopCamera();
    }
  };
  
  const toggleNetwork = () => setNetworkUp(prev => !prev);

  const addParticipant = () => {
    const name = prompt("Enter participant name:", `User ${nextId}`);
    if (name && name.trim() !== "") {
      setParticipants([...participants, { id: nextId++, name: name.trim(), muted: false, speaking: false, raisedHand: false }]);
    }
  };
  const handleRemove = (id) => setParticipants(participants.filter(p => p.id !== id));
  const toggleMute = (id) => setParticipants(participants.map(p => p.id === id ? { ...p, muted: !p.muted, speaking: false } : p));
  const handleMuteToggleAll = () => {
    setParticipants(prev => {
      const shouldUnmute = prev.every(p => p.muted);
      return prev.map(p => ({ ...p, muted: !shouldUnmute, speaking: false }));
    });
  };
  const toggleHand = (id) => setParticipants(participants.map(p => p.id === id ? { ...p, raisedHand: !p.raisedHand } : p));

  const displayParticipants = camera.stream 
    ? [{ id: 'local-you', name: 'You', isLocal: true, stream: camera.stream, muted: false, speaking: false, raisedHand: false }, ...participants]
    : participants;

  const everyoneMuted = participants.length > 0 && participants.every(p => p.muted);

  return (
    <div className="app-container">
      <h2>MMD 410 - Term Project Shell</h2>
      <div className="nav-bar">
        <button onClick={() => setView('week1')}>Week 1: Call Grid</button>
        <button onClick={() => setView('week2')}>Week 2: SIP Ladder</button>
        <button onClick={() => setView('week3')}>Week 3: ICE Candidates</button>
      </div>

      {view === 'week1' && (
        <div className="view-container">
          <div className="network-controls">
            <label>Network Status: </label>
            <button onClick={toggleNetwork} className={networkUp ? 'net-up-btn' : 'net-down-btn'}>
              {networkUp ? 'UP' : 'DOWN'}
            </button>
          </div>

          <div className="main-view">
            {status === 'idle' && (
              <div className="state-screen">
                <button className="action-btn" onClick={handleJoinCall}>Join Call</button>
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
                  <button onClick={handleMuteToggleAll} className="danger-btn">
                    {everyoneMuted ? 'Unmute All' : 'Mute All'}
                  </button>
                  <button onClick={handleLeaveCall} className="leave-btn">Leave Call</button>
                  
                  {/* NEW: Camera Controls & Dropdown */}
                  {!camera.stream ? (
                    <button 
                      onClick={() => camera.startCamera(camera.selectedDeviceId)} 
                      className="cam-btn" 
                      disabled={camera.status === 'requesting'}
                    >
                      {camera.status === 'requesting' ? '⏳ Requesting...' : '📷 Open Camera'}
                    </button>
                  ) : (
                    <button onClick={camera.stopCamera} className="danger-btn">📷 Close Camera</button>
                  )}
                  
                  {camera.devices.length > 0 && (
                    <select 
                      value={camera.selectedDeviceId} 
                      onChange={(e) => camera.switchDevice(e.target.value)}
                      className="device-select"
                    >
                      {camera.devices.map((d, i) => (
                        <option key={i} value={d.deviceId}>
                          {d.label || `Camera ${i + 1}`}
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                {/* NEW: Status & Error Messages */}
                <div className="camera-status">Camera Status: <strong>{camera.status.toUpperCase()}</strong></div>
                {camera.error && (
                  <div className="camera-error">⚠️ {camera.error}</div>
                )}

                <CallView 
                  participants={displayParticipants} 
                  onMute={toggleMute} 
                  onRaiseHand={toggleHand} 
                  onRemove={handleRemove} 
                />
              </div>
            )}

            {status === 'reconnecting' && (
              <div className="call-container">
                <div className="banner">Reconnecting to server...</div>
                <div className="grid-controls">
                  <button onClick={handleLeaveCall} className="leave-btn">Leave Call</button>
                </div>
                <CallView participants={displayParticipants} onMute={toggleMute} onRaiseHand={toggleHand} onRemove={handleRemove} />
              </div>
            )}

            {status === 'failed' && (
              <div className="state-screen">
                <p>Connection Failed.</p>
                <div className="failed-actions">
                  <button className="action-btn" onClick={handleRetry}>Retry</button>
                  <button className="home-btn" onClick={handleHome}>Home</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {view === 'week2' && (
        <div className="view-container">
          <div className="ladder-controls">
            <button onClick={() => { const mid = Math.floor(messages.length / 2); setMessages(messages.filter((_, i) => i !== mid)); }}>Remove Middle Message</button>
            <button onClick={() => setMessages(parseRawSip())} className="reset-btn">Reset</button>
          </div>
          <Ladder messages={messages} />
        </div>
      )}

      {view === 'week3' && (
        <div className="view-container">
          <CandidatePanel />
        </div>
      )}
    </div>
  );
}

export default App;