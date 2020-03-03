import React from 'react'
import './Board.css'
import Cell from './Cell'

export class Board extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            // grid: [],
            grid: this._initializeGrid(5),
        }
    }

    _initializeGrid = size => {
        const bombLocations = this._initBombs(size, size, size)

        // initialize grid
        let grid = []
        for (let i = 0; i < size; i++) {
            grid[i] = []
            for (let j = 0; j < size; j++) {
                grid[i][j] = {
                    val: '',
                    isBomb: false,
                    row: i,
                    col: j,
                    visible: true,
                    flagged: false,
                    bombCount: 0,
                }

                if (bombLocations.has([i, j].toString())) {
                    grid[i][j].isBomb = true
                    grid[i][j].val = '💣'
                }
            }
        }
        this._initCounts(grid)
        return grid
    }

    _initBombs = (numMines, numRows, numCols) => {
        // place mines
        const bombLocations = new Set()
        while (bombLocations.size < numMines) {
            let r = Math.floor(Math.random() * numRows)
            let c = Math.floor(Math.random() * numCols)

            if (!bombLocations.has([r, c].toString())) {
                bombLocations.add([r, c].toString())
            }
        }

        return bombLocations
    }

    _initCounts = matrix => {
        // loops through cells, at each cell count number of bombs around
        let size = matrix.length
        for (let i = 0; i < matrix.length; i++) {
            for (let j = 0; j < matrix.length; j++) {
                if (matrix[i][j].isBomb) {
                    continue
                }

                // count all bombs around cell
                let count = 0
                for (let r = 0; r < 3; r++) {
                    if (i - 1 + r < 0 || i - 1 + r >= size) {
                        continue
                    }

                    for (let c = 0; c < 3; c++) {
                        if (j - 1 + c < 0 || j - 1 + c >= size) {
                            continue
                        }

                        if (matrix[i - 1 + r][j - 1 + c].isBomb) {
                            count++
                        }
                    }
                }
                matrix[i][j].bombCount = count
                matrix[i][j].val = count.toString()
            }
        }
    }

    handleClick = (row, col) => {
        // alert('Hello')
        console.log(row, col)
        this.setState({
            grid: this.state.grid.map((row, i) =>
                row.map((cell, j) => {
                    const result = { ...cell }
                    if (row === i && col === j) {
                        result.visible = false
                    }
                    console.log(i, j)
                    return result
                })
            ),
        })
    }

    render() {
        const cellsFlat = [].concat(...this.state.grid)
        const cells = cellsFlat.map((item, i) => (
            <Cell key={i} {...item} handleClick={this.handleClick} />
        ))

        return (
            <div className="Board">
                {/* 
                                        <Controls />
                                        <Grid />
                                         */}
                {/* <Cell /> */}
                <div className="Grid"> {cells} </div>{' '}
            </div>
        )
    }
}

export default Board
