import React, {Component} from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import {getCategoryScore} from './game/Scoring';

export class Board extends Component {
	constructor() {
		super();

		this.state = {
			confirmZeroCategory: null,
		};
	}

	handlePickCategory(category) {
		const player = this.props.players[this.props.currentPlayer];

		let needConfirmation = false;
		if (this.props.dice[0] !== 0) {
			needConfirmation =
				!player.hasCategoryScore(category.id) &&
				getCategoryScore(category.id, player, this.props.dice) === 0 &&
				this.state.confirmZeroCategory !== category.id;
		}

		if (needConfirmation) {
			this.setState({
				...this.state,
				confirmZeroCategory: category.id,
			});
		} else {
			// Clear any pending timeout
			this.removeConfirmZero();
			this.props.onClickCategory(category);
		}
	}

	removeConfirmZero() {
		this.setState({
			...this.state,
			confirmZeroCategory: null,
		});
	}

	render() {
		const players = this.props.players;
		const confirmZeroCategory = this.state.confirmZeroCategory;

		const playerNames = players.map((p, i) =>
			<th key={i}
			    className={i === this.props.currentPlayer ? 'player-current' : ''}>
				{p.name}
			</th>
		);

		const categories = this.props.categories.map(cat =>
			<BoardRow key={cat.id}
			          category={cat}
			          players={players}
			          currentPlayer={this.props.currentPlayer}
			          dice={this.props.dice}
			          confirmZero={cat.id === confirmZeroCategory}
			          onPickCategory={() => this.handlePickCategory(cat)}/>
		);

		const totalScores = players.map((p, i) =>
			<td key={i}>{p.getTotalScore()}</td>
		);

		return (
			<table className='game-board'>
				<thead>
					<tr>
						<th></th>
						{playerNames}
					</tr>
				</thead>
				<tbody>
					{categories}
				</tbody>
				<tfoot>
					<tr className='category--derived category--total'>
						<th>Total</th>
						{totalScores}
					</tr>
				</tfoot>
			</table>
		);
	}

	componentDidUpdate(prevProps, prevState) {
		if (prevState.confirmZeroCategory !== this.state.confirmZeroCategory) {
			// The confirmZeroCategory has changed, so we need to do the following:

			// 1. Cancel the old timeout (if any).
			if (prevState.confirmZeroCategory !== null) {
				window.clearTimeout(this.confirmZeroTimeoutId);
			}

			// 2. Set a new timeout to fade out the confirmation after a few seconds
			//    (if applicable).
			if (this.state.confirmZeroCategory !== null) {
				this.confirmZeroTimeoutId = window.setTimeout(() => {
					this.removeConfirmZero();
				}, 2500);
			}
		}
	}
}

export function BoardRow(props) {
	const category = props.category;
	const players = props.players.map((p, i) => {
		const isCurrent = i === props.currentPlayer;
		return (
			<PlayerScore key={i}
			             player={p}
			             isCurrent={isCurrent}
			             category={category}
			             confirmZero={props.confirmZero && isCurrent}
			             dice={isCurrent ? props.dice : null}
			             onPickCategory={isCurrent ? (() => props.onPickCategory()) : null}/>
		);
	});

	const className = category.isDerived
		? `category--derived category--${category.id}`
		: `category--${category.id}`;

	return (
		<tr className={className}
		    onClick={() => props.onPickCategory()}>
			<th>{category.displayName}</th>
			{players}
		</tr>
	);
}

export function PlayerScore(props) {
	const dice = props.dice;
	const player = props.player;
	const category = props.category;
	const canScore =
		!category.isDerived &&
		!player.hasCategoryScore(category.id) &&
		props.isCurrent &&
		props.dice &&
		props.dice[0] !== 0;

	let className = 'score';
	let text = null;

	if (category.isDerived) {
		const score = getCategoryScore(category.id, player, dice);
		text = score;
		if (score === 0) {
			className += ' score--zero';
		}
	} else if (player.hasCategoryScore(category.id)) {
		const score = player.getCategoryScore(category.id);
		if (score !== 0) {
			text = score;
		} else {
			className += ' score--zero';
			text = '\u2014';
		}
	} else if (dice && dice[0] !== 0) {
		const score = getCategoryScore(category.id, player, dice);
		text = score;
		className += ' score--new';
		if (score === 0) {
			className += ' score--zero';
		}
	}

	if (props.isCurrent) {
		className += ' player-current';
	}

	return (
		<td className={className}
		    tabIndex={canScore ? 0 : null}
		    onKeyDown={canScore ? (e => activateFromKeyboard(e, props.onPickCategory)) : null}>
			{text}
			<ReactCSSTransitionGroup
					transitionName='confirm-zero'
					transitionEnterTimeout={50}
					transitionLeaveTimeout={300}>
				{props.confirmZero && <ConfirmZeroPopup/>}
			</ReactCSSTransitionGroup>
		</td>
	);
}

export function ConfirmZeroPopup(props) {
	return (
		<div className='confirm-zero-popup'>
			Once more to<br/>
			confirm <strong>0</strong> points
		</div>
	);
}

function activateFromKeyboard(e, callback) {
	const keyCode = e.which || e.keyCode;
	switch (keyCode) {
		case 13: // Enter
		case 32: // Space
			callback();
			return true;
		default:
			return false;
	}
}
