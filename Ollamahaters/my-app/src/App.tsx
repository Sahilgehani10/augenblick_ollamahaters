import React from 'react';
import './App.css';
import { Button } from "./components/ui/button";

function App() {
  return (
    <div style={{ backgroundColor: 'red', height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
      <h1 style={{ color: 'white' }}>Hello, World!</h1>
      <Button className="mt-4">Click Me</Button>
    </div>
  );
}

export default App;