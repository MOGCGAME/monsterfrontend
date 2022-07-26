import G from "../Module/Global";
import httpMng from "../Module/HttpMng";
import usrMng from "../Module/UserMng";

const {ccclass, property} = cc._decorator;

@ccclass
export default class InfoPage extends cc.Component {

    @property(cc.Node)
    headimg: cc.Node = null;
    @property(cc.Label)
    nickname: cc.Label = null;
    @property(cc.Node)
    id: cc.Node = null;
    @property(cc.Node)
    edit_nickname: cc.Node = null;
    @property(cc.Node)
    rank3v3: cc.Node = null;
    @property(cc.Node)
    rank5v5: cc.Node = null;
    @property(cc.Node)
    btnSetting: cc.Node = null;
    @property(cc.Node)
    btnEdit: cc.Node = null;
    @property(cc.Node)
    btnSave: cc.Node = null;
    @property(cc.Node)
    btnCopy: cc.Node = null;
    @property(cc.Node)
    card3: cc.Node = null;
    @property(cc.Node)
    card5: cc.Node = null;
    @property(cc.Node)
    setting: cc.Node = null;
    @property(cc.Node)
    itemContent: cc.Node = null;
    @property(cc.Node)
    btnHeadicon: cc.Node = null;
    @property(cc.Node)
    btnHeadframe: cc.Node = null;
    @property(cc.Node)
    info: cc.Node = null;
    @property(cc.Node)
    popUp: cc.Node = null;

    rank: number;
    itemId: number;
    type: any;

    // LIFE-CYCLE CALLBACKS:
    
    // setting func
    showheadicon() {
        this.clearItem();
        httpMng.post("/user/getHeadIcon", {}, 
        (ret) => {
            for (var i = 0; i < 40; i++) {
                let frameCopy = cc.instantiate(this.itemContent.children[0]);
                frameCopy.active = true;
                this.itemContent.addChild(frameCopy);
                if(ret.icon[i]) {
                    let userIcon = ret.icon[i];
                    let item = frameCopy.getChildByName("Item");
                    if (userIcon.used == 1) {
                        cc.loader.loadRes(`headIcon/${userIcon.item_id}`, cc.SpriteFrame, function(err, spriteFrame) {
                            this.getComponent(cc.Sprite).spriteFrame = spriteFrame
                        }.bind(this.info.getChildByName("Avatar").getComponent(cc.Sprite)))
                        this.info.getChildByName("Name").getComponent(cc.Label).string = userIcon.item_name
                        this.info.getChildByName("Introduce").getComponent(cc.Label).string = userIcon.introduce
                        item.getChildByName("Used").active = true;
                    }
                    cc.loader.loadRes(`headIcon/${userIcon.item_id}`, cc.SpriteFrame, function(err, spriteFrame) {
                        this.getComponent(cc.Sprite).spriteFrame = spriteFrame
                    }.bind(item.getChildByName("Avatar").getComponent(cc.Sprite)))
                    cc.loader.loadRes(`icon/frameandbase/base1`, cc.SpriteFrame, function(err, spriteFrame) {
                        this.getComponent(cc.Sprite).spriteFrame = spriteFrame
                    }.bind(item.getChildByName("Base").getComponent(cc.Sprite)))
                    item.active = true;
                    item.on(cc.Node.EventType.TOUCH_END, () => {
                        this.itemId = userIcon.item_id
                        this.type = userIcon.type
                        cc.loader.loadRes(`headIcon/${userIcon.item_id}`, cc.SpriteFrame, function(err, spriteFrame) {
                            this.getComponent(cc.Sprite).spriteFrame = spriteFrame
                        }.bind(this.info.getChildByName("Avatar").getComponent(cc.Sprite)))
                        this.info.getChildByName("Name").getComponent(cc.Label).string = userIcon.item_name
                        this.info.getChildByName("Introduce").getComponent(cc.Label).string = userIcon.introduce
                    })
                }
            }
        })
    }

    showheadframe() {
        this.clearItem();
        httpMng.post("/user/getHeadFrame", {}, 
        (ret) => {
            for (var i = 0; i < 40; i++) {
                let frameCopy = cc.instantiate(this.itemContent.children[0]);
                frameCopy.active = true;
                this.itemContent.addChild(frameCopy);
                if(ret.frame[i]) {
                    let userFrame = ret.frame[i];
                    let item = frameCopy.getChildByName("Item");
                    if (userFrame.used == 1) {
                        cc.loader.loadRes(`frame/${userFrame.item_id}`, cc.SpriteFrame, function(err, spriteFrame) {
                            this.getComponent(cc.Sprite).spriteFrame = spriteFrame
                        }.bind(this.info.getChildByName("Avatar").getComponent(cc.Sprite)))
                        this.info.getChildByName("Name").getComponent(cc.Label).string = userFrame.item_name
                        this.info.getChildByName("Introduce").getComponent(cc.Label).string = userFrame.introduce
                        item.getChildByName("Used").active = true;
                    }
                    cc.loader.loadRes(`frame/${userFrame.item_id}`, cc.SpriteFrame, function(err, spriteFrame) {
                        this.getComponent(cc.Sprite).spriteFrame = spriteFrame
                    }.bind(item.getChildByName("Avatar").getComponent(cc.Sprite)))
                    cc.loader.loadRes(`icon/frameandbase/base1`, cc.SpriteFrame, function(err, spriteFrame) {
                        this.getComponent(cc.Sprite).spriteFrame = spriteFrame
                    }.bind(item.getChildByName("Base").getComponent(cc.Sprite)))
                    item.active = true;
                    item.on(cc.Node.EventType.TOUCH_END, () => {
                        this.itemId = userFrame.item_id
                        this.type = userFrame.type
                        cc.loader.loadRes(`frame/${userFrame.item_id}`, cc.SpriteFrame, function(err, spriteFrame) {
                            this.getComponent(cc.Sprite).spriteFrame = spriteFrame
                        }.bind(this.info.getChildByName("Avatar").getComponent(cc.Sprite)))
                        this.info.getChildByName("Name").getComponent(cc.Label).string = userFrame.item_name
                        this.info.getChildByName("Introduce").getComponent(cc.Label).string = userFrame.introduce
                    })
                }
            }
        })
    }

    clearItem() {
        let frame = this.itemContent.children[0];
        let item = frame.getChildByName("Item");
        frame.active = false;
        item.active = false;
        for (let i = 1; i < this.itemContent.childrenCount; i++) {
            this.itemContent.children[i].destroy();
        }
    }

    confirmupdate() {
        httpMng.post("/user/updateHead", { itemId: this.itemId, type: this.type }, 
        (ret) => {
            if (ret.code == "success") {
                var main = this.node.parent.parent
                for (let i = 0; i < this.itemContent.childrenCount; i++) {
                    this.itemContent.children[i].getChildByName("Item").getChildByName("Used").active = false;
                }
                this.itemContent.children[parseInt(ret.seq) + 1].getChildByName("Item").getChildByName("Used").active = true;
                console.log(this.itemContent.children[parseInt(ret.seq) + 1].getChildByName("Item").getChildByName("Used"))
                if (this.type == "icon") {
                    cc.loader.loadRes(`headIcon/${this.itemId}`, cc.SpriteFrame, function(err, spriteFrame) {
                        this.getComponent(cc.Sprite).spriteFrame = spriteFrame
                    }.bind(this.headimg.getChildByName("Icon").getComponent(cc.Sprite)))
                    cc.loader.loadRes(`headIcon/${this.itemId}`, cc.SpriteFrame, function(err, spriteFrame) {
                        this.getComponent(cc.Sprite).spriteFrame = spriteFrame
                    }.bind(main.getChildByName("UserInfo").getChildByName("HeadIcon").getChildByName("Avatar").getComponent(cc.Sprite)))
                } else if (this.type == "frame") {
                    cc.loader.loadRes(`frame/${this.itemId}`, cc.SpriteFrame, function(err, spriteFrame) {
                        this.getComponent(cc.Sprite).spriteFrame = spriteFrame
                    }.bind(this.headimg.getChildByName("Frame").getComponent(cc.Sprite)))
                    cc.loader.loadRes(`frame/${this.itemId}`, cc.SpriteFrame, function(err, spriteFrame) {
                        this.getComponent(cc.Sprite).spriteFrame = spriteFrame
                    }.bind(main.getChildByName("UserInfo").getChildByName("HeadIcon").getChildByName("Frame").getComponent(cc.Sprite)))
                }
            }
        })
    }

    backSetting() {
        this.setting.active = false;
    }

    showsetting() {
        this.setting.active = true;
        this.showheadicon();
    }

    edit() {
        this.btnEdit.active = false;
        this.btnSave.active = true;
        this.nickname.node.active = false;
        this.edit_nickname.getComponent(cc.EditBox).string = this.nickname.getComponent(cc.Label).string;
        this.edit_nickname.active = true;
    }

    save() {
        this.btnEdit.active = true;
        this.btnSave.active = false;
        
        let newNickname = this.edit_nickname.getComponent(cc.EditBox).string;
        
        httpMng.post("/user/updateNickname", { nickname: newNickname}, 
        (ret) => {
            console.log(ret)
            if(ret.code == "success"){
                this.nickname.getComponent(cc.Label).string = newNickname;
                this.edit_nickname.active = false;
                this.nickname.node.active = true;
                let mainPage = this.node.parent.parent
                let main_nickname = mainPage.getChildByName("UserInfo").getChildByName("NameFrame").getChildByName("Label")
                main_nickname.getComponent(cc.Label).string = newNickname
                this.popup("玩家昵称保存成功")
            }else{
                //
            }
        })
    }

    cancel(){

    }

    copy() {
        var text = this.id.getComponent(cc.Label).string;
        navigator.clipboard.writeText(text).then(function() {
            console.log('Async: Copying to clipboard was successful!');
        }, function(err) {
            console.error('Async: Could not copy text: ', err);
        });
        this.popup("玩家ID复制成功")
    }
    
    selfInit(info) {
        console.log(info)
        this.id.getComponent(cc.Label).string = info.uid
        this.nickname.string = info.nickname
        this.rank3v3.getChildByName("rank").getComponent(cc.Label).string = info.rank1
        this.rank5v5.getChildByName("rank").getComponent(cc.Label).string = info.rank2
        cc.loader.loadRes(`headIcon/${info.headicon}`, cc.SpriteFrame, function(err, spriteFrame) {
            this.getComponent(cc.Sprite).spriteFrame = spriteFrame
        }.bind(this.headimg.getChildByName("Icon").getComponent(cc.Sprite)))
        cc.loader.loadRes(`frame/${info.frame}`, cc.SpriteFrame, function(err, spriteFrame) {
            this.getComponent(cc.Sprite).spriteFrame = spriteFrame
        }.bind(this.headimg.getChildByName("Frame").getComponent(cc.Sprite)))
        if (info.m31) {
            cc.loader.loadRes(`monster/${info.m31}`, cc.SpriteFrame, function(err, spriteFrame) {
                this.getComponent(cc.Sprite).spriteFrame = spriteFrame
            }.bind(this.card3.children[1].getChildByName("Icon").getComponent(cc.Sprite)))
        }
        if (info.r31) {
            cc.loader.loadRes(`monster/infoframe/frame${info.r31}`, cc.SpriteFrame, function(err, spriteFrame) {
                this.getComponent(cc.Sprite).spriteFrame = spriteFrame
            }.bind(this.card3.children[1].getChildByName("Frame").getComponent(cc.Sprite)))
        }
        if (info.m32) {
            cc.loader.loadRes(`monster/${info.m32}`, cc.SpriteFrame, function(err, spriteFrame) {
                this.getComponent(cc.Sprite).spriteFrame = spriteFrame
            }.bind(this.card3.children[2].getChildByName("Icon").getComponent(cc.Sprite)))
        }
        if (info.r32) {
            cc.loader.loadRes(`monster/infoframe/frame${info.r32}`, cc.SpriteFrame, function(err, spriteFrame) {
                this.getComponent(cc.Sprite).spriteFrame = spriteFrame
            }.bind(this.card3.children[2].getChildByName("Frame").getComponent(cc.Sprite)))
        }
        if (info.m33) {
            cc.loader.loadRes(`monster/${info.m33}`, cc.SpriteFrame, function(err, spriteFrame) {
                this.getComponent(cc.Sprite).spriteFrame = spriteFrame
            }.bind(this.card3.children[3].getChildByName("Icon").getComponent(cc.Sprite)))
        }
        if (info.r33) {
            cc.loader.loadRes(`monster/infoframe/frame${info.r33}`, cc.SpriteFrame, function(err, spriteFrame) {
                this.getComponent(cc.Sprite).spriteFrame = spriteFrame
            }.bind(this.card3.children[3].getChildByName("Frame").getComponent(cc.Sprite)))
        }
        if (info.m51) {
            cc.loader.loadRes(`monster/${info.m51}`, cc.SpriteFrame, function(err, spriteFrame) {
                this.getComponent(cc.Sprite).spriteFrame = spriteFrame
            }.bind(this.card5.children[1].getChildByName("Icon").getComponent(cc.Sprite)))
        }
        if (info.r51) {
            cc.loader.loadRes(`monster/infoframe/frame${info.r51}`, cc.SpriteFrame, function(err, spriteFrame) {
                this.getComponent(cc.Sprite).spriteFrame = spriteFrame
            }.bind(this.card5.children[1].getChildByName("Frame").getComponent(cc.Sprite)))
        }
        if (info.m52) {
            cc.loader.loadRes(`monster/${info.m52}`, cc.SpriteFrame, function(err, spriteFrame) {
                this.getComponent(cc.Sprite).spriteFrame = spriteFrame
            }.bind(this.card5.children[2].getChildByName("Icon").getComponent(cc.Sprite)))
        }
        if (info.r52) {
            cc.loader.loadRes(`monster/infoframe/frame${info.r52}`, cc.SpriteFrame, function(err, spriteFrame) {
                this.getComponent(cc.Sprite).spriteFrame = spriteFrame
            }.bind(this.card5.children[2].getChildByName("Frame").getComponent(cc.Sprite)))
        }
        if (info.m53) {
            cc.loader.loadRes(`monster/${info.m53}`, cc.SpriteFrame, function(err, spriteFrame) {
                this.getComponent(cc.Sprite).spriteFrame = spriteFrame
            }.bind(this.card5.children[3].getChildByName("Icon").getComponent(cc.Sprite)))
        }
        if (info.r53) {
            cc.loader.loadRes(`monster/infoframe/frame${info.r53}`, cc.SpriteFrame, function(err, spriteFrame) {
                this.getComponent(cc.Sprite).spriteFrame = spriteFrame
            }.bind(this.card5.children[3].getChildByName("Frame").getComponent(cc.Sprite)))
        }
        if (info.m54) {
            cc.loader.loadRes(`monster/${info.m54}`, cc.SpriteFrame, function(err, spriteFrame) {
                this.getComponent(cc.Sprite).spriteFrame = spriteFrame
            }.bind(this.card5.children[4].getChildByName("Icon").getComponent(cc.Sprite)))
        }
        if (info.r54) {
            cc.loader.loadRes(`monster/infoframe/frame${info.r54}`, cc.SpriteFrame, function(err, spriteFrame) {
                this.getComponent(cc.Sprite).spriteFrame = spriteFrame
            }.bind(this.card5.children[4].getChildByName("Frame").getComponent(cc.Sprite)))
        }
        if (info.m55) {
            cc.loader.loadRes(`monster/${info.m55}`, cc.SpriteFrame, function(err, spriteFrame) {
                this.getComponent(cc.Sprite).spriteFrame = spriteFrame
            }.bind(this.card5.children[5].getChildByName("Icon").getComponent(cc.Sprite)))
        }
        if (info.r55) {
            cc.loader.loadRes(`monster/infoframe/frame${info.r55}`, cc.SpriteFrame, function(err, spriteFrame) {
                this.getComponent(cc.Sprite).spriteFrame = spriteFrame
            }.bind(this.card5.children[5].getChildByName("Frame").getComponent(cc.Sprite)))
        }
    }

    init(info, mode) {
        this.btnSetting.active = false;
        this.btnCopy.active = false;
        this.btnEdit.active = false;
        this.id.getComponent(cc.Label).string = info.uid
        this.nickname.string = info.nickname
        cc.loader.loadRes(`headIcon/${info.headicon}`, cc.SpriteFrame, function(err, spriteFrame) {
            this.getComponent(cc.Sprite).spriteFrame = spriteFrame
        }.bind(this.headimg.getChildByName("Icon").getComponent(cc.Sprite)))
        cc.loader.loadRes(`frame/${info.frame}`, cc.SpriteFrame, function(err, spriteFrame) {
            this.getComponent(cc.Sprite).spriteFrame = spriteFrame
        }.bind(this.headimg.getChildByName("Frame").getComponent(cc.Sprite)))
        if (mode != 0) {
            if (mode == 3) {
                this.rank3v3.getChildByName("rank").getComponent(cc.Label).string = info.rank1
                this.rank5v5.active = false;
                this.card5.active = false;
                this.card3.y = -150;
                this.card3.x = 0;
                if (info.m31) {
                    cc.loader.loadRes(`monster/${info.m31}`, cc.SpriteFrame, function(err, spriteFrame) {
                        this.getComponent(cc.Sprite).spriteFrame = spriteFrame
                    }.bind(this.card3.children[1].getChildByName("Icon").getComponent(cc.Sprite)))
                }
                if (info.r31) {
                    cc.loader.loadRes(`monster/infoframe/frame${info.r31}`, cc.SpriteFrame, function(err, spriteFrame) {
                        this.getComponent(cc.Sprite).spriteFrame = spriteFrame
                    }.bind(this.card3.children[1].getChildByName("Frame").getComponent(cc.Sprite)))
                }
                if (info.m32) {
                    cc.loader.loadRes(`monster/${info.m32}`, cc.SpriteFrame, function(err, spriteFrame) {
                        this.getComponent(cc.Sprite).spriteFrame = spriteFrame
                    }.bind(this.card3.children[2].getChildByName("Icon").getComponent(cc.Sprite)))
                }
                if (info.r32) {
                    cc.loader.loadRes(`monster/infoframe/frame${info.r32}`, cc.SpriteFrame, function(err, spriteFrame) {
                        this.getComponent(cc.Sprite).spriteFrame = spriteFrame
                    }.bind(this.card3.children[2].getChildByName("Frame").getComponent(cc.Sprite)))
                }
                if (info.m33) {
                    cc.loader.loadRes(`monster/${info.m33}`, cc.SpriteFrame, function(err, spriteFrame) {
                        this.getComponent(cc.Sprite).spriteFrame = spriteFrame
                    }.bind(this.card3.children[3].getChildByName("Icon").getComponent(cc.Sprite)))
                }
                if (info.r33) {
                    cc.loader.loadRes(`monster/infoframe/frame${info.r33}`, cc.SpriteFrame, function(err, spriteFrame) {
                        this.getComponent(cc.Sprite).spriteFrame = spriteFrame
                    }.bind(this.card3.children[3].getChildByName("Frame").getComponent(cc.Sprite)))
                }
            } else {
                this.rank5v5.getChildByName("rank").getComponent(cc.Label).string = info.rank2
                this.rank3v3.active = false;
                this.rank5v5.y = 20;
                this.card3.active = false;
                this.card5.y = -150;
                this.card5.x = 0;
                if (info.r51) {
                    cc.loader.loadRes(`monster/infoframe/frame${info.r51}`, cc.SpriteFrame, function(err, spriteFrame) {
                        this.getComponent(cc.Sprite).spriteFrame = spriteFrame
                    }.bind(this.card5.children[1].getChildByName("Frame").getComponent(cc.Sprite)))
                }
                if (info.m51) {
                    cc.loader.loadRes(`monster/${info.m51}`, cc.SpriteFrame, function(err, spriteFrame) {
                        this.getComponent(cc.Sprite).spriteFrame = spriteFrame
                    }.bind(this.card5.children[1].getChildByName("Icon").getComponent(cc.Sprite)))
                }
                if (info.r52) {
                    cc.loader.loadRes(`monster/infoframe/frame${info.r52}`, cc.SpriteFrame, function(err, spriteFrame) {
                        this.getComponent(cc.Sprite).spriteFrame = spriteFrame
                    }.bind(this.card5.children[2].getChildByName("Frame").getComponent(cc.Sprite)))
                }
                if (info.m52) {
                    cc.loader.loadRes(`monster/${info.m52}`, cc.SpriteFrame, function(err, spriteFrame) {
                        this.getComponent(cc.Sprite).spriteFrame = spriteFrame
                    }.bind(this.card5.children[2].getChildByName("Icon").getComponent(cc.Sprite)))
                }
                if (info.r53) {
                    cc.loader.loadRes(`monster/infoframe/frame${info.r53}`, cc.SpriteFrame, function(err, spriteFrame) {
                        this.getComponent(cc.Sprite).spriteFrame = spriteFrame
                    }.bind(this.card5.children[3].getChildByName("Frame").getComponent(cc.Sprite)))
                }
                if (info.m53) {
                    cc.loader.loadRes(`monster/${info.m53}`, cc.SpriteFrame, function(err, spriteFrame) {
                        this.getComponent(cc.Sprite).spriteFrame = spriteFrame
                    }.bind(this.card5.children[3].getChildByName("Icon").getComponent(cc.Sprite)))
                }
                if (info.r54) {
                    cc.loader.loadRes(`monster/infoframe/frame${info.r54}`, cc.SpriteFrame, function(err, spriteFrame) {
                        this.getComponent(cc.Sprite).spriteFrame = spriteFrame
                    }.bind(this.card5.children[4].getChildByName("Frame").getComponent(cc.Sprite)))
                }
                if (info.m54) {
                    cc.loader.loadRes(`monster/${info.m54}`, cc.SpriteFrame, function(err, spriteFrame) {
                        this.getComponent(cc.Sprite).spriteFrame = spriteFrame
                    }.bind(this.card5.children[4].getChildByName("Icon").getComponent(cc.Sprite)))
                }
                if (info.r55) {
                    cc.loader.loadRes(`monster/infoframe/frame${info.r55}`, cc.SpriteFrame, function(err, spriteFrame) {
                        this.getComponent(cc.Sprite).spriteFrame = spriteFrame
                    }.bind(this.card5.children[5].getChildByName("Frame").getComponent(cc.Sprite)))
                }
                if (info.m55) {
                    cc.loader.loadRes(`monster/${info.m55}`, cc.SpriteFrame, function(err, spriteFrame) {
                        this.getComponent(cc.Sprite).spriteFrame = spriteFrame
                    }.bind(this.card5.children[5].getChildByName("Icon").getComponent(cc.Sprite)))
                }  
            }
        }
    }

    back() {
        this.node.destroy();
    }

    popup(popUpStr){
        this.popUp.getChildByName("Label").getComponent(cc.Label).string = popUpStr
        this.popUp.active = true
        this.scheduleOnce(function(){
            this.popUp.active = false
        }, 2)
    }

    onLoad () {

    }

    start () {

    }

    // update (dt) {}
}
