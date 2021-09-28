//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

contract ImplementationMockV1 {
    uint a;

    function setA(uint newA) public {
        a = newA;
    }

    function getA() external view returns (uint) {
        return a;
    }
}
