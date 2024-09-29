// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// Import Auth from the access-control subdirectory
import "../Auth.sol";

contract MySimpleStorage
{
    uint256 favoriteNumber;
    Auth private _auth;

    struct  Wassie
    {
        string  name;
        uint256 favoriteNumber;
    }

    mapping(string => uint256) public  nameToFavoriteNumber;

    // Wassie public wassie = Wassie({name : "smol", favoriteNumber : 7});
    Wassie[] public wassies;

    event ValueChanged(uint256 value);

    constructor()
    {
        _auth = new Auth(msg.sender);
    }

    function    store(uint256 _favoriteNumber) public virtual
    {
        require(_auth.isAdministrator(msg.sender));

        favoriteNumber = _favoriteNumber;
        emit ValueChanged(favoriteNumber);
    }

    // view, pure
    function    retrieve() public view returns (uint256)
    {
        return favoriteNumber;
    }

    /*
    - calldata = tmp var that can't be modified
    - memory = tmp var that can be modified
    - storage =  permanent var that can be modified (not for func params)
    */
    function    addWassie(string memory _name, uint256 _favoriteNumber) public
    {
        wassies.push(Wassie(_name, _favoriteNumber));
        nameToFavoriteNumber[_name] = _favoriteNumber;
    }
}
