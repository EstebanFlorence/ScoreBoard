// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../ScoreBoard.sol";

library Sort
{
	function quickSort
	(
		mapping (address => ScoreBoard.Player) storage _users, 
		address[] storage _array, 
		uint256 left, uint256 right
	) 
		internal
	{
		if (left >= right)
			return;

		uint256 pivotIndex = left + (right - left) / 2;
		uint256 pivotValue = _users[_array[pivotIndex]].score;

		uint256 i = left;
		uint256 j = right;

		while ( i <= j)
		{
			while (_users[_array[i]].score > pivotValue)
				++i;

			while (_users[_array[j]].score < pivotValue)
				--j;

			if (i <= j)
			{
				(_array[i], _array[j]) = (_array[j], _array[i]);
				++i;
				if (j == 0)
					break;
				--j;
			}
		}

		if (left < j)
			quickSort(_users, _array, left, j);
		if (i < right)
			quickSort(_users, _array, i, right);
	}

	function insertionSort
	(
		mapping (address => ScoreBoard.Player) storage _users, 
		address[] storage _array
	)
	internal
	{
		for (uint256 i = 0; i < _array.length; ++i)
		{
			address	key = _array[i];
			uint256	keyValue = _users[key].score;
			int j = int(i) - 1;

			while(j >= 0 && _users[_array[uint256(j)]].score < keyValue)
			{
				_array[uint256(j + 1)] = _array[uint256(j)];
				--j;
			}
			_array[uint256(j + 1)] = key;
		}
	}

}
