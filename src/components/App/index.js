import React, { Component } from "react";
import css from "./App.module.css";
const gist_ID = "69c73b41c0c513a711c5932e37a55f59";
const gist_URL = `https://gist.githubusercontent.com/j0nnylester/${gist_ID}/raw`;

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            bootcampers: [],
            bootcamper: "",
            facts: [],
            fact: "",
            isRevealed: false,
            reveal: "True"
        };
    }

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
            this.setState(state => ({
                fact: rfact,
                bootcamper: rbootcamper
            }));
        } else {
            this.setState(state => ({
                fact: "",
                bootcamper: ""
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
                    <h3 className={css.bootcamper}>{this.state.bootcamper}</h3>
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
                </header>
            </div>
        );
    }
}

export default App;
