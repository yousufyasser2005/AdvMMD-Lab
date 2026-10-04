// src/App.jsx
import { useState } from 'react';
import Ladder from './components/Ladder';
import { parseRawSip } from './lib/sipParser';
import './App.css';

function App() {
  // Initialize state with the mock parsed SIP data
  const [messages, setMessages] = useState(parseRawSip());

  // Removes a message from the middle of the array to test keys
  const removeMiddleMessage = () => {
    if (messages.length === 0) return;
    const middleIndex = Math.floor(messages.length / 2);
    // Creates a NEW array without the middle element
    setMessages(messages.filter((_, index) => index !== middleIndex));
  };

  const resetMessages = () => {
    setMessages(parseRawSip());
  };

  return (
    <div className="app-container">
      <h2>MMD 410 - Lab 2: SIP Ladder</h2>

      <div className="ladder-controls">
        <button onClick={removeMiddleMessage}>
          Remove Middle Message (Test Keys)
        </button>
        <button onClick={resetMessages} className="reset-btn">
          Reset
        </button>
      </div>

      <Ladder messages={messages} />
    </div>
  );
}

export default App;