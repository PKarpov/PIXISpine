import {Texture, AnimatedSprite, Loader, utils, Container} from './lib/pixi';
import {spine} from './lib/pixi-spine';

export default class SpineD extends PIXI.Container{
    constructor() {
        super();
    }

    init() {
        const AtlasAttachmentLoader = PIXI.spine.core.AtlasAttachmentLoader;
        AtlasAttachmentLoader.prototype.newRegionAttachment = function (skin, name, path) {
            var region = this.atlas.findRegion(path);
            if (region == null && skin && skin.attachments && skin.attachments.length > 0) {
                console.warn("Region " + path + " not found");

                const newSkin = skin.attachments.filter(function(e) {
                    return e
                })[0];
                const newSkinKey = Object.keys(newSkin)[0];
                const newAttachment = newSkin[newSkinKey];
                name = newAttachment.name;
                path = newAttachment.path;

                region = this.atlas.findRegion(name);

            }

            if (region == null) {
            debugger;
                throw new Error("Region not found in atlas: " + path + " (region attachment: " + name + ")");
            }
            var attachment = new PIXI.spine.core.RegionAttachment(name);
            attachment.region = region;
            return attachment;
        }


    }

}

;
var app = new PIXI.Application(1280, 720, { backgroundColor: 0x333333 });
document.body.appendChild(app.view);
app.stage.addChild(new PIXI.Graphics)
    .lineStyle(1, 0x777777)
    .moveTo(640,0)
    .lineTo(640,720)
    .moveTo(0,360)
    .lineTo(1280,360)

var spineBox0 = app.stage.addChild(new PIXI.Container());
var spine;
var id = 0;
var nn=0;

/*var anims = ['additional_bw',//эти есть Region not found in atlas: bw (region attachment: bw)
    'anticipation',
    'fire_transition',
    'game_popups',//Region not found in atlas: bonus_win (region attachment: bonus_win)
    'mask_bonus_fire',
    'scatter_anticipation'];*/


/*var anims = ['bonus_animation',//этих нет !!!
    'bonus_explosion',//!!!
    'add_respin_animation',
    'respins_frame_explosion',];*/

var anims = ['additional_bw',//Region not found in atlas: bw (region attachment: bw)
    'game_popups',//Region not found in atlas: bonus_win (region attachment: bonus_win)
    'bonus_animation',//!!!
    'bonus_explosion',//!!!
    'add_respin_animation',
    'anticipation',
    'fire_transition',
    'mask_bonus_fire',
    'respins_frame_explosion',
    'scatter_anticipation'];

function loadSpine(nn) {
    app.stop();
    while (spineBox0.children.length) {
        spineBox0.removeChildAt(0);
    }
    PIXI.loader.destroy();
    aName.text = anims[nn] + '.json';
    var url = './art/spine_new/' + anims[nn] + '/' + anims[nn] + '.json';
    console.log('>>>>>', url);
    PIXI.loader
        .add(('spin_' + id), url)
        .load(onAssetsLoaded);
}



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

var aName = app.stage.addChild(getButton('', 10, 5, null, 14));
app.stage.addChild(getButton('next', 1200, 5, openNext));



function showAnim(e) {
    if (old.anim) old.anim.style.fill = '#ffffff';
    old.anim = e.currentTarget;
    old.anim.style.fill = '#ff6f00';
    spine.state.addAnimation(0, e.currentTarget.text, false, 0);
}

function openNext() {
    nn = ++nn < anims.length ? nn : 0;
    loadSpine(nn);
}

function onAssetsLoaded(loader, res) {
    var data0 = res[('spin_' + id++)];
	console.log(data0);

    try {
        // console.log(res);
        // console.log(dataR);
        // console.log('spineData =', dataR.spineData || 'undefined');
        // console.log('data =', dataR.data || 'undefined');



        spine = new PIXI.spine.Spine(data0.spineData);

        // spine = Spine.fromFile("spines/additional_bw/additional_bw.json");
        // spine = Spine.fromFile("./art/spine_new/additional_bw/additional_bw.json");
        // spine.skeleton.setSkinByName('en');

        spine.position.set(app.screen.width * 0.5, app.screen.height * 0.5);
    } catch (er) {
        console.error(er);
        return;
    }
    spineBox0.addChild(spine);
    old.anim = null;

    y = 0;
    for (var animationsKey in data0.data.animations) {
        spineBox0.addChild(getButton(animationsKey, 20, 50 + y++ * 25, showAnim));
    }
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


app.ticker.add(function() { });