const { ethers } = require("hardhat");

async function main ()
{
    // Retrieve accounts from the local node
    const provider = new ethers.JsonRpcProvider();
    const accounts = await provider.listAccounts();
    console.log(accounts);

    // Set up ethers contract, representing our deployed ScoreBoard instance
    const address = '0x5FbDB2315678afecb367f032d93F642f64180aa3';
    const ScoreBoard = await ethers.getContractFactory('ScoreBoard');
    const scoreboard = ScoreBoard.attach(address);

    // Call a function
    const score = await scoreboard.addPlayer(accounts[0], "Index", 42);
    const player = await scoreboard.getPlayer(accounts[0]);
    console.log("Player details: ", player);

    const rankings = await scoreboard.getRankings();
    console.log("Rankings :", rankings);

}

main()
    .then(() => process.exit(0))
    .catch
    (
        error => 
        {
            console.error(error);
            process.exit(1);
        }
    );
