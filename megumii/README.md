

## Run Locally

- Clone this repo
- move to this directory

```sh
cd snapshot-subgraph-migration/megumii
```

- install subsquid cli

```sh
npm i -g @subsquid/cli
```

- install docker & docker compose (if you don't have)

```sh
sudo apt-get update && sudo apt install apt-transport-https ca-certificates curl software-properties-common -y && curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add - && sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu focal stable" && sudo apt-get install docker-ce docker-ce-cli containerd.io docker-compose-plugin
```

- run npm ci

```sh
npm ci
```

- build

```sh
sqd build
```

- run docker
```sh
docker compose up -d
```

- migrate

```sh
sqd migration:generate
```

- start the process

```sh
sqd process
```

- test locally

```sh
sqd serve
```

then open on your browser: http://localhost:4350/graphql

Or try it: https://squid.subsquid.io/megumii/v/v1/graphql
