import TimerController from "./TimerController";

const {ccclass, property} = cc._decorator;

@ccclass
export default class GradeController extends cc.Component {

    @property(cc.Sprite)
    private gradeSprite: cc.Sprite = null;
    @property(cc.Sprite)
    private iconSprite: cc.Sprite = null;
    @property([cc.SpriteFrame])
    private gradeFrames: cc.SpriteFrame[] = [];
    @property([cc.SpriteFrame])
    private iconFrames: cc.SpriteFrame[] = [];
    @property([cc.EditBox])
    private params: cc.EditBox[] = [];

    private resultMatrix: number[][] = [
    //  id, 1p, 2p,  3p,  4p
        [0, 55, 100, 160, 220],
        [1, 50, 95, 155, 215],
        [2, 45, 90, 145, 195],
        [3, 40, 85, 135, 175],
        [4, 35, 80, 125, 155],
        [5, 30, 75, 110, 130],
        [6, 25, 70, 90, 105],
        [7, 20, 65, 70, 80],
        [8, 15, 55, 50, 55],
        [9, 10, 45, 30, 30],
        [10, 5, 25, 15, 15],
        [11, 0, 25, 5, 5],
        [12, 0, 15, 0, 0],
    ];

    private onInputBegan(component: cc.EditBox): void {
        component.string = '';
        component.placeholder = '';
    }

    private onInputEnded(component: cc.EditBox): void {
        if (component.string === '') {
            component.string = '0';
            component.placeholder = '0';
        }
    }

    private onFinalGradePressed(): void {
        const players: number = parseInt(this.params[0].string);
        const hp: number = parseInt(this.params[1].string);
        const parry: number = parseInt(this.params[2].string);
        const wallops: number = parseInt(this.params[3].string);
        const time: number = parseInt(this.params[4].string);
        const timer: number = TimerController.TIMER_LENGTH;

        console.log({
            players: players,
            hp: hp,
            parry: parry,
            wallops: wallops,
            time: time,
            timer: timer
        });

        let result: number = 0;
        result += hp * 10;
        result += parry * 5;
        result += wallops * 5;
        result += time * -10;
        if (timer < 20 && timer >= 15) {
            result += 10;
        } else if (timer < 20 && timer >= 10) {
            result += 20;
        }

        console.log('Result: ', result);
        console.log(this.resultMatrix[0][players]);

        if (result <= 0 || (players === 2) && result <= 15) {
            this.setResult(this.resultMatrix.length - 1);
            return;
        }

        for (let i: number = 0; i < this.resultMatrix.length; i++) {
            const element: number[] = this.resultMatrix[i];
            if (element[players] > result) {
                continue;
            } else if (element[players] === result) {
                this.setResult(element[0]);
                break;
            } else if (element[players] < result && this.resultMatrix[i + 1][players] < result) {
                this.setResult(this.resultMatrix[i - 1][0]);
                break;
            }
            
        }
    }

    private setResult(id: number) {
        console.log('ID: ', id);
        this.gradeSprite.spriteFrame = this.gradeFrames[id];
        if (id > 2 && id <= 5) {
            this.iconSprite.spriteFrame = this.iconFrames[1];
        } else if (id > 5 && id <= 8) {
            this.iconSprite.spriteFrame = this.iconFrames[2];
        } else if (id > 8 && id <= 11) {
            this.iconSprite.spriteFrame = this.iconFrames[3];
        } else if (id > 11) {
            this.iconSprite.spriteFrame = this.iconFrames[4];
        }
    }

    private onBackPressed(): void {
        cc.audioEngine.stopMusic();
        cc.director.loadScene(cc.director.getScene().name);
    }
}
