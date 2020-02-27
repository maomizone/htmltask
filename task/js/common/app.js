/**
 * Created by Administrator on 2017/6/14 0014.
 */

var URL, IMG_URL, PublicManage, RepairManage, WashManage, SaleManage, MemberManage, AppointManage, OnlineOrderManage;

/**
 * 原生与js之间交互定义的方法名
 * @type {string}
 */
// from Js

// 工作日历-查看预约
var LOOK_APPOINT_FROM_JS= "lookAppointFromJs";
// 关闭当前h5界面
var CLOSE_PAGE_FROM_JS= "closePageFromJs";
// 传送签名
var GET_SIGN_BASE64_FROM_JS= "getSignBase64FromJs";
// 历史维修详情-查看维修记录
var LOOK_REPAIR_RECORDS_FROM_JS= "lookRepairRecordsFromJs";
// 查看通讯录详情
var LOOK_ADDRESS_DETAIL_FROM_JS= "lookAddressDetailFromJs";
// 通知原生跳转选择卡券界面
var CHOOSE_CARD_COUPONS_FROM_JS= "chooseCardCouponsFromJs";
// 通知原生跳转选择红包界面
var CHOOSE_RED_FROM_JS= "chooseRedFromJs";
// 查看维修单详情
var LOOK_REPAIR_DETAIL_FROM_JS= "lookRepairDetailFromJs";
// 客户确认获取信息
var GET_APPOINT_INFO_FROM_JS= "getAppointInfoFromJs";
// 传送派工人员
var GET_DISPATCH_PERSONS_FROM_JS= "getDispatchPersonsFromJs";
// 传送出库人员
var GET_PICK_PERSON_FROM_JS= "getPickPersonFromJs";
// 传送客户代表人员
var GET_REPRESENTATIVE_PERSON_FROM_JS= "getRepresentativePersonFromJs";
// 传送介绍员工
var GET_INTRODUCE_PERSON_FROM_JS= "getIntroducePersonFromJs";
// 联系审核人
var CALL_FROM_JS= "callFromJs";
var SHORT_MSG_FROM_JS= "shortMsgFromJs";
// 查看卡券
var LOOK_CARD_FROM_JS= "lookCardFromJs";
// 告知原生客户确认成功
var CONFIRM_SUCCESS_FROM_JS= "confirmSuccessFromJs";
// 查看订单来源详情
var LOOK_PAY_SOURCE_FROM_JS= "lookPaySourceFromJs";
// 销售弹出退单弹出框
var SHOW_SALE_BACK_ORDER_DIALOG_FROM_JS= "showSaleBackOrderDialogFromJs";
// 传送IM选择人员
var GET_IM_PERSONS_FROM_JS= "getIMPersonsFromJs";


// from native
var ANDROID_BACK_FROM_NATIVE= "ANDROID_BACK_FROM_NATIVE";
var SET_DATE_FROM_NATIVE= "SET_DATE_FROM_NATIVE";



// localStorage Or sessionStorage KEY
var CC_PERSON = "CC_PERSON";
var DISCOUNT_INFO = "DISCOUNT_INFO";
var CALENDAR_SELECTED_DATE = "CALENDAR_SELECTED_DATE";
var REFRESH_SPECIAL_DISCOUNT = "REFRESH_SPECIAL_DISCOUNT";
var PICKING_RECORDS = "PICKING_RECORDS";



// 常量
var NET_ERROR = "网络故障，请调整网络信号后重新尝试。";

/**
 * 在通讯录页面存储抄送人
 * @param ccList
 */
function saveCCPerson(ccList) {
    var objStr = JSON.stringify(ccList);
    console.log("存储抄送人信息" + objStr);
    sessionStorage.setItem(CC_PERSON,objStr);
};

function getCCPerson() {
    return eval('(' + sessionStorage.getItem(CC_PERSON) + ')');
}

function clearCCPerson() {
    sessionStorage.removeItem(CC_PERSON);
}

/**
 * 特批优惠申请页面存储填写的信息
 * @param obj
 */
function saveDiscountInfo(obj) {
    var objStr = JSON.stringify(obj);
    console.log("优惠信息"+objStr);
    sessionStorage.setItem(DISCOUNT_INFO,objStr);
}

function getDisountInfo() {
    return eval('(' + sessionStorage.getItem(DISCOUNT_INFO) + ')');
}

function clearDiscountInfo() {
    sessionStorage.removeItem(DISCOUNT_INFO);
}

/**
 * 存储领料记录
 * @param obj
 */
function savePickingRecords(obj) {
    var objStr = JSON.stringify(obj);
    console.log("领料记录"+objStr);
    sessionStorage.setItem(PICKING_RECORDS,objStr);
}

function getPickingRecords() {
    return eval('(' + sessionStorage.getItem(PICKING_RECORDS) + ')');
}

function clearPickingRecords() {
    sessionStorage.removeItem(PICKING_RECORDS);
}

/**
 * 存储提交计算页面的数据
 * @param person
 */
function saveSelectedDate(date) {
    sessionStorage.setItem(CALENDAR_SELECTED_DATE,date);
};

function getSelectedDate() {
    return  sessionStorage.getItem(CALENDAR_SELECTED_DATE);
}

function clearSelectedDate() {
    sessionStorage.removeItem(CALENDAR_SELECTED_DATE);
}

function setUrl(url, imgUrl) {
    URL = url;
    IMG_URL = imgUrl;
    // 公共模块(BPO_PublicManage.asmx)
    PublicManage = URL + 'BPO_PublicManage.asmx/';
// 维修美容模块(BPO_RepairManage.asmx)
    RepairManage = URL + 'BPO_RepairManage.asmx/';
// 洗车模块(BPO_WashManage.asmx)
    WashManage = URL + 'BPO_WashManage.asmx/';
// 销售模块(BPO_SaleManage.asmx)
    SaleManage = URL + 'BPO_SaleManage.asmx/';
// 会员模块(BPO_MemberManage.asmx)
    MemberManage = URL + 'BPO_MemberManage.asmx/';
// 预约模块(BPO_AppointManage.asmx)
    AppointManage = URL + 'BPO_AppointManage.asmx/';
// 线上订单模块(BPO_OnlineOrderManage.asmx)
    OnlineOrderManage = URL + 'BPO_OnlineOrderManage.asmx/';
}