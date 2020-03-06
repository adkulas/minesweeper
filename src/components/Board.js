import React from 'react'
import './Board.css'
import Cell from './Cell'
import ControlMenu from './ControlMenu'

export class Board extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            grid: this._initializeGrid({
                mode: 'Easy',
                bombs: 10,
                size: { rows: 10, cols: 10 },
            }),
            gameStarted: false,
            gameOver: false,
            win: false,
            flagCount: 0,
            difficulty: {
                mode: 'Easy',
                bombs: 10,
                size: { rows: 10, cols: 10 },
            },
        }
    }

    _initializeGrid = difficulty => {
        // initialize grid
        let grid = []
        const rows = difficulty.size.rows
        const cols = difficulty.size.cols
        for (let i = 0; i < rows; i++) {
            grid[i] = []
            for (let j = 0; j < cols; j++) {
                grid[i][j] = {
                    val: '',
                    isBomb: false,
                    row: i,
                    col: j,
                    visible: false,
                    flagged: false,
                    bombCount: 0,
                    exploded: false,
                }
            }
        }
        return grid
    }

    _initializeGridOLD = difficulty => {
        const bombLocations = this._initBombs(
            difficulty.bombs,
            difficulty.size.rows,
            difficulty.size.cols
        )

        // initialize grid
        let grid = []
        const rows = difficulty.size.rows
        const cols = difficulty.size.cols
        for (let i = 0; i < rows; i++) {
            grid[i] = []
            for (let j = 0; j < cols; j++) {
                grid[i][j] = {
                    val: '',
                    isBomb: false,
                    row: i,
                    col: j,
                    visible: false,
                    flagged: false,
                    bombCount: 0,
                    exploded: false,
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

    _initBombs = (firstClick, difficulty) => {
        // place mines
        const bombLocations = new Set()
        const result = []
        bombLocations.add([firstClick.row, firstClick.col].toString())

        while (bombLocations.size - 1 < difficulty.bombCount) {
            let r = Math.floor(Math.random() * difficulty.size.rows)
            let c = Math.floor(Math.random() * difficulty.size.cols)

            if (!bombLocations.has([r, c].toString())) {
                bombLocations.add([r, c].toString())
                result.push([r, c])
            }
        }

        return result
    }

    _initCountsOLD = matrix => {
        // loops through cells, at each cell count number of bombs around
        for (let i = 0; i < matrix.length; i++) {
            for (let j = 0; j < matrix[i].length; j++) {
                if (matrix[i][j].isBomb) {
                    continue
                }

                // count all bombs around cell
                let count = 0
                for (let r = 0; r < 3; r++) {
                    if (i - 1 + r < 0 || i - 1 + r >= matrix.length) {
                        continue
                    }

                    for (let c = 0; c < 3; c++) {
                        if (j - 1 + c < 0 || j - 1 + c >= matrix[i].length) {
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

    _initCounts = (grid, bombLocations) => {
        const updatedGrid = grid.map(row => row.map(cell => ({ ...cell })))

        for (let loc of bombLocations) {
        }

        return updatedGrid
    }

    _reveal = (grid, i, j, visited) => {
        grid[i][j].visible = true
        visited.add([i, j].toString())
        if (grid[i][j].bombCount > 0) return
        if (grid[i][j].isBomb) {
            grid[i][j].exploded = true
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

    _checkGameStatus = (grid, difficulty) => {
        let visibleCells = 0

        for (let row of grid) {
            for (let cell of row) {
                if (cell.exploded) return { gameOver: true, win: false }

                if (cell.visible) visibleCells++
            }
        }

        let totalFreeCells =
            difficulty.size.rows * difficulty.size.cols - difficulty.bombs
        if (visibleCells === totalFreeCells)
            return { gameOver: true, win: false }

        return { gameOver: false, win: false }
    }

    _revealBombs = grid => {
        grid.forEach(row =>
            row.forEach(cell => {
                if (cell.isBomb) {
                    cell.visible = true
                }
                return
            })
        )
    }

    _flagBombs = grid => {
        grid.forEach(row =>
            row.forEach(cell => {
                if (cell.isBomb) {
                    cell.flagged = true
                }
                return
            })
        )
    }

    startGame = (row, col) => {
        // set state for new grid where clicked spot must not be a bomb

        this.setState(state => {
            const bombLocations = this._initBombs(
                { row: row, col: col },
                state.difficulty
            )
        })
    }

    handleClick = (row, col) => {
        if (this.state.gameOver) {
            return
        }

        if (!this.state.gameStarted) {
            this.startGame(row, col)
            // add bombs
            // add counts
        }

        this.setState(state => {
            const newGrid = this.state.grid.map((arr, i) =>
                arr.map((cell, j) => ({ ...cell }))
            )

            this._reveal(newGrid, row, col, new Set())
            let gameStatus = this._checkGameStatus(newGrid, state.difficulty)

            if (gameStatus.gameOver) {
                gameStatus.win
                    ? this._flagBombs(newGrid)
                    : this._revealBombs(newGrid)
            }

            return {
                ...state,
                grid: newGrid,
                gameOver: gameStatus.gameOver,
                win: gameStatus.win,
            }
        })
    }

    handleRightClick = (row, col) => {
        if (this.state.gameOver) {
            return
        }
        this.setState(state => {
            const newGrid = this.state.grid.map((arr, i) =>
                arr.map((cell, j) => ({ ...cell }))
            )
            let flagVal = 0

            // no flag on cell and flags are available
            if (
                !newGrid[row][col].flagged &&
                state.flagCount < state.difficulty.bombs
            ) {
                newGrid[row][col].flagged = !newGrid[row][col].flagged
                flagVal = 1
            }

            // no flag on cell but no flags available
            else if (
                !newGrid[row][col].flagged &&
                state.flagCount >= state.difficulty.bombs
            ) {
                // do nothing
            }

            // remove a flag
            else {
                newGrid[row][col].flagged = !newGrid[row][col].flagged
                flagVal = -1
            }

            console.log(state.flagCount, flagVal)
            return {
                ...state,
                grid: newGrid,
                flagCount: state.flagCount + flagVal,
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

        const style = {
            gridTemplateRows: `repeat(${this.state.difficulty.size.rows}, 50px)`,
            gridTemplateColumns: `repeat(${this.state.difficulty.size.cols}, 50px)`,
        }

        return (
            <div>
                <div className="Board">
                    <ControlMenu />
                    <div className="Grid" style={style}>
                        {' '}
                        {cells}{' '}
                    </div>
                </div>
            </div>
        )
    }
}

export default Board
