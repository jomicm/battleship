import 'bootstrap/dist/css/bootstrap.min.css';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
// Bootstrap
import Button from 'react-bootstrap/Button';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Tabs from 'react-bootstrap/Tabs'
import Tab from 'react-bootstrap/Tab';
import Table from 'react-bootstrap/Table';
import Alert from 'react-bootstrap/Alert';

function Square(props) {
  let mock = Array(props.max).fill(0).map((x, ix) => ix)
  let row = Array(props.max).fill(0).map((x, ix) => props.startingPoint * props.max + ix);
  const convertFromNumberToXY = (n) => {
    let squareSize = props.max;
    let x = 0, y = 0;
    let aux = 0;
    while (aux < n) {
      y++;
      aux += squareSize;
    }
    x = n - (y - 1) * squareSize
    return [x, y];
  }
  const coordTranslator = (x, y) => {
    x -= 1;
    const letters = [65, 90];
    let nX = x > 25 ? Math.floor(x / 26) : 0;
    let fX = x > 25 ? x - (26 * nX) : x;
    x = x > 25 ? x - 26 : x;
    let res = (nX > 0 ? String.fromCharCode(letters[0] + nX - 1) : '') + String.fromCharCode(letters[0] + fX) + y;
    return res;
  }
  const getRowColCoord = index => {
    index = Number(index);
    const xy = convertFromNumberToXY(index + 1);
    return coordTranslator(xy[0], xy[1]);
  }
  return (
    <div>
      {mock.map((y, i) => {
        return (
          <div key={'row' + y} className="board-row">
            {row.map((x, j) => {
              const btnId = props.board + '_' + (props.max * i + j);
              const coord = getRowColCoord(props.max * i + j);
              let tileColor = Object.keys(props.color).find(key => props.color[key] === props.value[props.max * i + j]);
              return (
                <Button id={'button_' + btnId}
                  key={'button_' + btnId}
                  className="square"
                  coord={coord}
                  onClick={() => props.onClick(btnId, coord)}
                  style={{ 'background': tileColor }}
                  selected={tileColor === 'red' ? true : false}
                  onMouseEnter={() => props.onMouseEnter(btnId, true)}
                  onMouseLeave={() => props.onMouseLeave(btnId, false)}
                >
                  {coord}
                </Button>)
            })}
          </div>
        );
      })
      }
    </div>
  )
}

class MyAlert extends Component {
  state = {
    show: true,
  }
  componentDidMount(){
    setTimeout(() => this.setState({show: false}), 2000);
  }
  render() {
    return <Alert variant={this.props.variant}><h4>{this.props.message}</h4></Alert>
  }
}

class LeaderTable extends Component {
  render() {
    return <div>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Leader Name</th>
          </tr>
        </thead>
        <tbody>
            {this.props.leaders.map((l, index) => <tr key={index}>
                <td>{l.pos}</td>
                <td>{l.leader}</td>
              </tr>
            )}
        </tbody>
      </Table>
    </div>
  }
}


class Settings extends Component {
  state = {
    shipNames: ['Carrier', 'Cruiser', 'Battleship', 'Submarine', 'Destroyer'],
    boardSize: 10,
    shotsPerTurn: 1,
    noCarrier: 1,
    noCruiser: 1,
    noBattleship: 1,
    noSubmarine: 1,
    noDestroyer: 1,
    levels: ['Easy', 'Medium', 'Hard'],
    lvlSelected: 'Easy',
  }
  handleOnSaveRestart() {
    const obj = {
      boardSize: this.state.boardSize,
      shotsPerTurn: this.state.shotsPerTurn,
      shipSizes: {
        carrier: this.state.noCarrier,
        cruiser: this.state.noCruiser,
        battleship: this.state.noBattleship,
        submarine: this.state.noSubmarine,
        destroyer: this.state.noDestroyer
      },
      level: this.state.lvlSelected,
    }
    this.props.onUpdate(obj);
  }
  render() {
    return <div style={{ paddingLeft: '10px' }}>
      <label><span role="img" aria-label="ship"> ♟ </span> Board Size:<br />
        <input type="number" min={1} value={this.state.boardSize} onChange={(e) => this.setState({ boardSize: Number(e.target.value) })} style={{ 'textAlign': 'center', 'borderRadius': '5px', border: '0' }}></input>
      </label>
      <br /><br />
      <label><span role="img" aria-label="ship"> 🎯 </span>Shots Per Turn:<br />
        <input type="number" min={1} value={this.state.shotsPerTurn} onChange={(e) => this.setState({ shotsPerTurn: Number(e.target.value) })} style={{ 'textAlign': 'center', 'borderRadius': '5px', border: '0' }}></input>
      </label>
      <br /><br />
      <label><span role="img" aria-label="ship"> 🔢 </span>Default Number of Ships for A.I.:
      <br />
        <small>(Human players can always set as many ships as wished)</small>
        <br />
        {this.state.shipNames.map((s, i) => {
          return <div key={'shipNumber' + i} style={{ padding: '5px' }}>
            <span role="img" aria-label="ship"> 🛳 </span>
            <input type="number" min={0} value={this.state['no' + s]} onChange={(e) => this.setState({ ['no' + s]: Number(e.target.value) })} style={{ 'textAlign': 'center', 'borderRadius': '5px', border: '0', width: '50px' }}></input>
            <span> {s}</span>
          </div>
        })}
      </label>
      <br /><br />
      <label><span role="img" aria-label="ship"> 👾 </span>Select A.I. difficult level:<br />
        <select className="radio" value={this.state.lvlSelected} onChange={e => this.setState({ lvlSelected: e.target.value })}>
          {this.state.levels.map((s, index) => <option key={'lvl' + index}>{s}</option>)}
        </select>
      </label>
      <br /><br />
      <Button variant='success' onClick={() => this.handleOnSaveRestart()}>Save and Restart!</Button>
    </div>
  }
}

class NavBar extends Component {
  render() {
    return (
      <Navbar sticky="top" bg="light" expand="lg">
        <Navbar.Brand href="#home"><h3 style={{fontFamily:'Bungee Inline'}}><span role="img" aria-label="ship">⛴</span>         Battleship Game!</h3></Navbar.Brand>
      </Navbar>
    )
  }
}

class MyShips extends Component {
  state = {

  }

  render() {
    const myShips = !this.props.ships ? {} : this.props.ships;
    return <div>
      <h4>Your ships player {this.props.player + 1}:</h4>
      {Object.keys(myShips).map((key, ix) => <div key={'shipInfo' + ix}><span role="img" aria-label="ship">🚢</span> Ship: {key.toUpperCase()} ({myShips[key].length}) Sunk({myShips[key].filter(x => x.killed).length}) {myShips[key].filter(x => x.killed).length === myShips[key].length ? ' All ' + key.toUpperCase() + ' are sunk ❌' : ''}</div>)}
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
    this.setState({ name: e.target.value })
  }
  render() {
    return <div key={'shipInput'}>
      <span>Shortcut: Press orange button and then green one!</span>
      <br />
      <Button style={{ margin: '3px' }} onClick={() => this.props.onAIPlayer(this.props.tab)}><span role="img" aria-label="AI">🤖 </span>AI Player!</Button>
      <Button style={{ margin: '3px' }} variant="warning" onClick={() => this.props.onAI(this.props.tab)}>Let <span role="img" aria-label="AI">👾</span> AI put my ships!</Button>
      <Button style={{ margin: '3px' }} variant="success" onClick={() => this.props.onFinish(this.props.tab)}>I'm Ready!</Button>
      <br />
      <br />
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        <label>Select a ship to place:
        <select className="radio" value={this.state.name} onChange={e => this.handleShipChange(e)}>
            {this.state.ships.map((s, index) => <option key={'shipOpt' + index}>{s}</option>)}
          </select>
        </label>
        <form className="inline" style={{ display: 'flex', flexDirection: 'row' }}>
          <div className="radio">
            <label>
              <input type="radio" value="option1" checked={this.state.pos === 'H'} onChange={() => this.setState({ pos: 'H' })} />  Horizontal
            </label>
          </div>
          <div className="radio" >
            <label>
              <input type="radio" value="option2" checked={this.state.pos === 'V'} onChange={() => this.setState({ pos: 'V' })} />  Vertical
            </label>
          </div>
        </form>
      </div>
      <Button variant="info" onClick={() => this.props.onAdd(this.state.name, this.state.pos)}><span role="img" aria-label="AI">➕ </span> Add selected ship!</Button>
      <br />
      <br />
    </div>
  }
}

class Board extends React.Component {
  state = {
    boards: Array(this.props.boards).fill(0).map(x => Array(this.props.max * this.props.max).fill(0)),
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
      'carrier': { size: 5 },
      'battleship': { size: 4 },
      'cruiser': { size: 3 },
      'submarine': { size: 3 },
      'destroyer': { size: 2 }
    },
    staticShipDef: [{
      'carrier': { size: 5, quantity: 1 },
      'battleship': { size: 4, quantity: 1 },
      'cruiser': { size: 3, quantity: 1 },
      'submarine': { size: 3, quantity: 1 },
      'destroyer': { size: 2, quantity: 1 }
    }],
    shipDef2: [{
      'carrier': { size: 5, quantity: 1 },
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
    used: {},
    placing: null,
    color: {
      yellow: 0,
      red: 1,
      cyan: 2,
      blue: 3,
      magenta: 4,
      black: 5,
    },
    ready: {},
    letsplay: false,
    whoisplaying: -1,
    winner: -1,
    AIPlayer: [],
    level: 'Easy',
    rounds: 0,
    log: '',
    shotsPerTurn: 1,
    currentShotTurn: 1,
    name0: '',
    name1: '',
    leaderBoard: [],
    alertMessage: '',
    alertVariant: 'success',
    showMessage: false,
  }

  componentDidMount() {
    Array(this.props.boards).fill(0).map((x, ix) => {
      const ready = this.state.ready;
      ready['player' + ix] = false;
      this.setState({ ready });
    });
    let battleShipLeaderBoard = localStorage.getItem('battleShipLeaderBoard');
    if(battleShipLeaderBoard) {
      battleShipLeaderBoard = JSON.parse(battleShipLeaderBoard);
      this.setState({leaderBoard: this.leaderToArray(battleShipLeaderBoard)})
    }
  }

  handleStartAuto() {
    this.placeAllShips();
  }

  async handleStartManual() {
    const whoisplaying = this.getRandomTo(this.props.boards - 1);
    const AIPlayer = this.state.AIPlayer;
    await this.setState({ whoisplaying });
    if (AIPlayer.length > 0) {
      if (AIPlayer.includes(whoisplaying)) {
        this.getAIhit(this.state.level);
        if (AIPlayer.length === 2) {
          let winner = false
          while (!winner) {
            const winnerState = await this.state.winner;
            if (winnerState > -1) winner = true;
            //const r = 
            await this.getAIhit();
          }
        }
      }
    }
  }


  async getAIhit() {
    const tab = this.state.whoisplaying;
    const max = Math.pow(this.props.max, 2) - 1;
    const hit = this.getRandomTo(max);
    await this.handleHit(tab, hit);
    return true;
  }

  renderAlert() {
    return <Alert variant={'danger'} message={'my message'}/>
  }

  async handleClick(i, coord) {
    this.renderAlert();
    const winner = await this.state.winner;
    if (winner > -1) {
      this.writeMessage('The game is over, you can restart it!', 'info', 2000);
      return;
    }
    const placing = await this.state.placing;
    let whoisplaying = await this.state.whoisplaying;
    let [tab, index] = i.split('_');
    tab = Number(tab);
    index = Number(index);
    if (placing) {
      this.handlePlacingClick(tab, index, placing);
    } else if (whoisplaying > -1) {
      if (whoisplaying !== tab) {
        console.log('Not your turn!');
        this.writeMessage('Not your turn', 'danger', 2000);
        return;
      }
      await this.handleHit(tab, index, coord);
      if (this.state.AIPlayer.length === 1) this.getAIhit();
    }
  }

  async handleHit(tab, index, coord) {
    tab = tab === 0 ? 1 : 0;
    let boardShips = this.state.ships2['player' + tab];
    let color = 'blue';
    for (let key in boardShips) {
      for (let element of boardShips[key]) {
        if (element.points.includes(Number(index))) {
          this.handleUpdateScore(tab, element, index);
          color = 'red';
        }
      }
    }
    let rounds = this.state.rounds + 1;
    await this.colorPoints(tab === 0 ? 1 : 0, index, color);
    await this.setState({ rounds });
    let currentShotTurn = this.state.currentShotTurn;
    let whoisplaying = tab;
    if (this.state.shotsPerTurn === currentShotTurn) {
      whoisplaying = tab++;
      whoisplaying = whoisplaying > this.props.boards - 1 ? 0 : whoisplaying;
      currentShotTurn = 1;
      await this.setState({ whoisplaying });
    } else {
      currentShotTurn += 1;
    }
    await this.setState({ currentShotTurn });
    await this.handleHistory(whoisplaying, index, coord, color);
  }

  async handlePlacingClick(tab, index, placing) {
    const [x, y] = this.convertFromNumberToXY(Number(index) + 1);
    let startingPoint = placing.pos === 'H' ? x - 1 : y - 1;
    let rowCol = placing.pos === 'H' ? y - 1 : x - 1;
    let points = this.placeShip(placing.name, placing.pos, startingPoint, rowCol);
    const resTryPlace = await this.tryPlaceShip(points, tab, placing.name);
    this.setState({ placing: null });
    if (!resTryPlace) {
      alert('Space already used!');
      return;
    }
    this.colorPoints(tab, points, 'magenta');
  }

  async colorPoints(tab, points, color) {
    let validColor = this.state.color[color];
    if (validColor === undefined) return null;
    let localPoints = points;
    const boards = this.state.boards.slice();
    if (!Array.isArray(points)) localPoints = [points];
    for (const point of localPoints) {
      boards[tab][point] = validColor;
    }
    await this.setState({ boards })
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
    this.setState({ placing: { name, pos } });
  }

  async handleHistory(tab, index, coord, color) {
    const history = this.state.history;
    history['player' + tab] = !history['player' + tab] ? [index] : [...history['player' + tab], index];
    await this.setState({ history });
    tab = tab === 0 ? 2 : 1;
    let message = `Player ${tab} shot at ${coord}: ${color === 'red' ? 'HIT' : 'MISS'}`;
    this.logLog(message);
  }
  logLog(message) {
    let log = this.state.log;
    log = message + '\n' + log;
    this.setState({ log });
  }

  handleUpdateScore(tab, ship, hit) {
    hit = Number(hit);
    let localScore = this.state.score;
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
    this.setState({ score: localScore });
  }

  async handleKill(tab, ship) {
    let gameInfo = this.state.gameInfo;
    let playerInfo = gameInfo['player' + tab];
    playerInfo.shipsKilled++;
    if (playerInfo.shipsPlaced === playerInfo.shipsKilled) {
      await this.handleLose(tab);
    }
    await this.setState({ gameInfo });
    this.logLog(`Player ${tab === 0 ? 2 : 1} has sunk a ${ship.name.toUpperCase()}`)
    this.colorPoints(tab === 0 ? 1 : 0, ship.points, 'black')
  }

  async handleLose(tab) {
    await this.setState({ winner: tab === 0 ? 1 : 0 });
    this.writeMessage('Player' + (this.state.winner + 1) + ' has won!', 'success', 2000);

    const playerName = this.state['name' + (tab === 0 ? 1 : 0)];
    console.log('playerName', playerName);
    if (!playerName) return;

    let battleShipLeaderBoard = localStorage.getItem('battleShipLeaderBoard');
    if (battleShipLeaderBoard) battleShipLeaderBoard = JSON.parse(battleShipLeaderBoard);
    else if (!battleShipLeaderBoard) battleShipLeaderBoard = {};
    if (!battleShipLeaderBoard[playerName]) battleShipLeaderBoard[playerName] = 0;
    battleShipLeaderBoard[playerName]++;
    localStorage.setItem('battleShipLeaderBoard', JSON.stringify(battleShipLeaderBoard));
    await this.setState({ leaderBoard: this.leaderToArray(battleShipLeaderBoard) });
  }
  leaderToArray(leader) {
    let res = [];
    for (const key in leader) {
      res.push({leader:key, pos:Number(leader[key])});
    }
    return res.sort((a, b) => b.pos - a.pos);
  }

  tryPlaceShip = async (res, tab, ship) => {
    let used = this.state.used;
    if (!used['player' + tab]) used['player' + tab] = [];
    if (used['player' + tab].some(r => res.includes(r))) return null;
    used['player' + tab] = [...used['player' + tab], ...res];
    await this.setState({ used });
    let ships2 = this.state.ships2;
    if (!ships2['player' + tab]) ships2['player' + tab] = {};
    let places = ships2['player' + tab];
    let id = !places[ship] ? 0 : places[ship].length;
    let newShip = { id, name: ship, pos: (res[1] - res[0]) === 1 ? 'H' : 'V', points: res, total: res.length };
    places[ship] = !places[ship] ? [newShip] : [...places[ship], newShip];
    // Create/update GameInfo to control who wins
    let gameInfo = this.state.gameInfo;
    if (!gameInfo['player' + tab]) gameInfo['player' + tab] = { shipsPlaced: 0, shipsKilled: 0 };
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
  placeAllShips = async (staticShipDef, tab) => {
    let allPlaces = this.state.ships2;
    let playerNo = tab !== undefined ? tab : 0;
    let used = this.state.used;
    const shipDef2 = staticShipDef ? staticShipDef : this.state.shipDef2;
    for (const player of shipDef2) {
      let places = {};
      let shipsPlaced = 0;
      if (!used['player' + playerNo]) used['player' + playerNo] = [];
      for (const ship in player) {
        for (let i = 0; i < player[ship].quantity; i++) {
          let res;
          let condition;
          do {
            res = this.placeShip(ship);
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
    this.setPlayerReady(tab);
  }
  setPlayerReady(tab) {
    const ready = this.state.ready;
    ready['player' + tab] = true;
    const letsplay = Object.values(ready).every(r => r);
    if (letsplay) this.handleStartManual();
    this.setState({ ready, letsplay });
  }

  handleResetGame() {
    this.setState({
      boards: Array(this.props.boards).fill(0).map(x => Array(this.props.max * this.props.max).fill(0)),
      ships2: {},
      shipDefinition: {
        'carrier': { size: 5 },
        'battleship': { size: 4 },
        'cruiser': { size: 3 },
        'submarine': { size: 3 },
        'destroyer': { size: 2 }
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
      whoisplaying: -1,
      winner: -1,
      AIPlayer: [],
      level: 'Easy',
      rounds: 0,
      log: '',
      shotsPerTurn: 1,
      currentShotTurn: 1,
    });
  }

  async handleOnAI(tab) {
    const staticShipDef = this.state.staticShipDef.slice();
    await this.placeAllShips(staticShipDef, tab);
    this.colorAllShipsFromPlayer(tab, 'magenta');
  }

  async handleOnAIPlayer(tab) {
    const staticShipDef = this.state.staticShipDef.slice();
    await this.placeAllShips(staticShipDef, tab);
    const AIPlayer = this.state.AIPlayer.slice();
    AIPlayer.push(tab);
    await this.setState({ AIPlayer });
    this.setPlayerReady(tab);
  }

  colorAllShipsFromPlayer(tab, color) {
    const shipsFrom = this.state.ships2['player' + tab];
    Object.keys(shipsFrom).forEach(key => {
      shipsFrom[key].forEach(ship => {
        this.colorPoints(tab, ship.points, color);
      })
    })
  }

  async handleUpdateGameSettings(obj) {
    await this.handleResetGame();
    let staticShipDef = this.state.staticShipDef[0];
    for (let ship in obj.shipSizes) {
      staticShipDef[ship].quantity = obj.shipSizes[ship];
    }
    staticShipDef = [staticShipDef];
    await this.setState({ staticShipDef, level: obj.level, shotsPerTurn: obj.shotsPerTurn });
    if (this.props.max !== obj.boardSize) {
      this.props.onChangeMax(obj.boardSize);
      await this.handleResetGame();
    }
  }

  renderTableau(tab, max, color) {
    const tableauValues = this.state.boards[tab];
    return (
      <div key={'bd' + tab} style={{ marginLeft: '150px', }}>
        <h3><span role="img" aria-label="ship">🛳</span> Player {tab + 1}</h3>
        <input style={{ "width": '200px', textAlign: 'center' }} type="text" placeholder="Enter your name if you wish" value={this.state['name' + tab]} onChange={e => this.setState({ ['name' + tab]: e.target.value })}></input>
        {!this.state.ready['player' + tab] && <ShipInput
          tab={tab} onAdd={(name, pos) => this.handlePutSingleShip(name, pos)}
          onFinish={(tab) => this.handleFinishPuttingShips(tab)}
          onAI={(tab) => this.handleOnAI(tab)}
          onAIPlayer={(tab) => this.handleOnAIPlayer(tab)}
        />}
        <MyShips player={tab} ships={this.state.score['player' + tab]} />
        <Square
          key={'sq' + tab}
          board={tab}
          value={tableauValues}
          max={max}
          color={color}
          onClick={(btnId, coord) => this.handleClick(btnId, coord)}
          onMouseEnter={(btnId, toggle) => this.handleEnter(btnId, toggle)}
          onMouseLeave={(btnId, toggle) => this.handleLeave(btnId, toggle)}
        />
        <br />
      </div>
    );
  }

  async writeMessage(message, variant, time) {
    await this.setState({alertMessage: message, alertVariant: variant, showMessage: true});
    setTimeout(() => this.setState({showMessage: false}), time);
  }

  render() {
    let status;
    if (true) {
      status = 'Winner: ' + true;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }
    const instructions = "Welcome! First, every player has to place their ships, then the game will start automatically once every player has pressed 'I'm ready' button!";
    const playing = 'The game is on, your turn player:';
    const end = `This amazing game is over after ${this.state.rounds} rounds. The winner is player ${this.state.winner + 1}`;
    let whoisplaying = this.state.whoisplaying;
    return (
      <div style={{ textAlign: 'center' }}>
        {this.state.showMessage && <MyAlert variant={this.state.alertVariant} message={this.state.alertMessage}/>}
        {!this.state.letsplay && <h4>{instructions}</h4>}
        {(this.state.letsplay && this.state.winner < 0) && <h3>{playing} {whoisplaying + 1}</h3>}
        {this.state.winner > -1 && <h3>{end}</h3>}
        {this.state.letsplay && <Button onClick={() => this.handleResetGame()}>Restart Game!</Button>}

        <Tabs variant="tabs" defaultActiveKey="game" id="uncontrolled-tab-example">
          <Tab eventKey="game" title="Game!">
            <br />
            <div style={{ display: 'flex', flexDirection: 'row', paddingLeft: '30px', alignItems: 'space-around', justifyContent: 'space-around' }}>
              {Array(this.props.boards).fill(0).map((x, ix) => this.renderTableau(ix, this.props.max, this.state.color))}
            </div>
          </Tab>
          <Tab eventKey="log" title="Log">
            <div style={{ paddingLeft: '30px' }}>
              <br />
              <h4>Logs:</h4>
              <textarea value={this.state.log} readOnly style={{ width: '500px', height: '500px' }} />
            </div>
          </Tab>
          <Tab eventKey="leader" title="Leader Board">
            <div style={{ paddingLeft: '30px' }}>
              <br />
              <h4>Table of leaders:</h4>
              <LeaderTable leaders={this.state.leaderBoard}/>
            </div>
          </Tab>
          <Tab eventKey="settings" title="Settings">
            <div style={{ paddingLeft: '30px' }}>
              <br/>
              <h4>Settings:</h4>
              <br/>
              <Settings onUpdate={(obj) => this.handleUpdateGameSettings(obj)} />
            </div>
          </Tab>
        </Tabs>
        <br />
        <div>

        </div>
        <div className="board-row">
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  state = {
    boards: 2,
    max: 10,
  }
  handleChangeBoards(b) {
    // GOD MODE change number of boards
    this.setState({ boards: b });
  }
  handleChangeMax(m) {
    // GOD MODE change max row/column
    this.setState({ max: m });
  }
  render() {
    return (
      <div>
        <NavBar />
        <div className="game">
          <div className="game-board">
            <Board
              onChangeBoards={(b) => this.handleChangeBoards(b)}
              onChangeMax={(m) => this.handleChangeMax(m)}
              boards={this.state.boards} max={this.state.max} />
          </div>
          <div className="game-info">
            <div>{/* status */}</div>
            <ol>{/* TODO */}</ol>
          </div>
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
