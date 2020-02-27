/**
 * Created by Administrator on 2017/6/26 0026.
 */

var str =location.search;
var repairID = str.getQuery("repairID");
setUrl(str.getQuery("url"), str.getQuery("imgUrl"));

/////////////////////////////////////////////////////////////////////
// var repairID = "ac84b1f9-e414-4944-9495-26172e806835";
// setUrl("http://syclhxf.zhyinfo.cn/hxfwebsh_demo/App/jkgl/BusinessUnit/MerchantInterface/");



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
                serviceList:[],
                productList:[],
            },
        },
        methods:{
            back: function () {
                window.dsBridge.call(CLOSE_PAGE_FROM_JS, {}, function (responseData) {
                })
            },
            // 查看维修记录
            lookRepairRecords: function () {
                window.dsBridge.call(LOOK_REPAIR_RECORDS_FROM_JS, {repairID: repairID}, function (responseData) {
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
    obj.repairID = repairID;

    $.ajax({
        url:RepairManage + "repair_history_info",
        type:"POST",
        data: obj,
        timeout:1000*10,
        dataType:"json",

        success:function (data,textStatus,jqXHR) {
            hideLoading();
            console.log(JSON.stringify(data));
            // 返回结果状态值,值为0或1.(0表示请求失败；1表示请求成功)
            if(data.status == 1){
                repair.repairInfo = data.repairInfo;
                repair.repairInfo.isMember = data.serviceInfo.isMember;
                repair.repairInfo.isFromHistoryRepair = 1;
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


