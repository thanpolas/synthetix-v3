//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

contract ImplementationMockV2 {
    uint public a;
    string public b;

    function setA(uint newA) public {
        a = newA;
    }

    function getA() external view returns (uint) {
        return a;
    }

    function setB(string memory newB) public {
        b = newB;
    }

    function getB() external view returns (string memory) {
        return b;
    }
}

