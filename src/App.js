import React, { Component } from 'react'
import Web3 from 'web3'
import CUGAFarm from './abis/CUGAFarm.json'
import CUGAToken from './abis/CUGAToken.json'
import './App.css';
import logo from './logo.svg';

import Navbar from './Navbar';
import Main from './Main';

class App extends Component {

  constructor(props) {
    super(props)
    this.state = {
      account: '0x0',
      cugaToken: {},
      cugaFarm: {},
      ethBalance: 'N/A',
      cugaTokenBalance: '1',
      waitingReward: '2',
      totalStake: '3',
      loading: true
    }
  }

  async componentDidMount() {
    await this.loadWeb3();
    await this.loadBlockchainData();
  }

  async loadBlockchainData() {
    const web3 = window.web3

    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] })

    // const networkId = await web3.eth.net.getId()

    let ethBalance = await web3.eth.getBalance(this.state.account)
    this.setState({ ethBalance: ethBalance.toString() })

    // Load CUGAToken
    // const cugaTokenData = CUGAToken.networks[networkId]
    // if(cugaTokenData) {
      const cugaToken = new web3.eth.Contract(CUGAToken.abi, '0xC49D487F3854173357C97F29109ffa3ecbc6c995')
      this.setState({ cugaToken })
      let cugaTokenBalance = await cugaToken.methods.balanceOf(this.state.account).call()
      this.setState({ cugaTokenBalance: cugaTokenBalance.toString() })  
    // } else {
    //   window.alert('CUGAToken contract not deployed to detected network.')
    // }

    // Load CUGAFarm
    // const cugaFarmData = CUGAFarm.networks[networkId]
    // if(cugaFarmData) {
      const cugaFarm = new web3.eth.Contract(CUGAFarm.abi, '0x092CCC4986da84a23dC2df99E15B22CdF177595E')
      this.setState({ cugaFarm })
      let waitingReward = await cugaFarm.methods.waitingReward(this.state.account).call()
      this.setState({ waitingReward: waitingReward.toString() })
      let totalStake = await cugaFarm.methods.totalStake().call()
      this.setState({ totalStake: totalStake.toString() })
    // } else {
    //   window.alert('CUGAFarm contract not deployed to detected network.')
    // }

    this.setState({ loading: false })
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }

  stakeTokens = (amount) => {
    this.setState({ loading: true })
    this.state.cugaFarm.methods.stakeTokens().send({ from: this.state.account , value: amount}).on('transactionHash', async (hash) => {
      const web3 = window.web3
      const cugaToken = this.state.cugaToken
      const cugaFarm = this.state.cugaFarm

      let ethBalance = await web3.eth.getBalance(this.state.account)
      let cugaTokenBalance = await cugaToken.methods.balanceOf(this.state.account).call()
      let waitingReward = await cugaFarm.methods.waitingReward(this.state.account).call()
      let totalStake = await cugaFarm.methods.totalStake().call()

      this.setState({
        ethBalance: ethBalance.toString(),
        cugaTokenBalance: cugaTokenBalance.toString(),
        waitingReward: waitingReward.toString(),
        totalStake: totalStake.toString(),
        loading: false
      })
    })
  }

  setWithdrawAllowance = (key, amount, account) => {
    this.setState({ loading: true })
    this.state.cugaFarm.methods.setWithdrawAllowance(key, amount, account).send({ from: this.state.account}).on('transactionHash', async (hash) => {
      const web3 = window.web3
      const cugaToken = this.state.cugaToken
      const cugaFarm = this.state.cugaFarm

      let ethBalance = await web3.eth.getBalance(this.state.account)
      let cugaTokenBalance = await cugaToken.methods.balanceOf(this.state.account).call()
      let waitingReward = await cugaFarm.methods.waitingReward(this.state.account).call()
      let totalStake = await cugaFarm.methods.totalStake().call()

      this.setState({
        ethBalance: ethBalance.toString(),
        cugaTokenBalance: cugaTokenBalance.toString(),
        waitingReward: waitingReward.toString(),
        totalStake: totalStake.toString(),
        loading: false
      })
    })
  }

  unstakeTokens = () => {
    this.setState({ loading: true })
    this.state.cugaFarm.methods.withdrawTokens().send({ from: this.state.account }).on('transactionHash', async (hash) => {
      const web3 = window.web3
      const cugaToken = this.state.cugaToken
      const cugaFarm = this.state.cugaFarm
      
      let ethBalance = await web3.eth.getBalance(this.state.account)
      let cugaTokenBalance = await cugaToken.methods.balanceOf(this.state.account).call()
      let waitingReward = await cugaFarm.methods.waitingReward(this.state.account).call()
      let totalStake = await cugaFarm.methods.totalStake().call()

      this.setState({
        ethBalance: ethBalance.toString(),
        cugaTokenBalance: cugaTokenBalance.toString(),
        waitingReward: waitingReward.toString(),
        totalStake: totalStake.toString(),
        loading: false
      })
    })
  }

  issueTokens = () => {
    this.setState({ loading: true })
    this.state.cugaFarm.methods.issueTokens().send({ from: this.state.account }).on('transactionHash', async (hash) => {
      const web3 = window.web3
      const cugaToken = this.state.cugaToken
      const cugaFarm = this.state.cugaFarm
      
      let ethBalance = await web3.eth.getBalance(this.state.account)
      let cugaTokenBalance = await cugaToken.methods.balanceOf(this.state.account).call()
      let waitingReward = await cugaFarm.methods.waitingReward(this.state.account).call()
      let totalStake = await cugaFarm.methods.totalStake().call()

      this.setState({
        ethBalance: ethBalance.toString(),
        cugaTokenBalance: cugaTokenBalance.toString(),
        waitingReward: waitingReward.toString(),
        totalStake: totalStake.toString(),
        loading: false
      })
    })
  }

  render() {
    return (
      <div className="App">
        <Navbar account={this.state.account}/>
        <div className="container-fluid mt-5">
          <div className="row Main-center">
            <main role="main" className="col-lg-12 ml-auto mr-auto" style={{ maxWidth: '600px' }}>
              <div className="content mr-auto ml-auto">

                {
                  (
                    this.state.loading
                  ) ? (
                    <header className="App-header">
                      <img src={logo} className="App-logo" alt="logo" />
                    </header>
                  ) : (
                    <div>
                    <Main
                      totalStake={this.state.totalStake}
                      waitingReward={this.state.waitingReward}
                      cugaTokenBalance={this.state.cugaTokenBalance}
                      ethBalance={this.state.ethBalance}
                      stakeTokens={this.stakeTokens}
                      setWithdrawAllowance={this.setWithdrawAllowance}
                      unstakeTokens={this.unstakeTokens}
                    />
                    <button
                        type="submit"
                        className="btn btn-link btn-block btn-sm"
                        onClick={(event) => {
                          event.preventDefault()
                          this.issueTokens()
                        }}
                    >
                      ISSUETOKENS for OWNER
                    </button>
                    </div>
                  )
                }

              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
