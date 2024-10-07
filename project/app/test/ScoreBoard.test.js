const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('ScoreBoard', function ()
{
    let ScoreBoard;
    let scoreboard;
    let owner;
    let addr1;
    let addr2;
    let addr;

    before(async function ()
    {
        // Connect to local Hardhat node
        // const provider = new ethers.JsonRpcProvider('http://127.0.0.1:8545');

        // Retrieve accounts from the local node
        [owner, addr1, addr2, ...addr] = await ethers.getSigners();

        // Set up ethers contract, representing our deployed ScoreBoard instance
        const ScoreBoard = await ethers.getContractFactory('ScoreBoard');

        scoreboard = await ScoreBoard.deploy();
    });

    it('should add a tournament', async function ()
    {
        const tournamentName = "Test";
        const participants = ["Aldo", "Giovanni", "Giacomo", "Davide"];
        const allPlayers = ["Aldo", "Giacomo", "Davide", "Giovanni", "Giacomo", "Giovanni"];
        const allScores = [0, 2, 0, 2, 0, 2];

        await scoreboard.addTournament(tournamentName, participants, allPlayers, allScores);

        const tournaments = await scoreboard.getTournaments();
        const tournament = tournaments[0];
        expect(tournament.name).to.equal(tournamentName);
        expect(tournament.numPlayers).to.equal(participants.length);
    });

    it('should have correct players in the tournament', async function ()
    {
        const tournaments = await scoreboard.getTournaments();
        const tournament = tournaments[0];
        const players = tournament.players;

        expect(players.length).to.equal(4);
        expect(players[0].name).to.equal("Aldo");
        expect(players[1].name).to.equal("Giovanni");
        expect(players[2].name).to.equal("Giacomo");
        expect(players[3].name).to.equal("Davide");
    });

    it('should have correct games in the tournament', async function ()
    {
        const tournaments = await scoreboard.getTournaments();
        const tournament = tournaments[0];
        const rounds = tournament.rounds;

        expect(rounds.length).to.be.greaterThan(0);
        expect(rounds[0].length).to.equal(2); // First round should have 2 games

        const game1 = rounds[0][0];
        const game2 = rounds[0][1];

        expect(game1.player1.name).to.equal("Aldo");
        expect(game1.player2.name).to.equal("Giacomo");
        expect(game2.player1.name).to.equal("Davide");
        expect(game2.player2.name).to.equal("Giovanni");
    });

    it('should revert when adding a tournament with mismatched players and scores', async function ()
    {
        const tournamentName = "Invalid Tournament";
        const participants = ["Alice", "Bob"];
        const allPlayers = ["Alice", "Bob"];
        const allScores = [10]; // Mismatched length

        await expect
        (
            scoreboard.addTournament(tournamentName, participants, allPlayers, allScores)
        ).to.be.revertedWith("Players and Scores length mismatch");
    });

    it('check tournament data', async function ()
    {

    });

    // it('should update rankings', async function ()
    // {
    //     await scoreboard.updateRankings();
    //     const rankings = await scoreboard.getRankings();
    //     expect(rankings.length).to.equal(4); // Assuming 4 players were added
    // });

});

