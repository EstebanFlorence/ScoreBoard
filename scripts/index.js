const { ethers } = require("hardhat");

async function main ()
{
    // Retrieve accounts from the local node
    // const provider = new ethers.JsonRpcProvider();
    // const accounts = await provider.listAccounts();
    // console.log(accounts);

    // Set up ethers contract, representing our deployed MySimpleStorage instance
    const address = '0x5FbDB2315678afecb367f032d93F642f64180aa3';
    const MySimpleStorage = await ethers.getContractFactory('MySimpleStorage');
    const mysimplestorage = MySimpleStorage.attach(address);

    // Send a transaction to store() a new value in the MySimpleStorage
    await mysimplestorage.store(42);

    // Call the retrieve() function of the MySimpleStorage contract
    const value = await mysimplestorage.retrieve();
    console.log('MySimpleStorage value is', value.toString());
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
