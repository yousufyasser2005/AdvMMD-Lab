import { useState, useEffect, useRef } from 'react';
import { gatherCandidates } from '../lib/gatherCandidates';

const CONFIGS = {
  none: [],
  stun: [{ urls: "stun:stun.l.google.com:19302" }],
  wrong: [{ urls: "stun:stun.invalid.example:3478" }],
};

function CandidatePanel() {
  const [configKey, setConfigKey] = useState('stun');
  const [candidates, setCandidates] = useState([]);
  const [gatheringState, setGatheringState] = useState('new');
  const [elapsedTime, setElapsedTime] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    setCandidates([]);
    setGatheringState('new');
    setElapsedTime(0);
    
    let startTime = Date.now();

    const stopGathering = gatherCandidates({
      iceServers: CONFIGS[configKey],
      onCandidate: (candidate) => {
        setCandidates(prev => 
          [...prev, candidate].sort((a, b) => b.priority - a.priority)
        );
      },
      onDone: () => {
        setGatheringState('complete');
        if (timerRef.current) {
          clearInterval(timerRef.current);
          setElapsedTime(Date.now() - startTime);
        }
      },
      onStateChange: (state) => {
        setGatheringState(state);
        if (state === 'gathering' && !timerRef.current) {
          startTime = Date.now();
          timerRef.current = setInterval(() => {
            setElapsedTime(Date.now() - startTime);
          }, 100);
        }
      }
    });

    return () => {
      stopGathering();
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [configKey]);

  return (
    <div className="candidate-panel">
      <div className="panel-controls">
        <button onClick={() => setConfigKey('none')}>No STUN</button>
        <button onClick={() => setConfigKey('stun')}>Google STUN</button>
        <button onClick={() => setConfigKey('wrong')}>Invalid STUN</button>
      </div>

      <div className="panel-stats">
        <span>State: <strong>{gatheringState}</strong></span>
        <span>Time: <strong>{elapsedTime} ms</strong></span>
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
          {candidates.map((c) => (
            <tr key={c.foundation + c.address} className={`row-${c.type}`}>
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