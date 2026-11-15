// src/lib/pickRandomSpeaker.js
export function pickRandomSpeaker(participants) {
  if (!participants || participants.length === 0) return null;
  
  const unmuted = participants.filter(p => !p.muted);
  if (unmuted.length === 0) return null;
  
  // 20% chance of silence to make it feel natural
  if (Math.random() < 0.2) return null;
  
  return unmuted[Math.floor(Math.random() * unmuted.length)];
}