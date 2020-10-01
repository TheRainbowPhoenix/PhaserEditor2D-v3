/// <reference path="./BaseScene.ts" />
namespace phasereditor2d.scene.ui {

    export class Scene extends BaseScene {

        private _id: string;
        private _sceneType: core.json.SceneType;
        private _editor: editor.SceneEditor;
        private _settings: core.json.SceneSettings;
        private _prefabProperties: sceneobjects.PrefabUserProperties;
        private _objectLists: sceneobjects.ObjectLists;

        constructor(editor?: editor.SceneEditor) {
            super("ObjectScene");

            this._id = Phaser.Utils.String.UUID();

            this._editor = editor;

            this._settings = new core.json.SceneSettings();

            this._objectLists = new sceneobjects.ObjectLists();

            this._prefabProperties = new sceneobjects.PrefabUserProperties();
        }

        createSceneMaker() {

            return new SceneMaker(this);
        }

        getEditor() {

            return this._editor;
        }

        protected registerDestroyListener(name: string) {
            // console.log(name + ": register destroy listener.");
            // this.game.events.on(Phaser.Core.Events.DESTROY, e => {
            //     console.log(name + ": destroyed.");
            // });
        }

        removeAll() {

            this.sys.updateList.removeAll();
            this.sys.displayList.removeAll();

            // a hack to clean the whole scene
            this.input["_list"].length = 0;
            this.input["_pendingInsertion"].length = 0;
            this.input["_pendingRemoval"].length = 0;

            for (const obj of this.getDisplayListChildren()) {

                obj.getEditorSupport().destroy();
            }
        }

        getPrefabObject(): sceneobjects.ISceneGameObject {

            if (this.sys.displayList) {

                const list = this.getDisplayListChildren();

                return list[list.length - 1];
            }

            return undefined;
        }

        isNonTopPrefabObject(obj: any) {

            const support = sceneobjects.GameObjectEditorSupport.getEditorSupport(obj);

            if (support) {

                const scene = support.getScene();

                if (scene.isPrefabSceneType()) {

                    if (scene.getPrefabObject() !== obj) {

                        const container = (obj as Phaser.GameObjects.GameObject).parentContainer;


                        if (container) {

                            return this.isNonTopPrefabObject(container);
                        }

                        return true;
                    }
                }
            }

            return false;
        }

        getObjectLists() {
            return this._objectLists;
        }

        getSettings() {
            return this._settings;
        }

        getPrefabUserProperties() {

            return this._prefabProperties;
        }

        getId() {

            return this._id;
        }

        setId(id: string) {

            this._id = id;
        }

        getSceneType() {

            return this._sceneType;
        }

        isPrefabSceneType() {

            return this.getSceneType() === core.json.SceneType.PREFAB;
        }

        setSceneType(sceneType: core.json.SceneType) {

            this._sceneType = sceneType;
        }

        getMaker() {

            return super.getMaker() as SceneMaker;
        }

        getDisplayListChildren(): sceneobjects.ISceneGameObject[] {

            return this.sys.displayList.getChildren() as any;
        }

        getInputSortedObjects(): Phaser.GameObjects.GameObject[] {

            return this.getInputSortedObjects2([], this.getDisplayListChildren());
        }

        private getInputSortedObjects2(
            result: sceneobjects.ISceneGameObject[], list: sceneobjects.ISceneGameObject[]): sceneobjects.ISceneGameObject[] {

            for (const obj of list) {

                if (obj instanceof sceneobjects.Container) {

                    this.getInputSortedObjects2(result, obj.getList());

                } else {

                    result.push(obj);
                }
            }

            return result;
        }

        visit(visitor: (obj: sceneobjects.ISceneGameObject) => void) {

            this.visit2(visitor, this.getDisplayListChildren());
        }

        private visit2(visitor: (obj: sceneobjects.ISceneGameObject) => void, children: sceneobjects.ISceneGameObject[]) {

            for (const obj of children) {

                visitor(obj);

                if (obj instanceof sceneobjects.Container) {

                    this.visit2(visitor, obj.getList());
                }
            }
        }

        visitAskChildren(visitor: (obj: sceneobjects.ISceneGameObject) => boolean) {

            this.visitAskChildren2(visitor, this.getDisplayListChildren());
        }

        private visitAskChildren2(
            visitor: (obj: sceneobjects.ISceneGameObject) => boolean, children: sceneobjects.ISceneGameObject[]) {

            for (const obj of children) {

                const visitChildren = visitor(obj);

                if (visitChildren) {

                    if (obj instanceof sceneobjects.Container) {

                        this.visitAskChildren2(visitor, obj.getList());
                    }
                }
            }
        }

        makeNewName(baseName: string) {

            const nameMaker = new colibri.ui.ide.utils.NameMaker((obj: any) => {

                if (obj instanceof Phaser.GameObjects.GameObject) {

                    return (obj as sceneobjects.ISceneGameObject).getEditorSupport().getLabel();
                }

                return (obj as sceneobjects.ObjectList).getLabel();
            });

            this.visitAskChildren(obj => {

                nameMaker.update([obj]);

                return !obj.getEditorSupport().isPrefabInstance();
            });

            for (const list of this._objectLists.getLists()) {

                nameMaker.update([list]);
            }

            return nameMaker.makeName(baseName);
        }

        /**
         * Map an object with its pre-order index. This can be used to sort objects.
         */
        buildObjectSortingMap() {

            const map = new Map<sceneobjects.ISceneGameObject, number>();

            this.buildObjectSortingMap2(map, this.getDisplayListChildren());

            return map;
        }

        sortObjectsByRenderingOrder(list: sceneobjects.ISceneGameObject[]) {

            const map = this.buildObjectSortingMap();

            list.sort((a, b) => {

                const aa = map.get(a);
                const bb = map.get(b);

                return aa - bb;
            });
        }

        private buildObjectSortingMap2(map: Map<sceneobjects.ISceneGameObject, number>, list: sceneobjects.ISceneGameObject[]) {

            let i = 0;

            for (const obj of list) {

                map.set(obj, i);

                if (obj instanceof sceneobjects.Container) {

                    i += this.buildObjectSortingMap2(map, obj.getList());
                }

                i++;
            }

            return i;
        }

        buildObjectIdMap() {

            const map = new Map<string, sceneobjects.ISceneGameObject>();

            this.visit(obj => {

                map.set(obj.getEditorSupport().getId(), obj);
            });

            return map;
        }

        snapPoint(x: number, y: number): { x: number, y: number } {

            if (this._settings.snapEnabled) {

                return {
                    x: Math.round(x / this._settings.snapWidth) * this._settings.snapWidth,
                    y: Math.round(y / this._settings.snapHeight) * this._settings.snapHeight
                };
            }

            return { x, y };
        }

        snapVector(vector: Phaser.Math.Vector2) {

            const result = this.snapPoint(vector.x, vector.y);

            vector.set(result.x, result.y);
        }

        getByEditorId(id: string) {

            const obj = Scene.findByEditorId(this.getDisplayListChildren(), id);

            if (!obj) {
                console.error(`Object with id=${id} not found.`);
            }

            return obj;
        }

        static findByEditorId(list: sceneobjects.ISceneGameObject[], id: string) {

            for (const obj of list) {

                if (obj.getEditorSupport().getId() === id) {
                    return obj;
                }

                if (obj instanceof sceneobjects.Container) {

                    const result = this.findByEditorId(obj.getList(), id);

                    if (result) {
                        return result;
                    }
                }
            }

            return null;
        }

        create() {

            this.registerDestroyListener("Scene");

            if (this._editor) {

                const camera = this.getCamera();
                camera.setOrigin(0, 0);
            }
        }
    }
}