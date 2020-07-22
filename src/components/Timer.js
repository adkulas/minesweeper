import React, { Component } from 'react'

export class Timer extends Component {
    constructor(props) {
        super(props)
        this.state = {
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
        this.setState((state, props) => {
            if (props.gameStarted && !props.gameOver) {
                return {
                    seconds: state.seconds + 1,
                }
            } else if (props.gameOver) {
                return
            } else {
                return {
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
