import G from "../Module/Global";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Panel extends cc.Component {

    closePanel(){
        G.destroyGameObjectwithBackgroundThatBlocksInput(this.node.uuid);
    }

    closePrefab() {
        this.node.active = false;
    }

    blockBackPanel(){
        //G.destroyGameObjectwithBackgroundThatBlocksInput(this.node.uuid);
    }

    closePreviousPanel(){
        G.destroyGameObjectwithBackgroundThatBlocksInput(this.node.uuid);                                       //reward
        G.destroyGameObjectwithBackgroundThatBlocksInput(this.node.parent.uuid);                                //result
        G.destroyGameObjectwithBackgroundThatBlocksInput(this.node.parent.parent.uuid);                         //battle
        G.destroyGameObjectwithBackgroundThatBlocksInput(this.node.parent.parent.parent.uuid);                  //match
        G.destroyGameObjectwithBackgroundThatBlocksInput(this.node.parent.parent.parent.parent.uuid);           //room
        G.destroyGameObjectwithBackgroundThatBlocksInput(this.node.parent.parent.parent.parent.parent.uuid);    //join
    }

    backToMainPage(){
        cc.director.loadScene("Game")
    }

    // onLoad () {}

    start () {

    }

    // update (dt) {}
}
