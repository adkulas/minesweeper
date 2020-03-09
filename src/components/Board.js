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
                size: { rows: 9, cols: 9 },
            }),
            gameStarted: false,
            gameOver: false,
            win: false,
            flagCount: 0,
            difficulty: {
                mode: 'Easy',
                bombs: 10,
                size: { rows: 9, cols: 9 },
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

    _initBombs = (firstClick, difficulty) => {
        // place mines
        const bombLocations = new Set()
        const result = []

        // block off square around first click
        for (let i = firstClick.row - 1; i <= firstClick.row + 1; i++) {
            for (let j = firstClick.col - 1; j <= firstClick.col + 1; j++) {
                bombLocations.add([i, j].toString())
            }
        }
        // bombLocations.add([firstClick.row, firstClick.col].toString())

        while (bombLocations.size - 9 < difficulty.bombs) {
            let r = Math.floor(Math.random() * difficulty.size.rows)
            let c = Math.floor(Math.random() * difficulty.size.cols)

            if (!bombLocations.has([r, c].toString())) {
                bombLocations.add([r, c].toString())
                result.push([r, c])
            }
        }

        return result
    }

    _initCounts = (grid, bombLocations) => {
        const updatedGrid = grid.map(row => row.map(cell => ({ ...cell })))

        for (let loc of bombLocations) {
            let i = loc[0]
            let j = loc[1]

            grid[i][j].isBomb = true
            grid[i][j].bombCount = 0
            grid[i][j].val = '💣'

            // add count around each bomb
            for (let r = 0; r < 3; r++) {
                if (i - 1 + r < 0 || i - 1 + r >= grid.length) {
                    continue
                }

                for (let c = 0; c < 3; c++) {
                    if (j - 1 + c < 0 || j - 1 + c >= grid[i].length) {
                        continue
                    }
                    if (grid[i - 1 + r][j - 1 + c].isBomb) {
                        continue
                    }
                    grid[i - 1 + r][j - 1 + c].bombCount++
                    grid[i - 1 + r][j - 1 + c].val = grid[i - 1 + r][
                        j - 1 + c
                    ].bombCount.toString()
                }
            }
        }

        return updatedGrid
    }

    _reveal = (grid, i, j, visited) => {
        grid[i][j].visible = true
        visited.add([i, j].toString())
        if (grid[i][j].isBomb) {
            grid[i][j].exploded = true
            return
        } else if (grid[i][j].bombCount > 0) return

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
            const newGrid = this._initCounts(state.grid, bombLocations)
            return { ...state, gameStarted: true, grid: newGrid }
        })
    }

    handleClick = (row, col) => {
        if (this.state.gameOver) {
            return
        }

        if (!this.state.gameStarted) {
            this.startGame(row, col)
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

    handleReset = () => {
        this.setState(state => ({
            ...state,
            grid: this._initializeGrid(state.difficulty),
            gameStarted: false,
            gameOver: false,
            win: false,
            flagCount: 0,
        }))
    }

    handleDifficultyChange = mode => {
        let difficulty = {}
        switch (mode) {
            case 'Easy':
                difficulty = {
                    mode: 'Easy',
                    bombs: 10,
                    size: { rows: 9, cols: 9 },
                }
                break

            case 'Medium':
                difficulty = {
                    mode: 'Easy',
                    bombs: 40,
                    size: { rows: 16, cols: 16 },
                }
                break

            case 'Hard':
                difficulty = {
                    mode: 'Hard',
                    bombs: 99,
                    size: { rows: 30, cols: 16 },
                }
                break

            default:
                difficulty = {
                    mode: 'Easy',
                    bombs: 10,
                    size: { rows: 9, cols: 9 },
                }
        }

        this.setState(state => {
            return { ...state, difficulty: difficulty }
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
        console.log(cells.length)

        const style = {
            gridTemplateRows: `repeat(${this.state.difficulty.size.rows}, minmax(30px, 1fr))`,
            gridTemplateColumns: `repeat(${this.state.difficulty.size.cols}, minmax(30px, 1fr))`,
            maxWidth: `${this.state.difficulty.size.cols * 80}px`,
        }

        return (
            <div>
                <div className="Board">
                    <ControlMenu
                        handleReset={this.handleReset}
                        handleDifficultyChange={this.handleDifficultyChange}
                        flagCount={this.state.flagCount}
                        bombCount={this.state.difficulty.bombs}
                    />
                    <div className="Grid-container" style={style}>
                        {' '}
                        {cells}{' '}
                    </div>
                </div>
            </div>
        )
    }
}

export default Board
