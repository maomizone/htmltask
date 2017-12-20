/**
 * Created by Administrator on 2017/6/26 0026.
 */
var str =location.search;
var appointID = str.getQuery("appointID");
var commitBalance;

$(document).ready(function() {

    // 处理ios不刷新问题
    refreshIOS();
    // 处理android回退按键
    try{
        window.dsBridge.register(ANDROID_BACK_FROM_NATIVE,function(){
            commitBalance.back();
        });
    }catch (err){}

    commitBalance = new Vue({
        el: '#commitBalance',

        mounted: function () {
            // appoint_repair_count_info();
            if(getRefreshSpecialDiscount()){
                this.scrollToEnd();
                setTimeout(function () {
                    showLoading();
                },500)

                clearRefreshSpecialDiscount();
            }
        },

        computed: {

        },
        data: {
            appointInfo:{
                productMoneys: 0,
                freightMoney:0,
                discountMoney: 0,
                payMoney: 0,

                // projectList:[
                //     {
                //         projectName: '更换机油', projectMoney: 40, projectMoney_real: 20, projectNum : 5,
                //         productList:[
                //             {productMoney: 20, productMoney_real: 40, productNum : 5,productPic: '', productName:"从对方答复壳牌/Shell 喜力半合成机油HX75W-40SN/CF 蓝壳（1L装）"},
                //         ]
                //     },
                //     {
                //         projectName: '更换滤芯', projectMoney: 20, projectMoney_real: null, projectNum : 1,
                //         productList:[
                //             {productMoney: 40, productMoney_real: 30, productNum : 5,productPic: '', productName:"壳（1L装）"},
                //             {productMoney: 60, productMoney_real: 40, productNum : 3,productPic: '', productName:"1111壳（1L装）"},
                //         ]
                //     },
                // ],
                // productList:[
                //     {productMoney: 20, productMoney_real: 10, productNum : 5,productPic: '', productName:"壳（1L装）"},
                //     {productMoney: 20, productMoney_real: 15, productNum : 5,productPic: '', productName:"cccc壳（1L装）"},
                // ],
            },
        },
        methods:{
            /**
             * 返回事件
             */
            back:function () {
                window.dsBridge.call(CLOSE_PAGE_FROM_JS, {}, function (responseData) {
                })
            },
            scrollToEnd: function () {
                var h = $(document).height()-$(window).height();
                $(document).scrollTop(h);
            },
            /**
             * 判断特批优惠点击事件
             */
            compareSpecialDiscount: function () {
                // todo 存储界面数据
                window.location.href="./specialDiscountApply.html";
            },
            /**
             * 选择卡券
             */
            chooseCardCoupons: function () {
                window.dsBridge.call(CHOOSE_CARD_COUPONS_FROM_JS, {}, function (responseData) {
                })
            },
            /**
             * 选择红包
             */
            chooseRed: function () {
                window.dsBridge.call(CHOOSE_RED_FROM_JS, {}, function (responseData) {
                })
            },
        },
    });
})


/**
 * 提交结算信息查看
 */
function appoint_repair_count_info() {
    showLoading("发送中...");

    var obj = {};
    // obj.appointID = appointID;
    obj.appointID = "123456";

    $.ajax({
        url:BASE_URL + "appoint_repair_count_info",
        type:"POST",
        data: obj,
        timeout:1000*10,
        dataType:"json",

        success:function (data,textStatus,jqXHR) {
            hideLoading();
            // 返回结果状态值,值为0或1.(0表示请求失败；1表示请求成功)
            if(data.status == 1){
                commitBalance.appointInfo = data.appointInfo;
            }else {
                showMessage(data.info);
            }
        },
        error:function (xhr,textStatus) {
            hideLoading();
            showMessage(NET_ERROR);
            console.log("错误信息如下====================")
            console.log(xhr)
            console.log(textStatus)
        },
    });
}


