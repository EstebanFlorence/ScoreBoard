const { expect } = require('chai');
const { ethers } = require('hardhat');

describe( 'Box', () =>
	{
		before(async function() 
			{
				this.Box = await ethers.getContractFactory("Box");
				[this.owner, this.other] = await ethers.getSigners();
			})

		beforeEach(async function()
			{
				this.box = await this.Box.deploy();

				// to connect to the deployed instance of the Box contract
				// await this.box.deployed();
				console.log(this.box.target);
			})

		it('retrieve returns a value previously stored', async function() 
			{
				await this.box.store(23);
				const value = await this.box.retrieve();
				expect(value.toString()).to.equal('23');
			});

		it('retrieve returns a value previously stored', async function() 
			{
				await this.box.store(23);

				// Test if the returned value is the same one
				// Note that we need to use strings to compare the 256 bit integers
				expect((await this.box.retrieve()).toString()).to.equal('23');
			});
		
		it('store emits an event', async function()
			{
				const receipt = await this.box.store(23);

				// Test that a ValueChanged event was emitted with the new value
				await expect(receipt).to.emit(this.box, 'ValueChanged').withArgs(23);
			});

		it('non owner cannot store a value', async function()
			{
				await expect(this.box.connect(this.other).store(23)).to.be.reverted;
			});
		
	});
