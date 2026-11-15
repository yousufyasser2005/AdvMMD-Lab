// src/components/CandidatePanel.jsx
import { useState } from 'react';
import { useIceCandidates } from '../hooks/useIceCandidates';

const CONFIGS = {
  none: [],
  stun: [{ urls: "stun:stun.l.google.com:19302" }],
  wrong: [{ urls: "stun:stun.invalid.example:3478" }],
};

function CandidatePanel() {
  const [configName, setConfigName] = useState("stun");
  const iceServers = CONFIGS[configName];
  
  // Use the custom hook!
  const { sorted, state, elapsed } = useIceCandidates(iceServers);

  // Split candidates by protocol for O6
  const udpCandidates = sorted.filter(c => c.protocol === 'udp');
  const tcpCandidates = sorted.filter(c => c.protocol === 'tcp');

  const renderTable = (rows, title) => (
    <div style={{ marginBottom: '20px' }}>
      <h4 style={{ color: '#aaa' }}>{title}</h4>
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
          {rows.map(c => (
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

  return (
    <div className="candidate-panel">
      <div className="panel-controls">
        <button onClick={() => setConfigName('none')}>No STUN</button>
        <button onClick={() => setConfigName('stun')}>Google STUN</button>
        <button onClick={() => setConfigName('wrong')}>Invalid STUN</button>
      </div>

      <div className="panel-stats">
        <span>State: <strong>{state}</strong></span>
        <span>Time: <strong>{elapsed !== null ? `${elapsed} ms` : '...'}</strong></span>
      </div>

      {renderTable(udpCandidates, "UDP Candidates")}
      {renderTable(tcpCandidates, "TCP Candidates (Fallback)")}
    </div>
  );
}

export default CandidatePanel;