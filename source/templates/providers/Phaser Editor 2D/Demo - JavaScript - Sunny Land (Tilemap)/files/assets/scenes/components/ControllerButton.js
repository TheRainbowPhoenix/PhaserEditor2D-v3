
// You can write more code here

/* START OF COMPILED CODE */

class ControllerButton extends EventComponent {
	
	constructor(gameObject) {
		super(gameObject);
		
		gameObject["__ControllerButton"] = this;
		
		/** @type {Phaser.GameObjects.Image} */
		this.gameObject = gameObject;
		
		/* START-USER-CTR-CODE */

		this.isDown = false;

		this.gameObject.setInteractive();

		/* END-USER-CTR-CODE */
	}
	
	/** @returns {ControllerButton} */
	static getComponent(gameObject) {
		return gameObject["__ControllerButton"];
	}
	
	/* START-USER-CODE */

	update() {

		this.isDown = false;

		for (const pointer of this.scene.game.input.pointers) {

			if (pointer.isDown) {

				const [obj] = this.scene.input.hitTestPointer(pointer);

				if (obj === this.gameObject) {

					this.isDown = true;

					return;
				}
			}
		}
	}

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
