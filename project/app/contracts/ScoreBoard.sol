// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./sort/Sort.sol";

import "@openzeppelin/contracts/access/Ownable.sol";

// import "./access-control/Auth.sol";

contract ScoreBoard is Ownable
{
	struct Player
	{
		string	name;
		uint256	score;
		bool	exists;
	}

	struct Game
	{
		Player player1;
		Player player2;
	}

	struct Tournament
	{
		string	name;
		Game[]	rounds;
		uint256	numPlayers;
		mapping (address => Player) players;
	}

	mapping (address => Player) private	players;
	Tournament[]		tournaments;	// private?
	address[] public	rankings;
	uint256 public		numPlayers;
	uint256 private		addressCounter;

	constructor() Ownable(msg.sender) {}

	event PlayerAdded(address player);
	event PlayerRemoved(address player);


	function startTournament(address[] memory _addresses, string[] memory _names) public onlyOwner	// calldata?
	{
		require (_addresses.length == _names.length, "Addresses and players arrays must have the same lenght");

		for (uint256 i = 0; i < _addresses.length; ++i)
		{
			address playerAddress = _addresses[i];
			if (playerAddress == address(0))
				playerAddress = generateNewAddress();
			addPlayer(playerAddress, _names[i], 0);
		}
	}

	// pseudo-address, generate real ones outside
	function generateNewAddress() private returns (address)
	{
		addressCounter++;
		return address(uint160(addressCounter));
	}

	function getNewAddress() public returns (address)
	{
		return generateNewAddress();
	}

	function addGame(address _player1, address _player2) public onlyOwner
	{

	}

	function addPlayer(address _player, string memory _name, uint256 _score) public onlyOwner
	{
		require(!players[_player].exists, "Player already exists");

		players[_player] = Player(_name, _score, true);
		rankings.push(_player);
		++numPlayers;
		// updateRankings();

		emit PlayerAdded(_player);
	}

	function removePlayer(address _player) public onlyOwner
	{
		require(players[_player].exists, "Player does not exist");

		// rankings to contain only the tournaments' winners
		// uint index = findPlayerIndex(_player);

		// require(index < rankings.length, "Player not found in rankings");

		// for (uint i = index; i < rankings.length - 1; ++i)
		// {
		// 	rankings[i] = rankings[i + 1];
		// }

		// rankings.pop();
		delete players[_player];
		--numPlayers;
		
		emit PlayerRemoved(_player);
	}

	// function findPlayerIndex(address _player) internal view returns (uint)
	// {
	// 	for (uint i = 0; i < rankings.length; ++i)
	// 	{
	// 		if (rankings[i] == _player)
	// 			return i;
	// 	}

	// 	return rankings.length;
	// }

	function updateScore(address _player, uint256 _score) public onlyOwner
	{
		require(players[_player].exists, "Player does not exist");

		require(players[_player].score < _score, "Update only higher score");

		players[_player].score = _score;

		updateRankings();
	}

	function updateRankings() public onlyOwner
	{
		// Sort.quickSort(players, rankings, 0, rankings.length - 1);

		Sort.insertionSort(players, rankings);

		// for (uint256 i = 0; i < rankings.length; ++i)
		// {
		// 	players[rankings[i]].ranking = i + 1;
		// }
	}

	function getPlayer(address _player) public view returns (string memory name, uint256 score)
	{
		require(players[_player].exists, "Player does not exist");
		Player memory player = players[_player];
		return(player.name, player.score);
	}

	function getRankings() public view returns (address[] memory)
	{
		return rankings;
	}

	function getNumPlayers() public view returns (uint256)
	{
		return numPlayers;
	}

	function getWinner() public view returns (address winner)
	{
		// require()
	}

}
