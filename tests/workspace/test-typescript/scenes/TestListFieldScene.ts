
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
		const list = [dino]
		
		this.list = list;
	}
	
	private list: Phaser.GameObjects.Image[]|undefined;
	
	/* START-USER-CODE */
	
	// Write your code here
	
	create() {
	
		this.editorCreate();
	}
	
	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
