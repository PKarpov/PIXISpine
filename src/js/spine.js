var app = new PIXI.Application(1280, 720, { backgroundColor: 0x111111 });
document.body.appendChild(app.view);
app.stage.addChild(new PIXI.Graphics)
    .lineStyle(1, 0x999999)
    .moveTo(640,0)
    .lineTo(640,720)
    .moveTo(0,360)
    .lineTo(1280,360)

var spineBox0 = app.stage.addChild(new PIXI.Container());
var spineBox1 = app.stage.addChild(new PIXI.Container());
var selectBox = app.stage.addChild(new PIXI.Container());
var spine0;
var spine1;

function loadSpine() {
    if (old.spinebt) {
        app.stop();
        while (spineBox0.children.length) {
            spineBox0.removeChildAt(0);
        }
        while (spineBox1.children.length) {
            spineBox1.removeChildAt(0);
        }
        PIXI.loader.destroy();
        var url0 = './art/spine/egypt/' + old.spinebt.text + '.json';
        var url1 = './art/spine/dragon/' + old.spinebt.text + '.json';
        PIXI.loader
            .add(('spin0_' + id), url0)
            .add(('spin1_' + id), url1)
            .load(onAssetsLoaded);
    }
}

// loadSpine('egypt');


var spine;
var id = 0;
var txt;
var old = {
    anim: null,
    game: null,
    spine: null,
    spinebt: null
};

var style = {
    fontFamily: 'Calibri',
    fontWeight: 'bold',
    fontSize: 20,
    fill: '#ffffff'
};
var games = ['egypt', 'dragon'];
while (games.length) {
    selectBox.addChild(getButton(games.shift(), 20, (300 + games.length * 30), selectGame, 24));
}

games = ['additional_bw', 'anticipation', 'fire_transition', 'game_popups', 'mask_bonus_fire', 'scatter_anticipation'];
while (games.length) {
    selectBox.addChild(getButton(games.shift(), 20, (400 + games.length * 30), newSpine));
}

function selectGame(e) {
    var game = e.currentTarget.text;
    console.log(game)
    if (game === 'egypt') {
        spineBox0.visible = true;
        spineBox1.visible = false;
        selectBox.children[0].style.fill = '#ff6f00';
        selectBox.children[1].style.fill = '#ffffff';
        old.spine = spine0;
    } else {
        spineBox0.visible = false;
        spineBox1.visible = true;
        selectBox.children[0].style.fill = '#ffffff';
        selectBox.children[1].style.fill = '#ff6f00';
        old.spine = spine1;
    }
    if (old.anim) {
        old.anim.style.fill = '#ffffff';
        old.anim = null;
    }
}

function newSpine(e) {
    var bt = e.currentTarget;
    if (old.spinebt) old.spinebt.style.fill = '#ffffff';
    old.spinebt = bt;
    bt.style.fill = '#ff6f00';
    loadSpine();
}

function onDown(e) {
    if (old.anim) old.anim.style.fill = '#ffffff';
    old.anim = e.currentTarget;
    old.anim.style.fill = '#ff6f00';
    if ( old.spine ) old.spine.state.addAnimation(0, e.currentTarget.text, false, 0);
}

function onAssetsLoaded(loader, res) {
    var data0 = res['spin0_' + id];
    var data1 = res['spin1_' + id++];

    try {
        // console.log(res);
        // console.log(dataR);
        // console.log('spineData =', dataR.spineData || 'undefined');
        // console.log('data =', dataR.data || 'undefined');
        spine0 = new PIXI.spine.Spine(data0.spineData);
        spine1 = new PIXI.spine.Spine(data1.spineData);
    } catch (er) {
        console.error(er);
        return;
    }
    spineBox0.addChild(spine0).position.set(app.screen.width * 0.5, app.screen.height * 0.5);
    spineBox1.addChild(spine1).position.set(app.screen.width * 0.5, app.screen.height * 0.5);
    old.anim = null;

    y = 0;
    for (var animationsKey in data0.data.animations) {
        spineBox0.addChild(getButton(animationsKey, 20, 5 + y++ * 25, onDown));
    }
    y = 0;
    for (animationsKey in data1.data.animations) {
        spineBox1.addChild(getButton(animationsKey, 20, 5 + y++ * 25, onDown));
    }
    app.start();
}

function getButton(txt, x, y, cb, size) {
    var bt = new PIXI.Text(txt, style);
    if (size) bt.style.fontSize = 24;
    bt.position.set(x, y);
    bt.interactive = true;
    bt.buttonMode = true;
    bt.on('pointerdown', cb);
    return bt;
}

app.ticker.add(function() { });
