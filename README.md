# meleelight
Melee Light Platform Fighter

Play Stable Build: http://ikneedata.com/meleelitebeta
Join the discussion on Discord: https://discord.gg/qagFayt
Smashboards Thread: https://smashboards.com/threads/melee-light-browser-based-melee-clone-play-the-beta.439646/



## Table of Contents
1. [Getting Started](#getting-started)
2. [Development](#development)
  1. [Setup](#setup)
  2. [Commands](#commands)
  3. [Project layout](#project-layout)
3. [FAQ](#faq)



## Development

Melee Light is a javascript based project, that renders the game to canvas.
There's no Flash, Unity, or some other game engine here, just web technologies.
The project is assembled using Webpack, run through Babel for ES6 features, and
linted by ESLint.

### Setup

First make sure you have node and npm installed. You should have at least node
6.X.X. Run `node -v` to check this.

Then install the modules by running `npm install`, or alternatively using
`yarn init`. This project was built with [yarn](https://yarnpkg.com/), so that's
recommended, but either works.

You're all set! See the commands below for how to build the project.

### Commands

|`npm run <script>`|Description                                                |
|------------------|-----------------------------------------------------------|
|`dev`             |Run webpack and build the dev version, watches for changes |
|`build`           |Run webpack once and build the optimized production version|

### Project Layout

```
├── webpack                  # All scripts related to the Webpack build process
├── dist                     # Where the compiled code goes to be played
└── src                      # Application source code
    ├── index.js             # The entry point for the application. A lean file that loads additional code
    ├── main.js              # The main entry point for the application. Contains most everything else
    ├── main                 # Files core to the project
    ├── characters           # Character code, including attributes and moves
    │   └── shared           # Shared code between characters
    ├── menus                # Main menu, settings, character select, stage select etc
    ├── physics              # Utilities that relate to the in-game physics
    ├── stages               # Code to draw the stages that ship with the project
    └── target               # Things related to building and playing the break the targets game mode
```



## FAQ

Before checking any of the below, make sure you're running Melee Light in either
Chrome or Firefox, these are the only browsers 100% supported.

### It won't recognize my controller

Not sure.

### The game is running slow

You can disable effects and non-essential layers (BG1 & BG2) to try and help.
If that doesn't make it run stable, your computer may not be good enough. Keep
an eye out for performance improvements as the project continues to develop.

### Something not listed above is busted

Make sure you're running the latest version of Firefox or Chrome. These are the
only browsers 100% supported.

### I want to contribute to the project

Awesome! Hop in the discord channel and hit up @schmoo.
