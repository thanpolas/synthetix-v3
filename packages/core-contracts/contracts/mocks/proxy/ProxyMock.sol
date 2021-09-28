//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "../../proxy/Proxy.sol";

contract ProxyMock is Proxy {
    bytes32 __EMPTY_0;
    bytes32 __EMPTY_1;
    bytes32 __EMPTY_2;
    bytes32 __EMPTY_3;
    bytes32 __EMPTY_4;
    bytes32 __EMPTY_5;
    bytes32 __EMPTY_6;
    bytes32 __EMPTY_7;
    bytes32 __EMPTY_8;
    bytes32 __EMPTY_9;

    address implementation;

    constructor(address firstImplementation) Proxy(firstImplementation) {}

    function getImplementation() external view returns (address) {
        return _getImplementation();
    }

    function setImplementation(newImplementation) external {
        implementation = newImplementation;
    }

    function _getImplementation() internal override view returns (address) {
        return implementation;
    }

    function _setImplementation(address newImplementation) internal override {
        implementation = newImplementation;
    }
}
