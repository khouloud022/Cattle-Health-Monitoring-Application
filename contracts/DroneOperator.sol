// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IGovernment {
    function tenders(uint id) external view returns (
        uint, string memory, string memory, uint, bool, address, uint
    );
}

contract DroneOperator {
    IGovernment public governmentContract;
    address public government;

    struct Mission {
        uint tenderId;
        address operator;
        uint amount;
        bool isCompleted;
        bool isPaid;
    }

    struct Bid {
        uint tenderId;
        uint amount;
        address operator;
    }

    mapping(uint => Mission) public missions;
    mapping(uint => mapping(address => bool)) public hasBid;
    mapping(address => Bid[]) public bidsByOperator;
    mapping(uint => Bid[]) public bidsPerTender;
    mapping(uint => bool) public tenderHasMission;


    event BidSubmitted(uint indexed tenderId, address indexed operator, uint amount);
    event MissionMarkedCompleted(uint indexed tenderId, address indexed operator);
    event PaymentReleased(uint indexed tenderId, address indexed operator, uint amount);
    event MissionAssigned(uint indexed tenderId, address indexed operator);

    
    

    modifier onlyGovernment() {
        require(msg.sender == government, "Only government can perform this action");
        _;
    }

    constructor(address _governmentContract) {
        governmentContract = IGovernment(_governmentContract);
        government = msg.sender;
    }

    function submitBid(uint _tenderId, uint _amount) external {
        (, , , uint deadline, bool isOpen, ,) = governmentContract.tenders(_tenderId);
        require(isOpen, "Tender is not open");
        require(block.timestamp < deadline, "Deadline has passed");
        require(_amount > 0, "Bid amount must be greater than zero");
        require(!hasBid[_tenderId][msg.sender], "Already submitted bid for this tender");

        hasBid[_tenderId][msg.sender] = true;
        Bid memory newBid = Bid(_tenderId, _amount, msg.sender);
        bidsByOperator[msg.sender].push(newBid);
        bidsPerTender[_tenderId].push(newBid);

        emit BidSubmitted(_tenderId, msg.sender, _amount);
    }

    function getMyBids() external view returns (Bid[] memory) {
        return bidsByOperator[msg.sender];
    }

    function getBidsForTender(uint _tenderId) external view returns (Bid[] memory) {
        return bidsPerTender[_tenderId];
    }


function assignMission(uint _tenderId, address _operator) external onlyGovernment payable {
    require(!tenderHasMission[_tenderId], "Mission already assigned");
    require(hasBid[_tenderId][_operator], "Operator has not submitted a bid");
    uint bidAmount = 0;
    Bid[] memory allBids = bidsPerTender[_tenderId];
    bool found = false;
    for (uint i = 0; i < allBids.length; i++) {
        if (allBids[i].operator == _operator) {
            bidAmount = allBids[i].amount;
            found = true;
            break;
        }
    }
    require(found, "Bid not found for operator");

    missions[_tenderId] = Mission({
        tenderId: _tenderId,
        operator: _operator,
        amount: bidAmount,
        isCompleted: false,
        isPaid: false
    });

    tenderHasMission[_tenderId] = true;

    emit MissionAssigned(_tenderId, _operator);
}



function markMissionCompleted(uint _tenderId) external {
    Mission storage mission = missions[_tenderId];
    mission.isCompleted = true;
    
    emit MissionMarkedCompleted(_tenderId, msg.sender);
}


function releasePayment(uint _tenderId) external onlyGovernment {
    Mission storage mission = missions[_tenderId];
    mission.isPaid = true;
    (bool success, ) = mission.operator.call{value: mission.amount}("");
    require(success, "Payment transfer failed");
    
    emit PaymentReleased(_tenderId, mission.operator, mission.amount);
}

function getContractBalance() external view returns (uint) {
    return address(this).balance;
}

function getMissionDetails(uint _tenderId) external view returns (
    uint tenderId,
    address operator,
    uint amount,
    bool isCompleted,
    bool isPaid
) {
    Mission storage mission = missions[_tenderId];
    return (
        mission.tenderId,
        mission.operator,
        mission.amount,
        mission.isCompleted,
        mission.isPaid
    );
}

receive() external payable {}
}