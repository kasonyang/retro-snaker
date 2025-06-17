import "./app.css"
import {Button, Container, Label, Row} from "deft-react";
import {useEffect, useRef, useState} from "react";
import {SnakerGame} from "./snaker-game";
import {SimpleGameRenderer} from "./simple-game-renderer";

type GameState = "Unstart" | "Playing" | "GameOver"

export function App() {
    const gameContainer = useRef<ContainerElement>();
    const gameInstance = useRef<SnakerGame>();
    const gameScoreRef = useRef<LabelElement>();
    const [gameStatus, setGameStatus] = useState<GameState>("Unstart");
    const [finalScore, setFinalScore] = useState(0);

    function onBoundsChange(e: IBoundsChangeEvent) {
        if (!gameInstance.current) {
            const renderer = new SimpleGameRenderer(gameContainer.current);
            const rect = e.detail.originBounds;
            console.log('rect', rect);
            gameInstance.current = new SnakerGame({
                width: rect.width,
                height: rect.height,
                renderer(state) {
                    renderer.render(state.segments, state.food);
                    setGameStatus(state.status);
                    const scoreRef = gameScoreRef.current;
                    if (scoreRef) {
                        scoreRef.text = String(state.score);
                    }
                    if (state.status == "GameOver") {
                        setFinalScore(state.score);
                    }
                }
            });
        }
    }

    function onStart() {
        gameInstance.current.startGame();
    }

    function onKey(e: IKeyEvent) {
        console.log("onKey");
        gameInstance.current.onKey(e);
    }

    const keyMap = [
        {key: ["A", "ArrowLeft"], desc: "Left"},
        {key: ["W", "ArrowUp"], desc: "Up"},
        {key: ["D", "ArrowRight"], desc: "Right"},
        {key: ["S", "ArrowDown"], desc: "Down"},
    ]
    const rules = keyMap.map((r) => {
        return <Row key={r.desc}>
            <Row className="key-tip">
                <Row className="key-key">{r.key[0]}</Row> or <Row className="key-key">{r.key[1]}</Row>
            </Row>
            <Row className="key-desc">{r.desc}</Row>
        </Row>
    });

    return <Container className="main" onKeyUp={onKey}>
        <Row className="score">
            Score：<Label ref={gameScoreRef} className="red" text="0" />
        </Row>
        <Container ref={gameContainer} className="game-container" onBoundsChange={onBoundsChange}></Container>
        <Container className="welcome-container" style={{
            display: gameStatus == "Unstart" || gameStatus == "GameOver" ? "flex" : "none",
        }}>
            <Container style={{
                alignItems: 'center',
                display: gameStatus == "Unstart" ? "flex" : "none",
            }}>
                <Row className="game-title">Retro Snaker</Row>
                {rules}
            </Container>
            <Container style={{
                alignItems: 'center',
                display: gameStatus == "GameOver" ? "flex" : "none",
                width: '100%',
            }}>
                <Row style={{fontSize: 32}}>
                    Game Over
                </Row>
                <Row style={{fontSize: 32}}>
                    Score：<Label style={{color: '#F00'}} text={String(finalScore)} />
                </Row>
            </Container>
            <Button
                style={{
                    borderRadius: 8,
                    padding: '10 20'
                }}
                onClick={onStart}
            >
                {gameStatus == "Unstart" ? "Start" : "Try Again"}
            </Button>
        </Container>
    </Container>
}
