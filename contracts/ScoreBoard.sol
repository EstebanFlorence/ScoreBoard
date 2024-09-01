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
	mapping (address => Player) public	players;
	address[] public			rankings;
	uint256						numPlayers;

	constructor() Ownable(msg.sender) {}

	event PlayerAdded(address player);
	event PlayerRemoved(address player);


	function addPlayer(address _player, string memory _name) public onlyOwner
	{
		require(!players[_player].exists, "Player already exists");

		players[_player] = Player(_name, 0, 0, true);
		rankings.push(_player);
		++numPlayers;
		// _updateRankings();

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

		_updateRankings();
	}

	function _updateRankings() internal
	{
		// Sort.quickSort(players, rankings, 0, rankings.length - 1);

		// Sort.insertionSort(players, rankings);

		for (uint256 i = 0; i < rankings.length; ++i)
		{
			address	key = rankings[i];
			uint256	keyScore = players[key].score;
			int j = int(i) - 1;

			while(j >= 0 && players[rankings[uint256(j)]].score < keyScore)
			{
				rankings[uint256(j + 1)] = rankings[uint256(j)];
				--j;
			}
			rankings[uint256(j + 1)] = key;
		}

		for (uint256 i = 0; i < rankings.length; ++i)
		{
			players[rankings[i]].ranking = i + 1;
		}

	}

}
