/// <reference path="./StringPropertyType.ts" />
/// <reference path="./AbstractDialogPropertyType.ts" />
namespace phasereditor2d.scene.ui.sceneobjects {

    import controls = colibri.ui.controls;
    import io = colibri.core.io;

    export class SceneKeyPropertyType extends AbstractDialogPropertyType {

        constructor() {
            super({
                id: "phasereditor2d.scene.ui.sceneobjects.userProperties.SceneKeyDialog",
                dialogTitle: "Select Scene Key",
                name: "Scene Key",
                hasCustomIcon: true
            });
        }
        protected async updateIcon(iconControl: controls.IconControl, value: string) {

            const finder = ScenePlugin.getInstance().getSceneFinder();

            await finder.preload(controls.EMPTY_PROGRESS_MONITOR);

            const file = finder.getSceneFiles()
                .find(f => this.valueToString(null, f) === value);

            if (file) {

                const cache = SceneThumbnailCache.getInstance();

                await cache.preload(file);

                const img = cache.getContent(file);

                if (img) {

                    await img.preloadSize();
                    await img.preload();

                    iconControl.setIcon(img);

                } else {

                    iconControl.setIcon(colibri.ColibriPlugin.getInstance().getIcon(colibri.ICON_FOLDER));
                }
            }
        }

        protected async createViewer() {

            const viewer = new controls.viewers.TreeViewer(this.getId());

            viewer.setCellRendererProvider(new controls.viewers.EmptyCellRendererProvider(() => new viewers.SceneFileCellRenderer()));
            viewer.setLabelProvider(new controls.viewers.LabelProvider((file: io.FilePath) => {

                const label = this.valueToString(viewer, file);

                return label;
            }));

            viewer.setTreeRenderer(new controls.viewers.TreeViewerRenderer(viewer));
            viewer.setContentProvider(new controls.viewers.ArrayTreeContentProvider());

            return viewer;
        }

        protected async loadViewerInput(viewer: controls.viewers.TreeViewer) {

            viewer.setInput(ScenePlugin.getInstance().getSceneFinder().getSceneFiles());
        }

        protected valueToString(viewer: controls.viewers.TreeViewer, selected: io.FilePath): string {

            const data = ScenePlugin.getInstance().getSceneFinder().getSceneData(selected);

            return data?.settings?.sceneKey || selected.getNameWithoutExtension();
        }
    }
}