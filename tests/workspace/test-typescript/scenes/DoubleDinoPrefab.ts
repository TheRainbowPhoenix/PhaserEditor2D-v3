
// You can write more code here

/* START OF COMPILED CODE */

class DoubleDinoPrefab extends Phaser.GameObjects.Container {
	
	constructor(scene: Phaser.Scene, x: number, y: number) {
		super(scene, x, y);
		
		// dinoLeft
		const dinoLeft = new DinoPrefab(scene, 0, 0);
		this.add(dinoLeft);
		
		// dinoRight
		const dinoRight = new DinoPrefab(scene, 90, 166);
		this.add(dinoRight);
		
		// lists
		const testListInPrefab = [dinoRight, dinoLeft]
		
		// dinoLeft (prefab fields)
		dinoLeft.emit("prefab-awake");
		
		// dinoRight (prefab fields)
		dinoRight.emit("prefab-awake");
		
		this.dinoLeft = dinoLeft;
		this.dinoRight = dinoRight;
		this.testListInPrefab = testListInPrefab;
		
		// custom definition props
		this.ghost = true;
		
		/* START-USER-CTR-CODE */
		// Write your code here.
		/* END-USER-CTR-CODE */
	}
	
	private dinoLeft: DinoPrefab;
	private dinoRight: DinoPrefab;
	private testListInPrefab: DinoPrefab[];
	
	/* START-USER-CODE */

	set ghost(ghost: boolean) {

		this.alpha = ghost ? 0.5 : 1;
	}

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
