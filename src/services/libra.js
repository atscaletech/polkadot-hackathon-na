import { ApiPromise, WsProvider } from '@polkadot/api';
import jsonrpc from '@polkadot/types/interfaces/jsonrpc';
import { web3Accounts, web3Enable, web3FromSource } from '@polkadot/extension-dapp';
import keyring from '@polkadot/ui-keyring';
// import { formatBalance } from '@polkadot/util';

const RPC = 'wss://rpc.libra.atscale.xyz';

const getFromAcct = async accountPair => {
  const {
    address,
    meta: { source, isInjected },
  } = accountPair;

  if (isInjected) {
    const injected = await web3FromSource(source);

    return {
      fromAcct: address,
      signer: injected.signer,
    };
  }

  return {
    fromAcct: accountPair,
  };
};

let instance = null;

export class Libra {
  constructor() {
    this.provider = new WsProvider(RPC);
    this.api = new ApiPromise({
      provider: this.provider,
      rpc: jsonrpc
    });
    this.accounts = null;
  }

  static async init() {
    if (!instance) {
      instance = new Libra();
      await instance.connect();
    }
    
    return instance;
  }

  async connect() {
    return new Promise((resolve, reject) => {
      this.api.on('connected', () => {
        this.api.isReady.then();
      });

      this.api.on('ready', () => {
        resolve();
      });

      this.api.on('error', (err) => {
        resolve();
      });
    });
  }

  async createPayment(
    accountAddress,
    payee,
    amount,
    currency,
    description,
    receipt,
  ) {
    const pair = keyring.getAccount(accountAddress);
    const { fromAcct, signer } = await getFromAcct(pair);

    if (signer) {
      this.api.setSigner(signer);
    }

    return new Promise((resolve, reject) => {
      this.api.tx.lrp
        .createPayment(
          payee, 
          amount, 
          currency.id, 
          description, 
          receipt
        )
        .signAndSend(fromAcct, (status) => {
          if (status.isFinalized) {
            resolve();
          } 
        }).catch((err) => {
          reject(err);
        });
    })
  }

  async acceptPayment(
    accountAddress,
    paymentHash,
  ) {
    const pair = keyring.getAccount(accountAddress);
    const { fromAcct, signer } = await getFromAcct(pair);

    if (signer) {
      this.api.setSigner(signer);
    }

    return new Promise((resolve, reject) => {
      this.api.tx.lrp
        .acceptPayment(paymentHash)
        .signAndSend(fromAcct, (status) => {
          if (status.isFinalized) {
            resolve();
          } 
        }).catch((err) => {
          reject(err);
        });
    })
  }

  async rejectPayment(
    accountAddress,
    paymentHash,
  ) {
    const pair = keyring.getAccount(accountAddress);
    const { fromAcct, signer } = await getFromAcct(pair);

    if (signer) {
      this.api.setSigner(signer);
    }

    return new Promise((resolve, reject) => {
      this.api.tx.lrp
        .rejectPayment(paymentHash)
        .signAndSend(fromAcct, (status) => {
          if (status.isFinalized) {
            resolve();
          } 
        }).catch((err) => {
          reject(err);
        });
    })
  }

  async fulfillPayment(
    accountAddress,
    paymentHash,
  ) {
    const pair = keyring.getAccount(accountAddress);
    const { fromAcct, signer } = await getFromAcct(pair);

    if (signer) {
      this.api.setSigner(signer);
    }

    return new Promise((resolve, reject) => {
      this.api.tx.lrp
        .acceptPayment(paymentHash)
        .signAndSend(fromAcct, (status) => {
          if (status.isFinalized) {
            resolve();
          } 
        }).catch((err) => {
          reject(err);
        });
    })
  }

  async cancelPayment(
    accountAddress,
    paymentHash,
  ) {
    const pair = keyring.getAccount(accountAddress);
    const { fromAcct, signer } = await getFromAcct(pair);

    if (signer) {
      this.api.setSigner(signer);
    }

    return new Promise((resolve, reject) => {
      this.api.tx.lrp
        .cancelPayment(paymentHash)
        .signAndSend(fromAcct, (status) => {
          if (status.isFinalized) {
            resolve();
          } 
        }).catch((err) => {
          reject(err);
        });
    })
  }
}

let accounts = null;

export async function getAccounts() {
  if (!accounts) {
    try {
      await web3Enable('LibraCheckout');
      const result = await web3Accounts();
      accounts = result.map(({ address, meta }) => ({ address, meta: { ...meta, name: `${meta.name} (${meta.source})` } }));
      keyring.loadAll({ isDevelopment: false }, accounts);
    } catch (err) {
      console.log(err);
    }
  }

  return accounts;
}
