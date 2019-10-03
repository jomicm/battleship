import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  let mock = Array(props.max).fill(0).map((x, ix) => ix)
  let row = Array(props.max).fill(0).map((x, ix) => props.startingPoint * props.max + ix);
  return (
    <div>
      {mock.map((y, i) => {
        return (
          <div key={'row' + y} className="board-row">
            {row.map((x, j) => {
              const btnId = props.board + '_' + (props.max * i + j);
              let tileColor = Object.keys(props.color).find(key => props.color[key] === props.value[props.max * i + j]);
              //console.log('props.value', props.value);
              //console.log('tileColor', tileColor);
              //let tileColor = props.value[props.max * i + j] === 0 ? 'yellow' : 'blue';
              //tileColor = props.value[props.max * i + j] === -1 ? 'red' : tileColor;
              //const toggleColor = props.value[props.max * i + j] === 2;
              return (
                <button id={'button_' + btnId} key={'button_' + btnId} className="square"
                  onClick={() => props.onClick(btnId)}
                  //style={{'background': !toggleColor ? tileColor : 'violet'}}
                  style={{ 'background': tileColor }}
                  selected={tileColor === 'red' ? true : false}
                  onMouseEnter={() => props.onMouseEnter(btnId, true)}
                  //onMouseEnter={setTimeout(props.onMouseHover(btnId, true), 1000)}
                  onMouseLeave={() => props.onMouseLeave(btnId, false)}
                >
                  {btnId}
                </button>)
            })}
          </div>
        );
      })
      }
    </div>
  )
}

class MyShips extends Component {
  state = {

  }

  render() {
    //console.log('Rendering my ships', this.props.ships);
    const myShips = !this.props.ships ? {} : this.props.ships;
    return <div>
      <span>Your ships player {this.props.player + 1}:</span>
      {Object.keys(myShips).map((key, ix) => <div key={'shipInfo' + ix}><span role="img" aria-label="ship">🚢</span> Ship: {key.toUpperCase()} ({myShips[key].length}) Sunk({myShips[key].filter(x => x.killed).length}) {myShips[key].filter(x => x.killed).length === myShips[key].length ? ' All ' + key.toUpperCase() + ' are sunk ❌'  : ''}</div>)}
    </div>
  }
}

class ShipInput extends Component {
  state = {
    ships: ['carrier', 'cruiser', 'battleship', 'submarine', 'destroyer'],
    pos: 'H',
    name: 'carrier'
  }
  handleShipChange(e) {
    console.log('e>>, ', e.target.value);
    this.setState({name: e.target.value})
  }
  render() {
    return <div key={'shipInput'}>
      {/* <select value={this.state.name} onChange={e => this.setState({name: e.target.value})}> */}
      <select value={this.state.name} onChange={e => this.handleShipChange(e)}>
        {this.state.ships.map((s, index) => <option key={'shipOpt' + index}>{s}</option>)}
      </select>
      <form>
        <div className="radio">
          <label>
            <input type="radio" value="option1" checked={this.state.pos === 'H'} onChange={() => this.setState({ pos: 'H' })} />
            Horizontal
        </label>
        </div>
        <div className="radio">
          <label>
            <input type="radio" value="option2" checked={this.state.pos === 'V'} onChange={() => this.setState({ pos: 'V' })} />
            Vertical
        </label>
        </div>
      </form>
      <button onClick={() => this.props.onAdd(this.state.name, this.state.pos)}>Add selected ship!</button>
      <br/>
      <button onClick={() => this.props.onFinish(this.props.tab)}>I'm Ready!</button>
    </div>
  }
}

class Board extends React.Component {
  state = {
    //maxRow: 10,
    //boards: [Array(this.props.max * this.props.max).fill(0), Array(this.props.max * this.props.max).fill(0)],
    //boards: [Array(100).fill(0), Array(100).fill(0)],
    boards: Array(this.props.boards).fill(0).map(x => Array(this.props.max * this.props.max).fill(0)),
    //boards: [],
    //squaresFirstBoard: Array(100).fill(0),
    ships: [{
      'carrier': [23, 24, 25, 26, 27],
      'battleship': [39, 49, 59, 69],
      'cruiser': [62, 72, 82],
      'submarine': [97, 98, 99],
      'destroyer': [0, 10]
    },
    {
      'carrier': [23, 24, 25, 26, 27],
      'battleship': [39, 49, 59, 69],
      'cruiser': [62, 72, 82],
      'submarine': [97, 98, 99],
      'destroyer': [0, 10]
    },
    ],
    ships2: {},
    shipDefinition: {
      'carrier': { size: 5},
      'battleship': { size: 4},
      'cruiser': { size: 3},
      'submarine': { size: 3},
      'destroyer': { size: 2}
    },
    shipDef2: [{
      'carrier': { size: 5, quantity: 2 },
      'battleship': { size: 4, quantity: 1 },
      'cruiser': { size: 3, quantity: 1 },
      'submarine': { size: 3, quantity: 1 },
      'destroyer': { size: 2, quantity: 1 }
    },
    {
      'carrier': { size: 5, quantity: 1 },
      'battleship': { size: 4, quantity: 1 },
      'cruiser': { size: 3, quantity: 1 },
      'submarine': { size: 3, quantity: 1 },
      'destroyer': { size: 2, quantity: 3 }
    }],
    score: {},
    gameInfo: {},
    history: {},
    //hovered: [],
    //selected: [],
    //xIsNext: true,
    //prevNumber: -1,
    used: {},
    placing: null,
    color: {
      yellow: 0,
      red: 1,
      cyan: 2,
      blue: 3,
      magenta: 4,
    },
    ready: {},
    letsplay: false,
  }

  componentDidMount() {
    Array(this.props.boards).fill(0).map((x, ix) => {
      const ready = this.state.ready;
      ready['player' + ix] = false;
      this.setState({ready});
    });
  }

  handleStartAuto() {
    this.placeAllShips();
    console.log('Start');
  }

  handleStartManual() {
    // const letsplay = this.state.letsplay;
    // if (!letsplay) {
    //   alert('Both players must be ready');
    //   return;
    // }
    const whostarts = this.getRandomTo(this.props.boards - 1);
    console.log("Soooo, let's play!!!!. First turn for player: ", whostarts + 1);
  }

  async handleClick(i) {
    const placing =  await this.state.placing;
    console.log('i', i);
    const [tab, index] = i.split('_');
    if (placing) {
      console.log('About to place!', placing);
      const [x, y] = this.convertFromNumberToXY(Number(index) + 1);
      let startingPoint = placing.pos === 'H' ? x - 1 : y - 1;
      let rowCol = placing.pos === 'H' ? y - 1 : x - 1;
      let points = this.placeShip(placing.name, placing.pos, startingPoint, rowCol);
      const resTryPlace = await this.tryPlaceShip(points, tab, placing.name);
      this.setState({placing: null});
      if (!resTryPlace) {
        alert('Space already used!');
        return;
      }
      this.colorPoints(tab, points, 'magenta');
      return;
    }
    // Color the clicked square either hit or miss
    let color = this.handleHit(tab, index);
    this.colorPoints(tab, index, color);
  }

  colorPoints(tab, points, color) {
    let validColor = this.state.color[color];
    if (validColor === undefined)  return null;
    let localPoints = points;
    const boards = this.state.boards.slice();
    if (!Array.isArray(points)) localPoints = [points];
    for (const point of localPoints) { 
      boards[tab][point] = validColor;
    }
    this.setState({ boards })
  }

  convertFromNumberToXY(n) {
    let squareSize = this.props.max;
    let x = 0, y = 0;
    let aux = 0;
    while (aux < n) {
      y++;
      aux += squareSize;
    }
    x = n - (y - 1) * squareSize
    return [x, y];
  }

  handlePutSingleShip(name, pos) {
    console.log('Name: ' + name + ' Pos: ' + pos);
    //this.setState({ boards: sqtmp })
    this.setState({placing: { name, pos }});
  }

  async handleHistory(tab, index) {
    const history = this.state.history;
    index = Number(index);
    history['player' + tab] = !history['player' + tab] ? [index] : [...history['player' + tab], index];
    await this.setState({ history });
    console.log('this.state.history', this.state.history);
  }

  handleHit(tab, index) {
    console.log('hit3');
    let boardShips = this.state.ships2['player' + tab];
    console.log('boardShips', boardShips);
    for (let key in boardShips) {
      console.log('key', key);
      for (let element of boardShips[key]) {
        console.log('element', element);
        if (element.points.includes(Number(index))) {
          this.handleUpdateScore(tab, element, index);
          return 'red';
        }
      }
    }
    return 'blue';
  }

  async handleUpdateScore(tab, ship, hit) {
    //tab = 1;
    hit = Number(hit);
    let localScore = await this.state.score;
    if (!localScore['player' + tab]) localScore['player' + tab] = {};
    if (!localScore['player' + tab][ship.name]) localScore['player' + tab][ship.name] = [];
    const localShip = localScore['player' + tab][ship.name].filter(x => x.id === ship.id)
    const { id, total, pos, points, name } = ship;
    const hitInfo = { id, total, pos, points, name, hits: hit > -1 ? [hit] : [], killed: false };
    if (!localShip.length) localScore['player' + tab][ship.name].push(hitInfo);
    else if (!localShip[0].hits.includes(hit)) {
      localShip[0].hits.push(hit);
      if (localShip[0].hits.length === localShip[0].total) {
        localShip[0].killed = true;
        this.handleKill(tab, localShip[0]);
      }
    }
    console.log('localScore', localScore);
    await this.setState({ score: localScore });
  }

  async handleKill(tab, ship) {
    console.log('ship', ship);
    alert('You killed a ' + ship.name);
    let gameInfo = this.state.gameInfo;
    let playerInfo = gameInfo['player' + tab];
    playerInfo.shipsKilled++;
    if (playerInfo.shipsPlaced === playerInfo.shipsKilled) this.handleLose(tab);
    await this.setState({ gameInfo });
    console.log('gameinfokilled', this.state.gameInfo);
  }

  handleLose(tab) {
    console.log('Player ' + tab + ' You lost!')
  }

  //let used = [];

  tryPlaceShip = async (res, tab, ship) => {
    let used = this.state.used;
    if (!used['player' + tab]) used['player' + tab] = [];
    console.log('used["player" + tab]', used['player' + tab]);
    if (used['player' + tab].some(r => res.includes(r))) return null;
    used['player' + tab] = [...used['player' + tab], ...res];
    await this.setState({ used });
    
    let ships2 = this.state.ships2;
    if (!ships2['player' + tab]) ships2['player' +  tab] = {};
    let places = ships2['player' + tab];
    
    let id = !places[ship] ? 0 : places[ship].length;
    let newShip = { id, name: ship, pos: (res[1] - res[0]) === 1 ? 'H' : 'V', points: res, total: res.length };
    places[ship] = !places[ship] ? [newShip] : [...places[ship], newShip];
    // Create/update GameInfo to control who wins
    let gameInfo = this.state.gameInfo;
    if (!gameInfo['player' + tab]) gameInfo['player' +  tab] = { shipsPlaced: 0, shipsKilled:0 };
    gameInfo['player' + tab].shipsPlaced += 1;
    // Create a new score for ship
    this.handleUpdateScore(tab, newShip, -1);
    await this.setState({ ships2, gameInfo });
    return true;
  }
  placeShip(name, align, startingPoint, rowColumn) {
    let rowSize = this.props.max;
    let size = this.state.shipDefinition[name].size;
    align = align === undefined ? this.getRandomTo(1) : align === 'H' ? 0 : 1; // 0 H ; 1 V
    let maxPos = rowSize - size;
    startingPoint = startingPoint === undefined ? this.getRandomTo(maxPos) : startingPoint;
    startingPoint = startingPoint > maxPos ? maxPos : startingPoint;
    rowColumn = rowColumn === undefined ? this.getRandomTo(rowSize - 1) : rowColumn;
    let points = Array(size).fill(0).map((x, ix) => ix + startingPoint);
    if (!align) {
      points = points.map(x => x + rowSize * rowColumn)
    } else {
      points = points.map(x => x * (rowSize - 0) + rowColumn);
    }
    return points;
  };
  getRandomTo = number => Math.floor(Math.random() * (number + 1));
  placeAllShips = async () => {
    let allPlaces = [];
    let playerNo = 0;
    let used = this.state.used;
    for (const player of this.state.shipDef2) {
      let places = {};
      let shipsPlaced = 0;
      if (!used['player' + playerNo]) used['player' + playerNo] = [];
      //if (used['player' + tab].some(r => res.includes(r))) return null;
      // used['player' + tab] = [...used['player' + tab], ...res];
      // await this.setState({ used });

      for (const ship in player) {
        for (let i = 0; i < player[ship].quantity; i++) {
          let res;
          let condition;
          do {
            // res = this.placeShip(ship, this.props.max);
            res = this.placeShip(ship);
            //condition = this.state.used.some(r => res.includes(r));
            condition = used['player' + playerNo].some(r => res.includes(r));
          } while (condition);
          used['player' + playerNo] = [...used['player' + playerNo], ...res];
          await this.setState({ used });
          let id = !places[ship] ? 0 : places[ship].length;
          let newShip = { id, name: ship, pos: (res[1] - res[0]) === 1 ? 'H' : 'V', points: res, total: res.length };
          places[ship] = !places[ship] ? [newShip] : [...places[ship], newShip];
          shipsPlaced++;
          // Create a new score for ship
          this.handleUpdateScore(playerNo, newShip, -1);
        }
      }
      //allPlaces.push(places);
      allPlaces['player' + playerNo] = places;
      const playerInfo = { shipsPlaced, shipsKilled: 0 };
      const gameInfo = this.state.gameInfo;
      gameInfo['player' + playerNo] = playerInfo;
      await this.setState({ gameInfo });;
      playerNo++;
    }
    await this.setState({ ships2: allPlaces });
  }

  handlePlaceMyShips(tab, info) {
    console.log('Place My ships!')
  }

  async handleEnter(i, toggle) {
    //To do this il faut garder les previous states in memory to color back when leaving, stretch
    // console.log('i', i);
    // console.log('toggle', toggle);
    // const placing =  await this.state.placing;
    // console.log('i', i);
    // const [tab, index] = i.split('_');
    // console.log('placing', placing);
    // if (placing) {
    //   console.log('HOVER: About to place!', placing);
    //   const [x, y] = this.convertFromNumberToXY(Number(index) + 1);
    //   let startingPoint = placing.pos === 'H' ? x - 1 : y - 1;
    //   let rowCol = placing.pos === 'H' ? y - 1 : x - 1;
    //   let points = this.placeShip(placing.name, placing.pos, startingPoint, rowCol);
    //   this.colorPoints(tab, points, 'cyan');
    //   return;
    // }
  }
  
  async handleLeave(i, toggle) {
    
    // let actualValue = this.state.squaresFirstBoard[i.split('_')[1]];
    // let squaresFirstBoard = this.state.squaresFirstBoard.slice();
    // squaresFirstBoard[i.split('_')[1]] = this.state.selected.includes(i.split('_')[1]) ? 1 : 2;
    // await this.setState({squaresFirstBoard})
  }

  handleFinishPuttingShips(tab) {
    const tabBoard = this.state.boards[tab];
    this.colorPoints(tab, Object.keys(tabBoard).map(x => Number(x)), 'yellow');
    const ready = this.state.ready;
    ready['player' + tab] = true; 
    const letsplay = Object.values(ready).every(r => r);
    if (letsplay) this.handleStartManual();
    this.setState({ ready, letsplay });
  }

  renderTableau(tab, max, color) {
    console.log('Ready Status Player ', tab, this.state.ready['player' + tab]);
    const tableauValues = this.state.boards[tab];
    return (
      <div key={'bd' + tab}>
        {!this.state.ready['player' + tab] && <ShipInput tab={tab} onAdd={(name, pos) => this.handlePutSingleShip(name, pos)} onFinish={(tab) => this.handleFinishPuttingShips(tab)}/>}
        <MyShips player={tab} ships={this.state.score['player' + tab]}/>
        <Square
          key={'sq' + tab}
          board={tab}
          //startingPoint={i} 
          value={tableauValues}
          max={max}
          color={color}
          //ships={ships}
          onClick={btnId => this.handleClick(btnId)}
          onMouseEnter={(btnId, toggle) => this.handleEnter(btnId, toggle)}
          onMouseLeave={(btnId, toggle) => this.handleLeave(btnId, toggle)}
        />
        <br />
      </div>
    );
  }

  render() {
    //const winner = calculateWinner(this.state.squares);
    let status;
    if (true) {
      status = 'Winner: ' + true;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }
    const instructions = "Welcome! First every player has to place her/his ships, then the game will start automatically once every player has pressed 'I'm ready' button!";
    const playing = 'The game is on, your turn player:';
    return (
      <div>
        <h1>Battleship Game!</h1>
        {!this.state.letsplay && <h3>{instructions}</h3>}
        {this.state.letsplay && <h3>{playing}</h3>}
        <div className="status">{status}</div>
        {/* <button onClick={() => this.handleStartAuto()}>Start the Game Auto Mode!</button> */}
        {this.state.letsplay && <button onClick={() => this.handleStartAuto()}>Restart Game!</button>}
        {/* {!this.state.letsplay && <button onClick={() => this.handleStartManual()}>Start the Game!</button>} */}
        {/* <div>
          
          <button onClick={() => this.handlePlaceMyShips(0)}>Place my ships!</button>
        </div> */}
        {/* <br/> */}
        {Array(this.props.boards).fill(0).map((x, ix) => this.renderTableau(ix, this.props.max, this.state.color))}
        <div className="board-row">
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  render() {
    return (
      <div className="game">
        <div className="game-board">
          <Board boards={2} max={10} />
        </div>
        <div className="game-info">
          <div>{/* status */}</div>
          <ol>{/* TODO */}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

//const calculateWinner = squares => {
// function calculateWinner(squares) {
//   const lines = [
//     [0, 1, 2],
//     [3, 4, 5],
//     [6, 7, 8],
//     [0, 3, 6],
//     [1, 4, 7],
//     [2, 5, 8],
//     [0, 4, 8],
//     [2, 4, 6],
//   ];
//   for (let i = 0; i < lines.length; i++) {
//     const [a, b, c] = lines[i];
//     if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
//       return squares[a];
//     }
//   }
//   return null;
// }