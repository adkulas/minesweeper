import React from 'react'
import './Board.css'
import Cell from './Cell'

export class Board extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            grid: this._initializeGrid(8),
        }
    }

    _initializeGrid = size => {
        const bombLocations = this._initBombs(5, size, size)

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
                    visible: false,
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
                matrix[i][j].val = count ? count.toString() : ''
            }
        }
    }

    _reveal = (grid, i, j, visited) => {
        grid[i][j].visible = true
        visited.add([i, j].toString())
        if (grid[i][j].bombCount > 0 || grid[i][j].isBomb) {
            return
        }

        const height = grid.length
        const width = grid[0].length
        for (let r = 0; r < 3; r++) {
            if (i - 1 + r < 0 || i - 1 + r >= height) {
                continue
            }

            for (let c = 0; c < 3; c++) {
                if (j - 1 + c < 0 || j - 1 + c >= width) {
                    continue
                }

                if (
                    !visited.has([i - 1 + r, j - 1 + c].toString()) &&
                    grid[i - 1 + r][j - 1 + c].visible === false &&
                    grid[i - 1 + r][j - 1 + c].flagged === false
                ) {
                    this._reveal(grid, i - 1 + r, j - 1 + c, visited)
                }
            }
        }
        return
    }

    handleClick = (row, col) => {
        this.setState(state => {
            const newGrid = this.state.grid.map((arr, i) =>
                arr.map((cell, j) => ({ ...cell }))
            )
            this._reveal(newGrid, row, col, new Set())

            return {
                ...state,
                grid: newGrid,
            }
        })
    }

    handleRightClick = (row, col) => {
        this.setState(state => {
            const newGrid = this.state.grid.map((arr, i) =>
                arr.map((cell, j) => ({ ...cell }))
            )
            newGrid[row][col].flagged = !newGrid[row][col].flagged
            return {
                ...state,
                grid: newGrid,
            }
        })
    }

    render() {
        const cellsFlat = [].concat(...this.state.grid)
        const cells = cellsFlat.map((item, i) => (
            <Cell
                key={i}
                {...item}
                handleClick={this.handleClick}
                handleRightClick={this.handleRightClick}
            />
        ))

        return (
            <div className="Board">
                {/* 
                                        <Controls />
                                        <Grid />
                                         */}
                {/* <Cell /> */}
                <div className="Grid"> {cells} </div>
            </div>
        )
    }
}

export default Board
