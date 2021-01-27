import {Texture, AnimatedSprite, Loader, utils, Container} from '../lib/pixi';
import {spine} from '../lib/pixi-spine';
import Main from "../Main";

export default class SpineD extends PIXI.Container{
    constructor() {
        super();
        this.init();
    }
    init() {
        const AtlasAttachmentLoader = PIXI.spine.core.AtlasAttachmentLoader;
        AtlasAttachmentLoader.prototype.newRegionAttachment = function (skin, name, path) {
            var region = this.atlas.findRegion(path);
            if (region == null && skin && skin.attachments && skin.attachments.length > 0) {
                console.warn("Region " + path + " not found");
                const newSkin = skin.attachments.filter(function(e) {
                    return e;
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
        this.spineBox0 = this.addChild(new PIXI.Container());
        this.id = 0;
        this.nn = 0;
        this.anims = ['additional_bw',//Region not found in atlas: bw (region attachment: bw)
            'game_popups',//Region not found in atlas: bonus_win (region attachment: bonus_win)
            'bonus_animation',//!!!
            'bonus_explosion',//!!!
            'add_respin_animation',
            'anticipation',
            'fire_transition',
            'mask_bonus_fire',
            'respins_frame_explosion',
            'scatter_anticipation'];

        this.style = {
            fontFamily: 'Calibri',
            fontWeight: 'bold',
            fontSize: 20,
            fill: '#ffffff'
        };

        this.aName = this.addChild(this.getButton('', 10, 5, null, 14));
        this.addChild(this.getButton('<previous', 1100, 5, ()=>{
            this.nn = --this.nn < 0 ? this.anims.length-1: this.nn;
            this.loadSpine(this.nn);
        },20));
        this.addChild(this.getButton('next>', 1200, 5, ()=>{
            this.nn = ++this.nn < this.anims.length ? this.nn : 0;
            this.loadSpine(this.nn);
        },20));
    }

    loadSpine(nn) {
        while (this.spineBox0.children.length) {
            this.spineBox0.removeChildAt(0);
        }
        PIXI.loader.destroy();
        this.aName.text = this.anims[nn] + '.json';
        var url = './art/dragon/' + this.anims[nn] + '.json';
        console.log('>>>>>', url);
        PIXI.loader
            .add(('spin_' + this.id), url)
            .load(this.onAssetsLoaded.bind(this));
    }

    showAnim(e) {
        if (this.oldAnim) this.oldAnim.style.fill = '#ffffff';
        this.oldAnim = e.currentTarget;
        this.oldAnim.style.fill = '#ff6f00';
        this.instance.state.addAnimation(0, e.currentTarget.text, false, 0);
    }

    onAssetsLoaded(loader, res) {
        var data0 = res[('spin_' + this.id++)];
        console.log(data0);

        try {
            // console.log(res);
            // console.log(dataR);
            // console.log('spineData =', dataR.spineData || 'undefined');
            // console.log('data =', dataR.data || 'undefined');



            this.instance = new PIXI.spine.Spine(data0.spineData);

            // this.instance = Spine.fromFile("spines/additional_bw/additional_bw.json");
            // this.instance = Spine.fromFile("./art/spine_new/additional_bw/additional_bw.json");
            // this.instance.skeleton.setSkinByName('en');

            this.instance.position.set(Main.width * 0.5, Main.height * 0.5);
        } catch (er) {
            console.error(er);
            return;
        }
        this.spineBox0.addChild(this.instance);
        this.oldAnim = null;

        let y = 0;
        for (var animationsKey in data0.data.animations) {
            this.spineBox0.addChild(this.getButton(animationsKey, 20, 50 + y++ * 25, this.showAnim.bind(this)));
        }
        // app.start();
    }

    getButton(txt, x, y, cb, size) {
        var bt = new PIXI.Text(txt, this.style);
        if (size) bt.style.fontSize = size;
        bt.position.set(x, y);
        bt.interactive = true;
        bt.buttonMode = true;
        bt.on('pointerdown', cb);
        return bt;
    }

}
