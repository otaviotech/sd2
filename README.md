# sd2

[![Coverage Status](https://coveralls.io/repos/github/otaviotech/sd2/badge.svg?branch=master)](https://coveralls.io/github/otaviotech/sd2?branch=master)

## Documentação das rotas
[Insomnia](https://insomnia.rest/) collection. `insomnia_api_docs.json`

## Desenvolvimento

1 - Clone o projeto e instale as dependencias.

```console
$ git clone git@github.com:otaviotech/sd2.git
$ cd sd2
$ yarn # install

```

2 - Crie o arquivo de configuração local.

```console
$ cp .env.example.env .env
```

3 - Crie o banco de dados e execute as migrations.

```console
$ yarn run db:create # Somente na primeira vez.
$ yarn run db:migrate
```

4 - Execute!

```console
$ yarn run dev
```

## Testes

1 - Crie o banco de dados de teste.

```console
$ yarn run test:db:create # Somente na primeira vez.
```

2 - Execute os testes!

```console
$ yarn test 
```
