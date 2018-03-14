/**
 * Created by Administrator on 2017/6/14 0014.
 */

 window.alert = function (name) {
    var iframe = document.createElement("IFRAME");
    iframe.style.display = "none";
    iframe.setAttribute("src", 'data:text/plain,');
    document.documentElement.appendChild(iframe);
    window.frames[0].window.alert(name);
    iframe.parentNode.removeChild(iframe);
}


// 测试
// const BASE_URL = 'http://192.168.10.201:8089/Lock/inter_json/';
// 正式
const BASE_URL = 'http://www.5ycl.net:8000/Lock/inter_json/';

const NET_ERROR = "网络故障，请调整网络信号后重新尝试。";



