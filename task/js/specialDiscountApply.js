
var str = location.search;
var appointID = str.getQuery("appointID");
var serviceUserID = str.getQuery("serviceUserID");
var organizeOID = str.getQuery("organizeOID");
var postID = str.getQuery("postID");
var payMoney = str.getQuery("payMoney");
var URL = str.getQuery("url");
setUrl(URL);

// appointID="000CBDFA-0000-0000-0000-00003262DCA8";
// serviceUserID="00128317-0000-0000-0000-000076FF3905";
// payMoney = 80;
// organizeOID = "000BEF06-0000-0000-0000-0000A0059BE8";
// postID = "00119AED-0000-0002-0000-0000611EC1BD";
// var URL = "http://hellodj.eicp.net:13872/api_yj/App/jkgl/BusinessUnit/MerchantInterface/";
// setUrl(URL);
// appointID="06bc0891-cbde-4669-9417-942d3c4a39fb";
// serviceUserID="0008ac93-0000-0000-0000-000070622ca5";
// payMoney = 795.88;
// organizeOID = "000bef06-0000-0003-0000-0000a0547eef";
// postID = "000557a7-0000-0000-0000-0000a9569610";
// var URL = "http://222.185.244.186:8401/App/jkgl/BusinessUnit/MerchantInterface/";
// setUrl(URL);


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
            special_approval_bearFee(this);
            $(".pop").hide();
            $(".masking").hide();

            if(getDisountInfo()){
                var obj = getDisountInfo();
                this.inputMoney = obj.inputMoney;
                this.discountReason = obj.discountReason;
                this.bear = obj.bear;
                this.approverList = obj.approverList;
                this.ccList = obj.ccList;
            }
            clearDiscountInfo();

            if(getCCPerson()){
                var ccArray = [];
                getCCPerson().map(function (item) {
                    item.processUserID = item.serviceUserID;
                    item.processUserName = item.serviceUserName;
                    ccArray.push(item);
                });

                var newArr = this.ccList.concat(ccArray);

                // 去重
                var obj = {};
                newArr = newArr.reduce(function(item, next) {
                    obj[next.processUserID] ? '' : obj[next.processUserID] = true && item.push(next);
                    return item;
                }, []);

                this.ccList = newArr;
                console.log("去重 ccList", JSON.stringify(this.ccList));
            }else {
                console.log("没有数据，需要刷新");
            }
            clearCCPerson();
        },

        data:{
            isBearFeeShow: 0, // 是否显示总部承担(0:否,1:是)
            editMoney: "",
            inputMoney: "",
            discountReason:"",
            net:true,
            bear: false, // 总部承担
            approverList: [], // 审批人员
            ccList: [],        // 抄送人员
        },
        methods:{
            back: function () {
                window.dsBridge.call(CLOSE_PAGE_FROM_JS, {}, function (responseData) {
                })
            },
            tongxunluClick:function () {
                this.saveInfo();
                window.location.href="./addressList.html?type=1&organizeOID=" + organizeOID + "&url="+ URL;
            },
            saveInfo:function () {
                var objStr = {};
                objStr.inputMoney = this.inputMoney;
                objStr.discountReason = this.discountReason;
                objStr.bear = this.bear;
                objStr.approverList = this.approverList;
                objStr.ccList = this.ccList;
                saveDiscountInfo(objStr);
            },
            bearClick:function () {
                if (!this.bear){
                    var setContents = "确认开启“总部承担”并进行总部审批流程？";
                    var setButton = '["取消","确认"]';
                    var _this = this;
                    // 确认
                    $(".cancel").openWindow("",setContents,setButton, function () {
                        _this.bear = true;
                        if (_this.inputMoney.length == 0){
                            showMessage('请输入金额');
                            return;
                        }
                        if (parseFloat(_this.inputMoney) > parseFloat(payMoney)){
                            showMessage("特批优惠金额不能超过应付总计", 3000, true);
                            return;
                        }
                        special_approval_user_list(_this);
                    });
                }else{
                    this.bear = false;
                    if (this.inputMoney.length == 0){
                        showMessage('请输入金额');
                        return;
                    }
                    if (parseFloat(this.inputMoney) > parseFloat(payMoney)){
                        showMessage("特批优惠金额不能超过应付总计", 3000, true);
                        return;
                    }
                    special_approval_user_list(this);
                }
            },
            inputChange: function () {
                this.editMoney = this.editMoney.replace(/[^\d.]/g,"");  //清除“数字”和“.”以外的字符
                this.editMoney = this.editMoney.replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3'); //只能输入两个小数
            },
            edit:function () {
                $(".pop").show();
                $(".masking").show();
            },
            cancel:function () {
                $(".pop").hide();
                $(".masking").hide();
                this.editMoney = "";
            },
            confirm:function () {
                if (this.editMoney.length == 0){
                    showMessage('请输入金额');
                    return;
                }
                if (parseFloat(this.editMoney) > parseFloat(payMoney)){
                    showMessage("特批优惠金额不能超过应付总计", 3000, true);
                    return;
                }
                $(".pop").hide();
                $(".masking").hide();
                this.inputMoney = this.editMoney;
                this.editMoney = "";
                special_approval_user_list(this);
            },
            submit:function () {
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
                    special_approval_submit(this);
                }else {
                    showMessage('请勿重复提交！');
                }
            },
        }
    });
})

/**
 * 特批优惠-总部承担
 */
function special_approval_bearFee(vueObj) {
    var obj = {};

    console.log("special_approval_bearFee--->"+ JSON.stringify(obj));

    $.ajax({
        url:RepairManage + "special_approval_bearFee",
        type:"POST",
        data: obj,
        timeout:1000*20,
        dataType:"json",

        success:function (data,textStatus,jqXHR) {
            // 返回结果状态值,值为0或1.(0表示请求失败；1表示请求成功)
            if(data.status == 1){
                console.log(JSON.stringify(data));
                if(data.bearFee.isBearFee == 1){
                    vueObj.isBearFeeShow = 1;
                }
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
 * 特批优惠-根据优惠金额获取审批人员/抄送人员列表
 */
function special_approval_user_list(vueObj) {
    showLoading();
    var obj = {};
    obj.appointID = appointID;
    obj.applyUserID = serviceUserID;
    obj.applyPostID = postID;
    obj.isBearFee = vueObj.bear ? 1 : 0;
    obj.money = vueObj.inputMoney;

    console.log("special_approval_user_list--->"+ JSON.stringify(obj));

    $.ajax({
        url:RepairManage + "special_approval_user_list",
        type:"POST",
        data: obj,
        timeout:1000*60*3,
        dataType:"json",

        success:function (data,textStatus,jqXHR) {
            hideLoading();
            // 返回结果状态值,值为0或1.(0表示请求失败；1表示请求成功)
            if(data.status == 1){
                console.log(JSON.stringify(data));
                vueObj.approverList = data.approverList;
                vueObj.ccList = data.ccList;
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
 * 申请特批优惠
 */
function special_approval_submit(vueObj) {
    showLoading();
    vueObj.net = false;
    var obj = {};
    obj.appointID = appointID;
    obj.applyUserID = serviceUserID;
    obj.money = vueObj.inputMoney;
    obj.reason = vueObj.discountReason;
    obj.isBearFeeShow = vueObj.isBearFeeShow;
    obj.isBearFee = vueObj.bear ? 1 : 0;
    obj.bearFeeMoney = vueObj.inputMoney;

    obj.approverID = "";
    vueObj.approverList.map(function (item) {
        if(item != vueObj.approverList[vueObj.approverList.length-1]){
            obj.approverID += item.processUserID + ",";
        }else {
            obj.approverID += item.processUserID;
        }
    });
    obj.ccID = "";
    vueObj.ccList.map(function (item) {
        if(item != vueObj.ccList[vueObj.ccList.length-1]){
            obj.ccID += item.processUserID + ",";
        }else {
            obj.ccID += item.processUserID;
        }
    });

    console.log("djy 申请特批优惠--->"+ JSON.stringify(obj));

    $.ajax({
        url:RepairManage + "special_approval_submit",
        type:"POST",
        data: obj,
        timeout:1000*60*3,
        dataType:"json",

        success:function (data,textStatus,jqXHR) {
            hideLoading();
            console.log(data);
            // 返回结果状态值,值为0或1.(0表示请求失败；1表示请求成功)
            if(data.status == 1){
                // window.location.href="./specialDiscount.html?specialID=" + data.specialID + "&serviceUserID="+ serviceUserID;
                window.location.href="./specialDiscount.html?flowInst=" + data.flowResult.flowInst + "&url="+ URL + "&userID="+ serviceUserID + "&postID="+ postID;
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