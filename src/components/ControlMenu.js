import React, { PureComponent } from 'react'
import './ControlMenu.css'

export default class ControlMenu extends PureComponent {
    render() {
        return (
            <ul className="Container">
                <li>
                    <button>Easy</button>
                    <button>Medium</button>
                    <button>Hard</button>
                </li>
                <li>
                    <span>Flags</span>
                    <span>Timer</span>
                </li>
                <li>
                    <button>Reset</button>
                </li>
            </ul>
        )
    }
}
