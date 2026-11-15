// src/components/CandidatePanel.jsx
import { useState, useEffect } from 'react';
import { gatherCandidates } from '../lib/gatherCandidates';

// Slide 12: Keep CONFIGS outside the component so array identity is stable
const CONFIGS = {
  none: [],
  stun: [{ urls: "stun:stun.l.google.com:19302" }],
  wrong: [{ urls: "stun:stun.invalid.example:3478" }]
};

function CandidatePanel() {
  // Slide 12: State setup
  const [configName, setConfigName] = useState("stun");
  const [candidates, setCandidates] = useState([]);
  const [state, setState] = useState("new");
  const [elapsed, setElapsed] = useState(null);
  
  const iceServers = CONFIGS[configName];

  // Slide 12: Effect with cleanup and performance.now timer
  useEffect(() => {
    setCandidates([]);
    setElapsed(null);
    
    const t0 = performance.now();
    
    const stop = gatherCandidates({
      iceServers,
      onCandidate: c => setCandidates(p => [...p, c]),
      onDone: () => setElapsed(Math.round(performance.now() - t0)),
      onStateChange: setState
    });
    
    return stop; // Cleanup closes the connection
  }, [iceServers]); // Depends on the server list object

  // Slide 14: Sort a COPY of the array during render, highest priority first
  const sorted = [...candidates].sort(
    (a, b) => b.priority - a.priority
  );

  return (
    <div className="candidate-panel">
      <div className="panel-controls">
        <button onClick={() => setConfigName('none')}>No STUN</button>
        <button onClick={() => setConfigName('stun')}>Google STUN</button>
        <button onClick={() => setConfigName('wrong')}>Invalid STUN</button>
      </div>

      <div className="panel-stats">
        <span>State: <strong>{state}</strong></span>
        {/* elapsed will be null until gathering finishes, then show ms */}
        <span>Time: <strong>{elapsed !== null ? `${elapsed} ms` : '...'}</strong></span>
      </div>

      <table className="candidate-table">
        <thead>
          <tr>
            <th>Type</th>
            <th>Protocol</th>
            <th>Address:Port</th>
            <th>Priority</th>
            <th>Foundation</th>
          </tr>
        </thead>
        <tbody>
          {/* Slide 14: Render sorted rows with stable candidate string key */}
          {sorted.map(c => (
            <tr key={c.candidate} className={`row-${c.type}`}>
              <td>{c.type}</td>
              <td>{c.protocol}</td>
              <td>{c.address}:{c.port}</td>
              <td>{c.priority}</td>
              <td>{c.foundation}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default CandidatePanel;