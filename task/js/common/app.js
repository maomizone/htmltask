/**
 * Created by Administrator on 2017/6/14 0014.
 */
const BASE_URL = 'http://hellodj.eicp.net:13872/wk/BPO_PubFunctionExport.asmx/';

/**
 * 原生与js之间交互定义的方法名
 * @type {string}
 */
// from Js

// 工作日历-查看预约
const LOOK_APPOINT_FROM_JS= "lookAppointFromJs";
// 关闭当前h5界面
const CLOSE_PAGE_FROM_JS= "closePageFromJs";
// 传送签名
const GET_SIGN_BASE64_FROM_JS= "getSignBase64FromJs";
// 历史维修详情-查看维修记录
const LOOK_REPAIR_RECORDS_FROM_JS= "lookRepairRecordsFromJs";
// 查看通讯录详情
const LOOK_ADDRESS_DETAIL_FROM_JS= "lookAddressDetailFromJs";
// 通知原生跳转选择卡券界面
const CHOOSE_CARD_COUPONS_FROM_JS= "chooseCardCouponsFromJs";
// 通知原生跳转选择红包界面
const CHOOSE_RED_FROM_JS= "chooseRedFromJs";
// 查看维修单详情
const LOOK_REPAIR_DETAIL_FROM_JS= "lookRepairDetailFromJs";

// from native
const ANDROID_BACK_FROM_NATIVE= "ANDROID_BACK_FROM_NATIVE";



// localStorage Or sessionStorage KEY
const SINGEL_PERSON = "SINGEL_PERSON";
const DISCOUNT_INFO = "DISCOUNT_INFO";
const COMMIT_BALANCE = "COMMIT_BALANCE";
const REFRESH_SPECIAL_DISCOUNT = "REFRESH_SPECIAL_DISCOUNT";


// 常量
const NET_ERROR = "网络故障，请调整网络信号后重新尝试。";
///////////////////////////////////////////////////////////////////////
function saveSinglePerson(person) {
    var objStr = JSON.stringify(person);
    console.log("存储抄送人信息" + objStr);
    sessionStorage.setItem(SINGEL_PERSON,objStr);
};

function getSingelPerson() {
    return eval('(' + sessionStorage.getItem(SINGEL_PERSON) + ')');
}

function clearSinglePerson() {
    sessionStorage.removeItem(SINGEL_PERSON);
}
///////////////////////////////////////////////////////////////////////
function saveDiscountInfo(Info) {
    var objStr = JSON.stringify(Info);
    console.log("优惠信息"+objStr);
    sessionStorage.setItem(DISCOUNT_INFO,objStr);
}

function getDisountInfo() {
    return eval('(' + sessionStorage.getItem(DISCOUNT_INFO) + ')');
}

function clearDiscountInfo() {
    sessionStorage.removeItem(DISCOUNT_INFO);
}
///////////////////////////////////////////////////////////////////////
/**
 * 存储提交计算页面的数据
 * @param person
 */
function saveCommitBalance(data) {
    var objStr = JSON.stringify(data);
    console.log("存储提交计算页面的数据" + objStr);
    sessionStorage.setItem(COMMIT_BALANCE,objStr);
};

function getCommitBalance() {
    return eval('(' + sessionStorage.getItem(COMMIT_BALANCE) + ')');
}

function clearCommitBalance() {
    sessionStorage.removeItem(COMMIT_BALANCE);
}
///////////////////////////////////////////////////////////////////////
/**
 * 提交结算页面刷新特批优惠那一栏
 */
function saveRefreshSpecialDiscount() {
    sessionStorage.setItem(REFRESH_SPECIAL_DISCOUNT ,true);
}
function getRefreshSpecialDiscount() {
    return sessionStorage.getItem(REFRESH_SPECIAL_DISCOUNT);
}
function clearRefreshSpecialDiscount() {
    sessionStorage.removeItem(REFRESH_SPECIAL_DISCOUNT);
}
///////////////////////////////////////////////////////////////////////




