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

        it('Should add a player', async function ()
        {
            await scoreboard.addPlayer(addr1.address, "Adamo");

            const player = await scoreboard.players(addr1.address);

            expect(player.name).to.equal("Adamo");

        });

        it('Should remove a player', async function ()
        {
            await scoreboard.addPlayer(addr1.address, "Remo");
            await scoreboard.removePlayer(addr1.address);

            const player = await scoreboard.players(addr1.address);

            expect(player.exists).to.be.false;
        });

        it('Should revert', async function ()
        {
            await expect(scoreboard.connect(addr1).addPlayer(addr2.address, "Pinco"))
            .to.be.reverted; //.revertedWithCustomError(scoreboard, 'OwnableUnauthorizedAccount').withArgs(addr1.address);

            // await scoreboard.addPlayer(addr1.address, "Lucifero");
            await expect(scoreboard.connect(addr2).removePlayer(addr1.address))
            .to.be.reverted; //.revertedWithCustomError(scoreboard, 'OwnableUnauthorizedAccount').withArgs(addr2.address);

        });

        it('Should not revert', async function ()
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
            // await scoreboard.removePlayer(addr1.address);

            await expect(scoreboard.removePlayer(addr1.address))
            .to.be.revertedWith("Player does not exist");
        });

	});
