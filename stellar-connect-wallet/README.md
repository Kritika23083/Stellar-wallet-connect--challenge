# StellarFlow — Stellar Testnet Payment dApp

StellarFlow is a sleek, non-custodial Web3 payment portal built on the Stellar network. It provides a premium, responsive user experience allowing users to connect their Freighter browser extension wallet, check balances, request testnet faucet tokens via Friendbot, validate recipient accounts, and perform fast XLM transfers on the Stellar Testnet.

---

## Features

- **Freighter Wallet Integration**: Connect and disconnect securely. The application is completely non-custodial and never touches private keys.
- **On-chain Network Verification**: Automatically detects the Freighter extension network configuration. Prompts warnings if the user is connected to a network other than **Stellar Testnet**.
- **Interactive Balance Monitor**: Loads live XLM balance from Horizon. Auto-polls for wallet-level changes (account switching, locking, or network swapping) every 3 seconds.
- **Integrated Faucet Support**: Detects inactive/empty wallets and offers an on-screen "Fund Account" trigger to call the Stellar Friendbot directly, activating the account on-chain instantly.
- **Validation Engine**:
  - Validates recipient addresses to ensure correct Stellar Ed25519 public key formatting.
  - Monitors destination account activity on-chain to choose between a standard **Payment** operation or a **Create Account** activation operation (with a 1 XLM threshold warning).
  - Validates send amounts against active balances (including network fees).
- **Payment Lifecycle Feedback**: Interactive modal flow representing signing states, Horizon submission, transfer success details (with transaction hash copies and explorer redirects), and transaction rejection or failure reasons.
- **Rich Dark Aesthetics**: Responsive glassmorphism cards, glowing status badges, stellar orbit animation, and custom visual micro-interactions.

---

## Technologies Used

- **React.js**: Front-end framework.
- **@stellar/stellar-sdk**: Horizon server querying, network passphrase mapping, and transaction builder.
- **@stellar/freighter-api**: Non-custodial signature requests, active account retrieval, and network configuration queries.
- **Vanilla CSS**: Custom styling variables, glassmorphic blurs, star pulse animations, and interactive CSS layout systems.

---

## Prerequisites

- **Node.js** (v16 or higher)
- **NPM** (v8 or higher)
- **Freighter Extension**: Download and install from [freighter.app](https://www.freighter.app/).

---

## Freighter Setup & Testnet Instructions

To test transfers using this application, configure Freighter to point to the Stellar Test Network:

1. Open the **Freighter** extension in your browser.
2. Enter your password to unlock the wallet.
3. Click the network selector in the top navbar (it defaults to `Public`).
4. Select **Testnet** from the dropdown options.
5. Generate or import a testnet account.
6. Connect to this application and click the **Fund via Friendbot** button to receive `10,000` testnet XLM.

---

## Local Installation

1. Clone this repository and navigate to the project directory:
   ```bash
   cd stellar-connect-wallet
   ```
2. Install the necessary dependencies:
   ```bash
   npm install
   ```
3. Run the development server locally:
   ```bash
   npm start
   ```
4. Open [https://localhost:3000](https://localhost:3000) (using HTTPS as required for secure Web3 extensions) or click the address shown in your terminal.

---

## How to Test an XLM Transaction

1. Open the application and click **Connect Wallet**.
2. Approve the connection request in the Freighter wallet popup.
3. Ensure your balance is funded. If the account is new, click **Fund 10,000 XLM via Friendbot** to activate it on-chain.
4. Input a destination address (you can create a second account in Freighter to copy-paste the public key).
   - *Note*: If the destination is inactive, you must send at least `1.0` XLM to cover the account reserve.
5. Enter the amount to transfer.
6. Review details in the **Transaction Preview** panel.
7. Click **Send XLM** and click **Approve** in the Freighter extension to sign the transaction.
8. Wait for the success screen. Copy the hash or click **View Explorer** to view the live confirmed transaction on Stellar.Expert.

---

## Screenshot Placeholders

For your final submission, capture and insert screenshots representing each state:

1. **Disconnected State**: `[Insert screenshot of the homepage showing the 'Connect Freighter Wallet' screen]`
2. **Wallet Connected State**: `[Insert screenshot displaying the connected wallet address and a wrong network alert if applicable]`
3. **Balance Displayed**: `[Insert screenshot showing the active XLM balance and the refresh button]`
4. **Payment Form**: `[Insert screenshot of the form filled with valid values, displaying the Transaction Preview panel]`
5. **Successful Transaction**: `[Insert screenshot of the success modal with the transaction hash and explorer links]`

---

## Testnet Disclaimer

> [!WARNING]
> This application interacts strictly with the Stellar Testnet network. All assets (XLM) and transactions depicted are for evaluation purposes. Testnet XLM has **no real-world monetary value**. Do not send real/mainnet XLM to these addresses.
