// Bonus is awareded if the score of the singles is greater than
// or equal to the score of getting four-of-a-kind on all of them.
const BONUS_THRESHOLD = (1 + 2 + 3 + 4 + 5 + 6) * 4;
const BONUS_CATEGORIES = ['ones', 'twos', 'threes', 'fours', 'fives', 'sixes'];

function scoringCategory(id, displayName, isDerived = false) {
	return Object.freeze({
		id: id,
		displayName: displayName,
		isDerived: isDerived,
	});
}

const Reduce = Object.freeze({
	chain(...reducers) {
		if (reducers.length === 0) {
			throw new Error('Reducer chain needs at least one reducer');
		}

		return (player, dice) => {
			let result = dice;

			for (let i = 0; i < reducers.length; i++) {
				if (result === null) {
					break;
				}
				result = reducers[i](player, result);
			}

			return result || 0;
		};
	},

	regex(regex) {
		if (regex.global) {
			return (player, dice) => {
				const diceString = dice.join('');
				return diceString.match(regex);
			};
		} else {
			return (player, dice) => {
				const diceString = dice.join('');
				const matches = regex.exec(diceString);
				if (matches) {
					return matches[0];
				} else {
					return null;
				}
			};
		}
	},

	pairs(player, dice) {
		const diceString = dice.join('');
		const matches = diceString.match(/11|22|33|44|55|66/g);
		return matches;
	},

	unique(player, items) {
		// Assume the items are sorted.
		const result = items.reduce((acc, val) => {
			if (acc[acc.length - 1] !== val) {
				acc.push(val);
			}
			return acc;
		}, []);
		return result.length > 0 ? result : null;
	},

	sum(player, dice) {
		if (typeof dice === 'string') {
			// Allow a string of dice, like '235566';
			dice = dice.split('');
		}
		return dice.reduce((a, b) => a + +b, 0);
	},

	fixed(score) {
		return (player, _) => score;
	},
});

const scoringCategories = Object.freeze([
	// Top half - singles
	scoringCategory('ones', 'Ones'),
	scoringCategory('twos', 'Twos'),
	scoringCategory('threes', 'Threes'),
	scoringCategory('fours', 'Fours'),
	scoringCategory('fives', 'Fives'),
	scoringCategory('sixes', 'Sixes'),
	// Bonus
	scoringCategory('bonus', 'Bonus', true),
	// Pairs
	scoringCategory('one-pair', 'One pair'),
	scoringCategory('two-pairs', 'Two pairs'),
	scoringCategory('three-pairs', 'Three pairs'),
	// n-of-a-kind
	scoringCategory('three-of-a-kind', 'Three of a kind'),
	scoringCategory('four-of-a-kind', 'Four of a kind'),
	scoringCategory('five-of-a-kind', 'Five of a kind'),
	// Straights
	scoringCategory('small-straight', 'Small straight'),
	scoringCategory('large-straight', 'Large straight'),
	scoringCategory('full-straight', 'Full straight'),
	// Various buildings
	scoringCategory('full-house', 'Full house (2+3)'),
	scoringCategory('villa', 'Villa (3+3)'),
	scoringCategory('tower', 'Tower (2+4)'),
	// Chance
	scoringCategory('chance', 'Chance'),
	// Yatzy
	scoringCategory('yatzy', 'Yatzy'),
]);

const scoreReducers = Object.freeze({
	// Singles
	'ones': Reduce.chain(Reduce.regex(/1+/), Reduce.sum),
	'twos': Reduce.chain(Reduce.regex(/2+/), Reduce.sum),
	'threes': Reduce.chain(Reduce.regex(/3+/), Reduce.sum),
	'fours': Reduce.chain(Reduce.regex(/4+/), Reduce.sum),
	'fives': Reduce.chain(Reduce.regex(/5+/), Reduce.sum),
	'sixes': Reduce.chain(Reduce.regex(/6+/), Reduce.sum),
	// Bonus
	'bonus': (player, dice) => {
		const totalSinglesScore = BONUS_CATEGORIES
			.map(cat => player.getCategoryScore(cat) || 0)
			.reduce((a, b) => a + b, 0);
		return totalSinglesScore >= BONUS_THRESHOLD ? 100 : 0;
	},
	// Pairs
	'one-pair': Reduce.chain(
		Reduce.pairs,
		(player, pairs) => pairs[pairs.length - 1],
		Reduce.sum
	),
	'two-pairs': Reduce.chain(
		Reduce.pairs,
		Reduce.unique,
		(player, pairs) => {
			if (pairs.length < 2) {
				// Need at least two distinct pairs
				return null;
			}
			const pair1 = pairs[pairs.length - 1];
			const pair2 = pairs[pairs.length - 2];
			return pair1 + pair2;
		},
		Reduce.sum
	),
	'three-pairs': Reduce.chain(
		Reduce.pairs,
		Reduce.unique,
		(player, pairs) => {
			if (pairs.length < 3) {
				// Need at least three distinct pairs
				return null;
			}
			const pair1 = pairs[pairs.length - 1];
			const pair2 = pairs[pairs.length - 2];
			const pair3 = pairs[pairs.length - 3];
			return pair1 + pair2 + pair3;
		},
		Reduce.sum
	),
	// N-of-a-kind
	'three-of-a-kind': Reduce.chain(
		Reduce.regex(/111|222|333|444|555|666/g),
		(player, triplets) => triplets[triplets.length - 1],
		Reduce.sum
	),
	'four-of-a-kind': Reduce.chain(
		// With six dice, there can only be one four-of-a-kind,
		// hence no need for the /g flag
		Reduce.regex(/1111|2222|3333|4444|5555|6666/),
		Reduce.sum
	),
	'five-of-a-kind': Reduce.chain(
		// With six dice, there can only be one five-of-a-kind,
		// hence no need for the /g flag.
		Reduce.regex(/1{5}|2{5}|3{5}|4{5}|5{5}|6{5}/),
		Reduce.sum
	),
	// Straights
	'small-straight': Reduce.chain(
		Reduce.regex(/1.?2.?3.?4.?5/),
		Reduce.fixed(15)
	),
	'large-straight': Reduce.chain(
		Reduce.regex(/2.?3.?4.?5.?6/),
		Reduce.fixed(20)
	),
	'full-straight': Reduce.chain(
		Reduce.regex(/123456/),
		Reduce.fixed(25)
	),
	// Various buildings
	'full-house': Reduce.chain(
		(player, dice) => {
			// Match AA.BBB or AAA.BB.
			// Note: Because dice are ordered, AA.BBB is guaranteed
			// to be worth more than AAA.BB, so we match against that
			// first.
			const regex = /([1-6])\1.?([1-6])\2\2|([1-6])\3\3.?([1-6])\4/;
			const matches = regex.exec(dice.join(''));
			if (matches) {
				// The two groups need to be distinct
				const group1 = matches[1] || matches[4]; // AA or BB
				const group2 = matches[2] || matches[3]; // AAA or BBB
				if (group1 !== group2) {
					return group1 + group1 + group2 + group2 + group2;
				}
			}
			return null;
		},
		Reduce.sum
	),
	'villa': Reduce.chain(
		Reduce.regex(/111|222|333|444|555|666/g),
		Reduce.unique,
		(player, triplets) => {
			if (triplets.length < 2) {
				// Need at least two distinct triplets
				return null;
			}
			const triplet1 = triplets[triplets.length - 1];
			const triplet2 = triplets[triplets.length - 2];
			return triplet1 + triplet2;
		},
		Reduce.sum
	),
	'tower': Reduce.chain(
		(player, dice) => {
			// Note: Because dice are ordered, AABBBB is guaranteed
			// to be worth more than AAAABB, but it doesn't actually
			// matter which order we test, since we can't end up with
			// both situations simultaneously.
			const regex = /([1-6])\1([1-6])\2{3}|([1-6])\3{3}([1-6])\4/;
			const matches = regex.exec(dice.join(''));
			if (matches) {
				const group1 = matches[1] || matches[3];
				const group2 = matches[2] || matches[4];
				// We need two distinct groups
				if (group1 !== group2) {
					return dice;
				}
			}
			return null;
		},
		Reduce.sum
	),
	// Chance
	'chance': Reduce.sum,
	// Yatzy
	'yatzy': Reduce.chain(
		Reduce.regex(/1{6}|2{6}|3{6}|4{6}|5{6}|6{6}/),
		Reduce.fixed(100)
	),
});

export function getScoringCategories() {
	return scoringCategories;
}

export function getCategoryScore(category, player, dice) {
	if (dice) {
		dice = dice.slice().sort((a, b) => a - b);
	}

	const reducer = scoreReducers[category];
	if (!reducer) {
		throw new Error(`Invalid scoring category: ${category}`);
	}
	return reducer(player, dice);
}

export function getAllCategoryScores(player, dice) {
	return scoringCategories.map(cat => scoreReducers[cat.id](player, dice));
}
