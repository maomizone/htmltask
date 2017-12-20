

var sepcialDiscountApply;

$(document).ready(function () {

    // 处理ios不刷新问题
    refreshIOS();
    // 处理android回退按键
    try{
        window.dsBridge.register(ANDROID_BACK_FROM_NATIVE,function(){
            sepcialDiscountApply.back();
        });
    }catch (err){}


    epcialDiscountApply = new Vue({
        el:'#sepcialDiscountApply',

        mounted:function () {
            if(getDisountInfo()){
                var obj = getDisountInfo();
                this.inputMoney = obj.inputMoney;
                this.adminList = obj.adminList;
                this.chaosongPerson = obj.chaosongPerson;
                this.discountReason = obj.discountReason;
            }
            else{

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
                {serviceUserName:"张三"},
                {serviceUserName:"李四"},
            ],
            chaosongPerson:null,
        },
        methods:{
            back: function () {
                window.history.back();
            },
            inputChange: function () {
                this.inputMoney = this.inputMoney.replace(/[^\d.]/g,"");  //清除“数字”和“.”以外的字符
                this.inputMoney = this.inputMoney.replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3'); //只能输入两个小数
                service_admin_list();
            },

            tongxunluClick:function () {
                console.log('5555');
                this.saveInfo();
                window.location.href="./addressList.html?type=1";
            },

            btnClick:function () {
                console.log(this.inputMoney);
                if (this.inputMoney.length == 0){
                    showMessage('请输入金额');
                    return;
                }
                // todo 网络请求
                window.location.href="./specialDiscount.html";
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
function service_admin_list() {
    var obj = {};
    obj.money = epcialDiscountApply.inputMoney;

    $.ajax({
        url:BASE_URL + "service_admin_list",
        type:"POST",
        data: obj,
        timeout:1000*10,
        dataType:"json",

        success:function (data,textStatus,jqXHR) {
            // 返回结果状态值,值为0或1.(0表示请求失败；1表示请求成功)
            if(data.status == 1){
                alert(111)
            }else {
                showMessage(data.info);
            }
        },
        error:function (xhr,textStatus) {
            showMessage(NET_ERROR);
            console.log("错误信息如下====================")
            console.log(xhr)
            console.log(textStatus)
        },
    });
}