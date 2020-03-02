import React, { Component } from 'react'
import './Cell.css';

export class Cell extends Component {
    constructor(props) {
        super(props);


    }
    
    render() {
        return (
            <div className="Cell">
                {this.props.number}
            </div>
        )
    }
}

export default Cell
