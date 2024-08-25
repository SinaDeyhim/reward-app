import { expect } from "chai";
import hardhat from "hardhat";
const { ethers } = hardhat;

describe("HelloWorld Contract", function () {
  let HelloWorld;
  let helloWorld;
  let owner;

  beforeEach(async function () {
    // Get the ContractFactory and Signers
    HelloWorld = await ethers.getContractFactory("HelloWorld");
    [owner] = await ethers.getSigners();

    // Deploy the contract with an initial message
    helloWorld = await HelloWorld.deploy("Initial Message");
    await helloWorld.deployed();
  });

  describe("Deployment", function () {
    it("Should set the right initial message", async function () {
      // Check the initial message
      expect(await helloWorld.message()).to.equal("Initial Message");
    });
  });

  describe("Update Function", function () {
    it("Should update the message and emit the event", async function () {
      // Set up the new message
      const newMessage = "Updated Message";

      const tx = await helloWorld.update(newMessage);
      await tx.wait();


      // Check the updated message
      expect(await helloWorld.message()).to.equal(newMessage);
    });
  });
});
