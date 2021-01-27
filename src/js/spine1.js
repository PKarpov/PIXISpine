var app = new PIXI.Application(1280, 720, { backgroundColor: 0x111111 });
document.body.appendChild(app.view);
app.stage.addChild(new PIXI.Graphics)
    .lineStyle(1, 0x999999)
    .moveTo(640,0)
    .lineTo(640,720)
    .moveTo(0,360)
    .lineTo(1280,360)

var spineBox0 = app.stage.addChild(new PIXI.Container());
var spine;
function loadSpine() {
    app.stop();
    while (spineBox0.children.length) {
        spineBox0.removeChildAt(0);
    }
    PIXI.loader.destroy();
    //+++var url = './art/spine/dragon/anticipation.json';            //+ anticipation
    //+++var url = './art/spine/dragon/scatter_anticipation.json';    //+ end idle start win
    //+++
    var url = './art/spine/dragon/fire_transition.json';         //+ animation animation_end

    // var url = './art/spine/dragon/additional_bw.json';           //!!! -  Region not found
    // var url = './art/spine/dragon/game_popups.json';             //- Region not found in atlas: bonus_win
    // var url = './art/spine/dragon/bonus_animation.json';         //- idle static win
    // var url = './art/spine/dragon/bonus_explosion.json';         //- animation collect

    // var url = './art/spine/dragon/add_respin_animation.json';    //+ explosion highligh
    // var url = './art/spine/dragon/mask_bonus_fire.json';         //+ mask_bonus_fire
    // var url = './art/spine/dragon/respins_frame_explosion.json'; //+ collect respin


    // var url = './art/spine/egypt/respins_frame_explosion.json'; //+ collect respin
    console.log('>>>>>>>>>>>>', url);
    PIXI.loader
        .add('spin0', url)
        .load(onAssetsLoaded);
}

// loadSpine('egypt');


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


function showAnim(e) {
    if (old.anim) old.anim.style.fill = '#ffffff';
    old.anim = e.currentTarget;
    old.anim.style.fill = '#ff6f00';
    spine.state.addAnimation(0, e.currentTarget.text, false, 0);
}

function onAssetsLoaded(loader, res) {
    var data0 = res['spin0'];

    try {
        // console.log(res);
        // console.log(dataR);
        // console.log('spineData =', dataR.spineData || 'undefined');
        // console.log('data =', dataR.data || 'undefined');
        spine = new PIXI.spine.Spine(data0.spineData);
        spine.position.set(app.screen.width * 0.5, app.screen.height * 0.5);
    } catch (er) {
        console.error(er);
        return;
    }
    spineBox0.addChild(spine);
    old.anim = null;

    var y = 0;
    var all = '//+ ';
    for (var animationsKey in data0.data.animations) {
        spineBox0.addChild(getButton(animationsKey, 20, 5 + y++ * 25, showAnim));
        all += animationsKey + ' ';
    }
    console.log(all);
    app.start();
}

function getButton(txt, x, y, cb, size) {
    var bt = new PIXI.Text(txt, style);
    if (size) bt.style.fontSize = size;
    bt.position.set(x, y);
    bt.interactive = true;
    bt.buttonMode = true;
    bt.on('pointerdown', cb);
    return bt;
}

loadSpine();

app.ticker.add(function() { });
