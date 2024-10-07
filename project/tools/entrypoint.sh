#!/bin/sh

npm install

# npm install -g hardhat

npm install --save-dev hardhat

# exec npx hardhat node

npx hardhat node &

sleep 5

npx hardhat compile

npx hardhat run --network localhost scripts/deploy.js

npx hardhat test test/ScoreBoard.test.js

npx hardhat console --network localhost

tail -f /dev/null