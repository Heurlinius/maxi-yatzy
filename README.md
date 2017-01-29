# Maxi Yatzy

This is a [React][] implementation of the game _Maxi Yatzy_, which is a variation of Yatzy played with six dice. [Yatzy][] is a public domain dice game similar to Yahtzee (trademarked by Hasbro in the US) or Yacht.

You can play the game at [heurl.in/yatzy](http://heurl.in/yatzy/).

This project was created mainly to learn some React basics, as an experiment and something to enjoy after completion. Most of the UI is extremely minimal and bare-bones, and much of the code could probably be vastly improved.

This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app). See the [original readme file][cra-readme] for details.

[yatzy]: https://en.wikipedia.org/wiki/Yatzy
[react]: https://facebook.github.io/react/
[cra-readme]: ./create-react-app-readme.md

## How to play

* Players take turns rolling the six dice.
* Each turn, the player may roll the dice up to three times.
* On the second and third roll, the player chooses which dice to reroll. Click or tap on a die to "hold" it, which prevents it being rerolled.
* After the three rolls, the player picks a scoring category, and it becomes the next player's turn.
* The player may also pick a scoring category at any other point during their turn. If you get a Full Straight on the first roll, you can assign it right away.
* If you can't score in any category, you have to pick zero for one of them! To prevent misclicks with unfortunate consequences, you must doubleclick/doubletap the scoring category to confirm a score of zero.
* The game ends when all players have distributed scores in all categories.
* The player with the highest score wins.

### Scoring

This implementation of the game features these scoring categories:

* **Ones:** The sum of all dice showing &#x2680; (1).
* **Twos:** The sum of all dice showing &#x2681; (2).
* **Threes:** The sum of all dice showing &#x2682; (3).
* **Fours:** The sum of all dice showing &#x2683; (4).
* **Fives:** The sum of all dice showing &#x2684; (5).
* **Sixes:** The sum of all dice showing &#x2685; (6).
* **Bonus:** Awarded automatically if the sum of _Ones_ thru _Sixes_ is greater than or equal to 84 (equivalent to scoring four-of-a-kind in all those categories). The bonus is worth **100 points**.
* **One pair:** A pair of dice with the same value.
* **Two pairs:** Two distinct pairs of dice with the same value.
* **Three pairs:** Three distinct pairs of dice with the same value.
* **Three of a kind:** Three dice with the same value.
* **Four of a kind:** Four dice with the same value.
* **Five of a kind:** Five dice with the same value.
* **Small straight:** &#x2680;&#x2681;&#x2682;&#x2683;&#x2684; (1-2-3-4-5), worth 15 points (the sum of the dice).
* **Large straight:** &#x2681;&#x2682;&#x2683;&#x2684;&#x2685; (2-3-4-5-6), worth 20 points (the sum of the dice).
* **Full straight:** &#x2680;&#x2681;&#x2682;&#x2683;&#x2684;&#x2685; (1-2-3-4-5-6), worth 25 points.
* **Full house:** One pair and one three-of-a-kind, with different values.
* **Villa:** Two distinct three-of-a-kinds.
* **Tower:** One pair and one four-of-a-kind, with different values.
* **Chance:** The sum of all dice.
* **Yatzy:** All dice showing the same value, worth **100 points**.

Unless otherwise specified, the score for a particular category is calculated as the sum of the dice in the combo. So for example, &#x2684;&#x2680;&#x2684;&#x2685;&#x2685;&#x2684; (5-1-5-6-6-5) is worth 12 as a pair (&#x2685;&#x2685;, 6+6), 15 as a three-of-a-kind (&#x2684;&#x2684;&#x2684;, 5+5+5), or 27 as a full house (&#x2684;&#x2684;&#x2684;&#x2685;&#x2685;, 5+5+5+6+6). If a particular category can be scored multiple ways with the current dice, the game picks the highest possible score automatically. If you've rolled &#x2684;&#x2680;&#x2684;&#x2683;&#x2682;&#x2680; (5-1-5-4-3-1), _One pair_ will be worth 10 (&#x2684;&#x2684;, 5+5), not 2 (&#x2680;&#x2680;, 1+1).

In the case of _Two pairs_, _Three pairs_, _Full house_, _Villa_, and _Tower_, the dice groups must have distinct values. Hence, &#x2682;&#x2682;&#x2682;&#x2682;&#x2682; (3-3-3-3-3) is not a valid _Two pairs_ or _Full house_.

The order of the dice does not matter.

### Differences from the typical Maxi Yatzy

* Full Straight (&#x2680;&#x2681;&#x2682;&#x2683;&#x2684;&#x2685;, 1-2-3-4-5-6) is awarded 25 points instead of 21.
* There is no ability to save unused rolls; you get three rolls per turn, no more, no less.
