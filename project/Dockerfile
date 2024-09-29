FROM node:20.16

EXPOSE 8545

# WORKDIR /app

COPY app/package*.json ./
COPY app/hardhat.config.js ./
COPY app/contracts/ ./
COPY app/scripts/ ./
COPY app/test/ ./

COPY tools/entrypoint.sh ./entrypoint.sh

RUN chmod +x /entrypoint.sh

# RUN ./entrypoint.sh


# RUN npm install
# RUN npx hardhat node
# RUN npx hardhat compile
# RUN npx hardhat run --network localhost scripts/deploy.js
# RUN npx hardhat test test/ScoreBoard.test.js

# ENTRYPOINT ["npx", "hardhat", "node"]

# CMD [ "npx", "hardhat", "console", "--network", "localhost" ]

CMD [ "/entrypoint.sh" ]
