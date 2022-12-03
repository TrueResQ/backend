[![Build Status](https://drone.dev.tor.us/api/badges/torusresearch/torus-backend/status.svg?ref=/refs/heads/master)](https://drone.dev.tor.us/torusresearch/torus-backend)

For initial setup of database,

To migrate to latest,

```sh
cd database
knex migrate:latest
```

Requires a .env file with the following config

```env
#development
RDS_PORT=* mysql db port *
RDS_HOSTNAME=* mysql db url *
RDS_DB_NAME=* mysql db *
RDS_USERNAME=* mysql db username *
RDS_PASSWORD= * mysql db password *
PORT=2020
API_KEYS= * keys used for etherscan *
KEYS_AIRTABLE= * key used for airtable *
NODE_ENV=
JWT_PRIVATE_KEY=
```

Once all are present,

```sh
npm install
npm start
```
