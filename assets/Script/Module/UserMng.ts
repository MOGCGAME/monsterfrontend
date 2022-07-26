import httpMng from "./HttpMng";
import cookieMng from "./CookieMng";

const {ccclass, property} = cc._decorator;

@ccclass
class UserMng extends cc.Component {

    public uid: string
    public nickName: string
    public headIcon: number
    public frame: number
    public gameCoin: number
    public strength: number
    public rank: number

    private bindUser(ret) {
        console.log("User Data: ",ret)
        this.uid = ret.uid
        this.nickName = (ret.nickName) ? ret.nickName : ""
        this.headIcon = ret.headIcon
        this.frame = ret.frame
        this.gameCoin = ret.gameCoin
        this.strength = ret.strength
        this.rank = ret.rank
        //在cookie存入user的uid
        cookieMng.setGuest(ret.uid);
        //检查jwt是否存在
        if (ret.jwt) {
            //在cookie存入加密token
            cookieMng.setJWTString(ret.jwt);
        }
    }

    public getGuest(callback) {
        //后台获取user data
        httpMng.post("/user/getGuest", {}, (ret) => {
            if(ret.error) {

            } else {
                //绑定user在这台device
                this.bindUser(ret)
                //call这个参数的function
                callback()
            }
        });
    }

}
var usrMng = new UserMng()
export default usrMng