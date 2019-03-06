/**
 * Created by Administrator on 2017/6/26 0026.
 */

var str =location.search;
var appointID = str.getQuery("appointID");
var serviceUserID = str.getQuery("serviceUserID");
var state = str.getQuery("state"); // 订单状态(0:排班,1:维修中,2:待结算,3:待支付,4:待评价,5:完成)

// 洗车的时候只要传washID
var washID = str.getQuery("washID");
// 销售的时候只要传saleID
var saleID = str.getQuery("saleID");
// 会员的时候只要传memberID
var memberID = str.getQuery("memberID");

$(document).ready(function() {
    // 处理ios不刷新问题
    refreshIOS();
    // 处理android回退按键
    try {
        window.dsBridge.register(ANDROID_BACK_FROM_NATIVE,function(){
            chargeOrder.back();
        });
    }catch (err){
    }

    var chargeOrder = new Vue({
        el: '#chargeOrder',

        mounted: function () {
            if(appointID){
                repair_pay_info(this);
                if(state == 3){
                    this.stateStr = "待支付";
                }else if(state == 4){
                    this.stateStr = "待评价";
                }else if(state == 5){
                    this.stateStr = "已完成";
                }
            }else if(washID){
                wash_pay_info(this);
            }else if(saleID){
                sale_can_back(this);
                sale_pay_info(this);
            }else if(memberID){
                member_pay_info(this);
            }
        },

        computed: {
        },
        data: {
            stateStr: "",
            payInfo:{
            },
            canBack:0,
        },
        methods:{
            back: function () {
                window.dsBridge.call(CLOSE_PAGE_FROM_JS, {}, function (responseData) {
                })
            },
            lookPaySource: function (billID) {
                window.dsBridge.call(LOOK_PAY_SOURCE_FROM_JS, {billID:billID}, function (responseData) {
                })
            },
            backOrder: function () {
                var isProduct = 0;
                if(this.payInfo.productList && this.payInfo.productList.length>0){
                    isProduct = 1;
                }
                window.dsBridge.call(SHOW_SALE_BACK_ORDER_DIALOG_FROM_JS, {saleID : saleID, isProduct: isProduct}, function (responseData) {
                })
            },
        },
    });
});


/**
 * 结算单详情
 */
function repair_pay_info(vueObj) {
    showLoading();

    var obj = {};
    obj.appointID = appointID;

    $.ajax({
        url:BASE_URL + "repair_pay_info",
        type:"POST",
        data: obj,
        timeout:1000*10,
        dataType:"json",

        success:function (data,textStatus,jqXHR) {
            hideLoading();
            // 返回结果状态值,值为0或1.(0表示请求失败；1表示请求成功)
            if(data.status == 1){
                console.log(JSON.stringify(data));
                vueObj.payInfo = data.payInfo;
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
/**
 * 洗车结算单详情
 */
function wash_pay_info(vueObj) {
    showLoading();

    var obj = {};
    obj.washID = washID;

    $.ajax({
        url:BASE_URL + "wash_pay_info",
        type:"POST",
        data: obj,
        timeout:1000*10,
        dataType:"json",

        success:function (data,textStatus,jqXHR) {
            hideLoading();
            // 返回结果状态值,值为0或1.(0表示请求失败；1表示请求成功)
            if(data.status == 1){
                console.log(JSON.stringify(data));
                vueObj.payInfo = data.payInfo;
                vueObj.payInfo.isWash = true;

                if(vueObj.payInfo.state == 1){
                    vueObj.stateStr = '待支付';
                }else if(vueObj.payInfo.state == 2){
                    vueObj.stateStr = '待评价';
                }else if(vueObj.payInfo.state == 3){
                    vueObj.stateStr = '已完成';
                }
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
/**
 * 销售结算单详情
 */
function sale_pay_info(vueObj) {
    showLoading();

    var obj = {};
    obj.saleID = saleID;

    $.ajax({
        url:BASE_URL + "sale_pay_info",
        type:"POST",
        data: obj,
        timeout:1000*10,
        dataType:"json",

        success:function (data,textStatus,jqXHR) {
            hideLoading();
            // 返回结果状态值,值为0或1.(0表示请求失败；1表示请求成功)
            if(data.status == 1){
                console.log(JSON.stringify(data));
                vueObj.payInfo = data.saleInfo;
                vueObj.payInfo.saleID = saleID;

                // 状态（1.待结算，2.待支付，3.待评价，4.已完成，5.已取消）
                if(vueObj.payInfo.state == 1){
                    vueObj.stateStr = '待结算';
                } else if(vueObj.payInfo.state == 2){
                    vueObj.stateStr = '待支付';
                }else if(vueObj.payInfo.state == 3){
                    vueObj.stateStr = '待评价';
                }else if(vueObj.payInfo.state == 4){
                    vueObj.stateStr = '已完成';
                }else if(vueObj.payInfo.state == 5){
                    vueObj.stateStr = '已取消';
                }
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
/**
 * 判断是否可退单
 */
function sale_can_back(vueObj) {
    var obj = {};
    obj.saleID = saleID;

    $.ajax({
        url:BASE_URL + "sale_can_back",
        type:"POST",
        data: obj,
        timeout:1000*10,
        dataType:"json",

        success:function (data,textStatus,jqXHR) {
            hideLoading();

            // 返回结果状态值,值为0或1.(0表示请求失败；1表示请求成功)
            if(data.status == 1){
                vueObj.canBack = data.canBack;
            }else {
                showMessage(data.info);
            }
        },
        error:function (xhr,textStatus) {
            showMessage(NET_ERROR);
            console.log("错误信息如下====================");
            console.log(xhr);
            console.log(textStatus);
        },
    });
}
/**
 * 入会续会结算详情
 */
function member_pay_info(vueObj) {
    showLoading();

    var obj = {};
    obj.memberID = memberID;

    $.ajax({
        url:BASE_URL + "member_pay_info",
        type:"POST",
        data: obj,
        timeout:1000*10,
        dataType:"json",

        success:function (data,textStatus,jqXHR) {
            hideLoading();
            // 返回结果状态值,值为0或1.(0表示请求失败；1表示请求成功)
            if(data.status == 1){
                console.log(JSON.stringify(data));
                vueObj.payInfo = data.payInfo;

                // 状态（1.待结算，2.待支付，3.待评价，4.已完成，5.已取消）
                if(vueObj.payInfo.state == 1){
                    vueObj.stateStr = '待结算';
                } else if(vueObj.payInfo.state == 2){
                    vueObj.stateStr = '待支付';
                }else if(vueObj.payInfo.state == 3){
                    vueObj.stateStr = '待评价';
                }else if(vueObj.payInfo.state == 4){
                    vueObj.stateStr = '已完成';
                }
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