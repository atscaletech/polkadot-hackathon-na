import { ApiPromise, WsProvider } from '@polkadot/api';
import jsonrpc from '@polkadot/types/interfaces/jsonrpc';
import { formatBalance } from '@polkadot/util';

export default class Libra {
  constructor(rpc) {
    this.provider = new WsProvider(rpc);
    this.api = new ApiPromise({ provider, rpc: jsonrpc });
  }

  async getBalances(accountId) {
    const balance = await this.api.query.system.account(accountId, balance => {
      const total = formatBalance(
        balance.data.free,
        { withSi: false, forceUnit: '-' },
        12
      );
      const locked = formatBalance(
        balance.data.miscFrozen,
        { withSi: false, forceUnit: '-' },
        12
      );
      const available = formatBalance(
        balance.data.free.sub(balance.data.miscFrozen),
        { withSi: false, forceUnit: '-' },
        12
      );
      setBalance({
        total,
        available,
        locked,
      });
    });

    console.log(balance);

    return balance;
  }

  getPayments() {

  }
}