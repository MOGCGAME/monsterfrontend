const {ccclass, property} = cc._decorator;

@ccclass
export default class GameMgr extends cc.Component {
    @property(cc.Prefab)
    topBar: cc.Prefab = null;
    @property(cc.Prefab)
    mainPage: cc.Prefab = null;
    @property(cc.Prefab)
    embattlePage: cc.Prefab = null;
    @property(cc.Prefab)
    monsterPage: cc.Prefab = null;
    @property(cc.Prefab)
    bagPage: cc.Prefab = null;
    @property(cc.Prefab)
    equipmentPage: cc.Prefab = null;
    @property(cc.Prefab)
    vsPage: cc.Prefab = null;
    @property(cc.Prefab)
    rankingPage: cc.Prefab = null;
    @property(cc.Prefab)
    pvePage: cc.Prefab = null;
    @property(cc.Prefab)
    pvpPage: cc.Prefab = null;
    @property(cc.Prefab)
    friendPage: cc.Prefab = null;
    @property(cc.Prefab)
    checkPoint1: cc.Prefab = null;
    @property(cc.Prefab)
    checkPoint2: cc.Prefab = null;
    

    static pageStack: PageInfo[] = [];

    onLoad () {
        cc.view.setOrientation(cc.macro.ORIENTATION_LANDSCAPE);
        this.addPage("MainPage");
        // this.addTopBar();
    }

    static getInstance(): GameMgr {
        return cc.find("Canvas").getComponent(GameMgr);
    }

    addTopBar() {
        this.node.addChild(cc.instantiate(this.topBar));
    }

    hideTopBar() {
        console.log("hide")
    }

    addPage(pageName: string) {
        let themes = {
            "MainPage": "",
            "BagPage": "背包",
            "EmbattlePage": "布阵",
            "MonsterPage": "怪兽",
            "EquipmentPage": "装备",
            "PvEPage": "PVE",
            "PvPJoin": "PVP",
            "RankingPage": "排行榜",
            "FriendPage": "好友",
            "CheckPoint1": "",
            "VSPage": "",
        }
        let quoteName = pageName.substring(0, 1).toLowerCase() + pageName.substring(1);
        let node = cc.instantiate(this[quoteName]);
        let eventBlock = this.addEventBlock();
        this.node.addChild(node);
        GameMgr.pageStack.push({
            name: pageName,
            theme: themes[pageName],
            node: node,
            eventBlock: eventBlock,
        })
        if (pageName == "MainPage" || pageName == "PvPJoin" || pageName == "VSPage") {
            this.hideTopBar();
        } else {
            this.addTopBar();
        }

    }

    addVSPage() {
        let node = cc.instantiate(this.vsPage);
        node.zIndex = 10;
        this.node.addChild(node);
        this.addEventBlock();
    }

    addEventBlock(): cc.Node {
        let node = new cc.Node();
        node.setContentSize(cc.winSize);
        node.addComponent(cc.BlockInputEvents);
        this.node.addChild(node);
        return node;
    }
}

interface PageInfo {
    name: string;
    theme: string;
    node: cc.Node;
    eventBlock: cc.Node;
}