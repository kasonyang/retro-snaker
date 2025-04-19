import {Segment} from "./snaker-game";


export class SimpleGameRenderer {
    private readonly container: ContainerElement;
    private segmentElements: ContainerElement[] = [];
    private foodEl: ContainerElement;

    constructor(container: ContainerElement) {
        this.container = container;
        const foodEl = this.foodEl = new ContainerElement();
        foodEl.class = "food";
        container.addChild(foodEl);
    }

    render(segments: Segment[], food: Segment) {
        const snakeElements = this.segmentElements;
        const gameContainer = this.container;
        while (snakeElements.length < segments.length) {
            const el = new ContainerElement();
            el.class = "segment";
            gameContainer.addChild(el);
            snakeElements.push(el);
        }
        while (snakeElements.length > segments.length) {
            let el = snakeElements.pop();
            gameContainer.removeChild(el);
        }
        // Render snake segments
        for (let i = 0; i < segments.length; i++) {
            const {x, y} = segments[i];
            snakeElements[i].style = {
                transform: `translate(${x}, ${y})`,
            }
        }
        // Render food
        this.foodEl.style = {
            transform: `translate(${food.x}, ${food.y})`,
        }
    }

}