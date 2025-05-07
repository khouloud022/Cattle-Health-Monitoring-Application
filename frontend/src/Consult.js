import React, { useState, useEffect } from 'react';
import Nav from './Nav3'; 
import Header from './Header';
import Web3 from "web3";
const contractABI = [{
  "anonymous": false,
  "inputs": [
    {
      "indexed": false,
      "internalType": "uint256",
      "name": "timestamp",
      "type": "uint256"
    },
    {
      "indexed": false,
      "internalType": "uint256",
      "name": "cow",
      "type": "uint256"
    }
  ],
  "name": "DataAdded",
  "type": "event"
},
{
  "inputs": [
    {
      "internalType": "uint256",
      "name": "",
      "type": "uint256"
    }
  ],
  "name": "dataHistory",
  "outputs": [
    {
      "internalType": "uint256",
      "name": "timestamp",
      "type": "uint256"
    },
    {
      "internalType": "uint256",
      "name": "cow",
      "type": "uint256"
    },
    {
      "internalType": "int256",
      "name": "IN_ALLEYS",
      "type": "int256"
    },
    {
      "internalType": "int256",
      "name": "REST",
      "type": "int256"
    },
    {
      "internalType": "int256",
      "name": "EAT",
      "type": "int256"
    },
    {
      "internalType": "int256",
      "name": "ACTIVITY_LEVEL",
      "type": "int256"
    },
    {
      "internalType": "string",
      "name": "LPS",
      "type": "string"
    },
    {
      "internalType": "int256",
      "name": "disturbance",
      "type": "int256"
    }
  ],
  "stateMutability": "view",
  "type": "function",
  "constant": true
},
{
  "inputs": [
    {
      "internalType": "uint256",
      "name": "",
      "type": "uint256"
    }
  ],
  "name": "viewedData",
  "outputs": [
    {
      "internalType": "bool",
      "name": "",
      "type": "bool"
    }
  ],
  "stateMutability": "view",
  "type": "function",
  "constant": true
},
{
  "inputs": [
    {
      "internalType": "uint256",
      "name": "_cow",
      "type": "uint256"
    },
    {
      "internalType": "int256",
      "name": "_IN_ALLEYS",
      "type": "int256"
    },
    {
      "internalType": "int256",
      "name": "_REST",
      "type": "int256"
    },
    {
      "internalType": "int256",
      "name": "_EAT",
      "type": "int256"
    },
    {
      "internalType": "int256",
      "name": "_ACTIVITY_LEVEL",
      "type": "int256"
    },
    {
      "internalType": "string",
      "name": "_LPS",
      "type": "string"
    },
    {
      "internalType": "int256",
      "name": "_disturbance",
      "type": "int256"
    }
  ],
  "name": "addData",
  "outputs": [],
  "stateMutability": "nonpayable",
  "type": "function"
},
{
  "inputs": [],
  "name": "getLastData",
  "outputs": [
    {
      "components": [
        {
          "internalType": "uint256",
          "name": "timestamp",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "cow",
          "type": "uint256"
        },
        {
          "internalType": "int256",
          "name": "IN_ALLEYS",
          "type": "int256"
        },
        {
          "internalType": "int256",
          "name": "REST",
          "type": "int256"
        },
        {
          "internalType": "int256",
          "name": "EAT",
          "type": "int256"
        },
        {
          "internalType": "int256",
          "name": "ACTIVITY_LEVEL",
          "type": "int256"
        },
        {
          "internalType": "string",
          "name": "LPS",
          "type": "string"
        },
        {
          "internalType": "int256",
          "name": "disturbance",
          "type": "int256"
        }
      ],
      "internalType": "struct AutoSimulated.AnimalData",
      "name": "",
      "type": "tuple"
    }
  ],
  "stateMutability": "view",
  "type": "function",
  "constant": true
},
{
  "inputs": [],
  "name": "getDataLength",
  "outputs": [
    {
      "internalType": "uint256",
      "name": "",
      "type": "uint256"
    }
  ],
  "stateMutability": "view",
  "type": "function",
  "constant": true
},
{
  "inputs": [
    {
      "internalType": "uint256",
      "name": "index",
      "type": "uint256"
    }
  ],
  "name": "getDataAt",
  "outputs": [
    {
      "internalType": "uint256",
      "name": "timestamp",
      "type": "uint256"
    },
    {
      "internalType": "uint256",
      "name": "cow",
      "type": "uint256"
    },
    {
      "internalType": "int256",
      "name": "IN_ALLEYS",
      "type": "int256"
    },
    {
      "internalType": "int256",
      "name": "REST",
      "type": "int256"
    },
    {
      "internalType": "int256",
      "name": "EAT",
      "type": "int256"
    },
    {
      "internalType": "int256",
      "name": "ACTIVITY_LEVEL",
      "type": "int256"
    },
    {
      "internalType": "string",
      "name": "LPS",
      "type": "string"
    },
    {
      "internalType": "int256",
      "name": "disturbance",
      "type": "int256"
    }
  ],
  "stateMutability": "view",
  "type": "function",
  "constant": true
},
{
  "inputs": [
    {
      "internalType": "uint256",
      "name": "index",
      "type": "uint256"
    }
  ],
  "name": "markAsViewed",
  "outputs": [],
  "stateMutability": "nonpayable",
  "type": "function"
}];
const web3 = new Web3("http://127.0.0.1:7545");
const contractAddress = "0x31E37634cCc364D936e281d11e3EaDe6E10b4de9"; 
const contract = new web3.eth.Contract(contractABI, contractAddress);
function App() {
  const [data, setData] = useState([]);
  const [historicalData, setHistoricalData] = useState([]);
  const [dataLength, setDataLength] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [account, setAccount] = useState('');
  const [activeTab, setActiveTab] = useState('new'); 
  const getStorageKey = (account, contractAddress) => {
    return `lastViewedIndex_${account}_${contractAddress}`;
  };
  
  const loadLastViewedIndex = (account, contractAddress) => {
    const key = getStorageKey(account, contractAddress);
    const savedIndex = localStorage.getItem(key);
    return savedIndex ? parseInt(savedIndex) : 0;
  };
  const saveLastViewedIndex = (account, contractAddress, index) => {
    const key = getStorageKey(account, contractAddress);
    localStorage.setItem(key, index.toString());
  };

  useEffect(() => {
   
    const setupWeb3 = async () => {
      try {
        const accounts = await web3.eth.getAccounts();
        if (accounts && accounts.length > 0) {
          setAccount(accounts[1]);
          return accounts[1];
        } else {
          console.error("No Account found");
          return null;
        }
      } catch (error) {
        console.error("Error initializing web3:", error);
        return null;
      }
    };

    const init = async () => {
      try {
        
        const userAccount = await setupWeb3();
        if (!userAccount) {
          setLoading(false);
          setHistoryLoading(false);
          return;
        }

        
        const length = await contract.methods.getDataLength().call({ from: userAccount });
        setDataLength(parseInt(length));
        
       
        const lastIndex = loadLastViewedIndex(userAccount, contractAddress);
        setCurrentIndex(lastIndex);

        
        await loadHistoricalData(userAccount, lastIndex);
        
        setLoading(false);
      } catch (error) {
        console.error("Erreur lors de l'initialisation:", error);
        setLoading(false);
        setHistoryLoading(false);
      }
    };

    init();
  }, []);

  
  const loadHistoricalData = async (userAccount, lastIndex) => {
    try {
      setHistoryLoading(true);
      const history = [];
      
      if (lastIndex > 0) {
        for (let i = 0; i < lastIndex; i++) {
          try {
            const rawData = await contract.methods.getDataAt(i).call({ from: userAccount });
            history.push({
              index: i,
              timestamp: rawData.timestamp.toString(),
              cow: rawData.cow,
              IN_ALLEYS: rawData.IN_ALLEYS.toString(),
              REST: rawData.REST.toString(),
              EAT: rawData.EAT.toString(),
              ACTIVITY_LEVEL: rawData.ACTIVITY_LEVEL.toString(),
              LPS: rawData.LPS,
              disturbance: rawData.disturbance.toString(),
            });
          } catch (error) {
            console.error("Error loading history to index", i, ":", error);
          }
        }
      }
      setHistoricalData(history);
      setHistoryLoading(false);
    } catch (error) {
      console.error("Error loading history:", error);
      setHistoryLoading(false);
    }
  };
  
  useEffect(() => {
    if (dataLength === 0 || loading || !account) return;

    
    const fetchNewData = async () => {
      try {
        const newLength = await contract.methods.getDataLength().call({ from: account });
        const parsedNewLength = parseInt(newLength);
    
        if (parsedNewLength > currentIndex) {
          const newDataItems = [];
          for (let i = currentIndex; i < parsedNewLength; i++) {
            try {
              const rawData = await contract.methods.getDataAt(i).call({ from: account });
              const newItem = {
                index: i,
                timestamp: rawData.timestamp.toString(),
                cow: rawData.cow,
                IN_ALLEYS: rawData.IN_ALLEYS.toString(),
                REST: rawData.REST.toString(),
                EAT: rawData.EAT.toString(),
                ACTIVITY_LEVEL: rawData.ACTIVITY_LEVEL.toString(),
                LPS: rawData.LPS,
                disturbance: rawData.disturbance.toString(),
              };
              newDataItems.push(newItem);
            } catch (error) {
              console.error("Error retrieving data from index", i, ":", error);
            }
          }
    
          setData(newDataItems); 
          setCurrentIndex(parsedNewLength);
          saveLastViewedIndex(account, contractAddress, parsedNewLength); 
          setDataLength(parsedNewLength);
        }
      } catch (error) {
        console.error("Error verifying new data:", error);
      }
    };
    
    fetchNewData();
    
    const interval = setInterval(fetchNewData, 10000);
    return () => clearInterval(interval);
  }, [dataLength, currentIndex, loading, account]);

  const formatTimestamp = (timestamp) => {
    try {
      return new Date(parseInt(timestamp) * 1000).toLocaleString();
    } catch (e) {
      return timestamp;
    }
  };

  const renderDataTable = (dataItems, showIndex = false) => (
    <table style={styles.dataTable}>
      <thead>
        <tr>
          {showIndex && <th style={styles.tableHeader}>Index</th>}
          <th style={styles.tableHeader}>Timestamp</th>
          <th style={styles.tableHeader}>Cow ID</th>
          <th style={styles.tableHeader}>In Alleys</th>
          <th style={styles.tableHeader}>Rest</th>
          <th style={styles.tableHeader}>Eat</th>
          <th style={styles.tableHeader}>Activity Level</th>
          <th style={styles.tableHeader}>LPS</th>
          <th style={styles.tableHeader}>Disturbance</th>

        </tr>
      </thead>
      <tbody>
        {dataItems.map((item, idx) => (
          <tr key={idx} style={styles.tableRow}>
            {showIndex && <td style={styles.tableCell}>{item.index}</td>}
            <td style={{...styles.tableCell, ...styles.timestampCell}}>
              {formatTimestamp(item.timestamp)}
            </td>
            <td style={styles.tableCell}>{item.cow}</td>
            <td style={styles.tableCell}>{item.IN_ALLEYS/100000}</td>
            <td style={styles.tableCell}>{item.REST/100000}</td>
            <td style={styles.tableCell}>{item.EAT/100000}</td>
            <td style={styles.tableCell}>{item.ACTIVITY_LEVEL/100000}</td>
            <td style={styles.tableCell}>{item.LPS}</td>
            <td style={styles.tableCell}>{item.disturbance}</td>

          </tr>
        ))}
      </tbody>
    </table>
  );

  return (
    <div className="main-container">
      <Header />
      <Nav />
      <div className="main">
        <div style={styles.appContainer}>
          <h2 style={styles.dashboardTitle}>
            <br></br>
          Visualization of Cattle data
            <span style={styles.titleUnderline}></span>
          </h2>
          
          {/* Onglets de navigation */}
          <div style={styles.tabContainer}>
            <button 
              style={{
                ...styles.tabButton, 
                ...(activeTab === 'new' ? styles.activeTab : {})
              }}
              onClick={() => setActiveTab('new')}
            >
              New Data
            </button>
            <button 
              style={{
                ...styles.tabButton, 
                ...(activeTab === 'history' ? styles.activeTab : {})
              }}
              onClick={() => setActiveTab('history')}
            >
              History ({historicalData.length})
            </button>
          </div>
          
          {/* Contenu basé sur l'onglet actif */}
          {activeTab === 'new' ? (
           
            loading ? (
              <p style={styles.loadingMessage}>Loading data...</p>
            ) : data.length > 0 ? (
              <>
                <p style={styles.sessionInfo}>
                Displaying new data since the last session (index {currentIndex - data.length} à {currentIndex - 1})
                </p>
                {renderDataTable(data, true)}
              </>
            ) : (
              <p style={styles.noDataMessage}>No new data available(drone is not working at the moment)</p>
            )
          ) : (
            
            historyLoading ? (
              <p style={styles.loadingMessage}>Loading history...</p>
            ) : historicalData.length > 0 ? (
              <>
                <p style={styles.sessionInfo}>
                Complete history of drone added data (total: {historicalData.length})
                </p>
                {renderDataTable(historicalData, true)}
              </>
            ) : (
              <p style={styles.noDataMessage}>No data in history</p>
            )
          )}
          
          
        </div>
      </div>
    </div>
  );
}


const styles = {
  appContainer: {
    padding: '40px 20px',
    maxWidth: '1500px',
    margin: '0 auto',
    fontFamily: 'Segoe UI, sans-serif',
    color: '#333',
    backgroundColor: '#f9f9f9',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
  },
  dashboardTitle: {
    fontSize: '28px',
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: '20px',
    color: '#2c3e50',
  },
  titleUnderline: {
    display: 'block',
    margin: '8px auto 0',
    width: '60px',
    height: '4px',
    backgroundColor: '#3498db',
    borderRadius: '4px',
  },
  tabContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '30px',
    gap: '10px',
  },
  tabButton: {
    padding: '10px 20px',
    fontSize: '16px',
    cursor: 'pointer',
    backgroundColor: '#ecf0f1',
    border: '1px solid #bdc3c7',
    borderRadius: '6px',
    transition: 'all 0.3s ease',
  },
  activeTab: {
    backgroundColor: '#3498db',
    color: 'white',
    borderColor: '#2980b9',
  },
  loadingMessage: {
    textAlign: 'center',
    fontStyle: 'italic',
    color: '#7f8c8d',
    marginBottom: '20px',
  },
  noDataMessage: {
    textAlign: 'center',
    color: '#e74c3c',
    fontWeight: '500',
    marginBottom: '20px',
  },
  sessionInfo: {
    textAlign: 'center',
    color: '#34495e',
    marginBottom: '15px',
  },
  statusIndicator: {
    marginTop: '30px',
    textAlign: 'center',
    fontSize: '14px',
    color: '#555',
  },
  dataTable: {
    width: '100%',
    borderCollapse: 'collapse',
    marginBottom: '30px',
    backgroundColor: '#fff',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    borderRadius: '8px',
    overflow: 'hidden',
  },
  tableHeader: {
    backgroundColor: '#3498db',
    color: '#495057',
    fontWeight: 'bold',
    padding: '12px',
    textAlign: 'center',
    borderBottom: '2px solid #2980b9',
  },
  tableRow: {
    borderBottom: '1px solid #ddd',
    transition: 'background-color 0.2s ease',
  },
  tableCell: {
    padding: '10px',
    textAlign: 'center',
    color: '#2c3e50',
    fontSize: '14px',
  },
  timestampCell: {
    whiteSpace: 'nowrap',
  }
};


export default App;