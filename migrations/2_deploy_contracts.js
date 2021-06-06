const CUGAToken = artifacts.require('CUGAToken')
const CUGAFarm = artifacts.require('CUGAFarm')

module.exports = async function(deployer, network, accounts) {
  // Deploy CUGA Token
  await deployer.deploy(CUGAToken)
  const cugaToken = await CUGAToken.deployed()

  // Deploy CUGAFarm
  await deployer.deploy(CUGAFarm, cugaToken.address)
  const cugaFarm = await CUGAFarm.deployed()

  // Transfer all CUGA Tokens to CUGAFarm (1 million)
  await cugaToken.transfer(cugaFarm.address, '1000000000000000000000000')
}