namespace phasereditor2d.scene.ui.sceneobjects {

    export class ArcadeBodyTool extends BaseObjectTool {

        static ID = "phasereditor2d.scene.ui.sceneobjects.ArcadeBodyTool";
        static BODY_TOOL_COLOR = "pink";

        constructor() {
            super({
                id: ArcadeBodyTool.ID,
                command: editor.commands.CMD_EDIT_ARCADE_BODY
            }, ArcadeComponent.size.x, ArcadeComponent.size.y);

            this.addItems(
                new ArcadeBodySizeToolItem(1, 0.5),
                new ArcadeBodySizeToolItem(1, 1),
                new ArcadeBodySizeToolItem(0.5, 1),
                new ArcadeBodyOffsetToolItem(0, 0),
                new ArcadeBodyOffsetToolItem(0.5, 0),
                new ArcadeBodyOffsetToolItem(0, 0.5),
                new ArcadeBodyCircleOffsetToolItem()
            );
        }

        onActivated(args: editor.tools.ISceneToolContextArgs) {

            super.onActivated(args);

            const sections = [ArcadeGeometrySection.ID];

            this.confirmUnlockProperty(args, this.getProperties(), "size", ...sections);
        }

        render(args: editor.tools.ISceneToolRenderArgs): void {

            for (const obj of args.objects) {

                this.renderObj(args, obj as ArcadeObject);
            }

            super.render(args);
        }

        private renderObj(args: editor.tools.ISceneToolRenderArgs, obj: ArcadeObject) {

            const ctx = args.canvasContext;

            ctx.save();

            const body = obj.body;

            if (ArcadeComponent.isCircleBody(obj)) {

                this.renderCircle(obj, args, ctx);

            } else {

                this.renderRect(obj, args, ctx);
            }

            ctx.restore();
        }

        private renderRect(obj: ArcadeImage, args: editor.tools.ISceneToolRenderArgs, ctx: CanvasRenderingContext2D) {
            
            const body = obj.body;

            const p = new Phaser.Math.Vector2();

            const origin = obj.getEditorSupport().computeDisplayOrigin();

            let x1 = body.offset.x - origin.displayOriginX;
            let y1 = body.offset.y - origin.displayOriginY;
            let x2 = x1 + body.width;
            let y2 = y1 + body.height;

            const tx = obj.getWorldTransformMatrix();
            // removes rotation
            tx.rotate(-tx.rotation);
            tx.transformPoint(x1, y1, p);
            x1 = p.x;
            y1 = p.y;

            tx.transformPoint(x2, y2, p);
            x2 = p.x;
            y2 = p.y;

            const p1 = args.camera.getScreenPoint(x1, y1);
            const p2 = args.camera.getScreenPoint(x2, y2);

            ctx.strokeStyle = "black";
            ctx.lineWidth = 3;
            ctx.strokeRect(p1.x, p1.y, p2.x - p1.x, p2.y - p1.y);

            ctx.strokeStyle = ArcadeBodyTool.BODY_TOOL_COLOR;
            ctx.lineWidth = 1;
            ctx.strokeRect(p1.x, p1.y, p2.x - p1.x, p2.y - p1.y);
        }

        private renderCircle(obj: ArcadeImage, args: editor.tools.ISceneToolRenderArgs, ctx: CanvasRenderingContext2D) {
            
            const body = obj.body;

            const p = new Phaser.Math.Vector2();

            const origin = obj.getEditorSupport().computeDisplayOrigin();

            const bodyRadius = ArcadeComponent.radius.getValue(obj);
            let x1 = body.offset.x - origin.displayOriginX;
            let y1 = body.offset.y - origin.displayOriginY;
            let x2 = x1 + bodyRadius * 2;
            let y2 = y1 + bodyRadius * 2;

            const tx = obj.getWorldTransformMatrix();
            // removes rotation
            tx.rotate(-tx.rotation);
            tx.transformPoint(x1, y1, p);
            x1 = p.x;
            y1 = p.y;

            tx.transformPoint(x2, y2, p);
            x2 = p.x;
            y2 = p.y;

            const p1 = args.camera.getScreenPoint(x1, y1);
            const p2 = args.camera.getScreenPoint(x2, y2);

            const r = (p2.x - p1.x) / 2;
            const x = p1.x + r;
            const y = p1.y + r;

            ctx.strokeStyle = "black";
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.ellipse(x, y, r, r, 0, 0, 360);
            ctx.stroke();

            ctx.strokeStyle = ArcadeBodyTool.BODY_TOOL_COLOR;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.ellipse(x, y, r, r, 0, 0, 360);
            ctx.stroke();
        }
    }
}