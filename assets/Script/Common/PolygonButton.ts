const {ccclass, property} = cc._decorator;

@ccclass
export default class PolygonButton extends cc.Component {

    @property(cc.Boolean)
    Interactable: boolean = true
    @property(cc.Integer)
    Duration: number = 0.1
    @property(cc.Integer)
    ZoomScale: number = 0.9
    @property(cc.Component.EventHandler)
    ClickEvents: cc.Component.EventHandler[] = [];

    self: any

    onLoad () {
        this.node.active = false;
        this.scheduleOnce(() => {
            this.node.active = true;
        }, 0.5)
    }

    onEnable() {
        this.CanTouch = true
        this.node.on(cc.Node.EventType.TOUCH_START, this.TouchStart, this)
        this.node.on(cc.Node.EventType.TOUCH_END, this.TouchEnd, this)
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.TouchCancel, this)

        for (let index = 0; index < this.node.getComponent(cc.PolygonCollider).points.length; index++) {
            this.TouchPoints[index] = this.node.getComponent(cc.PolygonCollider).points[index].add(this.node.convertToWorldSpaceAR(cc.Vec2.ZERO_R))
        }
    }
    onDisable() {
        this.node.off(cc.Node.EventType.TOUCH_START, this.TouchStart, this)
        this.node.off(cc.Node.EventType.TOUCH_END, this.TouchEnd, this)
        this.node.off(cc.Node.EventType.TOUCH_CANCEL, this.TouchCancel, this)
    }
    private TouchPoints: cc.Vec2[] = []
    private CanTouch: boolean = true
    private TouchStart(touch: cc.Event.EventTouch) {
        if (cc.Intersection.pointInPolygon(touch.getLocation(), this.TouchPoints)) {
            // @ts-ignore
            this.node._touchListener.setSwallowTouches(true)
            if (this.Interactable && this.CanTouch) {
                this.node.runAction(cc.scaleTo(this.Duration, this.ZoomScale))
                this.CanTouch = false
            }
        } else {
            // @ts-ignore
            this.node._touchListener.setSwallowTouches(false)
        }

    }
    private TouchEnd(touch: cc.Event.EventTouch) {
        if (this.Interactable && !this.CanTouch && cc.Intersection.pointInPolygon(touch.getLocation(), this.TouchPoints)) {
            this.node.runAction(cc.scaleTo(this.Duration, 1))
            this.CanTouch = true
            this.ClickEvents.forEach(element => {
                element.emit([])
            });
        }
    }
    private TouchCancel(touch: cc.Event.EventTouch) {
        if (this.Interactable && !this.CanTouch && cc.Intersection.pointInPolygon(touch.getLocation(), this.TouchPoints)) {
            this.node.runAction(cc.scaleTo(this.Duration, 1))
            this.CanTouch = true
        }
    }
}
