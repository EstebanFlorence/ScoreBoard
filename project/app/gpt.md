To create this major module that stores tournament scores on the blockchain, you'll need to follow a structured approach that includes setting up the development environment, writing the smart contracts in Solidity, integrating them with your Pong website, and testing the functionality using a testing blockchain (like Ethereum's Ganache or Hardhat's local network). Here's a step-by-step guide to help you get started:

### 1. **Setup Development Environment**

First, set up your development environment with the necessary tools:

- **Node.js**: Ensure you have Node.js installed.
- **Hardhat**: A development environment to compile, deploy, test, and debug your Ethereum software.
- **Ganache**: A local blockchain for quick development and testing.
- **Metamask**: A browser extension wallet to interact with your local blockchain.

Install Hardhat:
```bash
npm install --save-dev hardhat
```

Set up a Hardhat project:
```bash
npx hardhat
```
Follow the prompts to create a basic sample project.

### 2. **Write Solidity Smart Contracts**

Now, create a Solidity smart contract that will handle the storage and retrieval of tournament scores.

Navigate to the `contracts/` directory in your Hardhat project and create a new file `TournamentScores.sol`:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract TournamentScores {
    struct Score {
        address player;
        uint256 points;
        uint256 timestamp;
    }

    mapping(uint256 => Score[]) public tournamentScores;

    event ScoreSubmitted(uint256 tournamentId, address indexed player, uint256 points, uint256 timestamp);

    function submitScore(uint256 tournamentId, uint256 points) external {
        Score memory newScore = Score({
            player: msg.sender,
            points: points,
            timestamp: block.timestamp
        });

        tournamentScores[tournamentId].push(newScore);

        emit ScoreSubmitted(tournamentId, msg.sender, points, block.timestamp);
    }

    function getScores(uint256 tournamentId) external view returns (Score[] memory) {
        return tournamentScores[tournamentId];
    }
}
```

### 3. **Compile and Test the Smart Contract**

Compile the contract to check for any errors:
```bash
npx hardhat compile
```

Next, write a test script in `test/TournamentScores.test.js` to validate your smart contract:

```javascript
const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('TournamentScores', function () {
    before(async function () {
        this.TournamentScores = await ethers.getContractFactory("TournamentScores");
    });

    beforeEach(async function () {
        this.tournamentScores = await this.TournamentScores.deploy();
        await this.tournamentScores.deployed();
    });

    it('should submit and retrieve scores', async function () {
        const [owner] = await ethers.getSigners();

        await this.tournamentScores.submitScore(1, 100);
        await this.tournamentScores.submitScore(1, 200);

        const scores = await this.tournamentScores.getScores(1);

        expect(scores.length).to.equal(2);
        expect(scores[0].player).to.equal(owner.address);
        expect(scores[0].points.toString()).to.equal('100');
        expect(scores[1].points.toString()).to.equal('200');
    });
});
```

Run the tests to make sure everything works correctly:

```bash
npx hardhat test
```

### 4. **Deploy the Smart Contract to a Local Blockchain**

You can deploy the contract on a local blockchain provided by Hardhat or Ganache for development purposes.

First, create a deploy script in `scripts/deploy.js`:

```javascript
async function main() {
    const TournamentScores = await ethers.getContractFactory("TournamentScores");
    const tournamentScores = await TournamentScores.deploy();

    await tournamentScores.deployed();

    console.log("TournamentScores deployed to:", tournamentScores.address);
}

main()
.then(() => process.exit(0))
.catch((error) => {
    console.error(error);
    process.exit(1);
});
```

Deploy the contract:

```bash
npx hardhat run scripts/deploy.js --network localhost
```

### 5. **Integrate Smart Contract with Pong Website**

To integrate the smart contract with your website:

1. **Front-end Connection**:
   - Use web3.js or ethers.js to interact with the deployed smart contract from your website.

2. **Metamask Integration**:
   - Allow users to connect their wallets using Metamask and interact with the contract.

Example integration snippet using ethers.js:

```javascript
import { ethers } from 'ethers';
import TournamentScores from './artifacts/contracts/TournamentScores.sol/TournamentScores.json';

async function submitScore(tournamentId, points) {
    if (!window.ethereum) throw new Error("No crypto wallet found");
    await window.ethereum.request({ method: "eth_requestAccounts" });

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(TournamentScoresAddress, TournamentScores.abi, signer);

    await contract.submitScore(tournamentId, points);
}

async function getScores(tournamentId) {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const contract = new ethers.Contract(TournamentScoresAddress, TournamentScores.abi, provider);

    const scores = await contract.getScores(tournamentId);
    console.log(scores);
}
```

### 6. **Testing on a Local Blockchain**

- Test interactions locally before moving to any testnet.
- Use tools like Hardhat’s console, or deploy a frontend that connects to your local blockchain.

### 7. **Deploy to a Testnet (Optional)**

Once you're satisfied with local testing, you might want to deploy your contract to a testnet like Ropsten or Goerli to simulate real-world usage.

1. **Get Testnet ETH**: Obtain some test ETH from a faucet.
2. **Update Hardhat Config**: Add the testnet configuration to your `hardhat.config.js`.
3. **Deploy**: Use the same deployment script with the testnet configuration.

```bash
npx hardhat run scripts/deploy.js --network goerli
```

### 8. **Monitoring and Debugging**

Use tools like Etherscan (for testnets) and Hardhat’s debug features to monitor and debug transactions.

### Conclusion

This module will enable your Pong website to securely store tournament scores on the Ethereum blockchain, ensuring that the records are immutable and transparent. By using a testing environment, you can safely develop and validate the functionality before considering a live deployment.