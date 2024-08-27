const { expect } = require('chai');
const { ethers } = require('hardhat');

describe( 'MySimpleStorage', () =>
	{
		before(async function() 
			{
				this.MySimpleStorage = await ethers.getContractFactory("MySimpleStorage");
			})

		beforeEach(async function()
			{
				this.mysimplestorage = await this.MySimpleStorage.deploy();

				// to connect to the deployed instance of the Box contract
				// await this.mysimplestorage.deployed();
				console.log(this.mysimplestorage.target);
			})

		it('retrieve returns a value previously stored', async function() 
			{
				await this.mysimplestorage.store(23);
				const value = await this.mysimplestorage.retrieve();
				expect(value.toString()).to.equal('23');
			});

		it('retrieve returns a value previously stored', async function() 
			{
				await this.mysimplestorage.store(23);

				// Test if the returned value is the same one
				// Note that we need to use strings to compare the 256 bit integers
				expect((await this.mysimplestorage.retrieve()).toString()).to.equal('23');
			});
		
		it('store emits an event', async function()
			{
				const receipt = await this.mysimplestorage.store(23);

				// Test that a ValueChanged event was emitted with the new value
				await expect(receipt).to.emit(this.mysimplestorage, 'ValueChanged').withArgs(23);
			});
	});
