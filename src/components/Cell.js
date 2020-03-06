import React, { Component } from 'react'
import './Cell.css'

export class Cell extends Component {
    constructor(props) {
        super(props)
    }

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
        if (this.props.exploded) style.backgroundColor = 'red'

        return (
            <button
                className="Cell"
                onClick={this._handleClick}
                onContextMenu={this._handleRightClick}
                style={style}
            >
                {this.props.visible
                    ? this.props.val
                    : this.props.flagged
                    ? '🚩️'
                    : ''}
            </button>
        )
    }
}

export default Cell
