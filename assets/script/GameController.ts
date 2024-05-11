const {ccclass, property} = cc._decorator;

@ccclass
export default class GameController extends cc.Component {

    @property(cc.Node)
    private titlePage: cc.Node = null;
    @property(cc.Node)
    private timerPage: cc.Node = null;
    @property(cc.Node)
    private timerLengthPage: cc.Node = null;
    @property(cc.Node)
    private bossPage: cc.Node = null;
    @property(cc.Node)
    private koPage: cc.Node = null;
    @property(cc.Node)
    private gradePage: cc.Node = null;

    private canInteract: boolean = true;

    public static BOSS_ID: number = 0;

    protected onLoad(): void {
        this.titlePage.active = true;
        this.timerPage.active = false;
        this.timerLengthPage.active = false;
        this.timerLengthPage.on('length-set', this.onLengthPressed, this);
        this.bossPage.active = false;
        this.koPage.active = false;
        this.gradePage.active = false;
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
            this.bossPage.active = true;
            this.bossPage.opacity = 255;
            this.canInteract = true;
        }, 0.4);
    }

    private onBossPressed(event: any, param: string): void {
        if (!this.canInteract) {
            return;
        }
        this.canInteract = false;

        GameController.BOSS_ID = parseInt(param);

        this.bossPage.opacity = 255;
        cc.tween(this.bossPage).to(0.5, {opacity: 0})
        .call(() => {
            this.bossPage.active = false;
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

    private onKoPressed(): void {
        this.timerPage.opacity = 255;
        cc.tween(this.timerPage).to(0.5, {opacity: 0})
        .call(() => {
            this.timerPage.active = false;
        }).start();
        this.scheduleOnce(() => {
            this.koPage.active = true;
            this.koPage.opacity = 255;
        }, 0.4);
    }

    private onFinalGradePressed(): void {
        this.koPage.opacity = 255;
        cc.tween(this.koPage).to(0.5, {opacity: 0})
        .call(() => {
            this.koPage.active = false;
        }).start();
        this.scheduleOnce(() => {
            this.gradePage.active = true;
            this.gradePage.opacity = 255;
        }, 0.4);
    }

    private onBackPressed(): void {
        cc.audioEngine.stopMusic();
        cc.director.loadScene(cc.director.getScene().name);
    }
}
