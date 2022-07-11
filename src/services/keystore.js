const PREFIX = 'libra:keystore';
const ACCOUNTS = 'libra:accounts';

export const addAccount = (accountId, keyPair) => {
  const accounts = getAccounts();

  const isExisted = !!accounts.find(id => id === accountId);

  if (isExisted) {
    throw new Error(`Account id: ${accountId} is already existed!`);
  }

  window.localStorage.setItem(ACCOUNTS, JSON.stringify([...accounts, accountId]));
  window.localStorage.setItem(`${PREFIX}:${accountId}`, keyPair);
};

export const removeAccount = (accountId) => {
  const accounts = getAccounts();

  window.localStorage.setItem(ACCOUNTS, JSON.stringify(accounts.filter(id => id === accountId)));
  window.localStorage.removeItem(`${PREFIX}:${accountId}`);
};

export const getAccounts = () => {
  const accounts = window.localStorage.getItem(ACCOUNTS);

  return accounts ? JSON.parse(accounts) : [];
};

export const getKey = (accountId) => {
  return window.localStorage.getItem(`${PREFIX}:${accountId}`);
};

