const {ccclass, property} = cc._decorator;

@ccclass
class CookieMng extends cc.Component {

    jwtKey = "jwtString"

    getJWTString() {
        var jwtString = cc.sys.localStorage.getItem(this.jwtKey);
        return (jwtString) ? jwtString : "";
    }

    setJWTString(jwtString) {
        cc.sys.localStorage.setItem(this.jwtKey, jwtString);
    }

    removeJWTString() {
        cc.sys.localStorage.removeItem(this.jwtKey)
    }

    uid = null

    isLocalUidExist() {
        this.uid = cc.sys.localStorage.getItem("uid");
        if (this.uid == null) { return false }
        else { return true }
    }

    setGuest(acc = null) {
        if (acc == null) {
            return;
        }
        else {
            this.uid = acc;
        }
        cc.sys.localStorage.setItem("uid", this.uid);
        return this.uid
    }
}
var cookieMng = new CookieMng()
export default cookieMng