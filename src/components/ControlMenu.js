import React, { Component } from 'react'
import './ControlMenu.css'
import Timer from './Timer'
import ButtonGroup from '@material-ui/core/ButtonGroup'
import Button from '@material-ui/core/Button'
import AlarmIcon from '@material-ui/icons/Alarm'
import FlagTwoToneIcon from '@material-ui/icons/FlagTwoTone'

export class ControlMenu extends Component {
    _handleMode = event => {
        this.props.handleDifficultyChange(event.currentTarget.value)
        this.props.handleReset()
        return
    }

    render() {
        return (
            <ul className="Container">
                <li>
                    <ButtonGroup
                        variant="contained"
                        color="primary"
                        aria-label="contained primary button group"
                    >
                        <Button value="Easy" onClick={this._handleMode}>
                            Easy
                        </Button>
                        <Button value="Medium" onClick={this._handleMode}>
                            Medium
                        </Button>
                        <Button value="Hard" onClick={this._handleMode}>
                            Hard
                        </Button>
                    </ButtonGroup>
                </li>
                <li>
                    <div className="Container middle">
                        <div className="Container">
                            <FlagTwoToneIcon
                                color="secondary"
                                style={{ fontSize: '4rem' }}
                            />{' '}
                            {this.props.bombCount - this.props.flagCount}
                        </div>
                        <div className="Container">
                            <AlarmIcon
                                color="default"
                                style={{ fontSize: '4rem' }}
                            />
                            <Timer
                                gameStarted={this.props.gameStarted}
                                gameOver={this.props.gameOver}
                            />
                        </div>
                    </div>
                </li>
                <li>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={this.props.handleReset}
                    >
                        Reset
                    </Button>
                </li>
            </ul>
        )
    }
}

export default ControlMenu
