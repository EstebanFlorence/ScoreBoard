[ ] Generate a real addresses for each player (if not present)
    ex. const { ethers } = require('ethers');

    async function generateAddress() {
        const wallet = ethers.Wallet.createRandom();
        console.log('Address:', wallet.address);
        console.log('Private Key:', wallet.privateKey);
        // Save the private key securely
        fs.writeFileSync('privateKey.txt', wallet.privateKey, { flag: 'wx' });
    }

    generateAddress();

[ ]

[ ]
