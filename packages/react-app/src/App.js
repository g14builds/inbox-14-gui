import React from "react";
import { Contract } from "@ethersproject/contracts";
import { getDefaultProvider } from "@ethersproject/providers";
import { useQuery } from "@apollo/react-hooks";
import logo from "./ethereumLogo.png";
import useWeb3Modal from "./hooks/useWeb3Modal";
import { Container, Row, Col, Card } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

// import { addresses, abis } from "@project/contracts";
import GET_TRANSFERS from "./graphql/subgraph";


var inbox14Abi = require('./inbox14.abi.json');

async function readOnChainData() {
  // Should replace with the end-user wallet, e.g. Metamask
  const defaultProvider = getDefaultProvider('ropsten');
  
  const inbox14Contract = new Contract("0x4b0b43Bc0F80034935056781D63aFD2da323Ddb9", inbox14Abi, defaultProvider);
  const message = await inbox14Contract.message();
  alert(message);
}

async function writeOnChainData() {
  // Should replace with the end-user wallet, e.g. Metamask
  const defaultProvider = getDefaultProvider('ropsten');
  const inbox14Contract = new Contract("0x4b0b43Bc0F80034935056781D63aFD2da323Ddb9", inbox14Abi, defaultProvider.signer);
  const message = await inbox14Contract.setMessage(prompt("Set Message:"));
  console.log(message);
}

function WalletButton({ provider, loadWeb3Modal, logoutOfWeb3Modal }) {
  return (
    <div className="btn btn-sm btn-outline-dark wallet-button"
      onClick={() => {
        if (!provider) {
          loadWeb3Modal();
        } else {
          logoutOfWeb3Modal();
        }
      }}
    >
      {!provider ? "Connect Wallet" : "Disconnect Wallet"}
    </div>
  );
}

function App() {
  const { loading, error, data } = useQuery(GET_TRANSFERS);
  const [provider, loadWeb3Modal, logoutOfWeb3Modal] = useWeb3Modal();

  React.useEffect(() => {
    if (!loading && !error && data && data.transfers) {
      console.log({ transfers: data.transfers });
    }
  }, [loading, error, data]);

  return (
    <div>
 
      <Container fluid>
        <Row>
          <Col md />
          <Col>
              <Card border="dark">
              
                <Card.Body>
                <img src={logo} alt="eth-logo" className="img " height="50" />
                <div className="float-right">
                  <WalletButton className="float-right"
                    provider={provider} 
                    loadWeb3Modal={loadWeb3Modal} 
                    logoutOfWeb3Modal={logoutOfWeb3Modal} />
                </div>
                <div className="btn-group btn-group-sm float-right">
                  <a href="https://faucet.ropsten.be/" title="Ropsten Network Faucet"
                    class="btn btn-small btn-outline-dark float-right" target="_blank" rel="noopener noreferrer">
                    Faucet
                  </a>
                  <a href="https://ropsten.etherscan.io/address/0x4b0b43Bc0F80034935056781D63aFD2da323Ddb9" 
                    class="btn btn-small btn-outline-dark float-right" target="_blank" rel="noopener noreferrer">
                    Contract
                  </a>
                </div>
               

                  <Card.Title>Inbox14</Card.Title>
                  <Card.Text>
                    <p>Demo of a minimum viable dApp deployed to Ropsten. Use these buttons to interact with the contract:</p>

                    <button onClick={() => readOnChainData()} className="contract-button">
                      Read On-Chain Message
                    </button>
                
                    <button onClick={() => writeOnChainData()} className="contract-button">
                      Set New On-Chain Message
                    </button>
                   
                  </Card.Text>
                </Card.Body>
              </Card>

              <p className="page-signature text-muted text-center">by <a href="https://g14.pub/">g14</a></p>

  
          </Col>
          <Col md />
        </Row>
      </Container>

    </div>
  );
}

export default App;
