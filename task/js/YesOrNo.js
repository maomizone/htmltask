/**
 * Created by Administrator on 2017/6/26 0026.
 */
// type 1:特批优惠-同意
// type 2:特批优惠-拒绝
var str =location.search;
var type = str.getQuery("type");
var flowInst = str.getQuery("flowInst");
var userID = str.getQuery("userID");
var postID = str.getQuery("postID");
setUrl(str.getQuery("url"));

$(document).ready(function() {
    // 处理ios不刷新问题
    refreshIOS();
    // 处理android回退按键
    try {
        window.dsBridge.register(ANDROID_BACK_FROM_NATIVE,function(){
            reason.back();
        });
    }catch (err){
    }

    var reason = new Vue({
        el: '#reason',

        mounted: function () {
        },

        computed: {
        },
        data: {
            reasonTxt: "",
        },
        methods:{
            back:function () {
                window.history.back();
            },
            send:function () {
                // if(this.stringIsBlank(this.reasonTxt)){
                //     showMessage('说点什么吧...');
                //     return;
                // }
                special_approval_operate(this);
                console.log(this.reasonTxt);
            },
            stringIsBlank:function (str) {
                if (str == null || str == undefined || str == "") {
                    return true;
                }else {
                    return false;
                }
            }
        },
    });
})

/**
 * 特批优惠-同意/拒绝
 */
function special_approval_operate(vueObj) {
    showLoading();

    var obj = {};
    obj.flowInst = flowInst;
    obj.userID = userID;
    obj.postID = postID;
    obj.operate = type;   //1:同意;2:拒绝
    obj.reason = vueObj.reasonTxt;

    $.ajax({
        url:RepairManage + "special_approval_operate",
        type:"POST",
        data: obj,
        timeout:1000*60,
        dataType:"json",

        success:function (data,textStatus,jqXHR) {
            hideLoading();
            console.log(data);
            // 返回结果状态值,值为0或1.(0表示请求失败；1表示请求成功)
            if(data.status == 1){
               window.history.back();
            }else {
                showMessage(data.info);
            }
        },
        error:function (xhr,textStatus) {
            hideLoading();
            showMessage(NET_ERROR);
            console.log("错误信息如下====================");
            console.log(xhr);
            console.log(textStatus);
        },
    });
}
