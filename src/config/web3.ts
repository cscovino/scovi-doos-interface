import Web3 from 'web3/dist/web3.min';
import { provider } from 'web3-core';
import { InjectedConnector } from '@web3-react/injected-connector';

export const getLibrary = (provider: provider) => {
  return new Web3(provider);
};

export const connector = new InjectedConnector({
  supportedChainIds: [
    4, // Rinkeby
  ],
});
