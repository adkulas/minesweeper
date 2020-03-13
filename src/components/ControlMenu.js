import React, { Component } from 'react'
import './ControlMenu.css'
import Timer from './Timer'

export class ControlMenu extends Component {
    _handleMode = event => {
        this.props.handleDifficultyChange(event.target.value)
        this.props.handleReset()
        return
    }

    render() {
        return (
            <ul className="Container">
                <li>
                    <button
                        className="button"
                        value="Easy"
                        onClick={this._handleMode}
                    >
                        Easy
                    </button>

                    <button
                        className="button"
                        value="Medium"
                        onClick={this._handleMode}
                    >
                        Medium
                    </button>
                    <button
                        className="button"
                        value="Hard"
                        onClick={this._handleMode}
                    >
                        Hard
                    </button>
                </li>
                <li>
                    <div className="Container middle">
                        <span>
                            '🚩️' {this.props.bombCount - this.props.flagCount}
                        </span>
                        <span>
                            <Timer
                                gameStarted={this.props.gameStarted}
                                gameOver={this.props.gameOver}
                            />
                        </span>
                    </div>
                </li>
                <li>
                    <button className="button" onClick={this.props.handleReset}>
                        Reset
                    </button>
                </li>
            </ul>
        )
    }
}

export default ControlMenu
