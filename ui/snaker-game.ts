export interface Segment {
    x: number,
    y: number,
}

type GameStatus = "Unstart" | "Playing" | "GameOver"

export interface SnakeGameState {
    segments: Segment[],
    food: Segment,
    status: GameStatus,
    score: number,
}

export interface SnakeRenderer {
    (state: SnakeGameState);
}

export interface SnakerGameOptions {
    width: number,
    height: number,
    renderer: SnakeRenderer,
}

export class SnakerGame {
    private snake: Segment[] = [
        {x: 10, y: 10}
    ];
    private food: Segment = {x: 15, y: 15};
    private dx = 0;
    private dy = 0;
    private score = 0;
    private gameLoop: any;
    private rows: number;
    private columns: number;
    private gridSize: number;
    private status: GameStatus = "Unstart";
    private renderer: SnakeRenderer;


    constructor(options: SnakerGameOptions) {
        this.gridSize = 10;
        this.rows = options.height / this.gridSize;
        this.columns = options.width / this.gridSize;
        this.renderer = options.renderer;
    }

    onKey(event: IKeyEvent) {
        let {dy, dx} = this;

        const keyPressed = event.detail.key;
        const goingUp = dy === -1;
        const goingDown = dy === 1;
        const goingRight = dx === 1;
        const goingLeft = dx === -1;
        console.log("key", keyPressed);

        if (["ArrowLeft", "a"].includes(keyPressed) && !goingRight) {
            dx = -1;
            dy = 0;
        }
        if (["ArrowUp", "w"].includes(keyPressed) && !goingDown) {
            dx = 0;
            dy = -1;
        }
        if (["ArrowRight", "d"].includes(keyPressed) && !goingLeft) {
            dx = 1;
            dy = 0;
        }
        if (["ArrowDown", "s"].includes(keyPressed) && !goingUp) {
            dx = 0;
            dy = 1;
        }
        this.dx = dx;
        this.dy = dy;
    }

    startGame() {
        console.log("Game started");
        this.status = "Playing";
        this.snake = [{x: 10, y: 10}];
        this.dx = 1;
        this.dy = 0;
        this.score = 0;
        this.gameLoop = setInterval(() => {
            try {
                this.update();
            } catch (error) {
                console.error('update error', error);
            }
        }, 150);
    }

    gameOver() {
        //ToDO remove timeout
        setTimeout(() => {
            clearInterval(this.gameLoop);
        }, 0);

        // alert(`游戏结束！得分: ${score}`);
        // 重置游戏

        //document.getElementById('score').textContent = `得分: ${score}`;
        console.log("gate over");
        this.status = "GameOver";
        this.render();
    }

    update() {
        // console.log("updating");
        const {snake, dx, dy, rows, columns, food} = this;

        // 移动蛇
        const head = {x: snake[0].x + dx, y: snake[0].y + dy};

        // 检查边界碰撞
        if (head.x < 0 || head.x >= columns || head.y < 0 || head.y >= rows) {
            this.gameOver();
            return;
        }

        // 检查自身碰撞
        for (let i = 0; i < snake.length; i++) {
            if (head.x === snake[i].x && head.y === snake[i].y) {
                this.gameOver();
                return;
            }
        }

        snake.unshift(head);

        // 检查是否吃到食物
        if (head.x === food.x && head.y === food.y) {
            this.score += 10;
            // document.getElementById('score').textContent = `得分: ${score}`;
            this.generateFood();
        } else {
            snake.pop();
        }
        this.render();
    }

    render() {
        const {food, snake, gridSize} = this;
        const segments: Segment[] = snake.map(it => ({
            x: it.x * gridSize,
            y: it.y * gridSize,
        }));

        const foodSeg: Segment = {
            x: food.x * gridSize,
            y: food.y * gridSize,
        };
        const state: SnakeGameState = {
            segments,
            food: foodSeg,
            status: this.status,
            score: this.score,
        };
        (this.renderer)(state);
    }

    generateFood() {
        const food = this.food = {
            x: Math.floor(Math.random() * this.columns),
            y: Math.floor(Math.random() * this.rows)
        };
        // 检查食物是否生成在蛇身上
        this.snake.forEach(segment => {
            if (segment.x === food.x && segment.y === food.y) {
                this.generateFood();
            }
        });
    }

}