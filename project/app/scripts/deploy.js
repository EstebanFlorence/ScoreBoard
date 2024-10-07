async function main ()
{
    const ScoreBoard = await ethers.getContractFactory('ScoreBoard');
    console.log('Deploying ScoreBoard...');
    const scoreboard = await ScoreBoard.deploy();
    await scoreboard.waitForDeployment();
    console.log('ScoreBoard deployed to:', await scoreboard.getAddress());
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
