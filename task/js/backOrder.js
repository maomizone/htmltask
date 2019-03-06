/**
 * Created by Administrator on 2017/6/26 0026.
 */

var str =location.search;
var saleID = str.getQuery("saleID");
var packageGuid = str.getQuery("packageGuid");
var cardGuid = str.getQuery("cardGuid");
var productGuid = str.getQuery("productGuid");

$(document).ready(function() {
    // 处理ios不刷新问题
    refreshIOS();
    // 处理android回退按键
    try {
        window.dsBridge.register(ANDROID_BACK_FROM_NATIVE,function(){
            backOrder.back();
        });
    }catch (err){
    }

    var backOrder = new Vue({
        el: '#backOrder',

        mounted: function () {
            charge_back_info(this);
        },

        computed: {
        },
        data: {
            companyName: "",
            backInfo:{
            },
        },
        methods:{
            back: function () {
                history.back();
            },
        },
    });
});


/**
 * 退货详情
 */
function charge_back_info(vueObj) {
    showLoading();

    var obj = {};
    obj.saleID = saleID;
    obj.packageGuid = packageGuid;
    obj.cardGuid = cardGuid;
    obj.productGuid = productGuid;

    console.log(JSON.stringify(obj));

    $.ajax({
        url:BASE_URL + "charge_back_info",
        type:"POST",
        data: obj,
        timeout:1000*10,
        dataType:"json",

        success:function (data,textStatus,jqXHR) {
            hideLoading();
            // 返回结果状态值,值为0或1.(0表示请求失败；1表示请求成功)
            if(data.status == 1){
                console.log(JSON.stringify(data));
                vueObj.backInfo = data.backInfo;
                vueObj.backInfo.saleID = saleID;

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


