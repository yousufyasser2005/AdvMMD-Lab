// src/hooks/useIceCandidates.js
import { useState, useEffect } from 'react';
import { gatherCandidates } from '../lib/gatherCandidates';

export function useIceCandidates(iceServers) {
  const [candidates, setCandidates] = useState([]);
  const [state, setState] = useState('new');
  const [elapsed, setElapsed] = useState(null);

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
    
    return stop;
  }, [iceServers]);

  // Sort a copy of the array
  const sorted = [...candidates].sort((a, b) => b.priority - a.priority);
  return { sorted, state, elapsed };
}