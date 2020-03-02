import React from 'react';
import './Board.css';
import Cell from './Cell';

export class Board extends React.Component {
    render() {
        return (
            <div className="Board">
                
                {/* 
                <Controls />
                <Grid />
                 */}

                {/* <Cell /> */}
                
                <div className="Grid">
                    <Cell number={1} />
                    <Cell number={2} />
                    <Cell number={3} />
                    <Cell number={4} />
                    <Cell number={5} />
                    <Cell number={6} />
                    <Cell number={7} />
                    <Cell number={8} />
                    <Cell number={9} />
                </div>
            </div>
        )
    }
}

export default Board
