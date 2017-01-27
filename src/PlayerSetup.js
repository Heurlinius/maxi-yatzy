import React, {Component} from 'react';
import deleteIcon from '../img/delete.svg';

export class PlayerSetup extends Component {
	constructor(props) {
		super(props);

		this.state = {
			playerNames: props.playerNames || [],
		};
	}

	canStartGame() {
		return this.state.playerNames.some(
			name => name.trim() !== ''
		);
	}

	renamePlayer(index, newName) {
		if (index < 0 || index > this.state.playerNames.length) {
			throw new Error(`Index out of range: ${index}`);
		}

		const newPlayerNames = this.state.playerNames.slice();
		// Note: this may add a new player to the end.
		newPlayerNames[index] = newName;

		this.setState({
			...this.state,
			playerNames: newPlayerNames,
		});
	}

	deletePlayer(index, newName) {
		if (index < 0 || index >= this.state.playerNames.length) {
			throw new Error(`Index out of range: ${index}`);
		}

		const newPlayerNames = this.state.playerNames.filter(
			(_, i) => i !== index
		);

		this.setState({
			...this.state,
			playerNames: newPlayerNames,
		});
	}

	handleClickStart() {
		const playerNames = this.state.playerNames;
		if (playerNames.length !== 0) {
			this.props.onClickStart(playerNames);
		}
	}

	render() {
		const playerNames = this.state.playerNames;
		// The game can start if there's at least one player with
		// a non-empty, non-whitespace name.
		const canStartGame = this.canStartGame();

		return (
			<div className='player-setup-area'>
				<div className='player-setup'>
					<h1>Player setup</h1>
					<PlayerList playerNames={playerNames}
					            onRename={(i, name) => this.renamePlayer(i, name)}
					            onDelete={i => this.deletePlayer(i)}
					            onSubmit={() => this.handleClickStart()}/>
					<p>
						<button className='start-game-button'
						        disabled={!canStartGame}
						        onClick={() => this.handleClickStart()}>
							Start game
						</button> &ndash; order is randomized
					</p>
				</div>
			</div>
		);
	}
}

export class PlayerList extends Component {
	renamePlayer(i, newName) {
		this.props.onRename(i, newName);
	}

	deletePlayer(i) {
		this.props.onDelete(i);
	}

	submit() {
		this.props.onSubmit();
	}

	render() {
		const iNew = this.props.playerNames.length;
		const players = this.props.playerNames.map((name, i) =>
			<PlayerEditor key={i}
			              name={name}
			              isNew={false}
			              onRename={name => this.renamePlayer(i, name)}
			              onDelete={() => this.deletePlayer(i)}
			              onSubmit={() => this.submit()}/>
		);
		if (players.length < 10) {
			players.push(
				<PlayerEditor key={iNew}
				              ref={elem => { this.newNameEditor = elem; }}
				              name=''
				              isNew={true}
				              onRename={name => this.renamePlayer(iNew, name)}
				              onDelete={() => { /* ignore */ }}
				              onSubmit={() => this.submit()}/>
			);
		}
		return (
			<ul className='player-list'>
				{players}
			</ul>
		);
	}

	componentDidMount() {
		if (this.props.playerNames.length === 0 && this.newNameEditor) {
			this.newNameEditor.focus();
		}
	}
}

export class PlayerEditor extends Component {
	handleBlur(value) {
		if (value.trim() === '') {
			this.props.onDelete();
		}
	}

	handleKeyDown(e) {
		const keyCode = e.which || e.keyCode;
		if (keyCode === 13) {
			this.props.onSubmit();
		}
	}

	focus() {
		if (this.nameInput) {
			this.nameInput.focus();
		}
	}

	render() {
		let className = 'player-name-input';
		let deleteButton = null;
		if (!this.props.isNew) {
			deleteButton = (
				<button className='player-delete-button'
				        onClick={() => this.props.onDelete()}>
					<img src={deleteIcon} alt='Delete'/>
				</button>
			);
		} else {
			className += ' player-name-input--new';
		}
		return (
			<li>
				<input ref={elem => { this.nameInput = elem; }}
				       type='text'
				       className={className}
				       value={this.props.name}
				       placeholder={this.props.isNew ? 'New player name' : null}
				       onChange={e => this.props.onRename(e.target.value)}
				       onBlur={e => this.handleBlur(e.target.value)}
				       onKeyDown={e => this.handleKeyDown(e)}/>
				{deleteButton}
			</li>
		);
	}
}
