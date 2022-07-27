// works with backend

window.appip = {
  host: "127.0.0.1", // localhost 开发使用
  // host: "144.34.172.115",
  port:"12307",
}
if (window.location !== window.parent.location) {
  window.appip.host = location.host;
}