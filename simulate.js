// simulateur.js
const fs = require("fs");
const csv = require("csv-parser");
const Web3 = require('web3').default;

const contractABI = require("./build/contracts/AutoSimulated.json").abi;
const contractAddress = "0x31E37634cCc364D936e281d11e3EaDe6E10b4de9";
const account = "0xEcEa5De1BbF50151dC6B9b05A383CE3989cd3230";

const web3 = new Web3("http://127.0.0.1:7545");
const contract = new web3.eth.Contract(contractABI, contractAddress);

let dataFromCSV = [];

async function startSimulation() {
  const existingDataCount = await contract.methods.getDataLength().call();
  console.log(`⏩ Already ${existingDataCount} data in the smart contract.`);

  fs.createReadStream("donnees.csv")
    .pipe(csv())
    .on("data", (row) => {
      dataFromCSV.push(row);
    })
    .on("end", () => {
      console.log("✅ CSV loaded. Start of simulation...");

      let index = parseInt(existingDataCount); 
      setInterval(async () => {
        if (index < dataFromCSV.length) {
          const row = dataFromCSV[index];
          console.log(`🚀 Sending Data ${index + 1}:`, row);

          try {
            await contract.methods
              .addData(
                parseInt(row.cow),
                parseInt(row.IN_ALLEYS),
                parseInt(row.REST),
                parseInt(row.EAT),
                parseInt(row.ACTIVITY_LEVEL),
                row.LPS,
                parseInt(row.disturbance)
              )
              .send({ from: account, gas: 3000000 });

            console.log(`✅ Data ${index + 1} sent successfully.`);
          } catch (error) {
            console.error(`❌ Error while sending data ${index + 1}`, error);
          }

          index++;
        } else {
          console.log("🎯 All Data has been sent !");
          process.exit(0);
        }
      }, 10 * 1000); 
    });
}

startSimulation();
