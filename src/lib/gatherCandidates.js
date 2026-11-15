// src/lib/gatherCandidates.js
export function gatherCandidates({
  iceServers, onCandidate, onDone, onStateChange
}) {
  const pc = new RTCPeerConnection({ iceServers });
  pc.createDataChannel("probe");
 
  // Slide 10: Use optional chaining for the state change callback
  pc.onicegatheringstatechange = () =>
    onStateChange?.(pc.iceGatheringState);

  // Slide 11: Handle candidate events
  pc.onicecandidate = (e) => {
    if (e.candidate) onCandidate(e.candidate);
    else onDone();
  };
 
  // Slide 11: Async create offer and start gathering
  pc.createOffer()
    .then((offer) => pc.setLocalDescription(offer))
    .catch(console.error);
 
  // Slide 11: Return the cleanup handle
  return () => pc.close();
}