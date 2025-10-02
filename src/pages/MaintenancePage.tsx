import React from 'react';

const MaintenancePage = () => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      textAlign: 'center',
      backgroundColor: '#f8f9fa',
      color: '#333',
      fontFamily: 'Arial, sans-serif',
      padding: '20px'
    }}>
      <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>
        🚧 Site Under Maintenance
      </h1>
      <p style={{ fontSize: '1.25rem', maxWidth: '600px' }}>
        We’re currently performing Maintenance to improve our service. 
        We appreciate your patience and invite you to check back soon.
      </p>
      <p style={{ marginTop: '2rem', fontSize: '1rem', color: '#666' }}>
        — The Team
      </p>
    </div>
  );
};

export default MaintenancePage;
