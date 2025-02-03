# Nutrisite WWW

Nutrisite WWW is a React application that provides a user interface for uploading food images and viewing nutritional information. It integrates with the Nutrisite Engine API to analyze food images and return nutritional data. The application uses Amplify for AWS cognito authentication.

## Prerequisites

Use node 22 or use nvm to switch to the node version used in this project.

## Installation

To install the dependencies, use npm:

```sh
npm i
```

## Setup

*You will need to at least deploy the cognito resources in the infra folder to get these:*

Create a .env file with the following environment variables.

```sh
VITE_USER_POOL_ID
VITE_CLIENT_ID
VITE_API_URL
VITE_COGNITO_DOMAIN
VITE_AWS_REGION
```

## Running the Application

To run the application in development mode:

```sh
npm run dev
```

## Running tests

To run the application tests:

```sh
npm test
```

## Building the Application

To build the application:

```sh
npm run build
```
