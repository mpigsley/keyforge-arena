# Keyforge Arena

Play Keyforge online, track chain as you play with particular decks, and challenge your friends.

This is very much so a **work in progress**.

## Feature Requests & Bugs

Feel free to [open an issue](https://github.com/mpigsley/keyforge-arena/issues/new) if there is a feature you'd like to see or something is broken. Pull requests are always welcome.

## Development

This project is a front-end application written in React + Redux with a [Firebase](https://firebase.google.com/) backend. For more information see [create-react-app](https://github.com/facebook/create-react-app).

### Getting Started

1.  `npm i` and `cd functions && npm i`
2.  `cp .env.example .env.local`
3.  Create a [firebase project](https://console.firebase.google.com/) and fill out `.env`.
4.  Ensure you enable authentication and the Firestore database in the web interface.
5.  `$(npm bin)/firebase login` or use your global firebase instance if you installed it globally.
6.  `$(npm bin)/firebase use --add` and select the project you configured in the firebase console.
7.  `npm run deploy` to setup the cloud functions
8.  `npm start`

### Available Scripts

In the project directory, you can run:

#### `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

#### `npm test`

Launches the test runner in the interactive watch mode.<br>
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

#### `npm run build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

#### `npm run deploy`

Combines the build command from above and with a deploy command from the local firebase package. The build directory is uploaded to the associated firebase project.
