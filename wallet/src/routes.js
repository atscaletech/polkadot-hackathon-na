import CreateAccount from './components/accounts/CreateAccount';
import SetupAccount from './components/accounts/SetupAccount';
import AccountInfo from './components/accounts/AccountInfo'

export default [
  {
    path: '/',
    name: 'AccountInfo',
    element: AccountInfo,
    exact: true,
  },
  {
    path: '/setup-account',
    name: 'SetupAccount',
    element: SetupAccount,
    exact: true,
  },
  {
    path: '/create-account',
    name: 'CreateAccount',
    element: CreateAccount,
    exact: true,
  },
]