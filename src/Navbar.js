import React, { Component } from 'react';
import Identicon from 'identicon.js';
import photo from './logo.png'

class Navbar extends Component {

  render() {
    return (
      <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
        <a
          className="navbar-brand col-sm-3 col-md-2 mr-0"
          href="https://www.google.com/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src={photo} width="30" height="30" className="d-inline-block align-top" alt="" />
          CUGAFarm
        </a>
        <ul className="navbar-nav px-3">
          <li className="nav-item text-nowrap d-sm-block">
            <small className="text-secondary">
              <small id="account">{this.props.account}</small>&nbsp;
            </small>
            {
              (
                this.props.account && this.props.account !== '0x0'
              ) ? (
                <img
                  className='ml-2'
                  width='30'
                  height='30'
                  src={`data:image/png;base64,${new Identicon(this.props.account, 30).toString()}`}
                  alt="identicon of public key"
                />
              ) : (
                <span/>
              )
            }
          </li>
        </ul>
      </nav>
    );
  }
}

export default Navbar;