import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import Nav from './Nav3';
import Header from './Header';
const livestockAbi =[{
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "string",
        "name": "id",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "breed",
        "type": "string"
      }
    ],
    "name": "CowAdded",
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
    "name": "cows",
    "outputs": [
      {
        "internalType": "string",
        "name": "id",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "breed",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "age",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "weight",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "gender",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "color",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_id",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_breed",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "_age",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_weight",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "_gender",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_color",
        "type": "string"
      }
    ],
    "name": "addCow",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "index",
        "type": "uint256"
      }
    ],
    "name": "getCow",
    "outputs": [
      {
        "components": [
          {
            "internalType": "string",
            "name": "id",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "breed",
            "type": "string"
          },
          {
            "internalType": "uint256",
            "name": "age",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "weight",
            "type": "uint256"
          },
          {
            "internalType": "string",
            "name": "gender",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "color",
            "type": "string"
          }
        ],
        "internalType": "struct LivestockManager.Cow",
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
    "name": "getCowsCount",
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
  }]; 
  
  const contractAddress = '0x54e62d5A70f082e52cE52A8043A70f6A0AaBc50F'; 


  const LivestockManagement = () => {
    const styles = {
        pageContainer: {
            display: 'flex',
            minHeight: '100vh',
            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
            padding: '20px',
            gap: '5px',
            marginLeft: '250px',
          },
          
      sectionContainer: {
        flex: 1,
        maxWidth: '700px',
        margin: '0 auto'
        
      },
      card: {
        borderRadius: '15px',
        background: 'linear-gradient(145deg, #ffffff, #f8f9fa)',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.08)',
        padding: '25px',
        marginBottom: '30px',
        border: '1px solid rgba(0, 0, 0, 0.05)'
      },
      title: {
        color: '#2c3e50',
        textAlign: 'center',
        marginBottom: '1.5rem',
        fontSize: '1.8rem',
        fontWeight: '600',
        paddingBottom: '0.5rem',
        borderBottom: '2px solid #3498db'
      },
      input: {
        width: '100%',
        padding: '12px 15px',
        marginBottom: '1rem',
        border: '1px solid #e0e6ed',
        borderRadius: '8px',
        fontSize: '1rem',
        transition: 'all 0.3s',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.05)'
      },
      button: {
        width: '100%',
        padding: '12px',
        backgroundColor: '#3498db',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        fontSize: '1.1rem',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'all 0.3s',
        marginTop: '0.5rem',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
      },
      statusMessage: {
        marginTop: '1rem',
        padding: '10px',
        borderRadius: '5px',
        textAlign: 'center',
        fontWeight: '500'
      },
      cowItem: {
        border: '1px solid #e0e6ed',
        padding: '15px',
        margin: '15px 0',
        borderRadius: '10px',
        backgroundColor: 'white',
        boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
        transition: 'transform 0.2s',
        ':hover': {
          transform: 'translateY(-3px)',
          boxShadow: '0 5px 15px rgba(0,0,0,0.1)'
        }
      },
      loading: {
        textAlign: 'center',
        color: '#7f8c8d',
        fontSize: '1.2rem'
      }
    };
  
    
    const [cow, setCow] = useState({
      id: '',
      breed: '',
      age: '',
      weight: '',
      gender: '',
      color: '',
    });
  
    const [txStatus, setTxStatus] = useState('');
    const [cows, setCows] = useState([]);
    const [loading, setLoading] = useState(false);
  
    
    const handleChange = (e) => {
      const { name, value } = e.target;
      setCow((prev) => ({ ...prev, [name]: value }));
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
  
      if (!window.ethereum) {
        alert('MetaMask non détecté.');
        return;
      }
  
      try {
        setTxStatus('Connexion au wallet...');
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const contract = new ethers.Contract(contractAddress, livestockAbi, signer);
  
        setTxStatus('Envoi de la transaction...');
        const tx = await contract.addCow(
          cow.id,
          cow.breed,
          parseInt(cow.age),
          parseInt(cow.weight),
          cow.gender,
          cow.color
        );
  
        await tx.wait();
        setTxStatus('✅ Cattle added successfully!');
        setCow({ id: '', breed: '', age: '', weight: '', gender: '', color: '' });
        fetchCows(); 
      } catch (error) {
        console.error(error);
        setTxStatus('❌ Error while adding cattle');
      }
    };

    const fetchCows = async () => {
      if (!window.ethereum) {
        alert("MetaMask non détecté.");
        return;
      }
  
      try {
        setLoading(true);
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const contract = new ethers.Contract(contractAddress, livestockAbi, signer);
  
        const count = await contract.getCowsCount();
        const cowList = [];
  
        for (let i = 0; i < count; i++) {
          const cow = await contract.getCow(i);
          cowList.push({
            id: cow.id,
            breed: cow.breed,
            age: Number(cow.age),
            weight: Number(cow.weight),
            gender: cow.gender,
            color: cow.color
          });
        }
  
        setCows(cowList);
        setLoading(false);
      } catch (error) {
        console.error("Erreur lors de la récupération des bétails :", error);
        setLoading(false);
      }
    };
  
    useEffect(() => {
      fetchCows();
    }, []);
  
    return (
        <div className="main-container">
      <Header />
      <Nav />
      <div style={styles.pageContainer}>
        {/* Section d'ajout */}
        <div style={styles.sectionContainer}>
          <div style={styles.card}>
            <h3 style={styles.title}>🐄 Record New Cattle</h3>
            
            {['id', 'breed', 'age', 'weight', 'gender', 'color'].map((field) => (
              <input
                key={field}
                name={field}
                placeholder={
                  field === 'id' ? 'Tag ID' : 
                  field.charAt(0).toUpperCase() + field.slice(1)
                }
                onChange={handleChange}
                value={cow[field]}
                required={field !== 'weight'}
                style={{
                  ...styles.input,
                  ':focus': {
                    outline: 'none',
                    borderColor: '#3498db',
                    boxShadow: '0 0 0 3px rgba(52, 152, 219, 0.2)'
                  }
                }}
                type={field === 'age' || field === 'weight' ? 'number' : 'text'}
              />
            ))}
            
            <button 
              type="submit"
              onClick={handleSubmit}
              style={{
                ...styles.button,
                ':hover': {
                  backgroundColor: '#2980b9',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 8px rgba(0,0,0,0.15)'
                },
                ':active': {
                  transform: 'translateY(0)'
                }
              }}
            >
              🐄 Add to Herd
            </button>
            
            {txStatus && (
              <p style={{
                ...styles.statusMessage,
                backgroundColor: txStatus.includes('✅') ? 'rgba(46, 204, 113, 0.2)' : 'rgba(231, 76, 60, 0.2)',
                color: txStatus.includes('✅') ? '#27ae60' : '#e74c3c'
              }}>
                {txStatus}
              </p>
            )}
          </div>
        </div>
  
        {/* Section liste */}
        <div style={styles.sectionContainer}>
          <div style={styles.card}>
            <h3 style={styles.title}>🐮 Cattle Registry</h3>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
              <button 
                onClick={fetchCows}
                style={{
                  ...styles.button,
                  backgroundColor: '#2ecc71',
                  padding: '8px 15px',
                  width: 'auto',
                  ':hover': {
                    backgroundColor: '#27ae60'
                  }
                }}
              >
                🔄 Refresh
              </button>
              <div style={{ color: '#7f8c8d', alignSelf: 'center' }}>
                Total: {cows.length}
              </div>
            </div>
            
            {loading ? (
              <p style={styles.loading}>Loading cattle data...</p>
            ) : cows.length === 0 ? (
              <p style={styles.loading}>No cattle found in the registry</p>
            ) : (
              <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
                {cows.map((cow, index) => (
                  <div key={index} style={styles.cowItem}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <strong style={{ color: '#3498db' }}>ID:</strong> 
                      <span>{cow.id}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <strong style={{ color: '#3498db' }}>Breed:</strong> 
                      <span>{cow.breed}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <strong style={{ color: '#3498db' }}>Age:</strong> 
                      <span>{cow.age} years</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <strong style={{ color: '#3498db' }}>Weight:</strong> 
                      <span>{cow.weight} kg</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <strong style={{ color: '#3498db' }}>Gender:</strong> 
                      <span>{cow.gender}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <strong style={{ color: '#3498db' }}>Color:</strong> 
                      <span>{cow.color}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      </div>
    );
  };
  
  export default LivestockManagement;