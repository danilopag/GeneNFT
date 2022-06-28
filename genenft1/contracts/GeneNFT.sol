// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract GeneNFT is ERC721, ERC721URIStorage, Ownable {
    mapping(string => uint8) existingURIs;
    using Counters for Counters.Counter;

    //Contatore dei token coniati
    Counters.Counter private _tokenIdCounter;

    constructor() ERC721("GeneNFT", "GNFT") {}

    //Base URI per l'NFT - Nel caso specifico viene mantenuta come stringa vuota vista la completezza dell' URI
    //già passato
    function _baseURI() internal pure override returns (string memory) {
        return "";
    }

    //Utilizzato per bruciare un token già esistente - Non implementato all'interno della Dapp
    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    //Permette lo storage degli URI già coniati
    function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    //Controllo per verificare se un URI è già stato coniato
    function existContent(string memory uri) public view returns (bool) {
        return existingURIs[uri] == 1;
    }

    //Processo di Conio di un NFT
    function safeMint(address recipient, string memory metadataURI) public returns (uint256) {
        require(existingURIs[metadataURI] != 1, 'NFT already minted!');
        uint256 newItemId = _tokenIdCounter.current();
        _tokenIdCounter.increment(); //Incrementa il contatore interno
        existingURIs[metadataURI] = 1; //Aggiunge l'URI del NFT coniato come già presente 
        _mint(recipient, newItemId); //Processo di conio tramite metodo _mint definito dallo standard
        _setTokenURI(newItemId, metadataURI);
        return newItemId;
    }
}