import React from 'react';
import './Board.css';
import Cell from './Cell';

export class Board extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            temp: "Test",
            grid: this.createGrid(5)
        }
    }
    
    createGrid = (size) => {
        
        // initialize matrix
        let matrix = [];
        for(let i=0; i < size; i++) {
            matrix[i] = [];
            for(let j=0; j < size; j++) {
                matrix[i][j] = "";
            }
        }

        // place mines
        let numMines = size;
        while (numMines > 0) {
            let r = Math.floor(Math.random()*size);
            let c = Math.floor(Math.random()*size);
            
            if (matrix[r][c] === "") {
                matrix[r][c] = "💣";
                numMines--;
            }
        }
        
        // label cells

        // loops through cells, at each cell count number of bombs around
        for(let i=0; i < matrix.length; i++) {
            for(let j=0; j < matrix.length; j++) {
                
                if (matrix[i][j] == "💣") {
                    continue;
                }

                // count all bombs around cell
                let count = 0;
                for(let r=i-1; r<=i+1; r++) {
                    if (r<0 || r>=size) {
                        continue;
                    }
                    
                    for(let c=j-1; c<=j+1; j++) {
                        if (c<0 || c>size) {
                            continue;
                        }

                        if (matrix[r][c] === "💣") {
                            count++;
                        }
                    }

                }
                matrix[i][j] = count;
            }
        }


        return matrix
    }

    render() {
        
        
        const cellsFlat = [].concat(...this.state.grid);   
        const cells = cellsFlat.map( item => <Cell number={item} /> )

        return (
            <div className="Board">
                
                {/* 
                <Controls />
                <Grid />
                 */}

                {/* <Cell /> */}
                 
                <p>{this.state.grid.length}</p>
                <p>{cellsFlat.length}</p>
                <p>{Math.random()}</p>
                <div className="Grid">
                        {cells}
                </div>
            </div>
        )
    }
}

export default Board
