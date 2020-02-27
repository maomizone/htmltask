/**
 * Created by Administrator on 2017/6/26 0026.
 */

var str =location.search;
var redID = str.getQuery("redID");
var specialID = str.getQuery("specialID");
var cardList = str.getQuery("cardList");
var appointID = str.getQuery("appointID");
var serviceUserID = str.getQuery("serviceUserID");
setUrl(str.getQuery("url"), str.getQuery("imgUrl"));

$(document).ready(function() {
    // 处理ios不刷新问题
    refreshIOS();
    // 处理android回退按键
    try {
        window.dsBridge.register(ANDROID_BACK_FROM_NATIVE,function(){
            customerConfirm.back();
        });
    }catch (err){
    }

    var customerConfirm = new Vue({
        el: '#customerConfirm',

        mounted: function () {
            //初始化插件
            $("#signature").jSignature();
            this.getAppointInfo();
        },

        computed: {
        },
        data: {
            appointInfo: {
                serviceList:[],
                productList:[],
            },

        },
        methods:{
            back: function () {
                window.dsBridge.call(CLOSE_PAGE_FROM_JS, {}, function (responseData) {
                })
            },
            getAppointInfo: function () {
                var _this = this;

                try {
                    window.dsBridge.call(GET_APPOINT_INFO_FROM_JS, {}, function (responseData) {
                        console.log("djy" + responseData);
                        var res =  eval('(' + responseData + ')');
                        res.appointInfo.payInfo.productMoneys = res.appointInfo.productMoneys;
                        res.appointInfo.payInfo.isMember = res.appointInfo.carInfo.isMember;
                        _this.appointInfo = res.appointInfo;
                    });
                }catch (err){
                }
            },
            reset:function () {
                var $sigdiv = $("#signature");
                $sigdiv.jSignature("reset");
            },
            jSignatureTest : function () {
                var $sigdiv = $("#signature");
                var datapair = $sigdiv.jSignature("getData", "image"); //设置输出的格式，具体可以参考官方文档

                if($sigdiv.jSignature("getData", "native").length == 0){
                    showMessage("请先签名");
                    return;
                }
                dsBridge.call(GET_SIGN_BASE64_FROM_JS, {signBase64: datapair[1]}, function (responseData) {
                    appoint_repair_count_sure(responseData);
                })
            }
        },
    });
});

/**
 * 客户确认结算信息
 */
function appoint_repair_count_sure(signPic) {
    showLoading();

    var obj = {};
    obj.appointID = appointID;
    obj.redID = redID;
    obj.specialID = specialID;
    obj.cardList = cardList;
    obj.signPic = signPic;

    console.log("djy 客户确认结算信息-->" + JSON.stringify(obj));

    $.ajax({
        url:RepairManage + "appoint_repair_count_sure",
        type:"POST",
        data: obj,
        timeout:1000*10,
        dataType:"json",

        success:function (data,textStatus,jqXHR) {
            hideLoading();
            console.log(data);
            // 返回结果状态值,值为0或1.(0表示请求失败；1表示请求成功)
            if(data.status == 1){
                dsBridge.call(CONFIRM_SUCCESS_FROM_JS, {}, function (responseData) {
                });
                window.location.href="./chargeOrder.html?serviceUserID="+serviceUserID
                + "&appointID="+appointID
                + "&state=3"
                + "&url=" + URL;
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




