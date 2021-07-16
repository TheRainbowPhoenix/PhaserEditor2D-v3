
// You can write more code here

/* START OF COMPILED CODE */

class WithAwakeEventPrefab extends Phaser.GameObjects.Text {
	
	constructor(scene: Phaser.Scene, x: number, y: number) {
		super(scene, x, y, "", {});
		
		// awake handler
		this.once("prefab-awake", () => this.awake());
		
		this.setOrigin(0.5, 0.5);
		this.text = "Prefab with awake event";
		this.setStyle({"backgroundColor":"#db68f7ff","fontSize":"40px"});
		
		/* START-USER-CTR-CODE */
		// Write your code here.
		/* END-USER-CTR-CODE */
	}
	
	/* START-USER-CODE */

	awake() {

		this.angle = -10;
	}

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
