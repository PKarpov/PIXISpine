import { Container, Application, utils } from 'pixi.js';
import SpineD from "./js/SpineD";

export default class Main {
	constructor() {
		Main.width = 1280;
		Main.height = 720;
		Main.tick = 'tick';
		Main.click = 'click';
		Main.observer = new utils.EventEmitter();

		const app = new PIXI.Application(1280, 720, { backgroundColor: 0x444444 });
		document.body.appendChild(app.view);
		app.stage.addChild(new PIXI.Graphics)
			.lineStyle(1, 0x777777)
			.moveTo(640,0)
			.lineTo(640,720)
			.moveTo(0,360)
			.lineTo(1280,360)

		document.addEventListener('click', this.clickListener.bind(this));
		app.ticker.add(this.update, this);
		this.main = app.stage.addChild(new SpineD());
	}

	clickListener(e) {
		const xy = this.main.toLocal({x: e.layerX, y: e.layerY});
		// this.hero.goTo(xy);
	}

	update(dt) {
	}
}

new Main();
