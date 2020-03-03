import React, { Component } from 'react'
import './Cell.css'

export class Cell extends Component {
    constructor(props) {
        super(props)
    }

    _handleClick = event => {
        this.props.handleClick(this.props.row, this.props.col)
    }

    render() {
        return (
            <button className="Cell" onClick={this._handleClick}>
                {this.props.visible ? this.props.val : ''}
            </button>
        )
    }
}

export default Cell
