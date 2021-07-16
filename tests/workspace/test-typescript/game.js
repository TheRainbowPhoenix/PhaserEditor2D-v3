"use strict";
window.addEventListener('load', function () {
    var game = new Phaser.Game({
        width: 800,
        height: 600,
        type: Phaser.AUTO,
        backgroundColor: "#242424",
        scale: {
            mode: Phaser.Scale.FIT,
            autoCenter: Phaser.Scale.CENTER_BOTH
        }
    });
    game.scene.add("Level", Level);
    game.scene.add("Boot", Boot, true);
});
class Boot extends Phaser.Scene {
    preload() {
        this.load.pack("pack", "assets/asset-pack.json");
    }
    create() {
        this.scene.start("Level");
    }
}
class UserComponent {
    /**
     * @param gameObject The entity.
     */
    constructor(gameObject) {
        this.scene = gameObject.scene;
        const listenAwake = this.awake !== UserComponent.prototype.awake;
        const listenStart = this.start !== UserComponent.prototype.start;
        const listenUpdate = this.update !== UserComponent.prototype.update;
        const listenDestroy = this.destroy !== UserComponent.prototype.destroy;
        if (listenAwake) {
            gameObject.once("components-awake", this.awake, this);
        }
        if (listenStart) {
            this.scene.events.once(Phaser.Scenes.Events.UPDATE, this.start, this);
        }
        if (listenUpdate) {
            this.scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this);
        }
        if (listenStart || listenUpdate || listenDestroy) {
            gameObject.on(Phaser.GameObjects.Events.DESTROY, () => {
                this.scene.events.off(Phaser.Scenes.Events.UPDATE, this.start, this);
                this.scene.events.off(Phaser.Scenes.Events.UPDATE, this.update, this);
                if (listenDestroy) {
                    this.destroy();
                }
            });
        }
    }
    awake() {
        // override this
    }
    start() {
        // override this
    }
    update() {
        // override this
    }
    destroy() {
        // override this
    }
}
/// <reference path="./UserComponent.ts"/>
// You can write more code here
/* START OF COMPILED CODE */
class PushOnClick extends UserComponent {
    constructor(gameObject) {
        super(gameObject);
        this.pushScale = 0.5;
        this.gameObject = gameObject;
        gameObject["__PushOnClick"] = this;
        /* START-USER-CTR-CODE */
        // Write your code here.
        /* END-USER-CTR-CODE */
    }
    static getComponent(gameObject) {
        return gameObject["__PushOnClick"];
    }
    /* START-USER-CODE */
    awake() {
        this.gameObject.setInteractive().on("pointerdown", () => {
            this.scene.add.tween({
                targets: this.gameObject,
                scaleX: this.pushScale,
                scaleY: this.pushScale,
                duration: 80,
                yoyo: true
            });
        });
    }
}
/* END OF COMPILED CODE */
// You can write more code here
// You can write more code here
/* START OF COMPILED CODE */
class Tint extends UserComponent {
    constructor(gameObject) {
        super(gameObject);
        this.gameObject = gameObject;
        gameObject["__Tint"] = this;
        /* START-USER-CTR-CODE */
        // Write your code here.
        /* END-USER-CTR-CODE */
        // custom definition props
        this.tint = "red";
    }
    static getComponent(gameObject) {
        return gameObject["__Tint"];
    }
    /* START-USER-CODE */
    set tint(tint) {
        switch (tint) {
            case "red":
                this.gameObject.setTint(0xff0000);
                break;
            case "green":
                this.gameObject.setTint(0x00ff00);
                break;
            case "blue":
                this.gameObject.setTint(0x0000ff);
                break;
        }
    }
}
/* END OF COMPILED CODE */
// You can write more code here
// You can write more code here
/* START OF COMPILED CODE */
class DinoPrefab extends Phaser.GameObjects.Image {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture || "dino", frame);
        this.rotating = false;
        /* START-USER-CTR-CODE */
        // Write your code here.
        /* END-USER-CTR-CODE */
        // custom definition props
        this.origin = "top";
    }
    /* START-USER-CODE */
    set origin(origin) {
        switch (origin) {
            case "top":
                this.setOrigin(0.5, 0);
                break;
            case "center":
                this.setOrigin(0.5, 0.5);
                break;
            case "bottom":
                this.setOrigin(0.5, 1);
                break;
        }
    }
}
/* END OF COMPILED CODE */
// You can write more code here
// You can write more code here
/* START OF COMPILED CODE */
class DoubleDinoPrefab extends Phaser.GameObjects.Container {
    constructor(scene, x, y) {
        super(scene, x, y);
        // dinoLeft
        const dinoLeft = new DinoPrefab(scene, 0, 0);
        this.add(dinoLeft);
        // dinoRight
        const dinoRight = new DinoPrefab(scene, 90, 166);
        this.add(dinoRight);
        // lists
        const testListInPrefab = [dinoRight, dinoLeft];
        // dinoLeft (prefab fields)
        dinoLeft.emit("prefab-awake");
        // dinoRight (prefab fields)
        dinoRight.emit("prefab-awake");
        this.dinoLeft = dinoLeft;
        this.dinoRight = dinoRight;
        this.testListInPrefab = testListInPrefab;
        /* START-USER-CTR-CODE */
        // Write your code here.
        /* END-USER-CTR-CODE */
        // custom definition props
        this.ghost = true;
    }
    /* START-USER-CODE */
    set ghost(ghost) {
        this.alpha = ghost ? 0.5 : 1;
    }
}
/* END OF COMPILED CODE */
// You can write more code here
// You can write more code here
/* START OF COMPILED CODE */
class Level extends Phaser.Scene {
    constructor() {
        super("Level");
        /* START-USER-CTR-CODE */
        // Write your code here.
        /* END-USER-CTR-CODE */
    }
    editorCreate() {
        // dino
        const dino = this.add.image(400, 245.50984430371858, "dino");
        // text_1
        const text_1 = this.add.text(400, 406, "", {});
        text_1.setOrigin(0.5, 0);
        text_1.text = "Phaser 3 + Phaser Editor 2D + TypeScript";
        text_1.setStyle({ "fontFamily": "arial", "fontSize": "3em" });
        // dino_1
        const dino_1 = new DinoPrefab(this, 186, 160);
        this.add.existing(dino_1);
        // doubleDinoPrefab
        const doubleDinoPrefab = new DoubleDinoPrefab(this, 666, 35);
        this.add.existing(doubleDinoPrefab);
        // withAwakeEventPrefab
        const withAwakeEventPrefab = new WithAwakeEventPrefab(this, 415, 505);
        this.add.existing(withAwakeEventPrefab);
        withAwakeEventPrefab.setOrigin(0.5, 0.5);
        // dino (components)
        const dinoPushOnClick = new PushOnClick(dino);
        dinoPushOnClick.pushScale = 0.8;
        new Tint(dino);
        dino.emit("components-awake");
        // dino_1 (prefab fields)
        dino_1.rotating = true;
        dino_1.emit("prefab-awake");
        // dino_1 (components)
        const dino_1Tint = new Tint(dino_1);
        dino_1Tint.tint = "blue";
        dino_1.emit("components-awake");
        // doubleDinoPrefab (prefab fields)
        doubleDinoPrefab.emit("prefab-awake");
        // withAwakeEventPrefab (prefab fields)
        withAwakeEventPrefab.emit("prefab-awake");
        this.dino = dino;
    }
    /* START-USER-CODE */
    // Write your code here.
    create() {
        this.editorCreate();
    }
    update() {
        if (this.dino) {
            this.dino.y -= 1;
        }
    }
}
/* END OF COMPILED CODE */
// You can write more code here
// You can write more code here
/* START OF COMPILED CODE */
class TestListFieldScene extends Phaser.Scene {
    constructor() {
        super("TestListFieldScene");
        /* START-USER-CTR-CODE */
        // Write your code here.
        /* END-USER-CTR-CODE */
    }
    editorCreate() {
        // dino
        const dino = this.add.image(337, 193, "dino");
        // lists
        const list = [dino];
        const emptyList = [];
        this.list = list;
        this.emptyList = emptyList;
    }
    /* START-USER-CODE */
    // Write your code here
    create() {
        this.editorCreate();
    }
}
/* END OF COMPILED CODE */
// You can write more code here
// You can write more code here
/* START OF COMPILED CODE */
class TestOneObjectScene extends Phaser.Scene {
    constructor() {
        super("TestOneObjectScene");
        /* START-USER-CTR-CODE */
        // Write your code here.
        /* END-USER-CTR-CODE */
    }
    editorCreate() {
        // dino
        const dino = this.add.image(482, 178, "dino");
        this.dino = dino;
    }
    /* START-USER-CODE */
    // Write your code here
    create() {
        this.editorCreate();
    }
}
/* END OF COMPILED CODE */
// You can write more code here
// You can write more code here
/* START OF COMPILED CODE */
class TextWordWrapScene extends Phaser.Scene {
    constructor() {
        super("TextWordWrapScene");
        /* START-USER-CTR-CODE */
        // Write your code here.
        /* END-USER-CTR-CODE */
    }
    editorCreate() {
        // text
        const text = this.add.text(114, 110, "", {});
        text.text = "New   long text   !";
        text.setStyle({ "fontFamily": "arial", "fontSize": "40px" });
        text.setWordWrapWidth(60, true);
        // text_1
        const text_1 = this.add.text(274, 142, "", {});
        text_1.text = "New text";
        text_1.setStyle({ "fontSize": "80px" });
    }
    /* START-USER-CODE */
    // Write your code here
    create() {
        this.editorCreate();
    }
}
/* END OF COMPILED CODE */
// You can write more code here
// You can write more code here
/* START OF COMPILED CODE */
class PrefabAwakeTest extends Phaser.Scene {
    constructor() {
        super("PrefabAwakeTest");
        /* START-USER-CTR-CODE */
        // Write your code here.
        /* END-USER-CTR-CODE */
    }
    editorCreate() {
        // withoutAwakeEventPrefab
        const withoutAwakeEventPrefab = new WithoutAwakeEventPrefab(this, 59, 79);
        this.add.existing(withoutAwakeEventPrefab);
        // withAwakeEventPrefab
        const withAwakeEventPrefab = new WithAwakeEventPrefab(this, 99, 197);
        this.add.existing(withAwakeEventPrefab);
        withAwakeEventPrefab.setOrigin(0.5, 0.5);
        // withAwakeEventPrefab (prefab fields)
        withAwakeEventPrefab.emit("prefab-awake");
    }
    /* START-USER-CODE */
    // Write your code here
    create() {
        this.editorCreate();
    }
}
/* END OF COMPILED CODE */
// You can write more code here
// You can write more code here
/* START OF COMPILED CODE */
class WithAwakeEventPrefab extends Phaser.GameObjects.Text {
    constructor(scene, x, y) {
        super(scene, x, y, "", {});
        // awake handler
        this.once("prefab-awake", () => this.awake());
        this.setOrigin(0.5, 0.5);
        this.text = "Prefab with awake event";
        this.setStyle({ "backgroundColor": "#db68f7ff", "fontSize": "40px" });
        /* START-USER-CTR-CODE */
        // Write your code here.
        /* END-USER-CTR-CODE */
    }
    /* START-USER-CODE */
    awake() {
        this.angle = -10;
    }
}
/* END OF COMPILED CODE */
// You can write more code here
// You can write more code here
/* START OF COMPILED CODE */
class WithoutAwakeEventPrefab extends Phaser.GameObjects.Text {
    constructor(scene, x, y) {
        super(scene, x, y, "", {});
        this.text = "Prefab Without Awake Event";
        this.setStyle({ "backgroundColor": "#1e87a1ff", "fontSize": "40px" });
        this.setPadding({ "left": 10, "top": 10, "right": 10, "bottom": 10 });
        /* START-USER-CTR-CODE */
        // Write your code here.
        /* END-USER-CTR-CODE */
    }
}
/* END OF COMPILED CODE */
// You can write more code here
