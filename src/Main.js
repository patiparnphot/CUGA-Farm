import React, { Component } from 'react'
import kub from './bitkub.svg'

class Main extends Component {

    render() {
        return (
        <div id="content" className="mt-3">

            <table className="table table-borderless text-muted text-center">
                <thead>
                    <tr>
                        <th scope="col">Total Stake</th>
                        <td>{window.web3.utils.fromWei(this.props.totalStake, 'Ether')} KUB</td>
                    </tr>
                </thead>
                <thead>
                    <tr>
                        <th scope="col">Waiting Reward</th>
                        <th scope="col">Reward Balance</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>{window.web3.utils.fromWei(this.props.waitingReward, 'Ether')} CUGA</td>
                        <td>{window.web3.utils.fromWei(this.props.cugaTokenBalance, 'Ether')} CUGA</td>
                    </tr>
                </tbody>
            </table>

            <div className="card mb-4" >

                <div className="card-body">

                    <form
                        className="mb-3"
                        onSubmit={(event) => {
                            event.preventDefault()
                            let amount
                            amount = this.input.value.toString()
                            amount = window.web3.utils.toWei(amount, 'Ether')
                            this.props.stakeTokens(amount)
                        }}
                    >
                        <div>
                            <label className="float-start"><b>Stake Tokens</b></label>
                            <span className="float-end text-muted">
                                Balance: {window.web3.utils.fromWei(this.props.ethBalance, 'Ether')}
                            </span>
                        </div>
                        <div className="input-group mb-4">
                            <input
                                type="text"
                                ref={(input) => { this.input = input }}
                                className="form-control form-control-lg"
                                placeholder="0"
                                required
                            />
                            <div className="input-group-append">
                                <div className="input-group-text">
                                    <img src={kub} height='32' alt=""/>
                                    &nbsp;&nbsp;&nbsp; KUB
                                </div>
                            </div>
                        </div>
                        <button type="submit" className="btn btn-primary btn-block btn-lg">STAKE!</button>
                    </form>
                    
                    <button
                        type="submit"
                        className="btn btn-link btn-block btn-sm"
                        onClick={(event) => {
                            event.preventDefault()
                            this.props.unstakeTokens()
                        }}
                    >
                        WITHDRAW...
                    </button>

                </div>
            
            </div>
            <div className="card mb-4" >

                <div className="card-body">

                    <form
                        className="mb-3"
                        onSubmit={(event) => {
                            event.preventDefault()
                            let key = this.withdrawKey.value.toString();
                            let amount = this.withdrawAmt.value.toString();
                            let account = this.withdrawAcc.value.toString();
                            amount = window.web3.utils.toWei(amount, 'Ether');
                            this.props.setWithdrawAllowance(key, amount, account);
                        }}
                    >
                        <div>
                            <label><b>Withdraw Allowance</b></label>
                        </div>
                        <div className="input-group mb-4">
                            <input
                                type="text"
                                ref={(withdrawKey) => { this.withdrawKey = withdrawKey }}
                                className="form-control form-control-lg"
                                placeholder="Password of withdraw allowance"
                                required
                            />
                        </div>
                        <div className="input-group mb-4">
                            <input
                                type="text"
                                ref={(withdrawAmt) => { this.withdrawAmt = withdrawAmt }}
                                className="form-control form-control-lg"
                                placeholder="0"
                                required
                            />
                            <div className="input-group-append">
                                <div className="input-group-text">
                                    <img src={kub} height='32' alt=""/>
                                    &nbsp;&nbsp;&nbsp; KUB
                                </div>
                            </div>
                        </div>
                        <div className="input-group mb-4">
                            <input
                                type="text"
                                ref={(withdrawAcc) => { this.withdrawAcc = withdrawAcc }}
                                className="form-control form-control-lg"
                                placeholder="Public key of withdraw account"
                                required
                            />
                        </div>
                        <button type="submit" className="btn btn-primary btn-block btn-lg">SET WITHDRAW ALLOWANCE</button>
                    </form>

                </div>

            </div>

        </div>
        );
    }
}

export default Main;