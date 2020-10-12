namespace phasereditor2d.scene.ui.sceneobjects {

    import controls = colibri.ui.controls;

    export class TilemapLayerSection extends SceneGameObjectSection<StaticTilemapLayer | DynamicTilemapLayer> {

        constructor(page: controls.properties.PropertyPage) {
            super(page, "phasereditor2d.scene.ui.sceneobjects.TilemapLayerData", "Tilemap Layer", false, false);
        }

        createForm(parent: HTMLDivElement) {

            const comp = this.createGridElement(parent, 2);

            {
                this.createLabel(comp, "Tilemap");

                const btn = this.createButton(comp, "", () => {

                    this.getEditor().setSelection([this.getSelectionFirstElement().tilemap]);
                });

                this.addUpdater(() => {

                    btn.textContent = (this.getSelectionFirstElement().tilemap as Tilemap).getEditorSupport().getLabel();
                });
            }

            this.layerProp(comp, "name", "Layer Name");
            this.layerProp(comp, "width", "Width");
            this.layerProp(comp, "height", "Height");
            this.layerProp(comp, "widthInPixels", "Width In Pixels");
            this.layerProp(comp, "heightInPixels", "Height In Pixels");
            this.layerProp(comp, "tileHeight", "Tile Height");
            this.layerProp(comp, "tileWidth", "Tile Width");
        }

        private layerProp(comp: HTMLElement, prop: string, name: string) {

            this.createLabel(comp, name, ScenePlugin.getInstance().getPhaserDocs().getDoc("Phaser.Tilemaps.LayerData." + prop));

            const text = this.createText(comp, true);

            this.addUpdater(() => {

                text.value = this.getSelectionFirstElement().tilemap.layer[prop];
            });
        }

        canEdit(obj: any, n: number): boolean {

            return obj instanceof StaticTilemapLayer || obj instanceof DynamicTilemapLayer;
        }

        canEditNumber(n: number): boolean {

            return n === 1;
        }
    }
}