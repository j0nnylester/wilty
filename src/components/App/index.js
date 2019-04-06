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
            facts: [],
            isRevealed: false,
            playedTimes: 1,
            currentGame: {
                bootcamper: "Player",
                fact: "",
                reveal: "",
                vsTeam: 0
            },
            scores: {
                one: 0,
                two: 0,
                three: 0,
                four: 0,
                five: 0,
                six: 0
            }
        };
    }

    changeScore = (team, change) => {
        this.setState(state => ({
            scores: {
                ...state.scores,
                [team]: state.scores[team] + change
            }
        }));
    };

    reveal = () => {
        this.setState(state => ({
            isRevealed: true,
            playedTimes: state.playedTimes + 1
        }));
    };

    play = () => {
        this.setState(() => ({ isRevealed: false }));

        let randomBootcamperIndex = Math.floor(
            Math.random() * this.state.bootcampers.length
        );
        let randomFactIndex = Math.floor(
            Math.random() * this.state.facts.length
        );

        //console.log({ rbi: randomBootcamperIndex, rfi: randomFactIndex });

        if (this.state.facts[randomFactIndex].reveal === "Lie") {
            this.setState(state => ({
                bootcampers: [
                    ...state.bootcampers.slice(0, randomBootcamperIndex),
                    ...state.bootcampers.slice(randomBootcamperIndex + 1)
                ],
                facts: [
                    ...state.facts.slice(0, randomFactIndex),
                    ...state.facts.slice(randomFactIndex + 1)
                ],
                currentGame: {
                    fact: state.facts[randomFactIndex].fact,
                    reveal: state.facts[randomFactIndex].reveal,
                    bootcamper: state.bootcampers[randomBootcamperIndex],
                    vsTeam: Math.floor(Math.random() * 5) + 1
                }
            }));
        } else if (
            this.state.facts[randomFactIndex].who ===
            this.state.bootcampers[randomBootcamperIndex]
        ) {
            this.setState(state => ({
                bootcampers: [
                    ...state.bootcampers.slice(0, randomBootcamperIndex),
                    ...state.bootcampers.slice(randomBootcamperIndex + 1)
                ],
                facts: [
                    ...state.facts.slice(0, randomFactIndex),
                    ...state.facts.slice(randomFactIndex + 1)
                ],
                currentGame: {
                    fact: state.facts[randomFactIndex].fact,
                    reveal: state.facts[randomFactIndex].reveal,
                    bootcamper: state.bootcampers[randomBootcamperIndex],
                    vsTeam: Math.floor(Math.random() * 5) + 1
                }
            }));
        } else {
            this.setState(() => ({
                currentGame: {
                    fact: "",
                    reveal: "",
                    bootcamper: "",
                    vsTeam: ""
                }
            }));
            this.play();
        }
    };

    componentDidMount() {
        const toFetch = ["facts", "bootcampers"];
        Promise.all(
            toFetch.map(item =>
                fetch(`${gist_URL}/${item}.json`)
                    .then(res => res.json())
                    .then(data =>
                        this.setState(() => ({
                            [item]: data
                        }))
                    )
            )
        );
    }

    render() {
        return (
            <div className={css.app}>
                <h1 className={css.title}>Would I Lie To You?</h1>
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
                    }`}{" "}
                </h2>
                <h3 className={css.round}>Round {this.state.playedTimes}</h3>
                <div className={css.scores}>
                    {Object.keys(this.state.scores)
                        .reverse()
                        .map(team => {
                            return (
                                <Score
                                    key={team}
                                    team={team}
                                    score={this.state.scores[team]}
                                    changeScore={this.changeScore}
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
