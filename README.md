# Maxi Yatzy

This is a [React][] implementation of the game _Maxi Yatzy_, which is a variation of Yatzy played with six dice. [Yatzy][] is a public domain dice game similar to Yahtzee (trademarked by Hasbro in the US) or Yacht.

You can play the game at [heurl.in/yatzy](http://heurl.in/yatzy/).

This project was created mainly to learn some React basics, as an experiment and something to enjoy after completion. Most of the UI is extremely minimal and bare-bones, and much of the code could probably be vastly improved.

This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app). See the [original readme file][cra-readme] for details.

[yatzy]: https://en.wikipedia.org/wiki/Yatzy
[react]: https://facebook.github.io/react/
[cra-readme]: ./create-react-app-readme.md

## Differences from the typical Maxi Yatzy

* Full Straight (1+2+3+4+5+6) is awarded 25 points instead of 21.
* There is no ability to save unused throws; you get three throws per turn, no more, no less.
