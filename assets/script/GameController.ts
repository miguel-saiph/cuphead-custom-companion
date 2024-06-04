import Utils from "./Utils";

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

        Utils.screenTransition(this.titlePage, this.bossPage, this, () => { this.canInteract = true; });
    }

    private onBossPressed(event: any, param: string): void {
        if (!this.canInteract) {
            return;
        }
        this.canInteract = false;

        GameController.BOSS_ID = parseInt(param);

        Utils.screenTransition(this.bossPage, this.timerLengthPage, this);
    }

    private onLengthPressed(): void {
        Utils.screenTransition(this.timerLengthPage, this.timerPage, this);
    }

    private onKoPressed(): void {
        Utils.screenTransition(this.timerPage, this.koPage, this);
    }

    private onFinalGradePressed(): void {
        Utils.screenTransition(this.koPage, this.gradePage, this);
    }

    private onBackPressed(): void {
        cc.audioEngine.stopMusic();
        cc.director.loadScene(cc.director.getScene().name);
    }
}
