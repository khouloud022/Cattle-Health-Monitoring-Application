
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ethers } from "ethers";
import Nav2 from './Nav2';
import Header from "./Header";
const CONTRACT_ADDRESS = "0x96Ce4f01aD687C59D64d2d7d5895F0Ce69e2FebC";
const CONTRACT_ABI = [{
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
  "name": "tenderCounter",
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
  "type": "function",
  "constant": true
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
  "type": "function",
  "constant": true
}];
const Main = () => {
  const [tenders, setTenders] = useState([]);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState(null);

  useEffect(() => {
    connectWallet();
  }, []);

  useEffect(() => {
    if (contract) {
      fetchTenders(contract);
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
        console.error("Erreur de connexion au wallet:", error);
      }
    } else {
      alert("Installez Metamask pour interagir avec le smart contract.");
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
      console.error("Erreur lors de la récupération des tenders :", error);
    }
  };
  
  

  return (
    <div className="main-container">
      <Header />
      <Nav2 />
    <div className="main">
      <div className="report-container">
        <div className="report-header">
          <h1 className="recent-Articles">Available Tenders</h1>
        </div>
        <div className="report-body">
        <div className="report-topic-heading">
        {tenders.length === 0 ? (
        <p>No active tender for the moment</p>
      ) : (
        <table>
          <thead>
            <tr>
              
            <th  scope="col">Tender </th>
            <th scope="col">Location </th>
            <th scope="col">Deadline </th>
            <th scope="col">Description </th>
            
            </tr>
            </thead>
            
            <tbody>   
            {tenders.map((tender, index) => (
          <tr key={index}>
            <td>{tender.id}</td>
            <td>{tender.location}</td>
            <td>{new Date(tender.deadline * 1000).toLocaleString()}</td>
            <td>{tender.description}</td>
            <td>{tender.isOpen}</td>
            <td><button type="submit" style={{padding: '8px 16px',backgroundColor: '#4CAF50',color: 'white',border: 'none',borderRadius: '4px',cursor: 'pointer',fontSize: '14px',fontWeight: 'bold',transition: 'background-color 0.3s',textDecoration: 'none'}} onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#45a049'}
    onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#4CAF50'}
  >
    <Link to="/placebid" style={{ textDecoration: 'none', color: 'inherit' }}>
      Submit
    </Link>
  </button>
</td>
          </tr>
        ))}
            </tbody>
            
            </table>)}
            </div>
            </div>

      </div>

    </div>
    </div>

);
  
};

export default Main;
