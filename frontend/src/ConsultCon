import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from './Header';
import Nav from './Nav5';

const PredictedList = () => {
  const [predictions, setPredictions] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get('http://127.0.0.1:5000/api/predictions?source=app')
      .then((response) => {
        setPredictions(response.data);
      })
      .catch((error) => {
        console.error('Error fetching predictions:', error);
      });
  }, []);

  return (
    <div style={styles.mainContainer}>
      <Header />
      <Nav />
      <div style={styles.appContainer}>
        <h2 style={styles.dashboardTitle}>
          Cattle Health Predictions <span style={styles.titleUnderline}></span>
        </h2>

        {error ? (
          <div style={styles.errorContainer}>
            <div style={styles.errorIcon}>⚠️</div>
            <p style={styles.errorText}>{error}</p>
            <button 
              style={styles.retryButton}
              onClick={() => window.location.reload()}
            >
              Retry
            </button>
          </div>
        ) : predictions.length > 0 ? (
          <div style={styles.tableWrapper}>
            <table style={styles.dataTable}>
              <thead>
                <tr>
                  <th style={styles.tableHeader}>IN_ALLEYS</th>
                  <th style={styles.tableHeader}>REST</th>
                  <th style={styles.tableHeader}>EAT</th>
                  <th style={styles.tableHeader}>ACTIVITY</th>
                  <th style={styles.tableHeader}>LPS</th>
                  <th style={styles.tableHeader}>Disturbance</th>
                  <th style={styles.tableHeader}>Health Status</th>
                </tr>
              </thead>
              <tbody>
                {predictions.map((item, index) => (
                  <tr key={index} style={styles.tableRow}>
                    <td style={styles.tableCell}>{item.IN_ALLEYS}</td>
                    <td style={styles.tableCell}>{item.REST}</td>
                    <td style={styles.tableCell}>{item.EAT}</td>
                    <td style={styles.tableCell}>{item.ACTIVITY_LEVEL}</td>
                    <td style={styles.tableCell}>{item.LPS}</td>
                    <td style={styles.tableCell}>{item.disturbance}</td>
                    <td style={{
                      ...styles.tableCell,
                      ...styles.statusCell,
                      color: item.prediction.includes("OK") ? '#27ae60' : '#e74c3c',
                      backgroundColor: item.prediction.includes("OK") ? 'rgba(39, 174, 96, 0.1)' : 'rgba(231, 76, 60, 0.1)'
                    }}>
                      <div style={styles.statusIndicator}>
                        {item.prediction}
                        <span style={styles.statusIcon}>
                          {item.prediction.includes("OK") ? '✓' : '⚠'}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>📊</div>
            <h3 style={styles.emptyTitle}>No Data Available</h3>
            <p style={styles.emptyText}>Submit data to get health predictions</p>
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  mainContainer: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, sans-serif'
  },
  appContainer: {
    flex: 1,
    padding: '2rem',
    maxWidth: '1500px',
    margin: '0 auto',
    width: '100%',
    color: '#2d3436',
    backgroundColor: 'white',
    borderRadius: '16px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    marginTop: '1rem',
    marginBottom: '2rem'
  },
  dashboardTitle: {
    fontSize: '2rem',
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: '1.5rem',
    color: '#2c3e50',
    position: 'relative'
  },
  titleUnderline: {
    display: 'block',
    margin: '0.5rem auto 0',
    width: '80px',
    height: '4px',
    borderRadius: '4px',
    background: 'linear-gradient(90deg, #3498db, #2ecc71)'
  },
  tableWrapper: {
    overflowX: 'auto',
    borderRadius: '12px',
    border: '1px solid #e0e6ed',
    boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
  },
  dataTable: {
    width: '100%',
    borderCollapse: 'separate',
    borderSpacing: 0
  },
  tableHeader: {
    backgroundColor: '#f8fafc',
    color: '#64748b',
    fontWeight: '600',
    padding: '1rem',
    textAlign: 'center',
    borderBottom: '1px solid #e2e8f0',
    position: 'sticky',
    top: 0,
    zIndex: 10,
    fontSize: '0.875rem',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  tableRow: {
    transition: 'background-color 0.2s ease',
    ':hover': {
      backgroundColor: '#f8fafc'
    },
    ':nth-child(even)': {
      backgroundColor: '#f8fafc'
    }
  },
  tableCell: {
    padding: '1rem',
    textAlign: 'center',
    color: '#334155',
    fontSize: '0.9375rem',
    borderBottom: '1px solid #f1f5f9',
    verticalAlign: 'middle'
  },
  statusCell: {
    fontWeight: '600',
    borderRadius: '0 8px 8px 0'
  },
  statusIndicator: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem'
  },
  statusIcon: {
    fontSize: '1.1rem'
  },
  errorContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem',
    backgroundColor: '#fff5f5',
    borderRadius: '12px',
    border: '1px solid #fed7d7',
    maxWidth: '500px',
    margin: '0 auto',
    textAlign: 'center'
  },
  errorIcon: {
    fontSize: '2rem',
    marginBottom: '1rem',
    color: '#e53e3e'
  },
  errorText: {
    color: '#e53e3e',
    fontSize: '1rem',
    marginBottom: '1.5rem'
  },
  retryButton: {
    backgroundColor: '#e53e3e',
    color: 'white',
    border: 'none',
    padding: '0.75rem 1.5rem',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600',
    transition: 'all 0.2s ease',
    ':hover': {
      backgroundColor: '#c53030',
      transform: 'translateY(-1px)'
    }
  },
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '3rem',
    backgroundColor: '#f8fafc',
    borderRadius: '12px',
    border: '1px dashed #cbd5e1',
    textAlign: 'center'
  },
  emptyIcon: {
    fontSize: '3rem',
    marginBottom: '1rem',
    color: '#94a3b8'
  },
  emptyTitle: {
    color: '#334155',
    fontSize: '1.25rem',
    fontWeight: '600',
    marginBottom: '0.5rem'
  },
  emptyText: {
    color: '#64748b',
    fontSize: '0.9375rem',
    maxWidth: '400px'
  }
};

export default PredictedList;