// src/lib/gatherCandidates.js
export function gatherCandidates({ iceServers, onCandidate, onDone, onStateChange }) {
  console.log("1. Attempting to gather candidates with config:", iceServers);
  
  try {
    const pc = new RTCPeerConnection({ iceServers });
    pc.createDataChannel("probe");

    pc.onicecandidate = (e) => {
      if (e.candidate) {
        console.log("2. Found candidate:", e.candidate.candidate);
        onCandidate(e.candidate);
      } else {
        console.log("3. Gathering complete (null candidate received).");
        onDone(); 
      }
    };

    if (onStateChange) {
      pc.onicegatheringstatechange = () => {
        console.log("4. Gathering state changed:", pc.iceGatheringState);
        onStateChange(pc.iceGatheringState);
      };
    }

    pc.createOffer()
      .then((offer) => {
        console.log("5. Offer created, setting local description...");
        return pc.setLocalDescription(offer);
      })
      .catch(err => {
        console.error("6. WebRTC Offer failed:", err);
      });

    return () => {
      console.log("7. Closing RTCPeerConnection.");
      pc.close();
    };
  } catch (err) {
    console.error("8. Fatal error creating RTCPeerConnection:", err);
    return () => {};
  }
}