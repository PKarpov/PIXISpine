import { Container, Application, utils } from 'pixi.js';
import Hero from "./js/Hero";

export default class Main {
	constructor() {
		Main.width = 800;
		Main.height = 400;
		Main.tick = 'tick';
		Main.click = 'click';
        Main.observer = new utils.EventEmitter();
        const app = new Application({width: Main.width, height: Main.height, backgroundColor: 0x1099bb});
		document.body.appendChild(app.view);
		document.addEventListener('click', this.clickListener.bind(this));
		app.ticker.add(this.update, this);
		this.main = app.stage.addChild(new Container());
		this.hero = this.main.addChild(new Hero());
	}

	clickListener(e) {
		const xy = this.main.toLocal({x: e.layerX, y: e.layerY});
		this.hero.goTo(xy);
	}

	update(dt) {
	}
}

new Main();
