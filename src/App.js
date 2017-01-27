import React, {Component} from 'react';
import {PlayerSetup} from './PlayerSetup';
import {Game} from './Game';
import {ResultScreen} from './Endgame';

const PHASE_SETUP = 0;
const PHASE_PLAYING = 1;
const PHASE_ENDGAME = 2;

class App extends Component {
	constructor() {
		super();

		this.state = {
			phase: PHASE_SETUP,
			playerNames: [],
		};
	}

	startGame(playerNames) {
		playerNames = playerNames.filter(name => name.trim() !== '');
		if (playerNames.length === 0) {
			throw new Error('Need at least one non-empty player to start the game');
		}

		this.setState({
			phase: PHASE_PLAYING,
			playerNames: playerNames,
		});
	}

	endGame(players) {
		if (this.state.phase !== PHASE_PLAYING) {
			throw new Error('Can only end the game from the playing phase');
		}

		this.setState({
			phase: PHASE_ENDGAME,
			players: players,
			playerNames: this.state.playerNames,
		});
	}

	restartGame() {
		if (this.state.phase !== PHASE_ENDGAME) {
			throw new Error('Can only restart the game from the endgame phase');
		}

		this.setState({
			phase: PHASE_SETUP,
			playerNames: this.state.playerNames,
		});
	}

	render() {
		switch (this.state.phase) {
			case PHASE_SETUP:
				return (
					<PlayerSetup playerNames={this.state.playerNames}
					             onClickStart={names => this.startGame(names)}/>
				);
			case PHASE_PLAYING:
				return (
					<Game playerNames={this.state.playerNames}
					      onGameEnd={players => this.endGame(players)}/>
				);
			case PHASE_ENDGAME:
				return (
					<ResultScreen players={this.state.players}
					              onGameRestart={() => this.restartGame()}/>
				);
			default:
				throw new Error(`Invalid game phase: ${this.state.phase}`);
		}
	}
}

export default App;
