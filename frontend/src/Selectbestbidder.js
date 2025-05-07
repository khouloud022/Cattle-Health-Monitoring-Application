
import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { doc, setDoc, getDoc,updateDoc, collection, query, where, getDocs } from "firebase/firestore";
import { auth, db } from './firebase'; // Import pour l'authentification
import { missionsDb } from './firebase-missions'; // Import pour les missions
import Header from './Header';
import Nav from './Nav';
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
  "name": "MissionAssigned",
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
    },
    {
      "internalType": "address",
      "name": "operator",
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
  "name": "bidsPerTender",
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
    },
    {
      "internalType": "address",
      "name": "operator",
      "type": "address"
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
  "name": "governmentContract",
  "outputs": [
    {
      "internalType": "contract IGovernment",
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
  "name": "tenderHasMission",
  "outputs": [
    {
      "internalType": "bool",
      "name": "",
      "type": "bool"
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
        },
        {
          "internalType": "address",
          "name": "operator",
          "type": "address"
        }
      ],
      "internalType": "struct DroneOperator.Bid[]",
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
    }
  ],
  "name": "getBidsForTender",
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
        },
        {
          "internalType": "address",
          "name": "operator",
          "type": "address"
        }
      ],
      "internalType": "struct DroneOperator.Bid[]",
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
      "name": "_operator",
      "type": "address"
    }
  ],
  "name": "assignMission",
  "outputs": [],
  "stateMutability": "payable",
  "type": "function"
}];;
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
}];
const governmentAddress = '0x96Ce4f01aD687C59D64d2d7d5895F0Ce69e2FebC';
const droneOperatorAddress = '0xC30D8Bed6B06C3030ecD8A18459A31a39f0F41e7';

function ReviewTenders() {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [account, setAccount] = useState(null);
  const [government, setGovernment] = useState(null);
  const [droneOperator, setDroneOperator] = useState(null);
  const [tenders, setTenders] = useState([]);
  const [selectedTenderId, setSelectedTenderId] = useState(null);
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(false);
  const [contractBalance, setContractBalance] = useState("0");
  const [errorMessage, setErrorMessage] = useState("");
  const [assignedMissions, setAssignedMissions] = useState({});
  const [missionStatuses, setMissionStatuses] = useState({});

  useEffect(() => {
    const init = async () => {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = await provider.getSigner();
        const account = await signer.getAddress();

        const govContract = new ethers.Contract(
          governmentAddress,
          GovernmentABI,
          signer
        );

        const droneContract = new ethers.Contract(
          droneOperatorAddress,
          DroneOperatorABI,
          signer
        );

        setProvider(provider);
        setSigner(signer);
        setAccount(account);
        setGovernment(govContract);
        setDroneOperator(droneContract);

        console.log("Gouvernment connected via Metamask!");
      } catch (err) {
        console.error("Connection error with Metamask:", err);
        alert("Metamask connection failed.");
      }
    };

    init();
  }, []);

  useEffect(() => {
    const fetchTenders = async () => {
      if (!government) return;
      try {
        const result = await government.getActiveTenders();
        const formatted = result.map(t => ({
          id: t.id.toString(),
          location: t.location,
          description: t.description,
          deadline: Number(t.deadline)
        }));
        setTenders(formatted);
        
        // Vérifier quelles missions sont déjà assignées
        if (droneOperator) {
          await loadAssignedMissions(formatted);
          // Synchroniser avec Firebase
          await loadMissions(formatted);
        }
      } catch (err) {
        console.error("Error while loading tenders:", err);
      }
    };
    
    fetchTenders();
  }, [government, droneOperator]);
  
const loadMissions = async (tendersList) => {
    try {
      const tenderIds = tendersList.map(tender => tender.id);
      const missionsRef = collection(db, "missions");
      const missionsSnapshot = await getDocs(query(missionsRef, where("tenderId", "in", tenderIds)));
      
      const missionsMap = {};
      const missionsStatusMap = {}; 
      
      missionsSnapshot.forEach(doc => {
        const missionData = doc.data();
        missionsMap[missionData.tenderId] = missionData.operator;
        missionsStatusMap[missionData.tenderId] = missionData.status || "active"; 
      });
      
      setAssignedMissions(prev => ({
        ...prev,
        ...missionsMap
      }));
      
      setMissionStatuses(missionsStatusMap);
      
    } catch (err) {
      console.error("Error loading missions from Firebase:", err);
    }
  };

  const fetchBids = async (tenderId) => {
    if (!droneOperator || !government) return;
    try {

      const isAssigned = await droneOperator.tenderHasMission(tenderId);
      if (isAssigned) {
        alert("Ce tender a déjà été assigné à un opérateur.");
        return;
      }
      
      const events = await droneOperator.queryFilter(
        droneOperator.filters.BidSubmitted(tenderId)
      );
  
      const allBids = events.map(e => ({
        bidder: e.args[1],
        amount: ethers.formatUnits(e.args[2], 18)
      }));
  
      setSelectedTenderId(tenderId);
      setBids(allBids);
    } catch (err) {
      console.error("Error while loading bids:", err);
    }
  };
  
  const checkMissionStatus = async (tenderId) => {
    try {
        if (!droneOperator) return false;
        const missionDetails = await droneOperator.missions(tenderId);
        return missionDetails && missionDetails.operator !== ethers.ZeroAddress;
    } catch (err) {
        console.error("Error checking mission status:", err);
        return false;
    }
  };
  
  const fundContract = async () => {
    if (!signer) return;
    try {
      setLoading(true);
      setErrorMessage("");
   
      const tx = await signer.sendTransaction({
          to: droneOperatorAddress,
          value: ethers.parseEther("1")
      });
      
      await tx.wait();

      const balance = await provider.getBalance(droneOperatorAddress);
      setContractBalance(ethers.formatEther(balance));
      
      alert("Contract funded with 1 ETH");
      setLoading(false);
    } catch (err) {
      console.error("Error funding contract:", err);
      setErrorMessage("Failed to fund contract: " + (err.message || err));
      setLoading(false);
    }
  };

  const assignMission = async (tenderId, operator) => {
    setLoading(true);
    try {
      if (!droneOperator || !government) {
        console.error("droneOperator ou government n'est pas défini");
        setLoading(false);
        return;
      }

      const isAssigned = await droneOperator.tenderHasMission(tenderId);
      if (isAssigned) {
        alert("Ce tender a déjà été assigné. Vous ne pouvez pas l'assigner à nouveau.");
        setLoading(false);
        return;
      }

      const governmentAddress = await government.government();
      const signer = await provider.getSigner();
      const signerAddress = await signer.getAddress();
      
      console.log("Adresse du gouvernement:", governmentAddress);
      console.log("Adresse utilisée pour assigner :", signerAddress);
      
      if (governmentAddress.toLowerCase() !== signerAddress.toLowerCase()) {
        alert("Seul le gouvernement peut assigner des missions. Vous n'avez pas les permissions nécessaires.");
        setLoading(false);
        return;
      }

      const hasBid = await droneOperator.hasBid(tenderId, operator);
      if (!hasBid) {
        alert("L'opérateur sélectionné n'a pas soumis d'offre pour ce tender.");
        setLoading(false);
        return;
      }

      const droneOperatorWithSigner = droneOperator.connect(signer);

      console.log("Envoi de la transaction avec les paramètres:", {
        tenderId,
        operator,
        gasLimit: 500000
      });

      const tx = await droneOperatorWithSigner.assignMission(tenderId, operator, {
        gasLimit: 500000
      });

      console.log("Transaction envoyée:", tx.hash);
      const receipt = await tx.wait();
      console.log("Transaction confirmée:", receipt);
      const tenderData = tenders.find(t => t.id === tenderId);
      await saveMissionToFirebase(tenderId, operator, tenderData, receipt.hash);
      setAssignedMissions(prev => ({
        ...prev,
        [tenderId]: operator
      }));
   
      setSelectedTenderId(null);
      setBids([]);
      
      console.log("Mission assignée avec succès.");
      alert("Mission assigned successfully.");
    } catch (err) {
      console.error("Erreur assignation mission :", err);
      if (err.reason) {
        alert("Erreur: " + err.reason);
      } else if (err.data && err.data.message) {
        alert("Erreur: " + err.data.message);
      } else {
        alert("Erreur lors de l'assignation. Voir la console pour plus de détails.");
      }
    }
    setLoading(false);
  };
  const saveMissionToFirebase = async (tenderId, operator, tenderData, txHash = null) => {
    try {
      if (!tenderData) {
        console.error("Données du tender non disponibles");
        return false;
      }
      const missionData = {
        tenderId,
        operator,
        location: tenderData.location,
        description: tenderData.description,
        deadline: tenderData.deadline,
        status: "active",
        assignedAt: new Date().toISOString(), 
        txHash: txHash 
      };
      const missionRef = doc(db, "missions", tenderId);
      await setDoc(missionRef, missionData);
      
      console.log("Mission sauvegardée dans Firebase:", missionData);
      return true;
    } catch (error) {
      console.error("Erreur lors de l'enregistrement dans Firebase:", error);
      return false;
    }
  };

  const loadAssignedMissions = async (tendersList) => {
    if (!droneOperator) return;
    
    try {
      const assignedMissionsMap = {};
      for (const tender of tendersList) {
        const tenderId = tender.id;
        const isAssigned = await droneOperator.tenderHasMission(tenderId);
        
        if (isAssigned) {
          const missionDetails = await droneOperator.missions(tenderId);
          if (missionDetails && missionDetails.operator !== ethers.ZeroAddress) {
            assignedMissionsMap[tenderId] = missionDetails.operator;
            const missionRef = doc(db, "missions", tenderId);
            const missionDoc = await getDoc(missionRef);
            if (!missionDoc.exists()) {
              await saveMissionToFirebase(tenderId, missionDetails.operator, tender, null);
            }
          }
        }
      }
      
      setAssignedMissions(assignedMissionsMap);
    } catch (err) {
      console.error("Error loading assigned missions:", err);
    }
  };
  const releasePayment = async (tenderId) => {
    setLoading(true);
    try {
      if (!droneOperator || !government) {
        console.error("droneOperator ou government n'est pas défini");
        setLoading(false);
        return;
      }
  
      const governmentAddress = await government.government();
      const signer = await provider.getSigner();
      const signerAddress = await signer.getAddress();
      
      if (governmentAddress.toLowerCase() !== signerAddress.toLowerCase()) {
        alert("Seul le gouvernement peut libérer les paiements.");
        setLoading(false);
        return;
      }
      const missionStatus = missionStatuses[tenderId];
      if (missionStatus !== "completed") {
        alert("Cette mission n'est pas encore marquée comme complétée.");
        setLoading(false);
        return;
      }
      const tx = await droneOperator.releaseMissionPayment(tenderId, {
        gasLimit: 500000
      });
      
      console.log("Transaction de paiement envoyée:", tx.hash);
      const receipt = await tx.wait();
      console.log("Transaction confirmée:", receipt);
      const missionRef = doc(db, "missions", tenderId);
      await updateDoc(missionRef, {
        status: "paid",
        paidAt: new Date().toISOString(),
        txPaymentHash: receipt.hash
      });
      setMissionStatuses(prev => ({
        ...prev,
        [tenderId]: "paid"
      }));
      
      alert("Paiement libéré avec succès!");
    } catch (err) {
      console.error("Erreur lors de la libération du paiement:", err);
      alert("Erreur lors de la libération du paiement. Voir la console pour les détails.");
    }
    setLoading(false);
  };
  const activeTenders = tenders.filter(t => !assignedMissions[t.id]);
  const assignedTenders = tenders.filter(t => assignedMissions[t.id]);

  return (
    <div className="main-container">
      <Header />
      <Nav />
      <div style={styles.container}>

        {/* Active Tenders Section */}
        <section style={styles.section}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>📝 Active Tenders</h2>
            <div style={styles.badge}>{activeTenders.length} available</div>
          </div>
          
          {activeTenders.length === 0 ? (
            <div style={styles.emptyState}>
              <p style={styles.emptyText}>No active tenders available</p>
            </div>
          ) : (
            <div style={styles.cardGrid}>
              {activeTenders.map(tender => (
                <div key={tender.id} style={styles.card}>
                  <div style={styles.cardHeader}>
                    <h3 style={styles.cardTitle}>Tender #{tender.id}</h3>
                    <span style={styles.deadline}>
                      ⏰ {new Date(tender.deadline * 1000).toLocaleString()}
                    </span>
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
                  </div>
                  
                  <button 
                    style={styles.primaryButton}
                    onClick={() => fetchBids(tender.id)}
                  >
                    View Submissions
                  </button>

                  {selectedTenderId === tender.id && (
                    <div style={styles.bidsContainer}>
                      <h4 style={styles.bidsTitle}>📋 Submissions for Tender #{tender.id}</h4>
                      
                      {bids.length === 0 ? (
                        <div style={styles.emptyState}>
                          <p style={styles.emptyText}>No submissions yet</p>
                        </div>
                      ) : (
                        <div style={styles.bidsList}>
                          {bids.map((bid, idx) => (
                            <div key={idx} style={styles.bidCard}>
                              <div style={styles.bidInfo}>
                                <div style={styles.infoRow}>
                                  <span style={styles.infoLabel}>Operator:</span>
                                  <span style={styles.infoValue}>{bid.bidder}</span>
                                </div>
                                <div style={styles.infoRow}>
                                  <span style={styles.infoLabel}>Bid Amount:</span>
                                  <span style={styles.bidAmount}>{bid.amount} ETH</span>
                                </div>
                              </div>
                              <button 
                                style={styles.successButton}
                                onClick={() => assignMission(tender.id, bid.bidder)}
                              >
                                Assign Mission
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Assigned Missions Section */}
        <section style={styles.section}>
  <div style={styles.sectionHeader}>
    <h2 style={styles.sectionTitle}>✅ Assigned Missions</h2>
    <div style={styles.badge}>{assignedTenders.length} assigned</div>
  </div>
  
  {assignedTenders.length === 0 ? (
    <div style={styles.emptyState}>
      <p style={styles.emptyText}>No missions assigned yet</p>
    </div>
  ) : (
    <div style={styles.tableContainer}>
      <table style={styles.table}>
        <thead>
          <tr style={styles.tableHeaderRow}>
            <th style={styles.tableHeader}>Tender ID</th>
            <th style={styles.tableHeader}>Location</th>
            <th style={styles.tableHeader}>Assigned Operator</th>
            <th style={styles.tableHeader}>Status</th>
            <th style={styles.tableHeader}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {assignedTenders.map(tender => {
            const status = missionStatuses[tender.id] || "active";
            let statusStyle = styles.statusBadge;
            if (status === "completed") {
              statusStyle = {...styles.statusBadge, backgroundColor: '#ff9800', color: 'white'};
            } else if (status === "paid") {
              statusStyle = {...styles.statusBadge, backgroundColor: '#4caf50', color: 'white'};
            }
            
            return (
              <tr key={tender.id} style={styles.tableRow}>
                <td style={styles.tableCell}>{tender.id}</td>
                <td style={styles.tableCell}>{tender.location}</td>
                <td style={styles.tableCell}>
                  <span style={styles.operatorTag}>{assignedMissions[tender.id]}</span>
                </td>
                <td style={styles.tableCell}>
                  <span style={statusStyle}>{status.charAt(0).toUpperCase() + status.slice(1)}</span>
                </td>
                <td style={styles.tableCell}>
                  {status === "completed" && (
                    <button 
                      style={{...styles.primaryButton, backgroundColor: '#4caf50'}}
                      onClick={() => releasePayment(tender.id)}
                    >
                      Release Payment
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  )}
</section>

        {loading && (
          <div style={styles.loadingOverlay}>
            <div style={styles.loadingSpinner}></div>
            <p style={styles.loadingText}>Processing transaction...</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ReviewTenders;

const styles = {
  container: {
    padding: '2rem',
    fontFamily: "'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif",
    maxWidth: '1500px',
    margin: '0 auto',
    color: '#333',
    
    
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem',
    paddingBottom: '1rem',
    borderBottom: '1px solid #eaeaea',
  },
  title: {
    fontSize: '1.8rem',
    fontWeight: '600',
    color: '#2c3e50',
    margin: 0,
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
  section: {
    marginBottom: '3rem',
    
  },
  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    marginBottom: '1.5rem',
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
  cardGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(500px, 1fr))',
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
  bidAmount: {
    fontWeight: '600',
    color: '#27ae60',
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
  successButton: {
    backgroundColor: '#27ae60',
    color: 'white',
    border: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '6px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    ':hover': {
      backgroundColor: '#219653',
    },
  },
  bidsContainer: {
    marginTop: '1.5rem',
    paddingTop: '1.5rem',
    borderTop: '1px solid #f0f0f0',
  },
  bidsTitle: {
    fontSize: '1rem',
    fontWeight: '600',
    margin: '0 0 1rem 0',
    color: '#2c3e50',
  },
  bidsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.8rem',
  },
  bidCard: {
    backgroundColor: '#f9f9f9',
    borderRadius: '6px',
    padding: '1rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    border: '1px solid #eaeaea',
  },
  bidInfo: {
    flex: 1,
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
  tableContainer: {
    overflowX: 'auto',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
    border: '1px solid #eaeaea',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  tableHeaderRow: {
    backgroundColor: '#f8f9fa',
  },
  tableHeader: {
    padding: '0.8rem 1rem',
    textAlign: 'left',
    fontWeight: '600',
    color: '#2c3e50',
    borderBottom: '1px solid #eaeaea',
  },
  tableRow: {
    ':hover': {
      backgroundColor: '#f8f9fa',
    },
  },
  tableCell: {
    padding: '0.8rem 1rem',
    borderBottom: '1px solid #eaeaea',
    verticalAlign: 'middle',
  },
  operatorTag: {
    backgroundColor: '#e3f2fd',
    color: '#1976d2',
    padding: '0.3rem 0.6rem',
    borderRadius: '4px',
    fontSize: '0.85rem',
    fontWeight: '500',
  },
  statusBadge: {
    backgroundColor: '#e8f5e9',
    color: '#2e7d32',
    padding: '0.3rem 0.6rem',
    borderRadius: '4px',
    fontSize: '0.85rem',
    fontWeight: '500',
  },
  loadingOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  loadingSpinner: {
    border: '4px solid #f3f3f3',
    borderTop: '4px solid #3498db',
    borderRadius: '50%',
    width: '40px',
    height: '40px',
    animation: 'spin 1s linear infinite',
  },
  loadingText: {
    marginTop: '1rem',
    color: '#3498db',
    fontWeight: '500',
  },
  '@keyframes spin': {
    '0%': { transform: 'rotate(0deg)' },
    '100%': { transform: 'rotate(360deg)' },
  },
};