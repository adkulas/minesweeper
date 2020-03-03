import React, { Component } from 'react'
import './Cell.css';

export class Cell extends Component {
    constructor(props) {
        super(props);


    }
    
    render() {
        return (
            <button className="Cell">
                {this.props.grid[0][0]}
            </button>
        )
    }
}

export default Cell
