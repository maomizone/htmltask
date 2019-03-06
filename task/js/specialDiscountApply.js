
var str = location.search;
var appointID = str.getQuery("appointID");
var serviceUserID = str.getQuery("serviceUserID");
var organizeOID = str.getQuery("organizeOID");
var payMoney = str.getQuery("payMoney");

$(document).ready(function () {

    // 处理ios不刷新问题
    refreshIOS();
    // 处理android回退按键
    try{
        window.dsBridge.register(ANDROID_BACK_FROM_NATIVE,function(){
            sepcialDiscountApply.back();
        });
    }catch (err){}


    var sepcialDiscountApply = new Vue({
        el:'#sepcialDiscountApply',

        mounted:function () {
            if(getDisountInfo()){
                var obj = getDisountInfo();
                this.inputMoney = obj.inputMoney;
                this.adminList = obj.adminList;
                this.chaosongPerson = obj.chaosongPerson;
                this.discountReason = obj.discountReason;
            }
            clearDiscountInfo();

            if(getSingelPerson()){
                this.chaosongPerson = getSingelPerson();
            }else {
                console.log("没有数据，需要刷新");
            }
            clearSinglePerson();
        },

        data:{
            inputMoney: "",
            discountReason:"",
            adminList:[
            ],
            chaosongPerson:null,
            net:true,
        },
        methods:{
            back: function () {
                window.dsBridge.call(CLOSE_PAGE_FROM_JS, {}, function (responseData) {
                })
            },
            inputChange: function () {
                this.inputMoney = this.inputMoney.replace(/[^\d.]/g,"");  //清除“数字”和“.”以外的字符
                this.inputMoney = this.inputMoney.replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3'); //只能输入两个小数
                if (this.inputMoney.length == 0){
                    return;
                }
                if (parseFloat(this.inputMoney) > parseFloat(payMoney)){
                    showMessage("特批优惠金额不能超过应付总计", 3000, true);
                    this.adminList = [];
                    return;
                }
                service_admin_list(this);
            },

            tongxunluClick:function () {
                this.saveInfo();
                window.location.href="./addressList.html?type=1&organizeOID=" + organizeOID;
            },

            btnClick:function () {
                console.log(this.inputMoney);
                if (this.inputMoney.length == 0){
                    showMessage('请输入金额');
                    return;
                }
                if (parseFloat(this.inputMoney) > parseFloat(payMoney)){
                    showMessage("特批优惠金额不能超过应付总计", 3000, true);
                    return;
                }
                if(this.net){
                    appoint_discount_apply(this);
                }else {
                    showMessage('请勿重复提交！');
                }
            },

            saveInfo:function () {
                var objStr = {};
                objStr.inputMoney = this.inputMoney;
                objStr.chaosongPerson = this.chaosongPerson;
                objStr.adminList = this.adminList;
                objStr.discountReason = this.discountReason;
                saveDiscountInfo(objStr);
            }
        }
    });
})


/**
 * 根据优惠金额获取审批人员列表
 */
function service_admin_list(vueObj) {
    var obj = {};
    obj.money = vueObj.inputMoney;
    obj.appointID = appointID;
    // obj.appointID = "000b3a41-0000-0000-0000-000087d13f7c";

    $.ajax({
        url:BASE_URL + "service_admin_list",
        type:"POST",
        data: obj,
        timeout:1000*10,
        dataType:"json",

        success:function (data,textStatus,jqXHR) {
            // 返回结果状态值,值为0或1.(0表示请求失败；1表示请求成功)
            if(data.status == 1){
                console.log(data);
                vueObj.adminList = [];
                var shenpiPerson = {};
                shenpiPerson.serviceUserID = data.serviceUserID;
                shenpiPerson.serviceUserName = data.serviceUserName;
                vueObj.adminList.push(shenpiPerson);
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
 * 申请特批优惠
 */
function appoint_discount_apply(vueObj) {
    showLoading();
    vueObj.net = false;
    var obj = {};
    obj.money = vueObj.inputMoney;
    obj.applyUserID = serviceUserID;
    obj.appointID = appointID;
    obj.content = vueObj.discountReason;
    obj.serviceUserID = vueObj.adminList[0].serviceUserID;
    obj.serviceUserID_cc = vueObj.chaosongPerson? vueObj.chaosongPerson.serviceUserID : "" ;

    console.log("djy 申请特批优惠--->"+ JSON.stringify(obj));

    $.ajax({
        url:BASE_URL + "appoint_discount_apply",
        type:"POST",
        data: obj,
        timeout:1000*10,
        dataType:"json",

        success:function (data,textStatus,jqXHR) {
            hideLoading();
            console.log(data);
            // 返回结果状态值,值为0或1.(0表示请求失败；1表示请求成功)
            if(data.status == 1){
                window.location.href="./specialDiscount.html?specialID=" + data.specialID + "&serviceUserID="+ serviceUserID;
            }else {
                showMessage(data.info);
                vueObj.net = true;
            }
        },
        error:function (xhr,textStatus) {
            hideLoading();
            vueObj.net = true;
            showMessage(NET_ERROR);
            console.log("错误信息如下====================");
            console.log(xhr);
            console.log(textStatus);
        },
    });
}