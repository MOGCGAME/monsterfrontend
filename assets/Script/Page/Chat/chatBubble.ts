const {ccclass, property} = cc._decorator;

@ccclass
export default class chatBubble extends cc.Component {

    @property(cc.Label)
    chatLabel: cc.Label = null;
    @property(cc.Label)
    chatMessage: cc.Label = null;
    @property(cc.Sprite)
    userImage: cc.Sprite = null;
    @property(cc.Label)
    timeLabel: cc.Label = null;

    init(label, message, faceUri, time) {
        this.timeLabel.string = time
        this.chatLabel.string = label // user name
        this.chatMessage.string = message
        if (faceUri) {
            cc.loader.loadRes(`headIcon/${faceUri}`, cc.SpriteFrame, function(err, spriteFrame) {
                this.getComponent(cc.Sprite).spriteFrame = spriteFrame
            }.bind(this.userImage.getComponent(cc.Sprite)))
        }
    }
    adjustChatMessage() {
        if (this.chatMessage.node.width > 820){
            this.chatMessage.overflow = cc.Label.Overflow.SHRINK
            this.chatMessage.node.width = 410
            this.chatMessage.node.height = 200
            this.chatMessage.node.parent.height = 200
            this.node.height = 270
        }else if (this.chatMessage.node.width > 410) {
            this.chatMessage.overflow = cc.Label.Overflow.SHRINK
            this.chatMessage.node.width = 410
            this.chatMessage.node.height = 100
            this.chatMessage.node.parent.height = 100
            this.node.height = 160
        }
    }

    // onLoad () {}

    start () {

    }

    // update (dt) {}
}
