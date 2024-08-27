async function main ()
{
    // Contract to deploy
    const MySimpleStorage = await ethers.getContractFactory('MySimpleStorage');
    console.log('Deploying MySimpleStorage...');
    const mysimplestorage = await MySimpleStorage.deploy();
    await mysimplestorage.waitForDeployment();
    console.log('MySimpleStorage deployed to:', await mysimplestorage.getAddress());
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
