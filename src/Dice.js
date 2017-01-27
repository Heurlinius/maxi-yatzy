import React, {Component} from 'react';

export class DiceTray extends Component {
	focusRollButton() {
		if (this.rollButton) {
			this.rollButton.focus();
		}
	}

	render() {
		const dice = this.props.dice.map((d, i) =>
			<Die key={i}
			     value={d}
			     held={this.props.held[i]}
			     onClick={() => this.props.onClickDie(i)}/>
		);

		return (
			<div className='dice-tray'>
				<RollButton rollsLeft={this.props.rollsLeft}
				            rolling={this.props.rolling}
				            ref={btn => { this.rollButton = btn; }}
				            onClick={() => this.props.onClickRoll()}/>
				{dice}
			</div>
		);
	}
}

export function Die(props) {
	return (
		<span className={`die die--d${props.value} ${props.held ? 'die--held' : ''}`}
		      tabIndex={0}
		      onClick={() => props.onClick()}
		      onKeyDown={e => activateFromKeyboard(e, props.onClick)}/>
	);
}

export class RollButton extends Component {
	focus() {
		if (this.button) {
			this.button.focus();
		}
	}

	render() {
		const text =
			this.props.rolling ? 'Rolling...' :
			this.props.rollsLeft > 0 ? `Roll (${this.props.rollsLeft})` :
			'Pick score';

		return (
			<button className='roll-button'
			        disabled={this.props.rolling || this.props.rollsLeft === 0}
			        ref={elem => { this.button = elem; }}
			        onClick={() => this.props.onClick()}>
				{text}
			</button>
		);
	}
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
