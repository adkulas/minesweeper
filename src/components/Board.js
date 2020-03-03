import React from 'react';
import './Board.css';
import Cell from './Cell';

export class Board extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            grid: this.createGrid(5),
            visible: this.createVisGrid(5),

        }
    }
    
    createVisGrid = (size) => {
        
        // initialize matrix
        let matrix = [];
        for(let i=0; i < size; i++) {
            matrix[i] = [];
            for(let j=0; j < size; j++) {
                matrix[i][j] = false;
            }
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
                for(let r=0; r<3; r++) {
                    if (i-1+r < 0 || i-1+r >= size) {
                        continue;
                    }
                    
                    for(let c=0; c<3; c++) {
                        if (j-1+c < 0 || j-1+c >= size ) {
                            continue;
                        }

                        if (matrix[i-1+r][j-1+c] === "💣") {
                            count++;
                        }
                    }
                }
                matrix[i][j] = count.toString();
            }
        }

        return matrix
    }

    reveal = (i, j) => {
        this.setState({grid: this.state.grid})
    } 

    render() {
        
        
        const cellsFlat = [].concat(...this.state.grid);   
        const cells = cellsFlat.map( item => <Cell {...this.state} /> );

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
