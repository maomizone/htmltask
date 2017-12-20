/**
 * Created by Administrator on 2017/6/26 0026.
 */

// type 0:通讯录 1:单选 2:多选
var str =location.search;
var repairID = str.getQuery("repairID");
console.log("repairID--->" + repairID);

$(document).ready(function() {
    // 处理ios不刷新问题
    refreshIOS();
    // 处理android回退按键
    try {
        window.dsBridge.register(ANDROID_BACK_FROM_NATIVE,function(){
            repair.back();
        });
    }catch (err){}

    var repair = new Vue({
        el: '#repair',

        mounted: function () {
            repair_history_info(this);
        },

        computed: {
        },
        data: {
            orderInfo:{},
            serviceInfo:{},
            repairInfo:{
                name:"",
                companyName:"",
                serviceTime:"",


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
            back: function () {
                window.dsBridge.call(CLOSE_PAGE_FROM_JS, {}, function (responseData) {
                })
            },
            // 查看维修记录
            lookRepairRecords: function () {
                window.dsBridge.call(LOOK_REPAIR_RECORDS_FROM_JS, {}, function (responseData) {
                })
            },
        },
    });



});


/**
 * 历史维修详情
 */
function repair_history_info(repair) {
    showLoading();

    var obj = {};
    // obj.repairID = repairID;

    obj.repairID = "0010EBCB-0000-0000-0000-0000B9B1D379";

    $.ajax({
        url:BASE_URL + "repair_history_info",
        type:"POST",
        data: obj,
        timeout:1000*10,
        dataType:"json",

        success:function (data,textStatus,jqXHR) {
            hideLoading();
            // 返回结果状态值,值为0或1.(0表示请求失败；1表示请求成功)
            if(data.status == 1){
                repair.repairInfo = data.repairInfo;
                repair.orderInfo = data.orderInfo;
                repair.serviceInfo = data.serviceInfo;
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


