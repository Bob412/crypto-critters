const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("CryptoCritters", function () {
  let cryptoCritters;
  let owner;
  let user1;
  let user2;
  const MINT_PRICE = ethers.utils.parseEther("0.01");

  beforeEach(async function () {
    // Get signers
    [owner, user1, user2] = await ethers.getSigners();

    // Deploy the contract
    const CryptoCritters = await ethers.getContractFactory("CryptoCritters");
    cryptoCritters = await CryptoCritters.deploy();
    await cryptoCritters.deployed();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await cryptoCritters.owner()).to.equal(owner.address);
    });

    it("Should set the correct name and symbol", async function () {
      expect(await cryptoCritters.name()).to.equal("CryptoCritters");
      expect(await cryptoCritters.symbol()).to.equal("CRIT");
    });

    it("Should have the correct mint price", async function () {
      expect(await cryptoCritters.MINT_PRICE()).to.equal(MINT_PRICE);
    });

    it("Should start with zero tokens", async function () {
      expect(await cryptoCritters.totalSupply()).to.equal(0);
    });
  });

  describe("Minting", function () {
    it("Should fail if mint price is incorrect", async function () {
      const wrongPrice = ethers.utils.parseEther("0.005");
      await expect(
        cryptoCritters.connect(user1).mint({ value: wrongPrice }),
      ).to.be.revertedWith("Incorrect mint price");
    });

    it("Should mint a new token when correct price is paid", async function () {
      // Initial state
      expect(await cryptoCritters.totalSupply()).to.equal(0);

      // Mint a token
      const mintTx = await cryptoCritters
        .connect(user1)
        .mint({ value: MINT_PRICE });

      // Check that the total supply increased
      expect(await cryptoCritters.totalSupply()).to.equal(1);

      // Check that the token was assigned to the correct owner
      expect(await cryptoCritters.ownerOf(0)).to.equal(user1.address);

      // Check that the Minted event was emitted
      await expect(mintTx)
        .to.emit(cryptoCritters, "Minted")
        .withArgs(user1.address, 0);
    });

    it("Should allow multiple users to mint tokens", async function () {
      // User1 mints a token
      await cryptoCritters.connect(user1).mint({ value: MINT_PRICE });
      expect(await cryptoCritters.ownerOf(0)).to.equal(user1.address);

      // User2 mints a token
      await cryptoCritters.connect(user2).mint({ value: MINT_PRICE });
      expect(await cryptoCritters.ownerOf(1)).to.equal(user2.address);

      // Total supply should be 2
      expect(await cryptoCritters.totalSupply()).to.equal(2);
    });
  });

  describe("TokenURI", function () {
    beforeEach(async function () {
      // Mint a token for testing
      await cryptoCritters.connect(user1).mint({ value: MINT_PRICE });
    });

    it("Should return a valid token URI", async function () {
      const tokenURI = await cryptoCritters.tokenURI(0);

      // Should be a base64 encoded JSON
      expect(tokenURI).to.match(/^data:application\/json;base64,/);

      // Decode the token URI
      const jsonString = Buffer.from(
        tokenURI.replace("data:application/json;base64,", ""),
        "base64",
      ).toString();

      const metadata = JSON.parse(jsonString);

      // Check metadata has required fields
      expect(metadata).to.have.property("name");
      expect(metadata).to.have.property("description");
      expect(metadata).to.have.property("image");
      expect(metadata).to.have.property("attributes");

      // Image should be base64 encoded SVG
      expect(metadata.image).to.match(/^data:image\/svg\+xml;base64,/);

      // Attributes should include color, shape, pattern and size
      const attributeTraits = metadata.attributes.map(
        (attr) => attr.trait_type,
      );
      expect(attributeTraits).to.include.members([
        "Color",
        "Shape",
        "Pattern",
        "Size",
      ]);
    });

    it("Should fail for non-existent token", async function () {
      await expect(cryptoCritters.tokenURI(99)).to.be.revertedWith(
        "URI query for nonexistent token",
      );
    });
  });

  describe("Withdrawal", function () {
    beforeEach(async function () {
      // Mint multiple tokens to fund the contract
      await cryptoCritters.connect(user1).mint({ value: MINT_PRICE });
      await cryptoCritters.connect(user2).mint({ value: MINT_PRICE });
    });

    it("Should allow owner to withdraw funds", async function () {
      const initialBalance = await ethers.provider.getBalance(owner.address);

      // Contract should have 0.02 ETH (2 mints)
      expect(await ethers.provider.getBalance(cryptoCritters.address)).to.equal(
        MINT_PRICE.mul(2),
      );

      // Owner withdraws funds
      const tx = await cryptoCritters.connect(owner).withdraw();
      const receipt = await tx.wait();
      const gasCost = receipt.gasUsed.mul(receipt.effectiveGasPrice);

      // Contract should have 0 ETH
      expect(await ethers.provider.getBalance(cryptoCritters.address)).to.equal(
        0,
      );

      // Owner should have received the funds minus gas costs
      const finalBalance = await ethers.provider.getBalance(owner.address);
      expect(finalBalance).to.equal(
        initialBalance.add(MINT_PRICE.mul(2)).sub(gasCost),
      );
    });

    it("Should prevent non-owners from withdrawing", async function () {
      await expect(cryptoCritters.connect(user1).withdraw())
        .to.be.revertedWithCustomError(
          cryptoCritters,
          "OwnableUnauthorizedAccount",
        )
        .withArgs(user1.address);
    });

    it("Should fail to withdraw if contract has no funds", async function () {
      // First withdraw all funds
      await cryptoCritters.connect(owner).withdraw();

      // Try to withdraw again
      await expect(cryptoCritters.connect(owner).withdraw()).to.be.revertedWith(
        "No funds to withdraw",
      );
    });
  });
});
