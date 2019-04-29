import React, { Component } from "react";
import css from "./App.module.css";

import Score from "../Score";

const gist_ID = process.env.REACT_APP_GIST_ID;
const gist_URL = `https://gist.githubusercontent.com/j0nnylester/${gist_ID}/raw`;

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            bootcampers: [],
            currentGame: {
                bootcamper: "Player",
                fact: "",
                reveal: "",
                vsTeam: 0
            },
            isRevealed: false,
            lieFacts: [],
            playedBootcampers: [],
            scores: {
                one: 0,
                two: 0,
                three: 0,
                four: 0,
                five: 0,
                six: 0
            },
            trueFacts: []
        };
    }

    changeScores = (team, change) => {
        this.setState(state => ({
            scores: {
                ...state.scores,
                [team]: state.scores[team] + change
            }
        }));
        localStorage.setItem("scores", JSON.stringify(this.state.scores));
    };

    clearPlayed = () => {
        if (
            this.state.playedBootcampers.length ===
            this.state.bootcampers.length
        ) {
            this.setState(() => ({ playedBootcampers: [] }));
        }
    };

    clearScores = () => {
        this.setState(() => ({
            scores: {
                one: 0,
                two: 0,
                three: 0,
                four: 0,
                five: 0,
                six: 0
            }
        }));
        localStorage.removeItem("scores");
    };

    pickLie = () => {
        let randomLie = Math.floor(Math.random() * this.state.lieFacts.length);
        let randomBootcamper = Math.floor(
            Math.random() * this.state.bootcampers.length
        );

        if (!this.state.playedBootcampers.includes(randomBootcamper)) {
            this.setState(
                state => ({
                    currentGame: {
                        fact: state.lieFacts[randomLie].fact,
                        reveal: state.lieFacts[randomLie].reveal,
                        bootcamper: state.bootcampers[randomBootcamper],
                        vsTeam: (state.currentGame.vsTeam % 6) + 1
                    },
                    playedBootcampers: [
                        ...state.playedBootcampers,
                        randomBootcamper
                    ].sort((a, b) => a - b)
                }),
                () => this.clearPlayed()
            );
        } else {
            this.play();
        }
    };

    pickTrue = () => {
        let randomTrue = Math.floor(
            Math.random() * this.state.trueFacts.length
        );
        if (
            !this.state.playedBootcampers.includes(
                this.state.bootcampers.indexOf(
                    this.state.trueFacts[randomTrue].who
                )
            )
        ) {
            this.setState(
                state => ({
                    currentGame: {
                        fact: state.trueFacts[randomTrue].fact,
                        reveal: state.trueFacts[randomTrue].reveal,
                        bootcamper: state.trueFacts[randomTrue].who,
                        vsTeam: (state.currentGame.vsTeam % 6) + 1
                    },
                    playedBootcampers: [
                        ...state.playedBootcampers,
                        state.bootcampers.indexOf(
                            state.trueFacts[randomTrue].who
                        )
                    ].sort((a, b) => a - b)
                }),
                () => this.clearPlayed()
            );
        } else {
            this.play();
        }
    };

    play = async () => {
        this.setState(() => ({ isRevealed: false }));
        if (Math.random() < 0.5) {
            // Lie
            this.pickLie();
        } else {
            // True
            this.pickTrue();
        }
    };

    reveal = () => {
        this.setState(() => ({
            isRevealed: true
        }));
    };

    componentDidMount = async () => {
        if (gist_ID) {
            const data = await fetch(`${gist_URL}/bootcampers.json`).then(res =>
                res.json()
            );
            this.setState(() => ({
                bootcampers: data.sort()
            }));
            const allFacts = await fetch(`${gist_URL}/facts.json`).then(res =>
                res.json()
            );
            this.setState(() => ({
                trueFacts: allFacts.filter(fact => {
                    return fact.reveal === "True";
                }),
                lieFacts: allFacts.filter(fact => {
                    return fact.reveal === "Lie";
                })
            }));
        }
        if (localStorage.getItem("scores")) {
            this.setState(() => ({
                scores: JSON.parse(localStorage.getItem("scores"))
            }));
        }
    };

    render() {
        return (
            <div className={css.app}>
                <h1 className={css.title}>Would I Lie To You?</h1>
                <h3 className={css.round} onClick={this.clearScores}>
                    Round {this.state.playedBootcampers.length}
                </h3>
                <p className={css.fact}>
                    {this.state.currentGame.fact
                        ? `"${this.state.currentGame.fact}"`
                        : ""}
                </p>
                {this.state.isRevealed ? (
                    <div className={css.reveal}>
                        {this.state.currentGame.reveal}
                    </div>
                ) : null}
                <h2 className={css.bootcamper}>
                    {`${this.state.currentGame.bootcamper} vs team: ${
                        this.state.currentGame.vsTeam
                    }`}
                </h2>
                <div className={css.scores}>
                    {Object.keys(this.state.scores)
                        .reverse()
                        .map(team => {
                            return (
                                <Score
                                    key={team}
                                    team={team}
                                    score={this.state.scores[team]}
                                    changeScore={this.changeScores}
                                />
                            );
                        })}
                </div>
                <div className={css.buttons}>
                    <button className={css.playButton} onClick={this.play}>
                        Play
                    </button>
                    <button className={css.revealButton} onClick={this.reveal}>
                        Reveal
                    </button>
                </div>
            </div>
        );
    }
}

export default App;
