// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./sort/Sort.sol";

import "@openzeppelin/contracts/access/Ownable.sol";

// import "./access-control/Auth.sol";

contract ScoreBoard is Ownable
{
	struct Player
	{
		uint256	id;
		string	name;
		uint256	score;
		bool	exists;
		bool	isWinner;
	}

	struct Game
	{
		Player	player1;
		Player	player2;
	}

	struct Tournament
	{
		uint256		date;
		uint256		id;
		string		name;
		uint256		numPlayers;
		Player[]	players;
		Game[][]	rounds;
	}

	uint256 public		_numTournaments;
	Tournament[] public	_tournaments;
	Player[] public		_rankings;
	uint256 private		_addressCounter;

	constructor() Ownable(msg.sender) {}

	event	TournamentAdded(string name);
	event	RankingsUpdated(string name);

	function addTournament(string calldata name, string[] calldata participants, string[] calldata allPlayers, uint256[] calldata allScores) public onlyOwner
	{
		require(allPlayers.length == allScores.length, "Players and Scores length mismatch");

		// Tournament
		Tournament storage	newTournament = _tournaments.push();
		newTournament.id = _numTournaments++;
		newTournament.name = name;
		newTournament.date = block.timestamp;
		newTournament.numPlayers = participants.length;

		// Players
		for (uint i = 0; i < participants.length; ++i)
		{
			Player memory	newPlayer = Player
			({
				id: i + 1,
				name: participants[i],
				score: 0,
				exists: true,
				isWinner: false
			});
			newTournament.players.push(newPlayer);
		}

		// Rounds and Games
		uint256	numRounds = getNumRounds(participants.length);
		for (uint256 r = 0; r < numRounds; ++r)
		{
			uint256	numGames = getNumGames(r, participants.length);
			// Game[] memory	round = new Game[](numGames);
			// newTournament.rounds.push(round);
			newTournament.rounds.push();
			for (uint256 g = 0; g < numGames; ++g)
			{
				newTournament.rounds[r].push();
			}
		}
		addGames(newTournament, allPlayers, allScores);
		setWinner(newTournament.id);
	}

	function setWinner(uint256 tournamentId) internal
	{
		Tournament storage	tournament = _tournaments[tournamentId];
		uint256	lastRound = tournament.rounds.length - 1;
		uint256	g = tournament.rounds[lastRound].length - 1;	// Or 0?
		Game storage	finalGame = tournament.rounds[lastRound][g];
		Player storage		winner = finalGame.player1.score > finalGame.player2.score ?
									finalGame.player1 : finalGame.player2;

		_rankings.push(winner);
		// updateRankings();
		emit RankingsUpdated(winner.name);
	}

	function addGames(Tournament storage newTournament, string[] calldata allPlayers, uint256[] calldata allScores) internal //pure
	{
		uint256	playerIndex = 0;
		// Rounds
		for (uint256 r = 0; r < newTournament.rounds.length; ++r)
		{
			Game[] storage	round = newTournament.rounds[r];
			// Games
			for (uint256 g = 0; g < round.length; ++g)
			{
				Game storage	game = round[g];

				// game.player1 = getPlayer(newTournament.players, allPlayers[playerIndex]);
				// game.player2 = getPlayer(newTournament.players, allPlayers[playerIndex + 1]);

				// game.player1.score = allScores[playerIndex];
				// game.player2.score = allScores[playerIndex + 1];

				game.player1 = Player
				({
					id: playerIndex + 1,
					name: allPlayers[playerIndex],
					score: allScores[playerIndex],
					exists: true,
					isWinner: false
				});

				game.player2 = Player
				({
					id: playerIndex + 2,
					name: allPlayers[playerIndex + 1],
					score: allScores[playerIndex + 1],
					exists: true,
					isWinner: false
				});

				Player storage	winner = game.player1.score > game.player2.score ? game.player1 : game.player2;
				winner.isWinner = true;

				playerIndex += 2;
			}
		}
		emit TournamentAdded(newTournament.name);
	}

	function getPlayer(Player[] storage players, string calldata name) internal view returns (Player storage)
	{
		for (uint256 i = 0; i < players.length; i++)
		{
			if (keccak256(abi.encodePacked(players[i].name)) == keccak256(abi.encodePacked(name)))
				return players[i];
		}
		revert("Player not found");
	}

	function getNumRounds(uint256 numPlayers) internal pure returns (uint256)
	{
		uint256	rounds = 0;
		while (numPlayers > 1)
		{
			numPlayers /= 2;
			rounds++;
		}
		return rounds;
	}

	function getNumGames(uint256 roundIndex, uint256 numPlayers) internal pure returns( uint256)
	{
		return numPlayers / (2 ** (roundIndex + 1));
	}

	function updateRankings() public onlyOwner
	{
		// Sort.quickSort(players, _rankings, 0, _rankings.length - 1);

		// Sort.insertionSort(players, _rankings);

		// for (uint256 i = 0; i < _rankings.length; ++i)
		// {
		// 	players[_rankings[i]].ranking = i + 1;
		// }
	}

	function getRankings() public view returns (Player[] memory)
	{
		return _rankings;
	}

	function getTournaments() public view returns (Tournament[] memory)
	{
		require(_tournaments.length > 0, "No Tournaments available");

		return _tournaments;
	}

}
