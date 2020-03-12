import React, { Component } from 'react'

export class Timer extends Component {
    constructor(props) {
        super(props)
        this.state = {
            time: new Date(),
            seconds: 0,
        }
    }

    componentDidMount() {
        this.timerId = setInterval(this.tick, 1000)
    }

    componentWillUnmount() {
        clearInterval(this.timerId)
    }

    tick = () => {
        this.setState(state => {
            if (this.props.gameStarted) {
                return {
                    time: new Date(),
                    seconds: state.seconds + 1,
                }
            } else {
                return {
                    time: new Date(),
                    seconds: 0,
                }
            }
        })
    }

    render() {
        return <div>{this.state.seconds}</div>
    }
}

export default Timer
