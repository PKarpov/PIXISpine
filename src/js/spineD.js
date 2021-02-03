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
        // this.nn = 0;
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

        this.aName = this.addChild(this.getButton('', 10, 5, null));
        // this.addChild(this.getButton('<previous', 1100, 5, ()=>{
        //     this.nn = --this.nn < 0 ? this.anims.length-1: this.nn;
        //     this.loadSpine(this.nn);
        // },20));
        // this.addChild(this.getButton('next>', 1200, 5, ()=>{
        //     this.nn = ++this.nn < this.anims.length ? this.nn : 0;
        //     this.loadSpine(this.nn);
        // },20));
        for (let i = 0; i < this.anims.length; i++) {
            this.addChild(this.getButton(this.anims[i], 1000, 20 + i * 25,this.loadSpine.bind(this)));

        }

        function isPrime(element, index, array) {
            var start = 2;
            while (start <= Math.sqrt(element)) {
                if (element % start++ < 1) {
                    return false;
                }
            }
            return element > 1;
        }

        console.log([4, 6, 7, 5, 8, 12].find(isPrime)); // undefined, не найдено
        console.log([4, 5, 8, 12].find(isPrime)); // 5

    }

    loadSpine(e) {
        if (this.oldSpine) this.oldSpine.style.fill = '#ffffff';
        this.oldSpine = e.currentTarget;
        this.oldSpine.style.fill = '#ff6f00';
        let spine = e.currentTarget.text;
        window.copyToClipboard(spine + '.json');
        // PIXI.loader.destroy();
        this.aName.text = spine + '.json';
        var url = './art/dragon/' + spine + '.json';
        console.log('>>>>>', url);
        PIXI.loader
            .add(('spin_' + this.id), url)
            .load(this.onAssetsLoaded.bind(this));
    }

    showAnim(e) {
        if (this.oldAnim) this.oldAnim.style.fill = '#ffffff';
        this.oldAnim = e.currentTarget;
        this.oldAnim.style.fill = '#ff6f00';
        console.log('width =', Math.round(this.instance.width), 'height =', Math.round(this.instance.height));
        this.instance.state.addAnimation(0, e.currentTarget.text, false, 0);
    }

    setSkin(e) {
        if (this.oldSkin) this.oldSkin.style.fill = '#ffffff';
        this.oldSkin = e.currentTarget;
        this.oldSkin.style.fill = '#ff6f00';
        this.instance.skeleton.setSkinByName(e.currentTarget.text);
    }

    onAssetsLoaded(loader, res) {
        while (this.spineBox0.children.length) {
            this.spineBox0.removeChildAt(0);
        }

        var data0 = res[('spin_' + this.id++)];
        console.log(data0);
        console.log(data0.spineData.skins);

        try {
            console.log(res);
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
        console.log('width =', Math.round(this.instance.width), 'height =', Math.round(this.instance.height));
        this.oldAnim = null;
        this.oldSkin = null;

        let y = 0;
        this.spineBox0.addChild(this.getButton('Animations', 20, 50 + y++ * 25,null));
        let bta;
        for (var animationsKey in data0.data.animations) {
            bta = this.spineBox0.addChild(this.getButton(animationsKey, 20, 50 + y++ * 25, this.showAnim.bind(this)));
        }
        if (data0.spineData.skins.length > 1) {
            // this.instance.skeleton.setSkinByName(this.instance.spineData.skins[2].name);
            this.spineBox0.addChild(this.getButton('Skins', 20, 300 + y++ * 25,null));
            let bts;
            for (let skin = 0; skin < data0.spineData.skins.length; skin++) {
                bts = this.spineBox0.addChild(this.getButton(this.instance.spineData.skins[skin].name, 20, 300 + y++ * 25, this.setSkin.bind(this)));
            }
            this.setSkin({currentTarget: bts});
        }
        this.showAnim({currentTarget: bta});
    }

    getButton(txt, x, y, cb) {
        var bt = new PIXI.Text(txt, this.style);
        bt.position.set(x, y);
        if (cb) {
            bt.interactive = true;
            bt.buttonMode = true;
            bt.on('pointerdown', cb);
        } else {
            bt.style.fill = '#ff4800';
            bt.style.fontSize = 16;
        }
        return bt;
    }

}
