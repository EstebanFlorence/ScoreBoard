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
		uint256	ranking;
		bool	exists;
	}

	// struct Game
	// {
	// 	string gameName;
	// 	mapping (address => Player) players;
	// }

	// mapping (string => Game) games;
	mapping (address => Player) private	players;
	address[] public			rankings;
	uint256						numPlayers;

	constructor() Ownable(msg.sender) {}

	event PlayerAdded(address player);
	event PlayerRemoved(address player);


	function addPlayer(address _player, string memory _name, uint256 _score) public onlyOwner
	{
		require(!players[_player].exists, "Player already exists");

		players[_player] = Player(_name, _score, 0, true);
		rankings.push(_player);
		++numPlayers;
		// updateRankings();

		emit PlayerAdded(_player);
	}

	function removePlayer(address _player) public onlyOwner
	{
		require(players[_player].exists, "Player does not exist");

		uint index = findPlayerIndex(_player);

		require(index < rankings.length, "Player not found in rankings");

		for (uint i = index; i < rankings.length - 1; ++i)
		{
			rankings[i] = rankings[i + 1];
		}

		rankings.pop();
		delete players[_player];
		--numPlayers;
		
		emit PlayerRemoved(_player);
	}

	function findPlayerIndex(address _player) internal view returns (uint)
	{
		for (uint i = 0; i < rankings.length; ++i)
		{
			if (rankings[i] == _player)
				return i;
		}

		return rankings.length;
	}

	function updateScore(address _player, uint256 _score) public onlyOwner
	{
		require(players[_player].exists, "Player does not exist");

		require(players[_player].score < _score);

		players[_player].score = _score;

		updateRankings();
	}

	function updateRankings() public onlyOwner
	{
		// Sort.quickSort(players, rankings, 0, rankings.length - 1);

		Sort.insertionSort(players, rankings);

		for (uint256 i = 0; i < rankings.length; ++i)
		{
			players[rankings[i]].ranking = i + 1;
		}
	}

	function getPlayer(address _player) public view returns (string memory name, uint256 score, uint256 ranking)
	{
		require(players[_player].exists, "Player does not exist");
		Player memory player = players[_player];
		return(player.name, player.score, player.ranking);
	}

	function getRankings() public view returns (address[] memory)
	{
		return rankings;
	}

	function getNumPlayers() public view returns (uint256)
	{
		return numPlayers;
	}



}
