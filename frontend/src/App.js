import React from 'react';
import MainDashboard from './components/mainDashboard';
import './App.css';

function App() {
  /**
   * 🔐 CONFIGURATION MATRIX
   * Replace the token string below with the fresh JWT token you generated 
   * from Postman after logging into your Validator account.
   */
  const sessionConfig = {
    docId: 10,                          // The ID of the file you verified in Postman
    signerId: 2,                        // The target user who needs to sign it
    token: "PASTE_YOUR_ACTIVE_VALIDATOR_JWT_TOKEN_HERE"
  };

  return (
    <div className="App" style={{ margin: 0, padding: 0, overflow: 'hidden', height: '100vh', width: '100vw' }}>
      <MainDashboard
        docId={sessionConfig.docId}
        signerId={sessionConfig.signerId}
        token={sessionConfig.token}
      />
    </div>
  );
}

export default App;