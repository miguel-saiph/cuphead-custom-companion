const {ccclass, property} = cc._decorator;

@ccclass
export default class GameController extends cc.Component {

    @property(cc.Node)
    private titlePage: cc.Node = null;
    @property(cc.Node)
    private timerPage: cc.Node = null;
    @property(cc.Node)
    private timerLengthPage: cc.Node = null;

    private canInteract: boolean = true;

    protected onLoad(): void {
        this.titlePage.active = true;
        this.timerPage.active = false;
        this.timerLengthPage.active = false;
        this.timerLengthPage.on('length-set', this.onLengthPressed, this);
    }

    private onStartPressed(): void {
        if (!this.canInteract) {
            return;
        }
        this.canInteract = false;

        this.titlePage.opacity = 255;
        cc.tween(this.titlePage).to(0.5, {opacity: 0})
        .call(() => {
            this.titlePage.active = false;
        }).start();
        this.scheduleOnce(() => {
            this.timerLengthPage.active = true;
            this.timerLengthPage.opacity = 255;
        }, 0.4);
    }

    private onLengthPressed(): void {
        this.timerLengthPage.opacity = 255;
        cc.tween(this.timerLengthPage).to(0.5, {opacity: 0})
        .call(() => {
            this.timerLengthPage.active = false;
        }).start();
        this.scheduleOnce(() => {
            this.timerPage.active = true;
            this.timerPage.opacity = 255;
        }, 0.4);
    }

    private onBackPressed(): void {
        cc.audioEngine.stopMusic();
        cc.director.loadScene(cc.director.getScene().name);
    }
}
