<div align="center" id="top">
  <img src="./.github/images//screen.png" alt="Nlw 15 Api Pass In" />

  &#xa0;

</div>

<h1 align="center">Nlw 15 Api Pass In</h1>

<p align="center">
  <img alt="Github top language" src="https://img.shields.io/github/languages/top/andrelinos/nlw-15-api-pass-in?color=56BEB8">

  <img alt="Github language count" src="https://img.shields.io/github/languages/count/andrelinos/nlw-15-api-pass-in?color=56BEB8">

  <img alt="Repository size" src="https://img.shields.io/github/repo-size/andrelinos/nlw-15-api-pass-in?color=56BEB8">

  <img alt="License" src="https://img.shields.io/github/license/andrelinos/nlw-15-api-pass-in?color=56BEB8">

</p>

<!-- Status -->

<!-- <h4 align="center">
	🚧  Nlw 15 Api Pass In 🚀 Under construction...  🚧
</h4>

<hr> -->

  [About](#dart-about) &#xa0; | &#xa0;
  [Features](#sparkles-features) &#xa0; | &#xa0;
  [Technologies](#rocket-technologies) &#xa0; | &#xa0;
  [Requirements](#white_check_mark-requirements) &#xa0; | &#xa0;
  [Starting](#checkered_flag-starting) &#xa0; | &#xa0;
  [API Documentation](#api-documentation) &#xa0; | &#xa0;
  [License](#memo-license) &#xa0; | &#xa0;
  <a href="https://github.com/andrelinos" target="_blank">Author</a>

&#xa0;

## :dart: Sobre ##

Descrição do projeto

## :sparkles: Funcionalidades ##

- [x] O organizador deve poder cadastrar um novo evento;
- [x] O organizador deve poder visualizar dados de um evento;
- [x] O organizador deve poser visualizar a lista de participantes;
- [x] O participante deve poder se inscrever em um evento;
- [x] O participante deve poder visualizar seu crachá de inscrição;
- [x] O participante deve poder realizar check-in no evento;

Regras de negócio

- [x]  O participante só pode se inscrever em um evento uma única vez;
- [x] O participante só pode se inscrever em eventos com vagas disponíveis;
- [x] O participante só pode realizar check-in em um evento uma única vez;

Requisitos não-funcionais

- [x]  O check-in no evento será realizado através de um QRCode;

## :rocket: Tecnologias ##

Abaixo a lista das principais tecnologias utilizadas

- [Fastify](https://fastify.dev/)
- [Node.js](https://nodejs.org/en/)
- [Prisma](https://www.prisma.io/)
- [TypeScript](https://www.typescriptlang.org/)
- [tsup](https://github.com/egoist/tsup)
- [Zod](https://zod.dev/)
- [Fastify-type-provider-zod](https://www.npmjs.com/package/fastify-type-provider-zod)
- [Swagger](https://swagger.io/)
- [Fastify-swagger-ui](https://github.com/Weslley049/fastify-swagger-ui)
- [Fastify-Cors](https://github.com/Weslley049/fastify-cors)

## :white_check_mark: Requisitos ##

Para iniciar o projeto :checkered_flag:, você precisa ter
[Git](https://git-scm.com) e [Node](https://nodejs.org/en/)
instalados em seu sistema operacional.

## :checkered_flag: Iniciando ##

- **Clonando o projeto**

```bash
git clone https://github.com/andrelinos/nlw-15-api-pass-in
```

- **Acesse a pasta do projeto**

```bash
cd nlw-15-api-pass-in
```

- **Instale as dependências**

```bash
pnpm i
```

- **Configure um container do docker para ter o banco de dados Postgres**

```bash
docker compose up --build -d
```

- **Execute as migrations**

```bash
npm run prisma migrate dev
```

- **Adicione dados de exemplo**

```bash
npm run prisma db seed
```

- **Execute seu projeto**

```bash
npm run start

# The server will initialize in the <http://localhost:3333>

```

## API Documentation ##

Welcome to the API documentation for the pass.in application backend. This API is built during the NLW Unite event by Rocketseat.

### Base URL

```
https://api.passin.com
```

****

### Authentication

This API does not require authentication for now.

### Events

#### Create an Event

```
POST /events
```

**Summary:** Create a new event.

**Request Body:**

```json
{
  "title": "Example Event",
  "details": "This is an example event",
  "eventStart": "2024-04-07T09:00:00Z",
  "eventFinish": "2024-04-07T17:00:00Z",
  "maximumAttendees": 100
}
```

**Response:**

```json
{
  "eventId": "123e4567-e89b-12d3-a456-426614174000"
}
```

#### Get All Events

```
GET /events
```

**Summary:** Retrieve all events.

**Response:**

```json
{
  "events": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "title": "Example Event",
      "slug": "example-event",
      "details": "This is an example event",
      "eventStart": "2024-04-07T09:00:00Z",
      "eventFinish": "2024-04-07T17:00:00Z",
      "maximumAttendees": 100,
      "attendeesAmount": 10,
      "attendees": [
        {
          "id": 1,
          "name": "John Doe",
          "email": "john@example.com",
          "createdAt": "2024-04-06T12:00:00Z",
          "eventId": "123e4567-e89b-12d3-a456-426614174000"
        },
        ...
      ]
    },
    ...
  ]
}
```

#### Get Event by ID

```
GET /events/{eventId}
```

**Summary:** Retrieve an event by ID.

**Response:**

```json
{
  "event": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "title": "Example Event",
    "slug": "example-event",
    "details": "This is an example event",
    "eventStart": "2024-04-07T09:00:00Z",
    "eventFinish": "2024-04-07T17:00:00Z",
    "maximumAttendees": 100,
    "attendeesAmount": 10
  }
}
```

#### Register an Attendee

```
POST /events/{eventId}/attendees
```

**Summary:** Register an attendee for an event.

**Request Body:**

```json
{
  "name": "John Doe",
  "email": "john@example.com"
}
```

**Response:**

```json
{
  "attendeeId": 1
}
```

#### Get Event Attendees

```
GET /events/{eventId}/attendees
```

**Summary:** Retrieve attendees for a specific event.

**Response:**

```json
{
  "attendees": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "createdAt": "2024-04-06T12:00:00Z",
      "checkedInAt": "2024-04-07T09:30:00Z"
    },
    ...
  ]
}
```

### Attendees

#### Get Attendee Badge

```
GET /attendees/{attendeeId}/badge
```

**Summary:** Retrieve attendee badge.

**Response:**

```json
{
  "badge": {
    "name": "John Doe",
    "email": "john@example.com",
    "eventTitle": "Example Event",
    "eventStart": "2024-04-07T09:00:00Z",
    "eventFinish": "2024-04-07T17:00:00Z",
    "checkInURL": "https://api.passin.com/attendees/1/check-in"
  }
}
```

#### Check-in an Attendee

```
GET /attendees/{attendeeId}/check-in
```

**Summary:** Check-in an attendee.

**Response:** 201 Created (No Content)

### Additional Notes

- All requests and responses are in JSON format.
- Dates and times are represented in ISO 8601 format.
- Attendees are registered with a unique attendee ID.
- Events are identified by their unique event ID.

Feel free to reach out if you have any questions or need further assistance!

## :memo: Licença ##

“Este projeto está sob a licença do MIT. Para mais detalhes, veja o arquivo [LICENSE](LICENSE.md)”

Feito com :heart: por [Andrelino Silva](https://github.com/andrelinos)
</a>

&#xa0;

[Voltar ao topo](#top)
