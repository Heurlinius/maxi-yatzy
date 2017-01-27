import React from 'react';

export function ResultScreen(props) {
	const result = props.players.length === 1
		? <SingleplayerResult player={props.players[0]}/>
		: <MultiplayerResult players={props.players}/>;
	return (
		<div className='endgame-area'>
			<div className='game-result'>
				<h1>Game has ended!</h1>
				{result}
				<p>
					<button className='restart-game-button'
					        onClick={() => props.onGameRestart()}>
						Play again
					</button>
				</p>
			</div>
		</div>
	);
}

export function SingleplayerResult(props) {
	const player = props.player;

	const score = player.getTotalScore();

	return (
		<p className='game-result-body'>
			You finished the game with <strong className='score score--final'>{score}</strong> points.
		</p>
	);
}

export function MultiplayerResult(props) {
	const playersSorted = props.players.slice()
		.sort(comparePlayers);

	const highestScore = playersSorted[0].getTotalScore();
	const playerScores = playersSorted.map((p, i) =>
		<li key={i}
		    className={p.getTotalScore() === highestScore ? 'winning-player' : null}>
			{p.name} &ndash; {p.getTotalScore()} points
		</li>
	);

	return (
		<div className='game-result-body'>
			<p>And the final scores are:</p>
			<ul className='winner-list'>
				{playerScores}
			</ul>
		</div>
	);
}

function comparePlayers(a, b) {
	// Order by highest score first, name second
	const aTotal = a.getTotalScore();
	const bTotal = b.getTotalScore();
	if (aTotal !== bTotal) {
		return bTotal - aTotal;
	}

	if (a.name < b.name) {
		return -1;
	}

	if (a.name > b.name) {
		return 1;
	}

	return 0;
}
