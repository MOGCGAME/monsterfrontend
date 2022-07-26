

const {ccclass, property} = cc._decorator;

@ccclass
class Global extends cc.Component {
  
  //for basic info
  nickName: string = ""
  
  //for head icon
  iconHeadSprite: any

  //for frame
  frameSprite: any

  //for gender
  genderSprite: any

  //for gamecoin
  shldGameCoinUpdate = false

  ccNodes: Map<string, cc.Node> = new Map<string, cc.Node>();

  displayError ( parent, errMessageString, animationTime = 2, angle = 0 ) {
      var animationTime = animationTime
      var errMessageWrapper = new cc.Node('NEW ERR MESSAGE WRAPPER');
      var errMessage = new cc.Node('NEW ERR MESSAGE');
      var errMessageLabel = errMessage.addComponent(cc.Label)
      var errMessageLabelOutline = errMessage.addComponent(cc.LabelOutline)
      var errMessageSprite = errMessageWrapper.addComponent(cc.Sprite)
      errMessage.color = cc.Color.WHITE
      errMessage.x = 0
      errMessage.y = 0
      errMessageWrapper.x = 0
      errMessageWrapper.y = 0
  
      cc.loader.loadRes(`game/haochehui/background/BenzBMW_tip_bg_small`, cc.SpriteFrame, function (err, spriteFrame) {
        this.spriteFrame = spriteFrame
      }.bind(errMessageSprite))
  
      errMessageSprite.sizeMode = cc.Sprite.SizeMode.CUSTOM;
      errMessageSprite.trim = false;
      errMessageWrapper.width = 862
      errMessageWrapper.height = 50
  
      errMessageLabelOutline.color = cc.Color.BLACK
      errMessageLabel.enableWrapText = false;
      errMessageLabel.fontSize = 30
      errMessageLabel.lineHeight = 30
      errMessageLabel.string = errMessageString
      // this.overallWrapper.addChild(errMessage)
      errMessageWrapper.addChild ( errMessage )
      errMessageWrapper.angle = angle
      parent.node.addChild (errMessageWrapper);
  
      parent.scheduleOnce(function(){ // errtimeout
        errMessageWrapper.destroy()
      }.bind(this), animationTime);
  }

  createGameObjectwithBackgroundThatBlocksInput(parent: cc.Node, child: cc.Prefab): cc.Node {
    //console.log(child);
    var childNode = cc.instantiate(child)
    if (this.ccNodes.has(child.name) == false) {
      var backgroundNode = new cc.Node();
      var sprite = backgroundNode.addComponent(cc.Sprite);
      cc.loader.loadRes("lobby/abackground/gl_loading_bg", cc.SpriteFrame, (err, spriteframe) => {
        if (err == null) {
          sprite.spriteFrame = spriteframe;
        }
        var widget = backgroundNode.addComponent(cc.Widget);
        backgroundNode.addComponent(cc.BlockInputEvents);
        widget.isAlignBottom = true;
        widget.isAlignTop = true;
        widget.isAlignLeft = true;
        widget.isAlignRight = true;
        widget.bottom = 0;
        widget.top = 0;
        widget.left = 0;
        widget.right = 0;
        parent.addChild(backgroundNode, cc.macro.MAX_ZINDEX - 2);
        //backgroundNode.opacity = 100;
        parent.addChild(childNode, cc.macro.MAX_ZINDEX - 1);
        this.ccNodes.set("background" + childNode.uuid, backgroundNode);
        this.ccNodes.set(childNode.uuid, childNode);
        //console.log(this.ccNodes.has(childNode.uuid));
        //spriteframe.addRef();
      })
      return childNode;
    }
  }

  destroyGameObjectwithBackgroundThatBlocksInput(uuid: string) {
    if (this.ccNodes.has(uuid) == true) {
      var ccNode: cc.Node = this.ccNodes.get(uuid);
      //Not sure if deleting the background is enough
      // ccNode.parent.removeChild(ccNode, true); // wk: this is redundant
      //ccNode.getComponent(cc.Sprite).spriteFrame.decRef();
      ccNode.destroy();
      var background: cc.Node = this.ccNodes.get("background" + uuid);
      background.parent.removeChild(background, true);
      background.destroy();
      this.ccNodes.delete(uuid);
      this.ccNodes.delete("background" + uuid);
    }
  }
}
var G = new Global()
export default G