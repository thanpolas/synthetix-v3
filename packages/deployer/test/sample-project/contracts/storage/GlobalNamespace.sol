//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

contract GlobalNamespace {
    struct GlobalStorage {
        uint value;
        uint someValue;
    }

    function _globalStorage() internal pure returns (GlobalStorage storage store) {
        assembly {
            // bytes32(uint(keccak256("io.synthetix.global")) - 1)
            store.slot := 0x8f203f5ee9f9a1d361b4a0f56abfdac49cdd246db58538b151edf87309e955b9
        }
    }
}
