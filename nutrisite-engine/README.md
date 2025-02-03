# Nutrisite Engine

Nutrisite Engine is an Express application that provides an API for nutrition data processing. It uses the [DietGram API](https://rapidapi.com/bulat.yauheni/api/dietagram) to return nutritional information. It uses AWS Lambda when deployed but and uses the express server locally.

## Prerequisites

Use node 22 or use nvm to switch to the node version used in this project.

## Installation

To install the dependencies, use npm:

```sh
npm i
```

## Setup

Create a .env file with a DIETAGRAM_API_KEY, if you dont have this yoo will get a sample response.

## Running the Application

To run the application in development mode:

```sh
npm run dev
```

## Running tests

To run the application tests

```sh
npm test
```

This will start the server with nodemon and watch for changes in the source files.

## Building the Application

To build the application:

```sh
npm run build
```

This will compile the TypeScript files into JavaScript and place them in the dist directory.

## Running the Built Code

To run the built code:

```sh
npm run serve
```

This will start the server using the compiled JavaScript files in the dist directory. 