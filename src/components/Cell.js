import React, { Component } from 'react'
import './Cell.css'

export class Cell extends Component {
    _handleClick = event => {
        if (!this.props.flagged && !this.props.visible) {
            this.props.handleClick(this.props.row, this.props.col)
        }
        return
    }

    _handleRightClick = event => {
        event.preventDefault()
        if (!this.props.visible) {
            this.props.handleRightClick(this.props.row, this.props.col)
        }
        return
    }

    render() {
        const style = this.props.visible ? { backgroundColor: 'lightgray' } : {}
        switch (this.props.bombCount) {
            case 1:
                style.color = 'blue'
                break
            case 2:
                style.color = 'green'
                break
            case 3:
                style.color = 'red'
                break
            case 4:
                style.color = 'darkblue'
                break
            case 5:
                style.color = 'maroon'
                break
            case 6:
                style.color = 'teal'
                break
            case 7:
                style.color = 'navy'
                break
            case 8:
                style.color = 'gray'
                break
            default:
                style.color = 'black'
        }

        if (this.props.exploded) style.backgroundColor = 'red'

        return (
            <div className="Cell-container">
                <div
                    className="text"
                    onClick={this._handleClick}
                    onContextMenu={this._handleRightClick}
                    style={style}
                >
                    {this.props.visible
                        ? this.props.val
                        : this.props.flagged
                        ? '🚩️'
                        : ''}
                </div>
            </div>
        )
    }
}

export default Cell
