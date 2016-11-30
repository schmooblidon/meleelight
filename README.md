# meleelight
Melee Light Platform Fighter

![Starting Scene](https://raw.githubusercontent.com/amilajack/meleelight/master/screenshots/starting.png)
![Gameplay Scene](https://raw.githubusercontent.com/amilajack/meleelight/master/screenshots/scene.png)

Play Stable Build: http://ikneedata.com/meleelight

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

Run the compile animations command (See below) first, before trying to run it.
This only needs to happen once, or if you change the animations at all. This was
split out for performance reasons, as it's the largest part of the codebase.

Now you're all set! See the commands below for how to build the project.

### Commands

All commands are run like `npm run <name>` from the root of the project.

|Name         |Description                                                     |
|-------------|----------------------------------------------------------------|
|`dev`        |Run webpack and build the dev version, watches for changes      |
|`build`      |Run webpack once and build the optimized production version     |
|`animations` |This compiles the animations, run once before playing           |
|`serve`      |Lets you play it locally at by default localhost:3000           |

### Project Layout

```
├── bin                      # All scripts that are run offline by devs
│   └── webpack              # Webpack-specific scripts
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

### Will Online ever be available?
Most likely sometime in the future.

### How many characters will there be?
First priority right now is Top 8, excluding ICs. But there's no reason that
all of the characters can't make it in.

### How can I get my controller to work?
Ask Schmoo or WwwWario on Discord and they will try their best to help you.

### Why doesn't the official adapter work on Chrome?
Because Chrome has a bug with the vJoy drivers, it is beyond our control.

### Why does my screen get stuck on the loading screen in the downloaded game?
If you downloaded the game, you need to run index.html (meleelightdebug.html
on older downloads), if it still doesn't load, join Discord and we'll try
to help. It helps if you can post any console output.

### You can go through the walls on Target Test Stages! Do you guys know about this?
This is a known issue.

### The game doesn't load or crashes!
The game is still in active development. If you want to help, you can open a
github issue or post in Discord. Please provide console output, if there is any.

### How does Melee Light compare to Melee?
The Devs are trying their best to replicate Vanilla Melee, but some differences
may arise.

### Who made this project?
The head Developers are Schmoo, Tatatat0, and Bites.

### I found a bug, is there a way to report it?
Join the Discord and there's a text channel you can report bugs in. There's also
Custom Stage sharing, idea sharing, and much more.

### I want to help out
Join the discord and ping the team. Help is always welcome.
