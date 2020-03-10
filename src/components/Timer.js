import React, { Component } from 'react'

export class Timer extends Component {
    constructor(props) {
        super(props)
        this.state = {
            time: new Date(),
        }
    }

    componentDidMount() {
        this.timerId = setInterval(
            this.setState(() => this.tick()),
            1000
        )
    }

    componentWillUnmount() {
        clearInterval(this.timerId)
    }

    tick = () => {
        this.setState({
            time: new Date(),
        })
    }

    render() {
        return <div>{this.state.time.toLocaleTimeString}</div>
    }
}

export default Timer
