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

        beforeEach(async function ()
        {
            ScoreBoard = await ethers.getContractFactory('ScoreBoard');
            [owner, addr1, addr2, ...addr] = await ethers.getSigners();

            scoreboard = await ScoreBoard.deploy();
            // await scoreboard.deployed();
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
            await scoreboard.addPlayer(addr1.address, "Adamo");

            const player = await scoreboard.getPlayer(addr1.address);

            expect(player.name).to.equal("Adamo");

        });

        it('Should remove a player', async function ()
        {
            // await expect(scoreboard.removePlayer(addr1.address)).to.be.revertedWith("Player does not exist");

            await scoreboard.addPlayer(addr1.address, "Remo");
            await scoreboard.removePlayer(addr1.address);

            await expect(scoreboard.getPlayer(addr1.address)).to.be.revertedWith("Player does not exist");

            // const player = await scoreboard.players(addr1.address);
            // expect(player.exists).to.be.false;
        });

        it('Should revert when non-owner tries to add or remove a player', async function ()
        {
            await expect(scoreboard.connect(addr1).addPlayer(addr2.address, "Pinco"))
            .to.be.reverted; //.revertedWithCustomError(scoreboard, 'OwnableUnauthorizedAccount').withArgs(addr1.address);

            // await scoreboard.addPlayer(addr1.address, "Lucifero");
            await expect(scoreboard.connect(addr2).removePlayer(addr1.address))
            .to.be.reverted; //.revertedWithCustomError(scoreboard, 'OwnableUnauthorizedAccount').withArgs(addr2.address);

        });

        it('Should not revert when owner adds or removes a player', async function ()
        {
            await expect(scoreboard.addPlayer(addr2.address, "Pinco"))
            .to.not.be.revertedWith("Not the owner");

            // await scoreboard.addPlayer(addr1.address, "Lucifero");
            await expect(scoreboard.removePlayer(addr1.address))
            .to.not.be.revertedWith("Not the owner");

        });

        it('Should fail to add an existing player', async function ()
        {
            await scoreboard.addPlayer(addr1.address, "Elisa");

            await expect(scoreboard.addPlayer(addr1.address, "Elisa"))
            .to.be.revertedWith("Player already exists");
        });

        it('Should fail to remove a non-existing player', async function ()
        {
            // await scoreboard.addPlayer(addr1.address, "Elisa");

            await expect(scoreboard.removePlayer(addr1.address))
            .to.be.revertedWith("Player does not exist");
        });

        it('Should update player score', async function ()
        {
            await scoreboard.addPlayer(addr1.address, "Ubaldo");
            await scoreboard.updateScore(addr1.address, 42);

            const player = await scoreboard.getPlayer(addr1.address);
            expect(player.score).to.equal(42);
        });

        it('Should fail to update score for non-existent player', async function ()
        {
            // await scoreboard.addPlayer(addr1.address, "Ubaldo");

            await expect(scoreboard.updateScore(addr1.address, 23))
                .to.be.rejectedWith("Player does not exist");
        });

        it('Should get player details', async function ()
        {
            await scoreboard.addPlayer(addr1.address, "Dionisio");
            // await scoreboard.updateScore(addr1.address, 777);

            const player = await scoreboard.getPlayer(addr1.address);
            expect(player.name).to.equal("Dionisio");
            expect(player.score).to.equal(0);
            expect(player.ranking).to.equal(0);
        });

        it('Should randomly create 100 players and check if the rankings are ordered', async function ()
        {
            const players = [];
            for (let i = 0; i < 100; ++i)
            {
                const randomName = getRandomName();
                const randomAddress = ethers.Wallet.createRandom().address;
                players.push({ address: randomAddress, randomName });
                await scoreboard.addPlayer(randomAddress, randomName);
            }

            for (const player of players)
            {
                const randomScore = getRandomScore();
                await scoreboard.updateScore(player.address, randomScore);
            }

            const rankings = await scoreboard.getRankings();
            let previousScore = Number.MAX_SAFE_INTEGER;

            for (const playerAddress of rankings)
            {
                const player = await scoreboard.getPlayer(playerAddress);
                expect(player.score).to.be.at.most(previousScore);
                previousScore = player.score;
            }
        });

	});
