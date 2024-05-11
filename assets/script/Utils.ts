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

}