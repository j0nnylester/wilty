import React from "react";
import css from "./Score.module.css";

const Score = props => {
    return (
        <div className={css.container}>
            <div className={css.team}>{`Team ${props.team
                .charAt(0)
                .toUpperCase() + props.team.slice(1)}`}</div>
            <div className={css.score}>
                <div className={css.buttons}>
                    <button
                        className={css.button}
                        onClick={() => props.changeScore(props.team, +1)}
                    >
                        +
                    </button>
                    <button
                        className={css.button}
                        onClick={() => props.changeScore(props.team, -1)}
                    >
                        -
                    </button>
                </div>
                <div className={css.scoretext}>{props.score}</div>
            </div>
        </div>
    );
};

export default Score;
