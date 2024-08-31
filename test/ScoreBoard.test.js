const { expect } = require('chai');
const { ethers } = require('hardhat');

describe( 'ScoreBoard', function ()
	{
        let ScoreBoard;
        let scoreboard;
        let owner;
        let addr1;
        let addr2;

        beforeEach(async function ()
        {
            ScoreBoard = await ethers.getContractFactory('ScoreBoard');
            [owner, addr1, addr2, ...addr] = await ethers.getSigners();

            scoreboard = await ScoreBoard.deploy();
            // await scoreboard.deployed();
        });

        it('Should add a player', async function ()
        {
            await scoreboard.addPlayer(addr1.address, "Test1");

            const player = await scoreboard.players(addr1.address);

            expect(player.name).to.equal("Test1");

        });

	});
