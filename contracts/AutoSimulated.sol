// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract AutoSimulated {
    struct AnimalData {
        uint256 timestamp;
        uint256 cow;
        int256 IN_ALLEYS;
        int256 REST;
        int256 EAT;
        int256 ACTIVITY_LEVEL;
        string LPS;
        int256 disturbance;
    }

    AnimalData[] public dataHistory;
    mapping(uint => bool) public viewedData;

    event DataAdded(uint256 timestamp, uint256 cow);

    function addData(
        uint256 _cow,
        int256 _IN_ALLEYS,
        int256 _REST,
        int256 _EAT,
        int256 _ACTIVITY_LEVEL,
        string memory _LPS,
        int256 _disturbance
    ) public {
        AnimalData memory data = AnimalData({
            timestamp: block.timestamp,
            cow: _cow,
            IN_ALLEYS: _IN_ALLEYS,
            REST: _REST,
            EAT: _EAT,
            ACTIVITY_LEVEL: _ACTIVITY_LEVEL,
            LPS: _LPS,
            disturbance: _disturbance
        });

        dataHistory.push(data);
        emit DataAdded(block.timestamp, _cow);
    }

    function getLastData() public view returns (AnimalData memory) {
        require(dataHistory.length > 0, "No data yet");
        return dataHistory[dataHistory.length - 1];
    }

    function getDataLength() public view returns (uint256) {
        return dataHistory.length;
    }

    function getDataAt(uint index) public view returns (
        uint256 timestamp,
        uint256 cow,
        int256 IN_ALLEYS,
        int256 REST,
        int256 EAT,
        int256 ACTIVITY_LEVEL,
        string memory LPS,
        int256 disturbance
    ) {
        require(index < dataHistory.length, "Index out of range");
        AnimalData memory data = dataHistory[index];
        return (
            data.timestamp,
            data.cow,
            data.IN_ALLEYS,
            data.REST,
            data.EAT,
            data.ACTIVITY_LEVEL,
            data.LPS,
            data.disturbance
        );
    }

    function markAsViewed(uint index) public {
        require(index < dataHistory.length, "Invalid index");
        viewedData[index] = true;
    }
}
