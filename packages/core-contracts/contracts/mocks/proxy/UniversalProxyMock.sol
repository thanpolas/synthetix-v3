////SPDX-License-Identifier: Unlicense
//pragma solidity ^0.8.0;

//import "../../proxy/UniversalProxy.sol";

//contract UniversalProxyMock is UniversalProxy {
//    struct ProxyStorage {
//        address implementation;
//    }

//    function _proxyStorage() internal pure returns (ProxyStorage storage store) {
//        assembly {
//            // bytes32(uint(keccak256("io.synthetix.proxy")) - 1)
//            store.slot := 0x9dbde58b6f7305fccdc5abd7ea1096e84de3f9ee47d83d8c3efc3e5557ac9c74
//        }
//    }

//    function getImplementation() public override view returns (address) {
//        return _proxyStorage().implementation;
//    }

//    function _setImplementation(address newImplementation) internal override {
//        _proxyStorage().implementation = newImplementation;
//    }
//}
