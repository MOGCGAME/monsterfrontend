import httpMng from "../Module/HttpMng";
import usrMng from "../Module/UserMng";

const {ccclass, property} = cc._decorator;

@ccclass
export default class FriendPage extends cc.Component {

    @property(cc.Node)
    detailbar: cc.Node = null;
    @property(cc.Node)
    friendList: cc.Node = null;
    @property(cc.Node)
    addFriendPanel: cc.Node = null;
    @property(cc.Node)
    requestFriendPanel: cc.Node = null;
    @property(cc.Node)
    chatListPanel: cc.Node = null;
    @property(cc.Node)
    chatPanel: cc.Node = null;
    @property(cc.Node)
    friendContent: cc.Node = null;
    
    @property(cc.Node)
    addFriendContent: cc.Node = null;
    @property(cc.EditBox)
    searchFriend: cc.EditBox = null;

    @property(cc.Node)
    requestFriendContent: cc.Node = null;
    @property(cc.Node)
    chatListContent: cc.Node = null;

    @property(cc.Prefab)
    prefabChatOthers: cc.Prefab = null;
    @property(cc.Prefab)
    prefabChatMe: cc.Prefab = null;
    @property(cc.ScrollView)
    scrollViewChat: cc.ScrollView = null;
    @property(cc.EditBox)
    editBoxSendChat: cc.EditBox = null;
    @property(cc.Node)
    messageCointainer: cc.Node = null;

    @property(cc.Node)
    errorMessage: cc.Node = null;

    @property(cc.Node)
    confirmPanel: cc.Node = null;
    @property(cc.Node)
    infoPanel: cc.Node = null;

    @property(cc.Node)
    noFriendLabel: cc.Node = null;

    static instance: FriendPage;

    friendInfo: any;
    currentChat: any;
    addFriendInfo: any;
    requestFriendInfo = new Array();;

    onLoad () {
        FriendPage.instance = this;
        this.clearList();
        this.friendList.active = true;
        this.changeColor(0);
        this.getFriendList();
    }

    showFriendList() {
        this.hideAll();
        this.friendList.active = true;
        this.changeColor(0);
        this.getFriendList();
    }

    showAddFriendPanel() {
        this.hideAll();
        this.addFriendPanel.active = true;
        this.changeColor(1);
        this.clearAddList();
    }

    showRequestFriendPanel() {
        this.hideAll();
        this.requestFriendPanel.active = true;
        this.changeColor(2);
        this.clearRequestList();
        this.requestFriendList();
    }

    showChatList() {
        this.hideAll();
        this.chatListPanel.active = true;
        this.changeColor(3);
        this.getChatList();
    }

    showMessagePanel(friendInfo) {
        this.chatPanel.active = true;
        this.currentChat = friendInfo.uid
        this.getMsg(this.currentChat);
        this.node.parent.getChildByName("TopBar").getComponent("TopBar").setBlockInputEvents(true);
    }

    closeMessagePanel(){
        this.chatPanel.active = false;
        this.node.parent.getChildByName("TopBar").getComponent("TopBar").setBlockInputEvents(false);
    }

    hideAll() {
        this.friendList.active = false;
        this.addFriendPanel.active = false;
        this.requestFriendPanel.active = false;
        this.chatListPanel.active = false;
        this.chatPanel.active = false;
        this.detailbar.getChildByName("Btns").children[0].color = new cc.Color(255, 255, 255)
        this.detailbar.getChildByName("Btns").children[1].color = new cc.Color(255, 255, 255)
        this.detailbar.getChildByName("Btns").children[2].color = new cc.Color(255, 255, 255)
        this.detailbar.getChildByName("Btns").children[3].color = new cc.Color(255, 255, 255)
    }

    changeColor(i) {
        var buttons = this.detailbar.getChildByName("Btns").children
        var activeButtonSpriteStr = "new/好友/好友_启动按钮"
        var inactiveButtonSpriteStr = "new/好友/好友_未启动按钮"
        for(let x = 0; x < buttons.length; x++){
            if (x == i){
                cc.loader.loadRes(activeButtonSpriteStr, cc.SpriteFrame, function(err, spriteFrame) {
                    this.getComponent(cc.Sprite).spriteFrame = spriteFrame
                }.bind(buttons[x].getComponent(cc.Sprite)))
                cc.loader.loadRes(activeButtonSpriteStr, cc.SpriteFrame, function(err, spriteFrame) {
                    this.getComponent(cc.Button).normalSprite = spriteFrame
                }.bind(buttons[x].getComponent(cc.Button))) 
                buttons[x].getComponent(cc.Button).enabled = false;
            }else{
                cc.loader.loadRes(inactiveButtonSpriteStr, cc.SpriteFrame, function(err, spriteFrame) {
                    this.getComponent(cc.Sprite).spriteFrame = spriteFrame
                }.bind(buttons[x].getComponent(cc.Sprite)))
                cc.loader.loadRes(inactiveButtonSpriteStr, cc.SpriteFrame, function(err, spriteFrame) {
                    this.getComponent(cc.Button).normalSprite = spriteFrame
                }.bind(buttons[x].getComponent(cc.Button))) 
                buttons[x].getComponent(cc.Button).enabled = true;
            }
        }
        // this.detailbar.getChildByName("Btns").children[i].color = new cc.Color(255, 0, 0)
    }

    clearList() {
        let frame = this.friendContent.children[0];
        let friend = frame.getChildByName("Friend");
        frame.active = false;
        friend.active = false;
        for (let i = 1; i < this.friendContent.childrenCount; i++) {
            this.friendContent.children[i].destroy();
        }
    }

    getFriendList() {
        this.clearList();
        httpMng.post("/friend/getFriendList", {}, 
        (ret) => {
            if(ret.friendList){
                this.noFriendLabel.active = false
                for (var i = 0; i < ret.friendList.length; i++) {
                    let frameCopy = cc.instantiate(this.friendContent.children[0])
                    frameCopy.active = true;
                    this.friendContent.addChild(frameCopy);
                    if (ret.friendList[i]) {
                        let userFriendInfo = ret.friendList[i];
                        let friend = frameCopy.getChildByName("Friend");
                        cc.loader.loadRes(`icon/frameandbase/base3`, cc.SpriteFrame, function(err, spriteFrame) {
                            this.getComponent(cc.Sprite).spriteFrame = spriteFrame
                        }.bind(friend.getChildByName("Base").getComponent(cc.Sprite)))
                        cc.loader.loadRes(`icon/frameandbase/frame${userFriendInfo.frame}`, cc.SpriteFrame, function(err, spriteFrame) {
                            this.getComponent(cc.Sprite).spriteFrame = spriteFrame
                        }.bind(friend.getChildByName("Frame").getComponent(cc.Sprite)))
                        cc.loader.loadRes(`headIcon/${userFriendInfo.avatar}`, cc.SpriteFrame, function(err, spriteFrame) {
                            this.getComponent(cc.Sprite).spriteFrame = spriteFrame
                        }.bind(friend.getChildByName("Avatar").getComponent(cc.Sprite)))
                        friend.getChildByName("Name").getComponent(cc.Label).string = userFriendInfo.nickname;
                        friend.active = true;
                        //chat
                        friend.getChildByName("btn").getChildByName("chat").on(cc.Node.EventType.TOUCH_END, () => {
                            this.friendInfo = userFriendInfo;
                            console.log(this.friendInfo)
                            this.showMessagePanel(this.friendInfo);
                        })
                        //unfriend
                        friend.getChildByName("btn").getChildByName("unfriend").on(cc.Node.EventType.TOUCH_END, () => {
                            this.friendInfo = userFriendInfo;
                            this.confirmPanel.getChildByName("title").getComponent(cc.Label).string = "确认删除好友？"
                            this.confirmPanel.active = true;
                        })
                        // confirm del
                        this.confirmPanel.getChildByName("btn").getChildByName("confirm").on(cc.Node.EventType.TOUCH_END, () => {
                            console.log("DELETE this.friendInfo.uid = ", this.friendInfo.uid)
                            httpMng.post("/friend/deleteFriend", { friendid: this.friendInfo.uid }, 
                            (ret) => {
                                if(ret){
                                    this.appearInfoPanel( "已删除好友")
                                    this.getFriendList();
                                }
                            })
                        })
                        // cancel
                        this.confirmPanel.getChildByName("btn").getChildByName("cancel").on(cc.Node.EventType.TOUCH_END, () => {
                            this.confirmPanel.active = false; 
                        })
                    }
                }
            }else{
                this.noFriendLabel.active = true
            }
        })
    }

    clearAddList() {
        let frame = this.addFriendContent.children[0];
        let friend = frame.getChildByName("Friend");
        frame.active = false;
        friend.active = false;
        for (let i = 1; i < this.addFriendContent.childrenCount; i++) {
            this.addFriendContent.children[i].destroy();
        }
    }

    addFriendList() {
        this.clearAddList();
        httpMng.post("/friend/searchFriend", { friendid: this.searchFriend.string }, 
        (ret) => {
            if(ret.strangerList == null){
                this.appearInfoPanel("玩家ID错误")
            } else {
                for (var i = 0; i < 20; i++) {
                    let frameCopy = cc.instantiate(this.addFriendContent.children[0])
                    frameCopy.active = true;
                    this.addFriendContent.addChild(frameCopy);
                    if (ret.strangerList[i]) {
                        let userStrangerInfo = ret.strangerList[i];
                        let friend = frameCopy.getChildByName("Friend");
                        cc.loader.loadRes(`icon/frameandbase/base3`, cc.SpriteFrame, function(err, spriteFrame) {
                            this.getComponent(cc.Sprite).spriteFrame = spriteFrame
                        }.bind(friend.getChildByName("Base").getComponent(cc.Sprite)))
                        cc.loader.loadRes(`icon/frameandbase/frame${userStrangerInfo.frame}`, cc.SpriteFrame, function(err, spriteFrame) {
                            this.getComponent(cc.Sprite).spriteFrame = spriteFrame
                        }.bind(friend.getChildByName("Frame").getComponent(cc.Sprite)))
                        cc.loader.loadRes(`headIcon/${userStrangerInfo.head_icon}`, cc.SpriteFrame, function(err, spriteFrame) {
                            this.getComponent(cc.Sprite).spriteFrame = spriteFrame
                        }.bind(friend.getChildByName("Avatar").getComponent(cc.Sprite)))
                        friend.getChildByName("Name").getComponent(cc.Label).string = userStrangerInfo.nick_name;
                        friend.active = true;
                        this.addFriendInfo = userStrangerInfo.uid;
                    }
                }
            }
        })
        this.searchFriend.string = ""
    }

    addFriend() {
        httpMng.post("/friend/addFriend", { friendid: this.addFriendInfo }, 
        (ret) => {
            console.log(ret)
            var errorTitle = ""
            if (ret.code == 1) {
                errorTitle = "已添加"
            } else if (ret.code == 2) {
                errorTitle = "已为好友"
            } else if (ret.code == 4) {
                errorTitle = "不能添加自己为好友"
            } else{
                errorTitle = "添加成功"
            }
            this.appearErrorMessage(errorTitle)
        })
    }

    clearRequestList() {
        let frame = this.requestFriendContent.children[0];
        let friend = frame.getChildByName("Friend");
        frame.active = false;
        friend.active = false;
        for (let i = 1; i < this.requestFriendContent.childrenCount; i++) {
            this.requestFriendContent.children[i].destroy();
        }
    }

    requestFriendList() {
        this.clearRequestList();
        httpMng.post("/friend/getFriendRequest", {}, 
        (ret) => {
            if(ret.requestList == null){
                this.requestFriendPanel.getChildByName("Notice").active = true;
            }
            else if(ret.requestList.length >= 1) {
                this.requestFriendPanel.getChildByName("Notice").active = false;
                for (var i = 0; i < 20; i++) {
                    let frameCopy = cc.instantiate(this.requestFriendContent.children[0])
                    frameCopy.active = true;
                    this.requestFriendContent.addChild(frameCopy);
                    if (ret.requestList[i]) {
                        let userRequestInfo = ret.requestList[i];
                        let friend = frameCopy.getChildByName("Friend");
                        cc.loader.loadRes(`icon/frameandbase/base3`, cc.SpriteFrame, function(err, spriteFrame) {
                            this.getComponent(cc.Sprite).spriteFrame = spriteFrame
                        }.bind(friend.getChildByName("Base").getComponent(cc.Sprite)))
                        cc.loader.loadRes(`icon/frameandbase/frame${userRequestInfo.frame}`, cc.SpriteFrame, function(err, spriteFrame) {
                            this.getComponent(cc.Sprite).spriteFrame = spriteFrame
                        }.bind(friend.getChildByName("Frame").getComponent(cc.Sprite)))
                        cc.loader.loadRes(`headIcon/${userRequestInfo.avatar}`, cc.SpriteFrame, function(err, spriteFrame) {
                            this.getComponent(cc.Sprite).spriteFrame = spriteFrame
                        }.bind(friend.getChildByName("Avatar").getComponent(cc.Sprite)))
                        friend.getChildByName("Name").getComponent(cc.Label).string = userRequestInfo.nickname;
                        //friend.getChildByName("btn").getChildByName("accept").getComponent(cc.Button).clickEvents[0].customEventData = String(i)
                        friend.active = true;
                        // this.requestFriendInfo.push({
                        //     "uid": userRequestInfo.uid,
                        // })

                        // confirm accept
                        friend.getChildByName("btn").getChildByName("accept").on(cc.Node.EventType.TOUCH_END, () => {
                            this.friendInfo = userRequestInfo;
                            console.log("this.friendInfo.uid = ", this.friendInfo.uid)
                            httpMng.post("/friend/acceptFriend", { friendid: this.friendInfo.uid }, 
                            (ret) => {
                                if(ret){
                                    this.appearInfoPanel("已成为好友")
                                    this.showRequestFriendPanel();
                                }
                            })
                        })


                    }
                }
            } 
        })
    }

    acceptFriend(i, e) {
        httpMng.post("/friend/acceptFriend", { friendid: this.requestFriendInfo[e].uid }, 
        (ret) => {
            console.log({ret})
            this.requestFriendList();
        })   
    }

    clearChatList() {
        let frame = this.chatListContent.children[0];
        let friend = frame.getChildByName("Friend");
        frame.active = false;
        friend.active = false;
        for (let i = 1; i < this.chatListContent.childrenCount; i++) {
            this.chatListContent.children[i].destroy();
        }
    }

    getChatList(){
        this.clearChatList();
        // httpMng.post("/friend/getFriendList", {}, 
        // (ret) => {
        //     console.log(ret);
        //     var friendlist = ret.friendList;
        // });
        httpMng.post("/friend/getMessageList", {},
        (ret) => {
            console.log("Message list: ",ret);
            if(ret.messageList == null){
                this.chatListPanel.getChildByName("Notice").active = true;
            }
            else if(ret.messageList.length >= 1) {
                this.chatListPanel.getChildByName("Notice").active = false;
                for (var i = 0; i < 60; i++) {
                    let frameCopy = cc.instantiate(this.chatListContent.children[0])
                    frameCopy.active = true;
                    this.chatListContent.addChild(frameCopy);
                    if (ret.messageList[i]) {
                        let userFriendInfo = ret.messageList[i];
                        let chatList = frameCopy.getChildByName("Friend");
                        cc.loader.loadRes(`icon/frameandbase/base3`, cc.SpriteFrame, function(err, spriteFrame) {
                            this.getComponent(cc.Sprite).spriteFrame = spriteFrame
                        }.bind(chatList.getChildByName("Base").getComponent(cc.Sprite)))
                        cc.loader.loadRes(`icon/frameandbase/frame${userFriendInfo.frame}`, cc.SpriteFrame, function(err, spriteFrame) {
                            this.getComponent(cc.Sprite).spriteFrame = spriteFrame
                        }.bind(chatList.getChildByName("Frame").getComponent(cc.Sprite)))
                        cc.loader.loadRes(`headIcon/${userFriendInfo.avatar}`, cc.SpriteFrame, function(err, spriteFrame) {
                            this.getComponent(cc.Sprite).spriteFrame = spriteFrame
                        }.bind(chatList.getChildByName("Avatar").getComponent(cc.Sprite)))
                        chatList.getChildByName("Name").getComponent(cc.Label).string = userFriendInfo.nickname;
                        chatList.active = true;
                 
                        if(ret.messageList[i].read == "1"){
                            chatList.getChildByName("read").active = false;
                        } else if(ret.messageList[i].read == "0"){
                            chatList.getChildByName("read").active = true;
                        }
    
                        chatList.on(cc.Node.EventType.TOUCH_END, () => {
                            this.friendInfo = userFriendInfo;
                            console.log(this.friendInfo)
                            this.showMessagePanel(this.friendInfo);
                        })
                    }else{
                        //skip, there is no more message need to load
                        break;
                    }
                }
            }
        })
    }

    sendMsg() {
        var isTooLongMessage = false
        var maxMessageLength = 254
        var date = new Date();
        var time = date.getMonth() + "-" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes();
        //check the message field is not empty before sending
        if(this.editBoxSendChat.string != "" ){
            if(this.editBoxSendChat.string.length < maxMessageLength){
                httpMng.post("/friend/sendMessage", { senderid: usrMng.uid, receiverid: this.currentChat, message: this.editBoxSendChat.string, time: String(time) }, 
                (ret) => {
                    this.getMsg(this.currentChat)
                })
            }else{
                this.appearErrorMessage("讯息内容过长")
                isTooLongMessage = true
            }
        }else{
            this.appearErrorMessage("讯息内容不能为空")
            
        }
        if(!isTooLongMessage){
            this.editBoxSendChat.string = "";
        }
        
    }

    
    appearInfoPanel(title){
        this.infoPanel.getChildByName("title").getComponent(cc.Label).string = title;
        this.infoPanel.active = true;
        this.scheduleOnce(function() {
            this.infoPanel.active = false;
        }, 2);
    }
    appearErrorMessage(title){
        this.errorMessage.getChildByName("Label").getComponent(cc.Label).string = title;
        this.errorMessage.active = true;
        this.scheduleOnce(function() {
            this.errorMessage.active = false;
        }, 3);
    }

    getMsg(friendid) {
        httpMng.post("/friend/getMessage", { friendid: friendid },
        (ret) => {
            if(ret.message == null){
                this.editBoxSendChat.string = "我们来聊天吧！"
                this.sendMsg();
            } else {
                this.scrollViewChat.content.removeAllChildren();
                for (var i = 0; i < ret.message.length; i++) {
                    let chat = ret.message[i]
                    var chatNode = cc.instantiate(this.prefabChatOthers)
                    if (chat.senderid == usrMng.uid) {
                        chatNode = cc.instantiate(this.prefabChatMe)
                    }
                    chatNode.getComponent("chatBubble").init(chat.sendername, chat.message, chat.avatar, chat.time);
                    this.scrollViewChat.content.addChild(chatNode);
                    this.scrollViewChat.scrollToBottom();
                    chatNode.getComponent("chatBubble").adjustChatMessage();
                }
            }
        })
    }

    start () {

    }

    // update (dt) {}
}
