# ScoreBoard
[ ] Give players an address?
- [ ] Generate a real address for each player (if not present)
    ex.
	const { ethers } = require('ethers');
    async function generateAddress() {
        const wallet = ethers.Wallet.createRandom();
        console.log('Address:', wallet.address);
        console.log('Private Key:', wallet.privateKey);
        // Save the private key securely
        fs.writeFileSync('privateKey.txt', wallet.privateKey, { flag: 'wx' });
    }
    generateAddress();
- [ ] Assign an address only to the winner

[ ] Retrieve tournament data:
- [ ] Tournament:
- [ ] Rounds = Game array:
- [ ] Game = 2 Player + scores:
- [ ] Player = name + scores
- Implement set/create functions?
- Get data after each Game?

# NodeJS
[ ] is @openzeppelin/test-helpers being used? If not uninstall

[ ]
