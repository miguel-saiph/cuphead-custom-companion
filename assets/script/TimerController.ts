import GameController from "./GameController";

const {ccclass, property} = cc._decorator;

@ccclass
export default class TimerController extends cc.Component {

    @property(cc.AudioSource)
    private audio: cc.AudioSource = null;
    @property([cc.AudioClip])
    private announceClips: cc.AudioClip[] = [];
    @property(cc.AudioClip)
    private startClip: cc.AudioClip = null;
    @property(cc.AudioClip)
    private endClip: cc.AudioClip = null;
    @property([cc.AudioClip])
    private musicClips: cc.AudioClip[] = [];
    @property(cc.AudioClip)
    private alertClip: cc.AudioClip = null;

    @property(cc.Integer)
    private musicVolume: number = 0.5;
    @property(cc.Integer)
    private timerMaxAmount: number = 10;
    @property(cc.Integer)
    private fadeTime: number = 3;

    @property(cc.Label)
    private timerLabel: cc.Label = null;
    @property(cc.Label)
    private maxTimerLabel: cc.Label = null;
    @property(cc.Node)
    private readyButton: cc.Node = null;
    @property(cc.Node)
    private stopButton: cc.Node = null;
    @property(cc.Sprite)
    private audioButton: cc.Sprite = null;
    @property(cc.SpriteFrame)
    private audioOnFrame: cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    private audioOffFrame: cc.SpriteFrame = null;

    private timerNumber: number = 0;
    private musicId: number = 0;

    private canInteract: boolean = true;
    private isMusicOn: boolean = true;

    protected init(): void {
        this.resetTimerLabel();
        this.maxTimerLabel.string = this.timerMaxAmount.toString();
        cc.audioEngine.setMusicVolume(this.musicVolume);
    }

    protected start(): void {
        // this.audio.play();
        this.readyButton.active = true;
        this.stopButton.active = false;
        this.maxTimerLabel.node.active = false;
    }

    private onReadyPressed(): void {
        if (!this.canInteract) {
            return;
        }
        this.canInteract = false;
        this.playAnnouncer();
    }

    private onStopPressed(): void {
        this.unschedule(this.updateLabel);
        cc.audioEngine.stop(this.musicId);

        cc.tween(this.stopButton).to(0.5, { opacity: 0 })
        .call(() => {
            this.stopButton.active = false;
        }).start();

        this.scheduleOnce(() => {
            this.readyButton.active = true;
            this.readyButton.opacity = 255;
        }, 0.25);

        cc.tween(this.timerLabel.node).to(0.5, { opacity: 0 })
        .start();

        this.scheduleOnce(() => {
            this.maxTimerLabel.node.active = true;
        }, 0.25);
    }

    private onAudioPressed(): void {
        this.isMusicOn = !this.isMusicOn;
        this.audioButton.spriteFrame = this.isMusicOn ? this.audioOnFrame : this.audioOffFrame;

        if (!this.isMusicOn && this.musicId) {
            cc.audioEngine.stop(this.musicId);
        }
    }

    private onTimerLengthPressed(event: any, param: string): void {
        const length: number = parseInt(param);
        this.timerMaxAmount = length;
        event.target.parent.emit('length-set');
        this.init();
    }

    private hideReadyButton(): void {
        cc.tween(this.readyButton).to(0.5, {opacity: 0})
        .call(() => {
            this.readyButton.active = false;
        }).start();
        this.scheduleOnce(() => {
            this.stopButton.active = true;
            this.stopButton.opacity = 255;
        }, 0.25);
    }

    private playAnnouncer(): void {
        const clip: cc.AudioClip = this.announceClips[this.randomInt(0, this.announceClips.length - 1)];
        const id: number = cc.audioEngine.play(clip, false, 0.5);
        cc.audioEngine.setFinishCallback(id, () => {
            this.hideReadyButton();
            this.onTimerStart();
        });
    }

    private onTimerStart(): void {
        cc.audioEngine.play(this.startClip, false, 0.5);
        this.schedule(this.updateLabel, 1, this.timerMaxAmount - 1);

        if (this.isMusicOn) {
            this.musicId = cc.audioEngine.playMusic(this.musicClips[GameController.BOSS_ID], false);
        }

        this.maxTimerLabel.node.active = false;
        this.resetTimerLabel();

        this.canInteract = true;
    }

    private resetTimerLabel(): void {
        this.timerLabel.node.opacity = 255;
        this.timerLabel.node.color = new cc.Color(14, 31, 47);
        this.timerLabel.string = this.timerMaxAmount.toString();
        this.timerNumber = this.timerMaxAmount;
    }

    private updateLabel(): void {
        this.timerNumber -= 1;
        this.timerLabel.string = this.timerNumber.toString();

        if (this.timerNumber === 5) {
            this.timerLabel.node.color = new cc.Color(226, 78, 43);
            cc.audioEngine.play(this.alertClip, false, 0.5);
        }

        if (this.timerNumber === 0) {
            this.onTimerEnd();
        } else if (this.timerNumber === this.fadeTime) {
            this.fadeMusic(this.musicId);
        }
    }

    private onTimerEnd(): void {
        cc.audioEngine.play(this.endClip, false, 0.5);
        this.musicId = null;
        this.scheduleOnce(this.onStopPressed, 1.5);
    }

    private fadeMusic(id: number): void {
        let volume: number = this.musicVolume;
        this.node.scale = 1;
        cc.tween(this.node).to(this.fadeTime, { scale: 0 }, {
            progress: (start: number, end: number, current: number, ratio: number): number => {
                const progress = start + (end - start) * cc.easing.quadOut(ratio);
                volume = progress;
                cc.audioEngine.setVolume(id, volume);
                return progress;
            }
        }).start();
    }

    private randomInt = (min: number, max: number) => {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min; 
    }
    
}
