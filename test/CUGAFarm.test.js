const CUGAToken = artifacts.require('CUGAToken')
const CUGAFarm = artifacts.require('CUGAFarm')

require('chai')
  .use(require('chai-as-promised'))
  .should()

function tokens(n) {
  return web3.utils.toWei(n, 'ether');
}

contract('CUGAFarm', ([owner, investor, investor2]) => {
  let cugaToken, cugaFarm

  before(async () => {
    // Load Contracts
    cugaToken = await CUGAToken.new()
    cugaFarm = await CUGAFarm.new(cugaToken.address)

    // Transfer all Dapp tokens to farm (1 million)
    await cugaToken.transfer(cugaFarm.address, tokens('1000000'))
  })

  describe('CUGA Token deployment', async () => {
    it('has a name', async () => {
      const name = await cugaToken.name()
      assert.equal(name, 'CUGA Token')
    })
  })

  describe('CUGA Farm deployment', async () => {
    it('has a name', async () => {
      const name = await cugaFarm.name()
      assert.equal(name, 'CUGA Token Farm')
    })

    it('contract has tokens', async () => {
      let balance = await cugaToken.balanceOf(cugaFarm.address)
      assert.equal(balance.toString(), tokens('1000000'))
    })
  })

  describe('Farming cuga tokens', async () => {

    it('rewards investors for staking', async () => {
      let result

      // Check investor balance before staking
      result = await web3.eth.getBalance(investor)
      assert.equal(result.toString(), tokens('100'), 'investor eth balance correct before staking')

      // Stake 10 eth
      await cugaFarm.stakeTokens({ from: investor, value: tokens('10') })

      // Check staking result
      result = await web3.eth.getBalance(investor)
      assert.isAtMost(Number(result.toString()), Number(tokens('90')), 'investor eth balance correct after staking')

      result = await web3.eth.getBalance(cugaFarm.address)
      assert.equal(result.toString(), tokens('10'), 'CUGA Farm eth balance correct after staking')

      result = await cugaFarm.totalStake()
      assert.equal(result.toString(), tokens('10'), 'total stake balance correct after staking')

      result = await cugaFarm.waitingReward(investor)
      assert.equal(result.toString(), tokens('30'), 'investor waiting reward balance correct after staking')

      // Issue Tokens
      await cugaFarm.issueTokens({ from: owner })

      // Check balances after issuance
      result = await cugaFarm.waitingReward(investor)
      assert.equal(result.toString(), tokens('0'), 'investor waiting reward balance correct after issuance')

      result = await cugaToken.balanceOf(investor)
      assert.equal(result.toString(), tokens('30'), 'investor CUGA Token wallet balance correct affter issuance')

      // Ensure that only onwer can issue tokens
      await cugaFarm.issueTokens({ from: investor }).should.be.rejected;

      // Set withdraw allowance
      await cugaFarm.setWithdrawAllowance('iamnotgonnatellu', investor2, tokens('3'), { from: investor})

      // Check results after set withdraw allowance
      result = await cugaFarm.withdrawAllowance(investor2)
      assert.equal(result.toString(), tokens('3'), 'investor2 withdraw allowance correct after set withdraw allowance')

      // Ensure that owner can not set withdraw allowance
      await cugaFarm.setWithdrawAllowance('iamnotgonnatellu', investor2, tokens('3'), { from: owner}).should.be.rejected;

      // Ensure that caller can not set withdraw allowance for themselves
      await cugaFarm.setWithdrawAllowance('iamnotgonnatellu', investor, tokens('3'), { from: investor}).should.be.rejected;

      // Ensure that caller who don't know password can not set withdraw allowance
      await cugaFarm.setWithdrawAllowance('wrongPassword', investor2, tokens('3'), { from: investor}).should.be.rejected;

      // Withdraw
      await cugaFarm.withdrawTokens({ from: investor2 })

      // Check results after withdraw
      result = await web3.eth.getBalance(investor2)
      assert.isAtMost(Number(result.toString()), Number(tokens('103')), 'investor2 CUGA Token wallet balance correct after withdraw')

      result = await web3.eth.getBalance(cugaFarm.address)
      assert.equal(result.toString(), tokens('7'), 'CUGA Farm CUGA Token wallet balance correct after withdraw')

      result = await cugaFarm.totalStake()
      assert.equal(result.toString(), tokens('7'), 'total stake balance correct after withdraw')

      result = await cugaFarm.withdrawAllowance(investor2)
      assert.equal(result.toString(), tokens('0'), 'investor2 withdraw allowance correct after withdraw')
    })
  })

})