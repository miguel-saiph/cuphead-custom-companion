import config from "./Config";

export default class Utils {

    public static fadeOutNode(node: cc.Node, duration: number = 0.5, callback?: Function): void {
        node.opacity = 255;
        cc.tween(node).to(duration, { opacity: 0 })
        .call(() => {
            node.active = false;
            if (callback) {
                callback();
            }
        }).start();
    }

    public static fadeInNode(node: cc.Node, duration: number = 0.5, callback?: Function): void {
        node.opacity = 0;
        cc.tween(node).to(duration, { opacity: 255 })
        .call(() => {
            node.active = true;
            if (callback) {
                callback();
            }
        }).start();
    }

    public static screenTransition(screen1: cc.Node, screen2: cc.Node, ctrl: cc.Component, callback?: Function): void {
        screen1.opacity = 255;
        cc.tween(screen1).to(config.transitionDuration, {opacity: 0})
        .call(() => {
            screen1.active = false;
        }).start();
        ctrl.scheduleOnce(() => {
            screen2.active = true;
            screen2.opacity = 255;
            if (callback) {
                callback();
            }
        }, 0.4);
    }

}