import React, { Component } from 'react'
import './ControlMenu.css'

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
                    <button value="Easy" onClick={this._handleMode}>
                        Easy
                    </button>

                    <button value="Medium" onClick={this._handleMode}>
                        Medium
                    </button>
                    <button value="Hard" onClick={this._handleMode}>
                        Hard
                    </button>
                </li>
                <li>
                    <span>
                        '🚩️' {this.props.bombCount - this.props.flagCount}
                    </span>
                    <span>Timer</span>
                </li>
                <li>
                    <button onClick={this.props.handleReset}>Reset</button>
                </li>
            </ul>
        )
    }
}

export default ControlMenu
