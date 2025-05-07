import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import Nav from './Nav';
import Header from "./Header";
import './Publish.css';
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
}];

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
      <br></br>
      <div className="main">
        <div className="content-wrapper"> {/* Nouveau wrapper */}
          <div className="form-section"> 
            <h1 className="text-2xl font-bold mb-4">Publish new tender</h1>
            <div className="form-container"> 
              <h2>Create a new tender</h2>
              <input 
                type="text" 
                placeholder="Location" 
                value={location} 
                onChange={(e) => setLocation(e.target.value)} 
              />
              <textarea 
                placeholder="Description" 
                value={description} 
                onChange={(e) => setDescription(e.target.value)} 
                rows="4"
              ></textarea>
              <input 
                type="datetime-local" 
                value={deadline} 
                onChange={(e) => setDeadline(e.target.value)} 
              />
              <button onClick={createTender}>
                Create tender
              </button>
            </div>
           
          </div>
          
          {/* Nouvelle section pour l'image */}
          <div className="image-section">
            <img 
              src="freepik_assistant_1745952612887.png" 
              alt="Construction project illustration"
              className="featured-image"
            />
            
          </div>
        </div>
      </div>
    </div>
  );
  
  
};

export default TenderApp;