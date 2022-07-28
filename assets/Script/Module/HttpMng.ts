import cookieMng from "./CookieMng";

const {ccclass, property} = cc._decorator;

@ccclass
class HttpMng extends cc.Component {
    host: string = "http://" + appip.host + ":12307";

    get(url, param, callback) {
        var xhr = cc.loader.getXMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                var respone = xhr.responseText;
                // console.log(respone)
                var ret = null;
                try {
                    ret = JSON.parse(respone);
                } catch (e) {
                    console.log("err:" + e);
                    ret = {
                        code: "timeout",
                    };
                }
                if (callback) {
                    callback(ret);
                }
            }
        };

        var sendtext = '?';
        for (var k in param) {
            if (sendtext != "?") {
                sendtext += "&";
            }
            sendtext += (k + "=" + param[k]);
        }
        var requestURL = this.host + url + encodeURI(sendtext);

        xhr.open("GET", requestURL, true);
        if (cc.sys.isNative) {
            xhr.setRequestHeader("Accept-Encoding", "gzip,deflate");
           
        }
        xhr.setRequestHeader("Access-Control-Allow-Origin", "*");
        xhr.setRequestHeader("Access-Control-Allow-Headers", "X-Requested-With");
        xhr.setRequestHeader("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
        xhr.setRequestHeader("X-Powered-By","3.2.1");
        xhr.setRequestHeader("Content-Type", "application/json;charset=utf-8");
        xhr.setRequestHeader("Authorization", cookieMng.getJWTString());
        xhr.setRequestHeader("Access-Control-Allow-Origin", "*");
        xhr.setRequestHeader("Content-Type", "application/x-www-form-uriencoded;cjarset=utf-8");
        xhr.setRequestHeader("Content-Type", "application/json")
        xhr.send();
    }

    post(url, param, callback) {
        let xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if ( xhr.readyState === 4 ) {
                var response = xhr.responseText;
                console.log(response)
                var ret = null;
                try {
                    ret = JSON.parse(response);
                } catch (e) {
                    console.log("err:" + e);
                    ret = {
                        code: "timeout",
                    };
                }
                if (callback) {
                    callback(ret);
                }
            }
        };

        var requestURL = this.host + url

        xhr.open("POST", requestURL, true);
        if (cc.sys.isNative) {
            xhr.setRequestHeader("Accept-Encoding", "gzip,deflate");
        }
        xhr.setRequestHeader("Authorization", cookieMng.getJWTString());

        // note: In Internet Explorer, the timeout property may be set only after calling the open()
        // method and before calling the send() method.
        xhr.timeout = 60000;// 5 seconds for timeout

        xhr.send(JSON.stringify(param));
    }

    getRemote(url, callback) {
        var xhr = cc.loader.getXMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                var respone = xhr.responseText;
                console.log("pure res " + respone)
                var ret = null;
                try {
                    ret = JSON.parse(respone);
                } catch (e) {
                    console.log("err:" + e);
                    ret = {
                        code: "timeout",
                    };
                }
                if (callback) {
                    callback(ret);
                }
            }
        };


        var requestURL = url
        xhr.open("GET", requestURL, true);
        if (cc.sys.isNative) {
            xhr.setRequestHeader("Accept-Encoding", "gzip,deflate");
        }

        // note: In Internet Explorer, the timeout property may be set only after calling the open()
        // method and before calling the send() method.
        xhr.timeout = 5000;// 5 seconds for timeout

        xhr.send();

    }

}
var httpMng = new HttpMng()
export default httpMng