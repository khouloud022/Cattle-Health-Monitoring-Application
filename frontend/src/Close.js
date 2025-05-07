import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import Nav from './Nav';
import Header from "./Header";
import './Publish.css';
const CONTRACT_ADDRESS = "0x96Ce4f01aD687C59D64d2d7d5895F0Ce69e2FebC";
const CONTRACT_ABI = [ {
  "inputs": [],
  "stateMutability": "nonpayable",
  "type": "constructor"
},
{
  "anonymous": false,
  "inputs": [
    {
      "indexed": true,
      "internalType": "uint256",
      "name": "tenderId",
      "type": "uint256"
    },
    {
      "indexed": true,
      "internalType": "address",
      "name": "winner",
      "type": "address"
    },
    {
      "indexed": false,
      "internalType": "uint256",
      "name": "amount",
      "type": "uint256"
    }
  ],
  "name": "BidAccepted",
  "type": "event"
},
{
  "anonymous": false,
  "inputs": [
    {
      "indexed": true,
      "internalType": "uint256",
      "name": "tenderId",
      "type": "uint256"
    },
    {
      "indexed": true,
      "internalType": "address",
      "name": "bidder",
      "type": "address"
    },
    {
      "indexed": false,
      "internalType": "uint256",
      "name": "amount",
      "type": "uint256"
    }
  ],
  "name": "BidPlaced",
  "type": "event"
},
{
  "anonymous": false,
  "inputs": [
    {
      "indexed": true,
      "internalType": "uint256",
      "name": "id",
      "type": "uint256"
    }
  ],
  "name": "TenderClosed",
  "type": "event"
},
{
  "anonymous": false,
  "inputs": [
    {
      "indexed": true,
      "internalType": "uint256",
      "name": "id",
      "type": "uint256"
    },
    {
      "indexed": false,
      "internalType": "string",
      "name": "location",
      "type": "string"
    },
    {
      "indexed": false,
      "internalType": "uint256",
      "name": "deadline",
      "type": "uint256"
    }
  ],
  "name": "TenderCreated",
  "type": "event"
},
{
  "inputs": [
    {
      "internalType": "uint256",
      "name": "",
      "type": "uint256"
    },
    {
      "internalType": "address",
      "name": "",
      "type": "address"
    }
  ],
  "name": "bids",
  "outputs": [
    {
      "internalType": "uint256",
      "name": "",
      "type": "uint256"
    }
  ],
  "stateMutability": "view",
  "type": "function"
},
{
  "inputs": [],
  "name": "government",
  "outputs": [
    {
      "internalType": "address",
      "name": "",
      "type": "address"
    }
  ],
  "stateMutability": "view",
  "type": "function"
},
{
  "inputs": [
    {
      "internalType": "uint256",
      "name": "",
      "type": "uint256"
    },
    {
      "internalType": "uint256",
      "name": "",
      "type": "uint256"
    }
  ],
  "name": "tenderBidders",
  "outputs": [
    {
      "internalType": "address",
      "name": "",
      "type": "address"
    }
  ],
  "stateMutability": "view",
  "type": "function"
},
{
  "inputs": [],
  "name": "tenderCounter",
  "outputs": [
    {
      "internalType": "uint256",
      "name": "",
      "type": "uint256"
    }
  ],
  "stateMutability": "view",
  "type": "function"
},
{
  "inputs": [
    {
      "internalType": "uint256",
      "name": "",
      "type": "uint256"
    }
  ],
  "name": "tenders",
  "outputs": [
    {
      "internalType": "uint256",
      "name": "id",
      "type": "uint256"
    },
    {
      "internalType": "string",
      "name": "location",
      "type": "string"
    },
    {
      "internalType": "string",
      "name": "description",
      "type": "string"
    },
    {
      "internalType": "uint256",
      "name": "deadline",
      "type": "uint256"
    },
    {
      "internalType": "bool",
      "name": "isOpen",
      "type": "bool"
    },
    {
      "internalType": "address",
      "name": "winningBidder",
      "type": "address"
    },
    {
      "internalType": "uint256",
      "name": "winningBidAmount",
      "type": "uint256"
    }
  ],
  "stateMutability": "view",
  "type": "function"
},
{
  "inputs": [
    {
      "internalType": "string",
      "name": "_location",
      "type": "string"
    },
    {
      "internalType": "string",
      "name": "_description",
      "type": "string"
    },
    {
      "internalType": "uint256",
      "name": "_deadline",
      "type": "uint256"
    }
  ],
  "name": "createTender",
  "outputs": [],
  "stateMutability": "nonpayable",
  "type": "function"
},
{
  "inputs": [
    {
      "internalType": "uint256",
      "name": "_id",
      "type": "uint256"
    }
  ],
  "name": "closeTender",
  "outputs": [],
  "stateMutability": "nonpayable",
  "type": "function"
},
{
  "inputs": [],
  "name": "getActiveTenders",
  "outputs": [
    {
      "components": [
        {
          "internalType": "uint256",
          "name": "id",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "location",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "description",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "deadline",
          "type": "uint256"
        },
        {
          "internalType": "bool",
          "name": "isOpen",
          "type": "bool"
        },
        {
          "internalType": "address",
          "name": "winningBidder",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "winningBidAmount",
          "type": "uint256"
        }
      ],
      "internalType": "struct Government.Tender[]",
      "name": "",
      "type": "tuple[]"
    }
  ],
  "stateMutability": "view",
  "type": "function"}];

const TenderApp = () => {
  const [tenders, setTenders] = useState([]);
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState(null);
  const [bids, setBids] = useState({});


  useEffect(() => {
    connectWallet();
  }, []);

  useEffect(() => {
    if (contract) {
      fetchTenders(contract);
      listenToBidPlacedEvents();
    }
  }, [contract]);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const contractInstance = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
        setContract(contractInstance);
        const accounts = await provider.send("eth_requestAccounts", []);
        setAccount(accounts[0]);
      } catch (error) {
        console.error("Wallet connection error:", error);
      }
    } else {
      alert("You must install Metamask!");
    }
  };
  const formatForContract = (value) => {
    try {
      return value.toString(); 
    } catch (error) {
      console.error("Conversion error:", error);
      return "0"; 
    }
  };

  const fetchTenders = async (contractInstance) => {
    try {
      const activeTenders = await contractInstance.getActiveTenders();
      const formattedTenders = activeTenders.map(tender => ({
        ...tender,
        id: Number(tender.id), 
      location: tender.location,
      description: tender.description,
      deadline: Number(tender.deadline), 
      isOpen: tender.isOpen
      }));
      setTenders(formattedTenders);
    } catch (error) {
      console.error("Error retrieving tenders:", error);
    }
  };

  const createTender = async () => {
    if (!contract || !location || !description || !deadline) {
      alert("Please fill in all fields and connect to a wallet");
      return;
    }
    
    try {
      const deadlineTimestamp = Math.floor(new Date(deadline).getTime() / 1000);
      const tx = await contract.createTender(
        location, 
        description, 
        formatForContract(deadlineTimestamp)
      );
      await tx.wait();
      alert("Tender created successfully !");
      fetchTenders(contract);
      setLocation("");
      setDescription("");
      setDeadline("");
    } catch (error) {
      console.error("Error creating tender:", error);
      alert(`Erreur: ${error.message}`);
    }
  };

  const closeTender = async (id) => {
    if (!contract) return;
    try {
      const tx = await contract.closeTender(formatForContract(id),{
        gasLimit: 300000, 
        
      } );
      
      await tx.wait();
      alert("Tender closed successfully!");
      fetchTenders(contract);
    } catch (error) {
      console.error("Error closing the tender :", error);
      let errorMessage = "Unknown error";
    if (error.reason) {
      errorMessage = error.reason;
    } else if (error.data?.message) {
      errorMessage = error.data.message;
    }
    alert(`Failed to close: ${errorMessage}`);
      
    }
  };
  const listenToBidPlacedEvents = () => {
    contract.on("BidPlaced", (tenderId, bidder, amount) => {
      setBids(prevBids => {
        const newBid = {
          bidder,
          amount: ethers.formatUnits(amount, "ether") + " ETH",
          tenderId: tenderId.toString()
        };
        return {
          ...prevBids,
          [tenderId]: prevBids[tenderId] ? [...prevBids[tenderId], newBid] : [newBid]
        };
      });
    });
  };
  const fetchBidsForTender = async (tenderId) => {
    try {
      
      if (!contract || !tenderId) {
        console.error("Contract or Tender ID is invalid.");
        return;
      }
  
      
      const filter = contract.filters.BidPlaced(tenderId, null);
      console.log("Fetching bids with filter:", filter);
      const events = await contract.queryFilter(filter);
  
      
      console.log("Fetched events:", events);
  
      
      const bidsForTender = events.map(event => ({
        bidder: event.args.bidder,
        amount: ethers.formatUnits(event.args.amount, 'ether') + " ETH",
        tenderId: event.args.tenderId.toString(),
      }));
  
      // Mise à jour des offres
      setBids(prev => ({ ...prev, [tenderId]: bidsForTender }));
    } catch (error) {
      console.error(`Error fetching bids for tender ${tenderId}:`, error);
      alert(`Failed to fetch bids: ${error.message}`);
    }
  };
  
  return (
    <div className="main-container">
      <Header />
      <Nav />
      <div style={styles.container}>
        <section style={styles.section}>
          <div style={{ marginTop: '2rem' }}>
            <div style={styles.sectionHeader}>
              <h2 style={styles.sectionTitle}>📝 Active Tenders</h2>
              <div style={styles.badge}>{tenders.filter(t => t.isOpen).length} open</div>
            </div>
            
            {tenders.length === 0 ? (
              <div style={styles.emptyState}>
                <p style={styles.emptyText}>No active tender for the moment.</p>
              </div>
            ) : (
              <div style={styles.cardGrid}>
                {tenders.map((tender, index) => (
                  <div key={index} style={styles.card}>
                    <div style={styles.cardHeader}>
                      <h3 style={styles.cardTitle}>Tender #{tender.id}</h3>
                      {tender.isOpen && (
                        <span style={styles.deadline}>
                          ⏰ {new Date(tender.deadline * 1000).toLocaleString()}
                        </span>
                      )}
                    </div>
                    
                    <div style={styles.cardBody}>
                      <div style={styles.infoRow}>
                        <span style={styles.infoLabel}>Location:</span>
                        <span style={styles.infoValue}>{tender.location}</span>
                      </div>
                      <div style={styles.infoRow}>
                        <span style={styles.infoLabel}>Description:</span>
                        <span style={styles.infoValue}>{tender.description}</span>
                      </div>
                      <div style={styles.infoRow}>
                        <span style={styles.infoLabel}>Status:</span>
                        <span style={tender.isOpen ? 
                          { color: '#27ae60', fontWeight: '500' } : 
                          { color: '#e74c3c', fontWeight: '500' }}>
                          {tender.isOpen ? "Open" : "Closed"}
                        </span>
                      </div>
                    </div>
                    
                    {tender.isOpen && (
                      <button 
                        onClick={() => closeTender(tender.id)}
                        style={{
                          ...styles.primaryButton,
                          backgroundColor: '#e74c3c',
                          ':hover': {
                            backgroundColor: '#c0392b'
                          }
                        }}
                      >
                        Close Tender
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  ); 
};
export default TenderApp;
const styles = {
  container: {
    padding: '2rem',
    fontFamily: "'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif",
    maxWidth: '1500px',
    margin: '0 auto',
    color: '#333',
  },
  section: {
    marginBottom: '3rem',
  },
  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    marginBottom: '1.5rem',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    fontSize: '1.4rem',
    fontWeight: '600',
    color: '#2c3e50',
    margin: 0,
  },
  badge: {
    backgroundColor: '#3498db',
    color: 'white',
    padding: '0.2rem 0.8rem',
    borderRadius: '20px',
    fontSize: '0.8rem',
    fontWeight: '600',
  },
  walletInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  walletLabel: {
    fontWeight: '500',
    color: '#7f8c8d',
  },
  walletAddress: {
    fontFamily: 'monospace',
    backgroundColor: '#f5f5f5',
    padding: '0.3rem 0.6rem',
    borderRadius: '4px',
    fontSize: '0.9rem',
  },
  cardGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))',
    gap: '1.5rem',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.08)',
    padding: '1.5rem',
    border: '1px solid #eaeaea',
    transition: 'transform 0.2s, box-shadow 0.2s',
    ':hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.12)',
    },
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem',
    paddingBottom: '0.8rem',
    borderBottom: '1px solid #f0f0f0',
  },
  cardTitle: {
    fontSize: '1.1rem',
    fontWeight: '600',
    margin: 0,
    color: '#2c3e50',
  },
  deadline: {
    fontSize: '0.8rem',
    color: '#e74c3c',
    fontWeight: '500',
  },
  cardBody: {
    marginBottom: '1.5rem',
  },
  infoRow: {
    display: 'flex',
    marginBottom: '0.6rem',
    gap: '0.5rem',
  },
  infoLabel: {
    fontWeight: '500',
    color: '#7f8c8d',
    minWidth: '90px',
  },
  infoValue: {
    fontWeight: '400',
  },
  primaryButton: {
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    padding: '0.6rem 1.2rem',
    borderRadius: '6px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    width: '100%',
    ':hover': {
      backgroundColor: '#2980b9',
    },
  },
  emptyState: {
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
    padding: '2rem',
    textAlign: 'center',
    border: '1px dashed #eaeaea',
  },
  emptyText: {
    color: '#95a5a6',
    margin: 0,
  },
};