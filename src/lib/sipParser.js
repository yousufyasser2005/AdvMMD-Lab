// src/lib/sipParser.js
// A helper function that would turn raw exported SIP text into the message array.
export function parseRawSip(rawText) {
  // In a real scenario, this would parse string headers into objects.
  // Returning mock data for now so the component can render.
  return [
    { id: "m1", t: 0.000, from: "caller", to: "callee", label: "INVITE", kind: "request" },
    { id: "m2", t: 0.014, from: "callee", to: "caller", label: "100 Trying", kind: "provisional" },
    { id: "m3", t: 1.902, from: "callee", to: "caller", label: "180 Ringing", kind: "provisional" },
    { id: "m4", t: 2.105, from: "callee", to: "caller", label: "200 OK", kind: "final-response" },
    { id: "m5", t: 2.110, from: "caller", to: "callee", label: "ACK", kind: "request" },
  ];
}