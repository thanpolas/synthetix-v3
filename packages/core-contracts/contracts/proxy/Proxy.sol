//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

abstract contract Proxy {
    constructor(address firstImplementation) payable {
        _setImplementation(firstImplementation);
    }

    fallback() external payable {
        address impl = _getImplementation();

        // solhint-disable-next-line no-inline-assembly
        assembly {
            calldatacopy(0, 0, calldatasize())

            let result := delegatecall(gas(), impl, 0, calldatasize(), 0, 0)

            returndatacopy(0, 0, returndatasize())

            switch result
            case 0 {
                revert(0, returndatasize())
            }
            default {
                return(0, returndatasize())
            }
        }
    }

    function _getImplementation() internal virtual returns (address);

    function _setImplementation(address newImplementation) internal virtual;
}
