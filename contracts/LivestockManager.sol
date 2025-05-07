// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract LivestockManager {
    struct Cow {
        string id;
        string breed;
        uint age;
        uint weight;
        string gender;
        string color;
    }

    Cow[] public cows;

    event CowAdded(string id, string breed);

    function addCow(
        string memory _id,
        string memory _breed,
        uint _age,
        uint _weight,
        string memory _gender,
        string memory _color
    ) public {
        cows.push(Cow(_id, _breed, _age, _weight, _gender, _color));
        emit CowAdded(_id, _breed);
    }

    function getCow(uint index) public view returns (Cow memory) {
        return cows[index];
    }

    function getCowsCount() public view returns (uint) {
        return cows.length;
    }
}
