import { render, screen } from '@testing-library/react';
import App from './App';

// Mock our Freighter helpers to simulate a disconnected user first.
// This prevents async state updates from triggering warnings in Jest.
jest.mock('./components/Freighter', () => ({
  isWalletInstalled: () => Promise.resolve(true),
  checkConnection: () => Promise.resolve(false),
  retrievePublicKey: () => Promise.reject(new Error('Not connected')),
  getWalletNetwork: () => Promise.resolve('TESTNET'),
  getBalance: () => Promise.resolve({ balance: '0.0000', isActivated: false }),
  fundWithFriendbot: () => Promise.resolve({}),
  checkRecipientAccount: () => Promise.resolve({ exists: false }),
  isValidAddress: () => false,
  sendPayment: () => Promise.resolve({ hash: '' }),
}));

test('renders StellarFlow heading or brand name', () => {
  render(<App />);
  const brandElements = screen.getAllByText(/StellarFlow/i);
  expect(brandElements.length).toBeGreaterThan(0);
});
