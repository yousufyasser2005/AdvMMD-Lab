// src/lib/stateMachine.js
export const ALLOWED_TRANSITIONS = {
  idle: ['connecting'],
  connecting: ['connected', 'failed', 'idle'],
  connected: ['reconnecting', 'idle'],
  reconnecting: ['connected', 'failed', 'idle'],
  failed: ['connecting', 'idle']
};

export function canTransition(from, to) {
  const allowed = ALLOWED_TRANSITIONS[from] || [];
  return allowed.includes(to);
}