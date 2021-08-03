namespace phasereditor2d.scene.ui.sceneobjects {

    import controls = colibri.ui.controls;
    import json = core.json;

    export class ContainerEditorSupport extends GameObjectEditorSupport<Container> {

        private _allowPickChildren: boolean;

        constructor(obj: Container, scene: Scene) {
            super(ContainerExtension.getInstance(), obj, scene);

            this._allowPickChildren = true;

            this.addComponent(new TransformComponent(obj));
            this.addComponent(new VisibleComponent(obj));
            this.addComponent(new ContainerComponent(obj));
        }

        isAllowPickChildren() {
            return this._allowPickChildren;
        }

        setAllowPickChildren(childrenPickable: boolean) {
            this._allowPickChildren = childrenPickable;
        }

        setInteractive() {
            // nothing
        }

        destroy() {

            for (const obj of this.getObject().getChildren()) {

                obj.getEditorSupport().destroy();
            }

            super.destroy();
        }

        async buildDependencyHash(args: IBuildDependencyHashArgs) {

            super.buildDependencyHash(args);

            if (!this.isPrefabInstance()) {

                for (const obj of this.getObject().getChildren()) {

                    obj.getEditorSupport().buildDependencyHash(args);
                }
            }
        }

        getCellRenderer(): colibri.ui.controls.viewers.ICellRenderer {

            if (this.isPrefabInstance()) {

                const finder = ScenePlugin.getInstance().getSceneFinder();

                const file = finder.getPrefabFile(this.getPrefabId());

                if (file) {

                    const image = SceneThumbnailCache.getInstance().getContent(file);

                    if (image) {

                        return new controls.viewers.ImageCellRenderer(image);
                    }
                }
            }

            return new controls.viewers.IconImageCellRenderer(ScenePlugin.getInstance().getIcon(ICON_GROUP));
        }

        writeJSON(containerData: json.IObjectData) {

            super.writeJSON(containerData);

            const finder = ScenePlugin.getInstance().getSceneFinder();

            if (this.isPrefabInstance()) {

                containerData.nestedPrefabs = this.getObject().getChildren()

                    .filter(obj => obj.getEditorSupport().isPrefabInstance())

                    .filter(obj => finder.existsPrefab(obj.getEditorSupport().getPrefabId()))

                    .map(obj => {

                        const objData = {} as json.IObjectData;

                        obj.getEditorSupport().writeJSON(objData);

                        return objData as json.IObjectData;
                    });

            } else {

                containerData.list = this.getObject().getChildren().map(obj => {

                    const objData = {} as json.IObjectData;

                    obj.getEditorSupport().writeJSON(objData);

                    return objData as json.IObjectData;
                });
            }
        }

        readJSON(containerData: json.IObjectData) {

            super.readJSON(containerData);

            const ser = this.getSerializer(containerData);

            const list = ser.read("list", []) as json.IObjectData[];

            const nestedPrefabMap = this.readNestedPrefabData(containerData);

            const maker = this.getScene().getMaker();

            const container = this.getObject();

            container.removeAll(true);

            for (const objData of list) {

                let sprite:ISceneGameObject;

                if (nestedPrefabMap.has(objData.id)) {

                    const prefabData = nestedPrefabMap.get(objData.id);

                    sprite = maker.createObject(prefabData);

                } else {

                    sprite = maker.createObject(objData, undefined, container);
                }

                if (sprite) {

                    container.add(sprite);
                }
            }
        }

        getScreenBounds(camera: Phaser.Cameras.Scene2D.Camera) {

            const container = this.getObject();

            if (container.list.length === 0) {
                return [];
            }

            const minPoint = new Phaser.Math.Vector2(Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER);
            const maxPoint = new Phaser.Math.Vector2(Number.MIN_SAFE_INTEGER, Number.MIN_SAFE_INTEGER);

            const points: Phaser.Math.Vector2[] = [];

            for (const obj of container.getChildren()) {

                const bounds = obj.getEditorSupport().getScreenBounds(camera);

                points.push(...bounds);
            }

            const worldPoint = new Phaser.Math.Vector2(0, 0);

            container.getWorldTransformMatrix().transformPoint(0, 0, worldPoint);

            const p = camera.getScreenPoint(worldPoint.x, worldPoint.y);

            points.push(p);

            for (const point of points) {

                minPoint.x = Math.min(minPoint.x, point.x);
                minPoint.y = Math.min(minPoint.y, point.y);
                maxPoint.x = Math.max(maxPoint.x, point.x);
                maxPoint.y = Math.max(maxPoint.y, point.y);
            }

            return [
                new Phaser.Math.Vector2(minPoint.x, minPoint.y),
                new Phaser.Math.Vector2(maxPoint.x, minPoint.y),
                new Phaser.Math.Vector2(maxPoint.x, maxPoint.y),
                new Phaser.Math.Vector2(minPoint.x, maxPoint.y)
            ];
        }

        trim() {

            const container = this.getObject();

            if (container.length === 0) {

                return;
            }

            let minX = Number.MAX_SAFE_INTEGER;
            let minY = Number.MAX_SAFE_INTEGER;

            for (const child of container.list) {

                const sprite = child as unknown as Phaser.GameObjects.Sprite;

                minX = Math.min(sprite.x, minX);
                minY = Math.min(sprite.y, minY);
            }

            for (const child of container.list) {

                const sprite = child as unknown as Phaser.GameObjects.Sprite;

                sprite.x -= minX;
                sprite.y -= minY;
            }

            const p = new Phaser.Math.Vector2(0, 0);

            container.getWorldTransformMatrix().transformPoint(minX, minY, p);

            if (container.parentContainer) {

                container.parentContainer.getWorldTransformMatrix().applyInverse(p.x, p.y, p);
            }

            container.x = p.x;
            container.y = p.y;
        }
    }
}