import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { auth, db } from './firebase';
import { doc, getDoc } from "firebase/firestore";
import Header from './Header';
import Nav from './Nav2';
const GovernmentABI = [{
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
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_tenderId",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "_bidder",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "_amount",
        "type": "uint256"
      }
    ],
    "name": "recordBid",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_tenderId",
        "type": "uint256"
      }
    ],
    "name": "getAllBidsForTender",
    "outputs": [
      {
        "internalType": "address[]",
        "name": "",
        "type": "address[]"
      },
      {
        "internalType": "uint256[]",
        "name": "",
        "type": "uint256[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }];
const DroneOperatorABI = [{
  "inputs": [
    {
      "internalType": "address",
      "name": "_governmentContract",
      "type": "address"
    }
  ],
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
      "name": "operator",
      "type": "address"
    },
    {
      "indexed": false,
      "internalType": "uint256",
      "name": "amount",
      "type": "uint256"
    }
  ],
  "name": "BidSubmitted",
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
      "name": "operator",
      "type": "address"
    }
  ],
  "name": "MissionMarkedCompleted",
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
      "name": "operator",
      "type": "address"
    },
    {
      "indexed": false,
      "internalType": "uint256",
      "name": "amount",
      "type": "uint256"
    }
  ],
  "name": "PaymentReleased",
  "type": "event"
},
{
  "inputs": [
    {
      "internalType": "address",
      "name": "",
      "type": "address"
    },
    {
      "internalType": "uint256",
      "name": "",
      "type": "uint256"
    }
  ],
  "name": "bidsByOperator",
  "outputs": [
    {
      "internalType": "uint256",
      "name": "tenderId",
      "type": "uint256"
    },
    {
      "internalType": "uint256",
      "name": "amount",
      "type": "uint256"
    }
  ],
  "stateMutability": "view",
  "type": "function",
  "constant": true
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
  "type": "function",
  "constant": true
},
{
  "inputs": [],
  "name": "governmentContract",
  "outputs": [
    {
      "internalType": "contract IGovernment",
      "name": "",
      "type": "address"
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
    },
    {
      "internalType": "address",
      "name": "",
      "type": "address"
    }
  ],
  "name": "hasBid",
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
      "name": "",
      "type": "uint256"
    }
  ],
  "name": "missions",
  "outputs": [
    {
      "internalType": "uint256",
      "name": "tenderId",
      "type": "uint256"
    },
    {
      "internalType": "address",
      "name": "operator",
      "type": "address"
    },
    {
      "internalType": "uint256",
      "name": "amount",
      "type": "uint256"
    },
    {
      "internalType": "bool",
      "name": "isCompleted",
      "type": "bool"
    },
    {
      "internalType": "bool",
      "name": "isPaid",
      "type": "bool"
    }
  ],
  "stateMutability": "view",
  "type": "function",
  "constant": true
},
{
  "stateMutability": "payable",
  "type": "receive",
  "payable": true
},
{
  "inputs": [
    {
      "internalType": "uint256",
      "name": "_tenderId",
      "type": "uint256"
    },
    {
      "internalType": "uint256",
      "name": "_amount",
      "type": "uint256"
    }
  ],
  "name": "submitBid",
  "outputs": [],
  "stateMutability": "nonpayable",
  "type": "function"
},
{
  "inputs": [],
  "name": "getMyBids",
  "outputs": [
    {
      "components": [
        {
          "internalType": "uint256",
          "name": "tenderId",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "internalType": "struct DroneOperator.Bid[]",
      "name": "",
      "type": "tuple[]"
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
      "name": "_tenderId",
      "type": "uint256"
    },
    {
      "internalType": "address",
      "name": "_operator",
      "type": "address"
    },
    {
      "internalType": "uint256",
      "name": "_amount",
      "type": "uint256"
    }
  ],
  "name": "assignMission",
  "outputs": [],
  "stateMutability": "nonpayable",
  "type": "function"
},
{
  "inputs": [
    {
      "internalType": "uint256",
      "name": "_tenderId",
      "type": "uint256"
    }
  ],
  "name": "markMissionCompleted",
  "outputs": [],
  "stateMutability": "nonpayable",
  "type": "function"
},
{
  "inputs": [
    {
      "internalType": "uint256",
      "name": "_tenderId",
      "type": "uint256"
    }
  ],
  "name": "releasePayment",
  "outputs": [],
  "stateMutability": "nonpayable",
  "type": "function"
}];
const governmentAddress = '0x96Ce4f01aD687C59D64d2d7d5895F0Ce69e2FebC'; 
const droneOperatorAddress = '0xC30D8Bed6B06C3030ecD8A18459A31a39f0F41e7'; 
function Viewbids() {
 
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [account, setAccount] = useState(null);
  const [government, setGovernment] = useState(null);
  const [droneOperator, setDroneOperator] = useState(null);
  const [tenders, setTenders] = useState([]);
  const [bidAmounts, setBidAmounts] = useState({});
  const [missions, setMissions] = useState([]);
  const [mySubmissions, setMySubmissions] = useState([]);
  const [showSubmissions, setShowSubmissions] = useState(false);
  const [loadingSubmissions, setLoadingSubmissions] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        const user = auth.currentUser;
  
        if (!user) {
          console.error("Utilisateur non connecté.");
          return;
        }
  
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
  
        if (!docSnap.exists()) {
          console.error("Données utilisateur non trouvées.");
          return;
        }
  
        const userData = docSnap.data();
  
        const privateKey = userData.ethPrivateKey;
  
      
        const wallet = new ethers.Wallet(privateKey);
        const provider = new ethers.BrowserProvider(window.ethereum);
        const connectedWallet = wallet.connect(provider);
  
       
        const govContract = new ethers.Contract(
          governmentAddress,
          GovernmentABI,
          connectedWallet
        );
        const droneContract = new ethers.Contract(
          droneOperatorAddress,
          DroneOperatorABI,
          connectedWallet
        );
  
       
        setProvider(provider);
        setSigner(connectedWallet);
        setAccount(wallet.address);
        setGovernment(govContract);
        setDroneOperator(droneContract);
  
        console.log("Connexion avec clé privée Firebase réussie !");
      } catch (error) {
        console.error("Erreur lors de l'initialisation :", error);
      }
    };
  
    init();
  }, []);
  
  useEffect(() => {
    fetchMySubmissions();
  }, [government]);

  
  const fetchMySubmissions = async () => {
    if (!droneOperator || !account) return;
    setLoadingSubmissions(true);
  
    try {
      const filter = droneOperator.filters.BidSubmitted(null, account);
      const events = await droneOperator.queryFilter(filter);
  
      const submissions = await Promise.all(
        events.map(async (event) => {
          const tenderId = event.args.tenderId;
          
          
          const tender = await government.tenders(tenderId);
          
          
          let missionStatus = "Submitted";
          try {
            const mission = await droneOperator.missions(tenderId);
            if (mission.operator === account) {
              missionStatus = mission.isCompleted ? 
                (mission.isPaid ? "Paid" : "Completed") : 
                "Assigned";
            }
          } catch {}
  
          return {
            tenderId: tenderId.toString(),
            amount: ethers.formatUnits(event.args.amount, 18),
            status: missionStatus,
            tenderDetails: {
              location: tender[1], 
              description: tender[2], 
              deadline: new Date(Number(tender[3]) * 1000).toLocaleString()
            }
          };
        })
      );
  
      setMySubmissions(submissions);
      setShowSubmissions(true);
    } catch (err) {
      console.error("Error fetching submissions:", err);
      alert("Error loading submissions. See console for details.");
    } finally {
        setLoadingSubmissions(false);}
  };


  return (
    <div className="main-container">
      <Header />
      <Nav />
    <div style={{ 
      padding: '2rem',
      maxWidth: '1500px',
      margin: '0 auto',
      fontFamily: "'Poppins', sans-serif",
      background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%)',
      minHeight: '100vh'
    }}>
      <p style={{
        fontSize: '1.1rem',
        color: '#ffffff',
        padding: '0.75rem 1.5rem',
        backgroundColor: '#6e48aa',
        borderRadius: '30px',
        display: 'inline-block',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        marginTop:'2rem',
        marginBottom: '1rem'
      }}>
        Connected wallet: {account}
      </p>
  
      <div style={{ marginTop: '2rem' }}>
        {showSubmissions && (
          <div>
            <h3 style={{
              marginTop: '2rem',
              textAlign: 'center',
              color: '#3a3d57',
              fontSize: '2rem',
              marginBottom: '2rem',
              paddingBottom: '0.5rem',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              position: 'relative',
              display: 'inline-block',
              left: '50%',
              transform: 'translateX(-50%)'
            }}>
              <span style={{
                display: 'block',
                width: '60px',
                height: '4px',
                background: 'linear-gradient(90deg, #ff9a9e 0%, #fad0c4 100%)',
                margin: '0.5rem auto',
                borderRadius: '2px'
              }}></span>
              My Bid Submissions
            </h3>
            
            {mySubmissions.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '3rem',
                background: 'white',
                borderRadius: '12px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
                maxWidth: '600px',
                margin: '0 auto'
              }}>
                <div style={{
                  width: '80px',
                  height: '80px',
                  background: 'linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)',
                  borderRadius: '50%',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.5rem'
                }}>
                  <span style={{ fontSize: '2rem', color: 'white' }}>!</span>
                </div>
                <p style={{
                  color: '#4a4a4a',
                  fontSize: '1.3rem',
                  fontWeight: '500'
                }}>
                  No submissions found
                </p>
                <p style={{ color: '#7b7b7b', marginTop: '0.5rem' }}>
                  Start bidding to see your submissions here
                </p>
              </div>
            ) : (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
                gap: '2rem',
                padding: '1rem'
              }}>
                {mySubmissions.map((submission, index) => (
                  <div 
                    key={index} 
                    style={{
                      border: 'none',
                      padding: '2rem',
                      borderRadius: '12px',
                      background: submission.status === 'Accepted' ? 'linear-gradient(135deg, #d4fc79 0%, #96e6a1 100%)' :
                                    submission.status === 'Rejected' ? 'linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%)' : 
                                    'linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)',
                      boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
                      transition: 'all 0.3s ease',
                      position: 'relative',
                      overflow: 'hidden',
                      ':hover': {
                        transform: 'translateY(-5px)',
                        boxShadow: '0 15px 30px rgba(0,0,0,0.15)'
                      },
                      ':before': {
                        content: '""',
                        position: 'absolute',
                        top: '0',
                        right: '0',
                        width: '100%',
                        height: '4px',
                        background: submission.status === 'Accepted' ? '#2ecc71' :
                                    submission.status === 'Rejected' ? '#e74c3c' : '#3498db',
                        transition: 'all 0.3s'
                      }
                    }}
                  >
                    <h4 style={{
                      marginTop: '0',
                      color: '#3a3d57',
                      paddingBottom: '0.75rem',
                      marginBottom: '1.25rem',
                      fontSize: '1.4rem',
                      borderBottom: '2px dashed rgba(255,255,255,0.5)'
                    }}>
                      Tender ID: {submission.tenderId}
                    </h4>
                    
                    <p style={{ 
                      margin: '0.75rem 0',
                      display: 'flex',
                      alignItems: 'center'
                    }}>
                      <span style={{ 
                        color: '#3a3d57',
                        fontWeight: '600',
                        minWidth: '100px',
                        display: 'inline-block'
                      }}>Amount:</span> 
                      <span style={{ 
                        fontWeight: 'bold', 
                        color: '#3a3d57',
                        background: 'rgba(255,255,255,0.7)',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '20px',
                        fontSize: '0.95rem'
                      }}> 
                        {submission.amount} ETH
                      </span>
                    </p>
                    
                    <p style={{ 
                      margin: '0.75rem 0',
                      display: 'flex',
                      alignItems: 'center'
                    }}>
                      <span style={{ 
                        color: '#3a3d57',
                        fontWeight: '600',
                        minWidth: '100px',
                        display: 'inline-block'
                      }}>Status:</span> 
                      <span style={{
                        fontWeight: 'bold',
                        color: '#ffffff',
                        textTransform: 'capitalize',
                        background: submission.status === 'Accepted' ? 'rgba(46, 204, 113, 0.8)' :
                                    submission.status === 'Rejected' ? 'rgba(231, 76, 60, 0.8)' : 
                                    'rgba(52, 152, 219, 0.8)',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '20px',
                        fontSize: '0.9rem',
                        letterSpacing: '0.5px'
                      }}> 
                        {submission.status}
                      </span>
                    </p>
                    
                    <div style={{
                      marginTop: '1.5rem',
                      paddingTop: '1.5rem',
                      borderTop: '2px dashed rgba(255,255,255,0.5)'
                    }}>
                      <p style={{ 
                        margin: '0.75rem 0',
                        display: 'flex',
                        alignItems: 'flex-start'
                      }}>
                        <span style={{ 
                          color: '#3a3d57',
                          fontWeight: '600',
                          minWidth: '100px',
                          display: 'inline-block'
                        }}>Location:</span> 
                        <span style={{ color: '#3a3d57' }}>{submission.tenderDetails.location}</span>
                      </p>
                      <p style={{ 
                        margin: '0.75rem 0',
                        display: 'flex',
                        alignItems: 'flex-start'
                      }}>
                        <span style={{ 
                          color: '#3a3d57',
                          fontWeight: '600',
                          minWidth: '100px',
                          display: 'inline-block'
                        }}>Description:</span> 
                        <span style={{ color: '#3a3d57' }}>{submission.tenderDetails.description}</span>
                      </p>
                      <p style={{ 
                        margin: '0.75rem 0',
                        display: 'flex',
                        alignItems: 'center'
                      }}>
                        <span style={{ 
                          color: '#3a3d57',
                          fontWeight: '600',
                          minWidth: '100px',
                          display: 'inline-block'
                        }}>Deadline:</span> 
                        <span style={{ 
                          color: '#3a3d57',
                          fontWeight: '600',
                          background: 'rgba(255,255,255,0.7)',
                          padding: '0.25rem 0.75rem',
                          borderRadius: '20px',
                          fontSize: '0.9rem'
                        }}> 
                          {submission.tenderDetails.deadline}
                        </span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
    </div>
  );
  
}

export default Viewbids;
