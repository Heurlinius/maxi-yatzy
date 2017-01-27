import {getScoringCategories, getCategoryScore} from './Scoring';

export class Player {
	constructor(name, scores = {}) {
		this.name = name;
		this.scores = scores;
		this.totalScore = calculateTotalOwnScore(scores) + calculateTotalDerivedScore(this);
	}

	hasCategoryScore(category) {
		return this.scores.hasOwnProperty(category);
	}

	getCategoryScore(category) {
		return this.scores[category];
	}

	setCategoryScore(category, score) {
		return new Player(
			this.name,
			{
				...this.scores,
				[category]: score,
			}
		);
	}

	getTotalScore() {
		return this.totalScore;
	}
}

function calculateTotalOwnScore(scores) {
	const scoringCategories = Object.keys(scores);
	return scoringCategories.reduce((a, b) => a + scores[b], 0);
}

function calculateTotalDerivedScore(player) {
	const derivedCategories = getScoringCategories()
		.filter(c => c.isDerived);

	return derivedCategories.reduce(
		(acc, cat) => acc + getCategoryScore(cat.id, player, null),
		0
	);
}
