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

    return <Container style={{
        background: "#2a2a2a",
        color: "#FFF",
        gap: 5,
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        height: '100%',
        width: '100%',
        position: 'relative',
    }} onKeyUp={onKey}>
        <Row style={{
            flex: 1,
            alignItems: 'center',
            paddingLeft: 6,
        }}>
            成绩：<Label ref={gameScoreRef} style={{color: '#F00'}} text="0" />
        </Row>
        <Container ref={gameContainer} style={{
            position: 'relative',
            width: 400,
            height: 400,
            background: '#000',
        }} onBoundsChange={onBoundsChange}></Container>
        <Container style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 20,
            background: '#0008',
            display: gameStatus == "Unstart" || gameStatus == "GameOver" ? "flex" : "none",
        }}>
            <Container style={{
                alignItems: 'center',
                display: gameStatus == "Unstart" ? "flex" : "none",
            }}>
                <Row style={{
                    fontSize: 36,
                    padding: '20 0',
                    color: '#56A8F5',
                }}>贪吃蛇</Row>
                <Row>A或← 向左</Row>
                <Row>W或↑ 向上</Row>
                <Row>D或→ 向右</Row>
                <Row>S或↓ 向下</Row>
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
                    成绩：<Label style={{color: '#F00'}} text={String(finalScore)} />
                </Row>
            </Container>
            <Button
                style={{
                    borderRadius: 8,
                    padding: '10 20'
                }}
                onClick={onStart}
            >
                {gameStatus == "Unstart" ? "立即开始" : "再来一局"}
            </Button>
        </Container>
    </Container>
}
