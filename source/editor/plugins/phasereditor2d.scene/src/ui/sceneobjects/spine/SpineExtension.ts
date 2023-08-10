namespace phasereditor2d.scene.ui.sceneobjects {

    interface ISpineExtraData {
        dataAsset: pack.core.SpineJsonAssetPackItem | pack.core.SpineBinaryAssetPackItem,
        atlasAsset: pack.core.SpineAtlasAssetPackItem
    }

    export class SpineExtension extends SceneGameObjectExtension {

        private static _instance: SpineExtension;

        static getInstance() {

            if (!this._instance) {

                this._instance = new SpineExtension();
            }

            return this._instance;
        }

        constructor() {
            super({
                typeName: "SpineGameObject",
                phaserTypeName: "spine.SpineGameObject",
                category: SCENE_OBJECT_SPINE_CATEGORY,
                icon: resources.getIconDescriptor(resources.ICON_SPINE)
            });
        }

        override async collectExtraDataForCreateDefaultObject(editor: ui.editor.SceneEditor) {

            const finder = new pack.core.PackFinder();

            await finder.preload();

            const promise = new Promise((resolve, reject) => {

                const dlg = new SpineConfigWizard(finder);

                dlg.setFinishCallback(async () => {

                    const { dataAsset, atlasAsset } = dlg.getSelection();

                    const scene = editor.getScene();


                    for (const asset of [dataAsset, atlasAsset]) {

                        const updater = ScenePlugin.getInstance().getLoaderUpdaterForAsset(asset);

                        await updater.updateLoader(scene, asset);
                    }

                    const result: ICreateExtraDataResult = {
                        data: ({ dataAsset, atlasAsset } as ISpineExtraData)
                    };

                    resolve(result);
                });

                dlg.setCancelCallback(() => {

                    const result: ICreateExtraDataResult = {
                        abort: true
                    };

                    resolve(result);
                });

                dlg.create();
            });

            return promise;
        }

        acceptsDropData(data: any): boolean {

            return data instanceof pack.core.SpineAtlasAssetPackItem
                || data instanceof pack.core.SpineBinaryAssetPackItem
        }

        createDefaultSceneObject(args: ICreateDefaultArgs) {

            const { dataAsset, atlasAsset } = args.extraData as ISpineExtraData;

            const spineObj = new SpineObject(args.scene, 0, 0, dataAsset.getKey(), atlasAsset.getKey());

            return [spineObj];
        }

        createSceneObjectWithAsset(args: ICreateWithAssetArgs): ISceneGameObject {
            
            throw new Error("Method not implemented.");
        }

        createGameObjectWithData(args: ICreateWithDataArgs): ISceneGameObject {
            throw new Error("Method not implemented.");
        }

        getAssetsFromObjectData(args: IGetAssetsFromObjectArgs): Promise<any[]> {
            throw new Error("Method not implemented.");
        }

        getCodeDOMBuilder(): GameObjectCodeDOMBuilder {
            throw new Error("Method not implemented.");
        }
    }
}