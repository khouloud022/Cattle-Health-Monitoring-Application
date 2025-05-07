import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { auth, db } from './firebase';
import { doc,updateDoc, setDoc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { missionsDb } from './firebase-missions'; 
import Header from './Header';
import Nav2 from './Nav2';
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
  "stateMutability": "payable",
  "type": "receive"
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
},
{
  "inputs": [],
  "name": "getContractBalance",
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
      "name": "_tenderId",
      "type": "uint256"
    }
  ],
  "name": "getMissionDetails",
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
}];
const governmentAddress = '0x96Ce4f01aD687C59D64d2d7d5895F0Ce69e2FebC'; 
const droneOperatorAddress = '0xC30D8Bed6B06C3030ecD8A18459A31a39f0F41e7'; 

function Placebid() {
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
  const [assignedMissions, setAssignedMissions] = useState([]); 
  const [missionDetails, setMissionDetails] = useState({});
  const [loadingMission, setLoadingMission] = useState(false);
  const [earnings, setEarnings] = useState("0");

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
    const fetchTenders = async () => {
      if (government) {
        const result = await government.getActiveTenders();
        const formattedTenders = result.map(tender => ({
          ...tender,
          id: tender.id.toString(),
          deadline: Number(tender.deadline)
        }));
        setTenders(formattedTenders);
      }
    };
    fetchTenders();
  }, [government]);

  useEffect(() => {
    const fetchAssignedMissions = async () => {
      if (!account) return;
      
      try {
        const missionsRef = collection(db, "missions");
        const q = query(missionsRef, where("operator", "==", account));
        const querySnapshot = await getDocs(q);
        
        const missionsData = [];
        querySnapshot.forEach((doc) => {
          missionsData.push({
            id: doc.id,
            ...doc.data()
          });
        });
        
        setAssignedMissions(missionsData);
        await fetchMissionDetails(missionsData);
      } catch (error) {
        console.error("Erreur lors du chargement des missions assignées:", error);
      }
    };

    fetchAssignedMissions();
  }, [account, droneOperator]);

  const handleBidChange = (id, value) => {
    setBidAmounts(prev => ({ ...prev, [id]: value }));
  };

  const submitBid = async (tenderId) => {
    const amount = bidAmounts[tenderId];
    if (!amount || isNaN(amount)) return alert('Invalid bid amount');
    try {
      const tx = await droneOperator.submitBid(tenderId, ethers.parseEther(amount));
      await tx.wait();
      alert('Bid submitted!');
    } catch (err) {
      console.error(err);
      alert('Error submitting bid');
    }
  };

  const fetchMySubmissions = async () => {
    if (!droneOperator || !account) return;

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
    }
  };

  const fetchMissions = async () => {
    const missionsList = [];
    for (let i = 1; i <= 10; i++) {
      try {
        const m = await droneOperator.missions(i);
        if (m.operator.toLowerCase() === account.toLowerCase()) {
          missionsList.push({
            id: i,
            tenderId: m.tenderId.toString(),
            amount: m.amount.toString(),
            isCompleted: m.isCompleted,
            ...m
          });
        }
      } catch (err) {}
    }
    setMissions(missionsList);
  };

  const completeMission = async (tenderId) => {
    if (!droneOperator || !account) return;
    
    try {
      setLoadingMission(true);
      
      const missionRef = doc(db, "missions", tenderId);
      await updateDoc(missionRef, {
        status: "completed",
        completedAt: new Date().toISOString()
      });
      
      const updatedMissions = assignedMissions.map(mission => {
        if (mission.tenderId === tenderId) {
          return { 
            ...mission, 
            status: "completed", 
            completedAt: new Date().toISOString() 
          };
        }
        return mission;
      });
      setAssignedMissions(updatedMissions);
      
      setMissionDetails(prev => ({
        ...prev,
        [tenderId]: {
          ...prev[tenderId],
          isCompleted: true
        }
      }));
      
      try {
        console.log(`Tentative de marquage de la mission ${tenderId} comme terminée...`);
        
        
        const tx = await droneOperator.markMissionCompleted(tenderId, {
          gasLimit: 500000,
          gasPrice: ethers.parseUnits("20", "gwei")
        });
        
        console.log("Transaction envoyée:", tx.hash);
        console.log("En attente de confirmation...");
        const receipt = await tx.wait();
        console.log("Transaction confirmée dans le bloc:", receipt.blockNumber);
        
        await updateDoc(missionRef, {
          txCompletionHash: receipt.hash,
          blockConfirmed: receipt.blockNumber
        });
        
        alert("Mission marquée comme terminée ! Le gouvernement va examiner et libérer le paiement.");
      } catch (err) {
        console.error("La transaction blockchain a échoué:", err);
        alert("Mission completed");
      }
    } catch (err) {
      console.error("Erreur dans le processus de complétion de mission:", err);
      alert("Échec du marquage de la mission comme terminée. Veuillez réessayer.");
    } finally {
      setLoadingMission(false);
    }
  };
const fetchMissionDetails = async (missionsData) => {
  if (!account) return;
  
  try {
    
    let missionsList = missionsData || [];
    
    if (!missionsList.length) {
      const missionsRef = collection(db, "missions");
      const q = query(missionsRef, where("operator", "==", account));
      const querySnapshot = await getDocs(q);
      
      missionsList = [];
      querySnapshot.forEach((doc) => {
        missionsList.push({
          id: doc.id,
          tenderId: doc.id,
          ...doc.data()
        });
      });
      
      setAssignedMissions(missionsList);
    }
    if (droneOperator) {
      const detailsMap = {};
      let totalEarnings = ethers.parseEther("0");
      let needsFirebaseUpdate = false;
      
      for (const mission of missionsList) {
        try {
          const missionData = await droneOperator.missions(mission.tenderId);
          
          const amountStr = ethers.formatEther(missionData.amount);
          
          console.log(`Mission ${mission.tenderId} amount from blockchain: ${amountStr}`);
          detailsMap[mission.tenderId] = {
            isCompleted: missionData.isCompleted,
            isPaid: missionData.isPaid,
            amount: amountStr
          };
          
         
          const firebaseStatus = mission.status || "";
          const blockchainStatus = missionData.isPaid ? "paid" : 
                                 missionData.isCompleted ? "completed" : "active";
                                  
          
          const firebaseAmount = mission.amount || "0";
          const blockchainAmount = amountStr;
          
          if ((blockchainStatus !== firebaseStatus) || 
              (parseFloat(blockchainAmount) > 0 && blockchainAmount !== firebaseAmount)) {
            const missionRef = doc(db, "missions", mission.tenderId);
            await updateDoc(missionRef, {
              status: blockchainStatus,
              amount: amountStr, 
              completedAt: mission.completedAt || new Date().toISOString(),
              updatedAt: new Date().toISOString()
            });
            needsFirebaseUpdate = true;
            console.log(`Updated mission ${mission.tenderId} in Firebase: status=${blockchainStatus}, amount=${amountStr}`);
          }
          
          if (missionData.isPaid) {
            totalEarnings = totalEarnings + missionData.amount;
          }
          
        } catch (err) {
          console.warn(`Impossible de récupérer la mission ${mission.tenderId} depuis la blockchain:`, err);
          detailsMap[mission.tenderId] = {
            isCompleted: mission.status === "completed" || mission.status === "paid",
            isPaid: mission.status === "paid",
            amount: mission.amount || "0"
          };
          
          console.log(`Mission ${mission.tenderId} amount from Firebase: ${mission.amount || "0"}`);
        }
      }
 
      setMissionDetails(detailsMap);
      setEarnings(ethers.formatEther(totalEarnings));
 
      if (needsFirebaseUpdate) {
        setTimeout(() => fetchMissionDetails(), 1000);
      }
      
    } else {
      console.log("Pas de connexion blockchain, utilisation des données Firebase uniquement");
      const detailsMap = {};
      for (const mission of missionsList) {
        detailsMap[mission.tenderId] = {
          isCompleted: mission.status === "completed" || mission.status === "paid",
          isPaid: mission.status === "paid",
          amount: mission.amount || "0"
        };
        
        console.log(`Mission ${mission.tenderId} amount from Firebase (no blockchain): ${mission.amount || "0"}`);
      }
      setMissionDetails(detailsMap);
    }
    
  } catch (err) {
    console.error("Erreur lors du chargement des détails de mission:", err);
  }
};

  useEffect(() => {
    if (account && droneOperator) {
      fetchMissionDetails();
    
      const intervalId = setInterval(fetchMissionDetails, 60000);
      return () => clearInterval(intervalId);
    }
  }, [account, droneOperator]);

  const updateMissionStatusInFirebase = async (detailsMap) => {
    if (!account) return;
    
    try {
      for (const tenderId in detailsMap) {
        const details = detailsMap[tenderId];
        const missionRef = doc(db, "missions", tenderId);
        
        const status = details.isPaid ? "paid" : 
                       details.isCompleted ? "completed" : "active";
        
        await updateDoc(missionRef, {
          status: status,
          amount: details.amount, 
          updatedAt: new Date().toISOString()
        });
      }
    } catch (err) {
      console.error("Error updating mission status in Firebase:", err);
    }
  };
  return (
    <div className="main-container">
      <Header />
      <Nav2 />
      <div style={styles.container}>
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>🏗️ Active Tenders</h2>
          <div style={styles.cardsContainer}>
            {tenders.map((tender, index) => (
              <div key={index} style={styles.card}>
                <div style={styles.cardContent}>
                  <p style={styles.cardField}><span style={styles.fieldLabel}>ID:</span> {tender.id.toString()}</p>
                  <p style={styles.cardField}><span style={styles.fieldLabel}>Location:</span> {tender.location}</p>
                  <p style={styles.cardField}><span style={styles.fieldLabel}>⏰ Deadline:</span> {new Date(Number(tender.deadline) * 1000).toLocaleString()}</p>
                </div>
                <div style={styles.bidForm}>
                  <input
                    style={styles.input}
                    type="text"
                    placeholder="Enter bid amount in ETH"
                    value={bidAmounts[tender.id] || ''}
                    onChange={(e) => handleBidChange(tender.id, e.target.value)}
                  />
                  <button 
                    style={styles.primaryButton}
                    onClick={() => submitBid(tender.id)}
                  >
                    Place Bid
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section pour les missions assignées depuis Firebase */}
        <section style={styles.section}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>📋 Your Assigned Missions</h2>
            <div style={styles.earningsSummary}>
              <span style={styles.earningsLabel}>Total Earnings:</span>
              <span style={styles.earningsAmount}>{earnings} ETH</span>
            </div>
          </div>
          <div style={styles.cardsContainer}>
            {assignedMissions.length > 0 ? (
              assignedMissions.map((mission, index) => {
                const details = missionDetails[mission.tenderId] || {};
                const status = details.isPaid ? "Paid" : 
                               details.isCompleted || mission.status === "completed" ? "Completed (Waiting Payment)" : "Active";
                const statusColor = details.isPaid ? "#4CAF50" : 
                                    details.isCompleted || mission.status === "completed" ? "#FF9800" : "#2196F3";
                
                // Vérifier si la mission est complétée à partir des deux sources
                const isCompleted = details.isCompleted || mission.status === "completed" || mission.status === "paid";
                
                return (
                  <div key={index} style={styles.card}>
                    <div style={styles.cardContent}>
                      <p style={styles.cardField}><span style={styles.fieldLabel}>Tender ID:</span> {mission.tenderId}</p>
                      <p style={styles.cardField}><span style={styles.fieldLabel}>Location:</span> {mission.location}</p>
                      <p style={styles.cardField}><span style={styles.fieldLabel}>Description:</span> {mission.description}</p>
                      <p style={styles.cardField}><span style={styles.fieldLabel}>Assigned At:</span> {new Date(mission.assignedAt).toLocaleString()}</p>
                      <p style={styles.cardField}>
                        <span style={styles.fieldLabel}>Status:</span> 
                        <span style={{color: statusColor, fontWeight: 'bold'}}>
                          {status}
                        </span>
                      </p>
                      {mission.completedAt && (
                        <p style={styles.cardField}><span style={styles.fieldLabel}>Completed At:</span> {new Date(mission.completedAt).toLocaleString()}</p>
                      )}
                      {mission.paidAt && (
                        <p style={styles.cardField}><span style={styles.fieldLabel}>Paid At:</span> {new Date(mission.paidAt).toLocaleString()}</p>
                      )}
                    </div>
                    {!isCompleted && (
                      <button 
                        style={styles.successButton}
                        onClick={() => completeMission(mission.tenderId)}
                        disabled={loadingMission}
                      >
                        {loadingMission ? "Processing..." : "Mark as Completed"}
                      </button>
                    )}
                    {isCompleted && !details.isPaid && (
                      <div style={styles.paymentStatusBadge}>
                        Awaiting Payment from Government
                      </div>
                    )}
                    {details.isPaid && (
                      <div style={styles.paymentReceivedBadge}>
                        Payment Received: {details.amount} ETH
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <div style={styles.emptyState}>
                <p>No missions assigned to you yet</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

export default Placebid;
  const styles = {
    container: {
      padding: '2rem',
      maxWidth: '1200px',
      margin: '0 auto',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
    },
    walletInfo: {
      backgroundColor: '#f0f8ff',
      padding: '1rem',
      borderRadius: '8px',
      marginBottom: '2rem',
      display: 'flex',
      alignItems: 'center',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    },
    walletLabel: {
      fontWeight: 'bold',
      marginRight: '0.5rem',
      color: '#333'
    },
    walletAddress: {
      fontFamily: 'monospace',
      color: '#2c3e50',
      fontSize: '0.9rem'
    },
    section: {
      marginBottom: '3rem',
      animation: 'fadeIn 0.5s ease-out'
    },
    sectionHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '1.5rem'
    },
    sectionTitle: {
      color: '#2c3e50',
      fontSize: '1.5rem',
      margin: 0
    },
    cardsContainer: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
      gap: '1.5rem'
    },
    card: {
      backgroundColor: 'white',
      border: '1px solid #ddd',
      borderRadius: '10px',
      padding: '1.5rem',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
      ':hover': {
        transform: 'translateY(-5px)',
        boxShadow: '0 6px 12px rgba(0,0,0,0.15)'
      }
    },
    cardContent: {
      marginBottom: '1rem'
    },
    cardField: {
      margin: '0.5rem 0',
      lineHeight: '1.6'
    },
    fieldLabel: {
      fontWeight: '600',
      color: '#3498db'
    },
    bidForm: {
      display: 'flex',
      gap: '0.5rem',
      marginTop: '1rem'
    },
    input: {
      flex: 1,
      padding: '0.75rem',
      border: '1px solid #ddd',
      borderRadius: '6px',
      fontSize: '1rem',
      transition: 'border 0.3s',
      ':focus': {
        outline: 'none',
        borderColor: '#3498db',
        boxShadow: '0 0 0 2px rgba(52,152,219,0.2)'
      }
    },
    primaryButton: {
      backgroundColor: '#3498db',
      color: 'white',
      border: 'none',
      borderRadius: '6px',
      padding: '0.75rem 1.5rem',
      cursor: 'pointer',
      fontWeight: '600',
      transition: 'background-color 0.3s',
      ':hover': {
        backgroundColor: '#2980b9'
      }
    },
    secondaryButton: {
      backgroundColor: 'transparent',
      color: '#3498db',
      border: '1px solid #3498db',
      borderRadius: '6px',
      padding: '0.5rem 1rem',
      cursor: 'pointer',
      fontWeight: '600',
      transition: 'all 0.3s',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      ':hover': {
        backgroundColor: '#f0f8ff'
      }
    },
    successButton: {
      backgroundColor: '#4CAF50',
      color: 'white',
      border: 'none',
      borderRadius: '6px',
      padding: '0.75rem 1.5rem',
      cursor: 'pointer',
      fontWeight: '600',
      transition: 'background-color 0.3s',
      width: '100%',
      ':hover': {
        backgroundColor: '#3e8e41'
      }
    }
  };
