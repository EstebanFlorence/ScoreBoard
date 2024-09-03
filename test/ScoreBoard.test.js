const { expect } = require('chai');
const { ethers } = require('hardhat');

describe( 'ScoreBoard', function ()
	{
        let ScoreBoard;
        let scoreboard;
        let owner;
        let addr1;
        let addr2;
        let addr;

        // before(async function ()
        // {
        //     // Connect to local Hardhat node
        //     const provider = new ethers.JsonRpcProvider('http://127.0.0.1:8545');
    
        //     // Retrieve accounts from the local node
        //     // const accounts = await provider.listAccounts();
        //     // [owner, addr1, addr2, ...addr] = accounts;
        //     [owner, addr1, addr2, ...addr] = await ethers.getSigners();

        //     // Set up ethers contract, representing our deployed ScoreBoard instance
        //     const ScoreBoard = await ethers.getContractFactory('ScoreBoard');
        //     scoreboard = await ScoreBoard.deploy();

        //     // Attach to an already deployed instance
        //     // const address = '0x5FbDB2315678afecb367f032d93F642f64180aa3'; // Replace with your deployed contract address
        //     // scoreboard = ScoreBoard.attach(address).connect(owner);
        // });

        beforeEach(async function ()
        {
            ScoreBoard = await ethers.getContractFactory('ScoreBoard');
            [owner, addr1, addr2, ...addr] = await ethers.getSigners();

            scoreboard = await ScoreBoard.deploy();
        });

        function getRandomName()
        {
            const names = ["Aldo", "Giovanni", "Giacomo"];
            return names[Math.floor(Math.random() * names.length)] + Math.floor(Math.random() * 1000);
        }

        function getRandomScore()
        {
            return Math.floor(Math.random() * 1000);
        }

        it('Should add a player', async function ()
        {
            await scoreboard.addPlayer(addr1.address, "Adamo", 0);

            const player = await scoreboard.getPlayer(addr1.address);

            expect(player.name).to.equal("Adamo");

        });

        it('Should remove a player', async function ()
        {
            await expect(scoreboard.removePlayer(addr1.address)).to.be.revertedWith("Player does not exist");

            await scoreboard.addPlayer(addr1.address, "Remo", 0);
            await scoreboard.removePlayer(addr1.address);

            await expect(scoreboard.getPlayer(addr1.address)).to.be.revertedWith("Player does not exist");

            // const player = await scoreboard.players(addr1.address);
            // expect(player.exists).to.be.false;
        });

        it('Should revert when non-owner tries to add or remove a player', async function ()
        {
            await expect(scoreboard.connect(addr1).addPlayer(addr2.address, "Pinco", 0))
            .to.be.reverted; //.revertedWithCustomError(scoreboard, 'OwnableUnauthorizedAccount').withArgs(addr1.address);

            // await scoreboard.addPlayer(addr1.address, "Lucifero", 0);
            await expect(scoreboard.connect(addr2).removePlayer(addr1.address))
            .to.be.reverted; //.revertedWithCustomError(scoreboard, 'OwnableUnauthorizedAccount').withArgs(addr2.address);

        });

        it('Should not revert when owner adds or removes a player', async function ()
        {
            await expect(scoreboard.addPlayer(addr2.address, "Pinco", 0))
            .to.not.be.revertedWith("Not the owner");

            // await scoreboard.addPlayer(addr1.address, "Lucifero", 0);
            await expect(scoreboard.removePlayer(addr1.address))
            .to.not.be.revertedWith("Not the owner");

        });

        it('Should fail to add an existing player', async function ()
        {
            await scoreboard.addPlayer(addr1.address, "Elisa", 0);

            await expect(scoreboard.addPlayer(addr1.address, "Elisa", 0))
            .to.be.revertedWith("Player already exists");
        });

        it('Should fail to remove a non-existing player', async function ()
        {
            // await scoreboard.addPlayer(addr1.address, "Elisa", 0);

            await expect(scoreboard.removePlayer(addr1.address))
            .to.be.revertedWith("Player does not exist");
        });

        it('Should update player score', async function ()
        {
            await scoreboard.addPlayer(addr1.address, "Ubaldo", 0);
            await scoreboard.updateScore(addr1.address, 42);

            const player = await scoreboard.getPlayer(addr1.address);
            expect(player.score).to.equal(42);
        });

        it('Should fail to update score for non-existent player', async function ()
        {
            // await scoreboard.addPlayer(addr1.address, "Ubaldo", 0);

            await expect(scoreboard.updateScore(addr1.address, 23))
                .to.be.rejectedWith("Player does not exist");
        });

        it('Should get player details', async function ()
        {
            await scoreboard.addPlayer(addr1.address, "Dionisio", 777);

            const player = await scoreboard.getPlayer(addr1.address);
            expect(player.name).to.equal("Dionisio");
            expect(player.score).to.equal(777);
            // expect(player.ranking).to.equal(0);  // ranking removed from Player
            // expect(player.ranking).to.equal(1);  // If updateRanking() in addPlayer()
        });

        it('Should get the rankings ordered', async function ()
        {
            const players = [];
            for (let i = 0; i < 100; ++i)
            {
                const randomName = getRandomName();
                const randomAddress = ethers.Wallet.createRandom().address;
                const randomScore = getRandomScore();

                players.push({ address: randomAddress, randomName, randomScore });
                // await scoreboard.addPlayer(randomAddress, randomName, 0);
                await scoreboard.addPlayer(randomAddress, randomName, randomScore);  // could revert if score is higher that the updated one
            }

            console.log("Rankings before updating scores:");
            let rankings = await scoreboard.getRankings();
            for (const playerAddress of rankings)
            {
                const player = await scoreboard.getPlayer(playerAddress);
                console.log(`Address: ${playerAddress}, Name: ${player.name}, Score: ${player.score}`);
            }

            // for (const player of players)
            // {
            //     const randomScore = getRandomScore();
            //     await scoreboard.updateScore(player.address, randomScore);   // could revert
            // }

            await scoreboard.updateRankings();

            console.log("Rankings after updating scores:");
            rankings = await scoreboard.getRankings();
            for (const playerAddress of rankings)
            {
                const player = await scoreboard.getPlayer(playerAddress);
                console.log(`Address: ${playerAddress}, Name: ${player.name}, Score: ${player.score}`);
            }

            // const rankings = await scoreboard.getRankings();

            let previousScore = Number.MAX_SAFE_INTEGER;
            for (const playerAddress of rankings)
            {
                const player = await scoreboard.getPlayer(playerAddress);
                expect(player.score).to.be.at.most(previousScore);
                previousScore = player.score;
            }
        });

	});
