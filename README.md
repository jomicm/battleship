# ⛴ Battleship game using React JS

This project provides a 2 player Battleship game.

## Getting Started

You can clone, fork or download the whole project to play Battleship or take a look on the componets created and the logic implemented.

## Quick guide how to play 📹 (video)

[![Guide](https://i9.ytimg.com/vi/qeMcWWQzIos/mq3.jpg?sqp=CKC38OwF&rs=AOn4CLB5JvXqbQCVhUJMVsKiIIl7f02RlQ)](https://youtu.be/qeMcWWQzIos)

### The Game

#### Welcome to Battleship Game, pick your side!
![Game](https://raw.githubusercontent.com/jomicm/battleship/master/docs/boards.png)

#### Now place your ships manually or let the A.I. finds the best spots for you
![Place](https://raw.githubusercontent.com/jomicm/battleship/master/docs/place.png)

#### When the game is Over you will see the result in the list of ships of every player
![List](https://raw.githubusercontent.com/jomicm/battleship/master/docs/game.png)

#### At every single move you can be sure the log will show what has happend!
![Logs](https://raw.githubusercontent.com/jomicm/battleship/master/docs/logs.png)

#### If you are too good, your name surely be in this list!
![Leader](https://raw.githubusercontent.com/jomicm/battleship/master/docs/leaders.png)

#### If you hace tried it all, maybe it's time for new challenges
![Settings](https://raw.githubusercontent.com/jomicm/battleship/master/docs/settings.png)

### The logic used:
- There are always two boards. (However the number of boards could be overriden since every board, tile, and piece of render is a component).
- Each board will render a N number of tiles, the same number of rows an columns, having as variable row/col. The result board will always be a square one.
- Columns are represented with letters from A to Z and then using more letter if required lile 'AB'.
- Rows are represeted with numbers.
- There are 5 types of ships available: Carrier, Cruiser, Battleship, Destroyer and Submarine.
- Each player can put as many ships as wished of every type.
- Each player selects from a droplist the type of ship they want to place and the orientation; then clicks **Add selected ship!** buton and clicks in the initial coordinate to place the ship. If the resulting position of the ship results in tiles outside the board, it will try to correct to available coordinates when possible.
- There is also the possibility to let A.I. place our ships.
- There is also the possibility to select an A.I. as a player. (You can even select both players as AI, in that case they will start playing immediatly) 
- When you finish placing the ships you will have a list of your ships and the quantity of each one. This list will also notify when a ship is sunk.
- When a player is done placing ships, then clicks **I'm ready** button.
- When both players are ready and have pressed their respective buttons, then the game starts!
- Every Player has a turn (might be adjustable) then their boards turns into the enemy's one and they have to try to find enemy's ships.
- So they click on the tile the want to attack, a red color means HIT! and a blue color means MISS!. Once you sink a whole ship, the red attacked tiles will turn black.
- The game ends when a player has sunk all the enemy's ships.

### Prerequisites

In the project directory, you can run:

### `npm start`

Runs Battleship in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

### Features list and examples

- Game
  - This is the main tab showing two boards and info about every player.
  - There is an alert component which will keep you informed.
- Log
  - This tab will show a log of all the players movements, notifiying every attack and the result. Also notigying all the sunk ships.
- Leader Board
  - This tab will show a table with the ranking of all players who have entered a name. It will show in descending order from the top 1 player to the new ones.
- Settings
  - This tab will contain some extended functions for this project.

### Note

  - When A.I. plays against A.I. there is a blocking page while they make moves. After some seconds the result is rendered. It will be modified in next versions to see live action.

### Extended features

  - The max number of rows/columns can be modified. (Default 10)
  - The number of shots per turn can be modified.
  - The number of ships the A.I. will play can be modified. (Default 1 each)
  - If you select two A.I. they will play against each other.
  - You can select the difficult level of the A.I.

### Features to be implemented

  - Replay all game from beginning.
  - Be able to play agains other people in other computers.

### Authors

* **Miguel Cruz** - *Initial work* -
