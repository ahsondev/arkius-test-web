import React, { useEffect, useState } from 'react';
import images from './images.json';
import metadata from './metadata.json';
import Web3 from 'web3';
import Web3Modal from 'web3modal';
import WalletConnectProvider from '@walletconnect/web3-provider';
import contractConfig from './contracts/config.json';
import contractAbi from './contracts/ATNFT.json';
import Loader from './Loader';

const providerOptions = {
  walletconnect: {
    package: WalletConnectProvider,
    options: {
      infuraId: '9aa3d95b3bc440fa88ea12eaa4456161',
      bridge: "https://bridge.walletconnect.org/",
    },
  },
};

const web3Modal = new Web3Modal({
  network: 'rinkeby', // optional
  cacheProvider: false, // optional
  providerOptions, // required
  disableInjectedProvider: false,
});

interface IHome {}

const Home = (props: IHome) => {
  const [loading, setLoading] = useState(false);
  const [web3, setWeb3] = useState<Web3 | null>(null);
  const [contract, setContract] = useState<any>(null);

  useEffect(() => {
    web3Modal.clearCachedProvider();
  }, []);

  const onMint = async (img: any) => {
    setLoading(true);
    try {
      if (!web3) {
        alert('You are not connected');
        setLoading(false);
        return;
      }

      const metadata = `https://arweave.net/${img.dataTxId}`;
      console.log({metadata});
      const tx = {
        from: window.ethereum.selectedAddress,
        to: contractConfig.contractAddress,
        data: contract.methods.mint(metadata).encodeABI(),
      };

      await web3.eth.sendTransaction(tx);
      // contract.mint(metadata);
    } catch (ex) {
      console.log(ex);
    }
    setLoading(false);
  };

  const onConnect = async () => {
    setLoading(true);

    try {
      if (web3) {
        web3Modal.clearCachedProvider();
        setWeb3(null);
        setContract(null);
      } else {
        const _provider = await web3Modal.connect();
        const _web3 = new Web3(_provider);
        const _contract = new _web3.eth.Contract(
          contractAbi as any,
          contractConfig.contractAddress
        );

        setWeb3(_web3);
        setContract(_contract);
      }
    } catch (ex) {
      console.log(ex);
    }
    setLoading(false);
  };

  return (
    <div className='home-page'>
      <header className='header'>
        <div className='title'>
          Arkius Test
        </div>
        <span className='selected-address'>
          {!!web3 && (
            <>
              <b>Selected address: </b>
              {window.ethereum.selectedAddress}
            </>
          )}
        </span>
        <button type='button' className='button-connect' onClick={onConnect}>
          {!!web3 ? 'Disconnect Metamask' : 'Connect Metamask'}
        </button>
      </header>
      <div className='image-list'>
        {images.map((img, index) => (
          <div key={metadata[index].dataTxId} className='image-item'>
            <img src={`https://arweave.net/${img.dataTxId}`} alt="arkius" />
            {/* <img src={`https://app.ardrive.io/#/file/${img.fileId}/view`} alt="arkius" /> */}
            <span><b>Name: </b>{img.name}</span>
            <button type='button' onClick={() => onMint(metadata[index])}>Mint</button>
          </div>
        ))}
      </div>

      {loading && <Loader />}
    </div>
  );
};

export default Home;
