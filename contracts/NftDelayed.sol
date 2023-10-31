// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.0;

import "@thirdweb-dev/contracts/base/ERC721DelayedReveal.sol";
import "@thirdweb-dev/contracts/extension/NFTMetadata.sol";


contract NftDelayed is ERC721DelayedReveal, INFTMetadata {
    constructor(
        address _defaultAdmin,
        string memory _name,
        string memory _symbol,
        address _royaltyRecipient,
        uint128 _royaltyBps
    ) ERC721DelayedReveal(_defaultAdmin, _name, _symbol, _royaltyRecipient, _royaltyBps) {}

    function verifyClaim(address _claimer, uint256 _quantity) public view virtual override {
        require(_claimer != owner(), "Not authorized to claim");
    }
}
