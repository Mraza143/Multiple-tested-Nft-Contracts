const { assert, expect } = require("chai")
const { network, deployments, ethers ,getNamedAccounts } = require("hardhat")
const { developmentChains, networkConfig } = require("../../helper-hardhat-config")

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("Random Nft Unit Tests", function () {
          let randomNft, deployer, mintFee // , deployer

          beforeEach(async () => {
              accounts = await ethers.getSigners() 
                 deployer  = (await getNamedAccounts()).deployer

              await deployments.fixture(["all"]) // Deploys modules with the tags "mocks" and "lottery"
              randomNft = await ethers.getContract("RandomIpfsNft",deployer) // Returns a new connection to the Lottery contract
            mintFee = randomNft.getMintFee()
          })

          describe("constructor", function () {
              it("initializes the dog token uri of random nft correctly", async () => {
                  
                  const dogtokenuri = (await randomNft.getDogTokenUris(0)).toString();
                  assert.equal(dogtokenuri,"ipfs://QmSeHYoyFNwcPLLgpyQ96DcR2TfrUFX5pW26s1neGMk9ut")

              })                
          })
          describe("requestNft", function () {
            it("reverts when you don't pay enough", async () => {
                await expect(randomNft.requestNft()).to.be.revertedWith( // is reverted when not paid enough or raffle is not open
                    "NeedMoreETHSent"
                )
            })

            it("emits event on enter", async () => {
                await expect(randomNft.requestNft({ value: mintFee })).to.emit( // emits RaffleEnter event if entered to index player(s) address
                    randomNft,
                    "NftRequested"
                )
            })

            it(" and emits a requestId", async () => {
                // Too many asserts in this test!
                 const txResponse = await randomNft.requestNft({ value: mintFee });
                const txReceipt = await txResponse.wait(1) // waits 1 block
                const requestId = txReceipt.events[1].args.requestId
                assert(requestId.toNumber() > 0)
                //console.log(requestId);
                //assert(raffleState == 1) // 0 = open, 1 = calculating
            })

        })
  
        })
