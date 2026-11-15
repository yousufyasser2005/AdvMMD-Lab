// src/lib/parseCandidate.js
export function parseCandidate(rawString) {
  // Regex to match standard ICE candidate string format
  const regex = /candidate:(?<foundation>\d+)\s+(?<component>\d+)\s+(?<protocol>\w+)\s+(?<priority>\d+)\s+(?<address>[\d\.a-zA-Z\-]+)\s+(?<port>\d+)\s+typ\s+(?<type>\w+)/;
  const match = rawString.match(regex);
  
  if (!match) return null;
  
  return {
    foundation: match.groups.foundation,
    protocol: match.groups.protocol,
    priority: parseInt(match.groups.priority),
    address: match.groups.address,
    port: parseInt(match.groups.port),
    type: match.groups.type
  };
}