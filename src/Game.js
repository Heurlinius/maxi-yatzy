import React, {Component} from 'react';
import {Board} from './Board';
import {DiceTray} from './Dice';
import {getScoringCategories, getCategoryScore} from './game/Scoring';
import {Player} from './game/Player';

export class Game extends Component {
	constructor(props) {
		super(props);

		this.state = {
			players: createPlayers(this.props.playerNames),
			currentPlayer: 0,
			rollsLeft: 3,
			dice: [0, 0, 0, 0, 0, 0],
			heldDice: [false, false, false, false, false, false],
			rollingDice: null,
			rollingDiceTumbleCounts: null,
		};
	}

	beginRoll() {
		if (this.state.rollsLeft === 0) {
			// No more rolls left; just return
			return;
		}

		const tumbleCounts = this.state.heldDice.map(held =>
			held ? 0 : getTumbleCount()
		);
		this.setState({
			...this.state,
			rollsLeft: this.state.rollsLeft - 1,
			rollingDice: this.state.dice,
			rollingDiceTumbleCounts: tumbleCounts,
		});

		this.enqueueTumble();
	}

	enqueueTumble() {
		window.setTimeout(() => {
			this.tumbleDice();
		}, 50);
	}

	tumbleDice() {
		if (this.state.rollingDiceTumbleCounts.every(c => c === 0)) {
			this.endRoll();
			return;
		}

		const rollingDice = this.state.heldDice.map((held, i) =>
			held ? this.state.rollingDice[i] : getDieRoll()
		);
		const tumbleCounts = this.state.rollingDiceTumbleCounts
			.map(c => Math.max(0, c - 1));
		this.setState({
			...this.state,
			rollingDice: rollingDice,
			rollingDiceTumbleCounts: tumbleCounts,
		});

		this.enqueueTumble();
	}

	endRoll() {
		this.setState({
			...this.state,
			dice: this.state.rollingDice, // No need to clone
			rollingDice: null,
			rollingDiceTumbleCounts: null,
		});
	}

	clickDie(index) {
		if (this.state.dice[index] === 0) {
			// Cannot hold a die before it's been rolled
			return;
		}

		const heldDice = this.state.heldDice.slice();
		heldDice[index] = !heldDice[index];
		this.setState({
			...this.state,
			heldDice: heldDice,
		});
	}

	clickCategory(category) {
		if (this.state.dice[0] === 0) {
			// Cannot distribute points before first roll
			return;
		}

		const player = this.state.players[this.state.currentPlayer];

		if (player.hasCategoryScore(category.id) || category.isDerived) {
			// Category already has a score, or is
			// derived (calculated automatically)
			return;
		}

		const score = getCategoryScore(category.id, player, this.state.dice);

		const players = this.state.players.slice();
		players[this.state.currentPlayer] = player.setCategoryScore(
			category.id,
			score
		);

		this.setState({
			...this.state,
			players: players,
			rollsLeft: 3,
			dice: [0, 0, 0, 0, 0, 0],
			heldDice: [false, false, false, false, false, false],
			currentPlayer: (this.state.currentPlayer + 1) % players.length,
		});
	}

	gameHasEnded() {
		if (this.state.currentPlayer !== 0) {
			return false;
		}

		const player = this.state.players[0];
		const categories = getScoringCategories();
		return categories.every(c => c.isDerived || player.hasCategoryScore(c.id));
	}

	render() {
		return (
			<div className='game-area'>
				<Board players={this.state.players}
				       categories={getScoringCategories()}
				       dice={this.state.rollingDice ? null : this.state.dice}
				       currentPlayer={this.state.currentPlayer}
				       onClickCategory={c => this.clickCategory(c)}/>
				<DiceTray dice={this.state.rollingDice || this.state.dice}
				          held={this.state.heldDice}
				          rollsLeft={this.state.rollsLeft}
				          rolling={this.state.rollingDice ? true : false}
				          onClickRoll={() => this.beginRoll()}
				          onClickDie={i => this.clickDie(i)}/>
			</div>
		);
	}

	componentDidUpdate(prevProps, prevState) {
		if (this.gameHasEnded()) {
			this.props.onGameEnd(this.state.players);
		}
	}
}

function createPlayers(names) {
	const randomNames = shuffle(names);
	return randomNames.map(name => new Player(name));
}

function shuffle(items) {
	items = items.slice(); // Work on a copy
	// Knuth-Fisher-Yates shuffle algorithm ftw
	for (let i = items.length - 1; i > 0; i--) {
		const n = Math.floor((i + 1) * Math.random());
		// Swap items[i] <-> items[n]
		const temp = items[i];
		items[i] = items[n];
		items[n] = temp;
	}

	return items;
}

function getTumbleCount() {
	// [5, 15)
	return 5 + Math.floor(10 * Math.random());
}

function getDieRoll() {
	return 1 + Math.floor(6 * Math.random());
}
