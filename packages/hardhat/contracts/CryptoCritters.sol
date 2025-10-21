// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Base64.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract CryptoCritters is ERC721URIStorage, Ownable {
    using Strings for uint256;

    uint256 public constant MINT_PRICE = 0.01 ether;
    uint256 private _tokenIds;

    // Properties for NFT generation
    string[] private colors = ["red", "green", "blue", "yellow", "purple"];
    string[] private shapes = ["circle", "square", "triangle"];
    string[] private patterns = ["solid", "striped", "dotted"];
    string[] private backgrounds = ["lightblue", "lightgreen", "lavender", "lightyellow", "lightgray"];
    string[] private sizes = ["small", "medium", "large"];

    event Minted(address owner, uint256 tokenId);

    constructor() ERC721("CryptoCritters", "CRIT") Ownable(msg.sender) {}

    function mint() public payable {
        require(msg.value == MINT_PRICE, "Incorrect mint price");

        uint256 tokenId = _tokenIds;
        _tokenIds += 1;

        _safeMint(msg.sender, tokenId);

        emit Minted(msg.sender, tokenId);
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(_exists(tokenId), "URI query for nonexistent token");

        // Generate random features based on tokenId and block timestamp
        uint256 randomSeed = uint256(keccak256(abi.encodePacked(tokenId, block.timestamp)));

        // Select random properties
        string memory color = colors[randomSeed % colors.length];
        string memory shape = shapes[(randomSeed >> 32) % shapes.length];
        string memory pattern = patterns[(randomSeed >> 64) % patterns.length];
        string memory background = backgrounds[(randomSeed >> 96) % backgrounds.length];
        string memory size = sizes[(randomSeed >> 128) % sizes.length];

        // Generate SVG image
        string memory svg = generateSVG(color, shape, pattern, background, size, tokenId);
        string memory encodedSvg = Base64.encode(bytes(svg));

        // Generate JSON metadata
        string memory name = string(abi.encodePacked("CryptoCritter #", tokenId.toString()));
        string memory description = "A unique NFT critter generated on-chain";
        string memory attributes = generateAttributes(color, shape, pattern, size);

        string memory json = string(abi.encodePacked(
            '{"name":"', name,
            '","description":"', description,
            '","image":"data:image/svg+xml;base64,', encodedSvg,
            '","attributes":', attributes, '}'
        ));

        string memory encodedJson = Base64.encode(bytes(json));

        return string(abi.encodePacked("data:application/json;base64,", encodedJson));
    }

    function generateSVG(
        string memory color,
        string memory shape,
        string memory pattern,
        string memory background,
        string memory size,
        uint256 tokenId
    ) private pure returns (string memory) {
        uint256 svgSize = 300; // SVG canvas size
        uint256 shapeSize;

        if (keccak256(abi.encodePacked(size)) == keccak256(abi.encodePacked("small"))) {
            shapeSize = 100;
        } else if (keccak256(abi.encodePacked(size)) == keccak256(abi.encodePacked("medium"))) {
            shapeSize = 150;
        } else {
            shapeSize = 200;
        }

        uint256 x = (svgSize - shapeSize) / 2;
        uint256 y = (svgSize - shapeSize) / 2;

        string memory patternDef;
        string memory patternFill;

        if (keccak256(abi.encodePacked(pattern)) == keccak256(abi.encodePacked("striped"))) {
            patternDef = string(abi.encodePacked(
                '<pattern id="stripes" patternUnits="userSpaceOnUse" width="10" height="10" patternTransform="rotate(45)">',
                '<rect width="4" height="10" fill="', color, '" fill-opacity="0.7"></rect>',
                '</pattern>'
            ));
            patternFill = 'fill="url(#stripes)"';
        } else if (keccak256(abi.encodePacked(pattern)) == keccak256(abi.encodePacked("dotted"))) {
            patternDef = string(abi.encodePacked(
                '<pattern id="dots" patternUnits="userSpaceOnUse" width="20" height="20">',
                '<circle cx="10" cy="10" r="5" fill="', color, '" fill-opacity="0.7"></circle>',
                '</pattern>'
            ));
            patternFill = 'fill="url(#dots)"';
        } else {
            patternDef = '';
            patternFill = string(abi.encodePacked('fill="', color, '"'));
        }

        string memory shapeSvg;
        if (keccak256(abi.encodePacked(shape)) == keccak256(abi.encodePacked("circle"))) {
            shapeSvg = string(abi.encodePacked(
                '<circle cx="', (x + shapeSize/2).toString(), '" cy="', (y + shapeSize/2).toString(),
                '" r="', (shapeSize/2).toString(), '" ', patternFill, ' stroke="black" stroke-width="3"/>'
            ));
        } else if (keccak256(abi.encodePacked(shape)) == keccak256(abi.encodePacked("square"))) {
            shapeSvg = string(abi.encodePacked(
                '<rect x="', x.toString(), '" y="', y.toString(),
                '" width="', shapeSize.toString(), '" height="', shapeSize.toString(),
                '" ', patternFill, ' stroke="black" stroke-width="3"/>'
            ));
        } else {
            // triangle
            uint256 x1 = x + shapeSize / 2;
            uint256 y1 = y;
            uint256 x2 = x;
            uint256 y2 = y + shapeSize;
            uint256 x3 = x + shapeSize;
            uint256 y3 = y + shapeSize;

            shapeSvg = string(abi.encodePacked(
                '<polygon points="',
                x1.toString(), ',', y1.toString(), ' ',
                x2.toString(), ',', y2.toString(), ' ',
                x3.toString(), ',', y3.toString(),
                '" ', patternFill, ' stroke="black" stroke-width="3"/>'
            ));
        }

        return string(abi.encodePacked(
            '<svg xmlns="http://www.w3.org/2000/svg" width="', svgSize.toString(), '" height="', svgSize.toString(), '" viewBox="0 0 ', svgSize.toString(), ' ', svgSize.toString(), '">',
            '<rect width="100%" height="100%" fill="', background, '"/>',
            '<defs>', patternDef, '</defs>',
            shapeSvg,
            '<text x="50%" y="20" font-family="Arial" font-size="16" text-anchor="middle" fill="black">CryptoCritter #', tokenId.toString(), '</text>',
            '</svg>'
        ));
    }

    function generateAttributes(
        string memory color,
        string memory shape,
        string memory pattern,
        string memory size
    ) private pure returns (string memory) {
        return string(abi.encodePacked(
            '[',
            '{"trait_type":"Color","value":"', color, '"},',
            '{"trait_type":"Shape","value":"', shape, '"},',
            '{"trait_type":"Pattern","value":"', pattern, '"},',
            '{"trait_type":"Size","value":"', size, '"}',
            ']'
        ));
    }

    function totalSupply() public view returns (uint256) {
        return _tokenIds;
    }

    function withdraw() public onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds to withdraw");

        (bool success, ) = payable(owner()).call{value: balance}("");
        require(success, "Withdrawal failed");
    }
}
