/**
 * Created by Administrator on 2017/6/26 0026.
 */
var str =location.search;
var serviceUserID = str.getQuery("serviceUserID");
var inspectID = str.getQuery("inspectID");

var inspectionApply;

$(document).ready(function() {
    inspectionApply = new Vue({
        el: '#inspectionApply',

        mounted: function () {
            // service_inspect_info();
        },

        computed: {
        },
        data: {
            inspectInfo:{
                serviceUserName:"张三",
                projectName: "",
                plateNumber: "",
                reviewUser: "王五",
                createTime: "",
                state: 0,
                repairID: "123",
                createTime:"2017-12-12",
            },
        },
        methods:{
            back:function () {
                window.dsBridge.call(CLOSE_PAGE_FROM_JS, {}, function (responseData) {
                })
            },
            stringIsBlank:function (str) {
                if (str == null || str == undefined || str == "") {
                    return true;
                }else {
                    return false;
                }
            },
            /**
             * 通过
             */
            yes:function () {
                window.location.href="./YesOrNo.html?type=2&&serviceUserID=" + serviceUserID + "&&inspectID=" + inspectID;
            },
            /**
             * 拒绝
             */
            no:function () {
                window.location.href="./YesOrNo.html?type=3&&serviceUserID=" + serviceUserID + "&&inspectID=" + inspectID;
            },
            /**
             * 查看维修单
             */
            lookRepairOrder:function () {
                window.dsBridge.call(LOOK_REPAIR_DETAIL_FROM_JS, {repairID: this.inspectInfo.repairID}, function (responseData) {
                })
            },
        },
    });
})


/**
 * 总检申请-详情
 */
function service_inspect_info() {
    showLoading();

    var obj = {};
    obj.serviceUserID = "123";
    obj.inspectID = "123";

    $.ajax({
        url:RepairManage + "service_inspect_info",
        type:"POST",
        data: obj,
        timeout:1000*10,
        dataType:"json",

        success:function (data,textStatus,jqXHR) {
            hideLoading();
            // 返回结果状态值,值为0或1.(0表示请求失败；1表示请求成功)
            if(data.status == 1){
                inspectionApply.inspectInfo = data.inspectInfo;
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


