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
            bootcamper: "Player",
            facts: [],
            fact: "",
            isRevealed: false,
            reveal: "True",
            vsTeam: 0,
            one: 0,
            two: 0,
            three: 0,
            four: 0,
            five: 0,
            six: 0
        };
    }

    changeScore = (team, change) => {
        this.setState(state => ({
            [team]: state[team] + change
        }));
    };

    reveal = () => {
        this.setState(() => ({ isRevealed: true }));
    };

    randomise = () => {
        this.setState(() => ({ isRevealed: false }));

        let rbootcamper = this.state.bootcampers[
            Math.floor(Math.random() * this.state.bootcampers.length)
        ];
        let rfact = this.state.facts[
            Math.floor(Math.random() * this.state.facts.length)
        ];
        if (rfact.reveal === "True" && rfact.who === rbootcamper) {
            this.setState(() => ({
                fact: rfact,
                bootcamper: rbootcamper
            }));
        } else {
            this.setState(() => ({
                fact: "",
                bootcamper: "",
                vsTeam: Math.floor(Math.random() * 5) + 1
            }));
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
                <header className={css.appheader}>
                    <h1 className={css.title}>Would I Lie To You?</h1>
                    <h3 className={css.bootcamper}>
                        {`${this.state.bootcamper} vs team: ${
                            this.state.vsTeam
                        }`}{" "}
                    </h3>
                    <p className={css.fact}>
                        {this.state.fact ? `"${this.state.fact.fact}"` : ""}
                    </p>
                    {this.state.isRevealed ? (
                        <div className={css.reveal}>{this.state.reveal}</div>
                    ) : (
                        <div className={css.button} onClick={this.reveal}>
                            Reveal
                        </div>
                    )}
                    <div className={css.randomise} onClick={this.randomise}>
                        Play
                    </div>
                    <div className={css.scores}>
                        <Score
                            team="one"
                            score={this.state.one}
                            changeScore={this.changeScore}
                        />
                        <Score
                            team="two"
                            score={this.state.two}
                            changeScore={this.changeScore}
                        />
                        <Score
                            team="three"
                            score={this.state.three}
                            changeScore={this.changeScore}
                        />
                        <Score
                            team="four"
                            score={this.state.four}
                            changeScore={this.changeScore}
                        />
                        <Score
                            team="five"
                            score={this.state.five}
                            changeScore={this.changeScore}
                        />
                        <Score
                            team="six"
                            score={this.state.six}
                            changeScore={this.changeScore}
                        />
                    </div>
                </header>
            </div>
        );
    }
}

export default App;
