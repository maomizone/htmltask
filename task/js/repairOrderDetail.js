/**
 * Created by Administrator on 2017/6/26 0026.
 */

var str =location.search;
var specialID = str.getQuery("specialID");
var appointID = str.getQuery("appointID");
setUrl(str.getQuery("url"), str.getQuery("imgUrl"));

$(document).ready(function() {
    // 处理ios不刷新问题
    refreshIOS();
    // 处理android回退按键
    try {
        window.dsBridge.register(ANDROID_BACK_FROM_NATIVE,function(){
            repairOrder.back();
        });
    }catch (err){
    }

    var repairOrder = new Vue({
        el: '#repairOrder',

        mounted: function () {
            discount_repair_info(this);
        },

        computed: {
        },
        data: {
            appointInfo:{
                carInfo: {

                },
                payInfo: {

                },
            },
        },
        methods:{
            back: function () {
                window.history.back();
                // window.dsBridge.call(CLOSE_PAGE_FROM_JS, {}, function (responseData) {
                // })
            },
            card: function () {
                window.dsBridge.call(LOOK_CARD_FROM_JS, {appointID: appointID}, function (responseData) {
                })
            },
        },
    });
});

/**
 * 特批优惠-维修单详情
 */
function discount_repair_info(vueObj) {
    showLoading();

    var obj = {};
    obj.specialID = specialID;
    obj.appointID = appointID;
    // obj.specialID = "fd1a7763-2349-4cf4-8110-933317177ab8";
    // obj.appointID = "12894ad0-d23a-409b-bf6d-355aa4e1ffae";

    $.ajax({
        url:RepairManage + "discount_repair_info",
        type:"POST",
        data: obj,
        timeout:1000*10,
        dataType:"json",

        success:function (data,textStatus,jqXHR) {
            hideLoading();
            console.log("djy discount_repair_info res == " +JSON.stringify(data));
            // 返回结果状态值,值为0或1.(0表示请求失败；1表示请求成功)
            if(data.status == 1){
                vueObj.appointInfo = data.appointInfo;
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

