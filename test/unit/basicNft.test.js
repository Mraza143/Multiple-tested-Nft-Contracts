const { assert, expect } = require("chai")
const { network, deployments, ethers ,getNamedAccounts } = require("hardhat")
const { developmentChains, networkConfig } = require("../../helper-hardhat-config")

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("Basic Nft Unit Tests", function () {
          let basicNft, deployer, player // , deployer

          beforeEach(async () => {
              accounts = await ethers.getSigners() 
                 deployer  = (await getNamedAccounts()).deployer

              await deployments.fixture(["all"]) // Deploys modules with the tags "mocks" and "lottery"
              basicNft = await ethers.getContract("BasicNft",deployer) // Returns a new connection to the Lottery contract

          })

          describe("constructor", function () {
              it("initializes the name of nft correctly", async () => {
                  //const lotteryState = (await lottery.getLotteryState()).toString()
                  const name = await basicNft.name();

                  assert.equal(name, "Dogie")
                  /*assert.equal(
                      interval.toString(),
                      networkConfig[network.config.chainId]["keepersUpdateInterval"]
                  )*/
              })   
              it("initializes the symbol of nft correctly", async () => {
                //const lotteryState = (await lottery.getLotteryState()).toString()
                const symbol = await basicNft.symbol();
                assert.equal(symbol, "DOG")
                /*assert.equal(
                    interval.toString(),
                    networkConfig[network.config.chainId]["keepersUpdateInterval"]
                )*/
            })             
          })
          
          describe("mint nft", function () {
            it("increments the token counter by one", async () => {
                //const lotteryState = (await lottery.getLotteryState()).toString()
                const count = await basicNft.getTokenCounter();
                await basicNft.mintNft();
                const count2 = await basicNft.getTokenCounter() - 1;
                assert.equal(count, count2)
            })   
            
            it("checks the owner of nft by token id", async () => {
                
                await basicNft.mintNft();                
                const count = await basicNft.getTokenCounter();
                const owner = await basicNft.ownerOf(count);
                assert.equal(deployer, owner)
                //balanceOf
            })  
            
            it("checks the balance of  owner of nft ", async () => {
                let balance = await basicNft.balanceOf(deployer)
                assert.equal(balance, 0)
                await basicNft.mintNft();  
                balance = await basicNft.balanceOf(deployer)              
                assert.equal(
                    balance, 1)
                //balanceOf
            })  
        })
              })