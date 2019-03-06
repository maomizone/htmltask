/**
 * 通用组件类
 * Created by Administrator on 2017/6/24 0024.
 */

// 分隔符 高度12px
Vue.component('space', {
    template: '<div class="space"></div>',
});

// 分隔符 高度1px
Vue.component('divider', {
    template: '<div class="divider"></div>',
});
// 保留两位小数
Vue.component('money-template', {
    props: ['money'],
    data:function () {
        var res = "";
        if(this.money == null || this.money == undefined || this.money == "") {
            res = "0.00";
        }else {
            res = parseFloat(this.money).toFixed(2);
        }

        return{
            res: res,
        }
    },
    template: '<span>￥{{res}}</span>'
});


Vue.component('package-template', {
    props: {
        package:Object,
        saleid:String,
    },
    data: function () {
        var p1, p2;
        var showP2 = 'inline';
        var huiyuanMoney = this.getMoney(this.package.packageMoney_new);
        var originMoney = this.getMoney(this.package.packageMoney);

        if(huiyuanMoney == originMoney) {
            showP2 = 'none';
            p1 = huiyuanMoney;
            p2 = "";
        }else {
            p1 = huiyuanMoney;
            p2 = originMoney;
        }
        return{
            show: showP2,
            p1: p1,
            p2: p2,
        }

    },
    methods: {
        getMoney: function (str) {
            if (str == null || str == undefined || str == "" || str == 0) {
                return 0.00.toFixed(2);
            }else {
                return parseFloat(str).toFixed(2);
            }
        },
        lookBackOrderDetail: function () {
            window.location.href="./backOrderDetail.html?saleID=" + this.saleid
                + "&cardGuid=" + ""
                + "&packageGuid=" + this.package.packageGuid
                + "&productGuid=" + ""
            ;
        },
    },
    template: '<div style="background-color: #F8F8F8">'+
    '<div style="padding:0px 12px;height:60px;box-sizing: border-box;display: flex;align-items: center">' +


    // '<span class="font font-24-666" style="flex: 1">{{package.packageName}}</span>' +
    '<div style="flex: 1;display: flex; flex-direction: column;justify-content: center;">' +
    '<span class="font font-24-666">{{package.packageName}}</span>' +
    '<div v-if="package.backState > 0" style="margin-top: 8px">' +
    '<span class="font font-24-orange">{{package.backState == 1 ? "部分退货" : "全部退货"}}</span>' +
    '<span v-if="package.backState == 1" @click="lookBackOrderDetail()" class="font font-24-blue" style="padding: 4px 12px;border: 1px solid #4FD2C2;margin-left: 4px">退货详情</span>' +
    '</div>' +
    '</div>' +

    '<div style="float: right; display: flex; flex-direction: column;align-items: flex-end;justify-content: center">' +
    '<span class="font font-24-orange">￥{{p1}}</span>' +
    '<del class="font font-24-999" v-bind:style="{ display: show }">￥{{p2}}</del>' +
    '<span class="font font-22-666">x{{package.packageNum}}</span>' +
    '</div>' +
    '</div>' +
    '<div class="divider" style="margin-left: 12px"></div>' +
    '</div>'
});

Vue.component('card-template', {
    props: {
        card:Object,
        saleid:String,
    },
    data: function () {
        var p1, p2;
        var showP2 = 'inline';
        var huiyuanMoney = this.getMoney(this.card.cardMoney_new);
        var originMoney = this.getMoney(this.card.cardMoney);

        if(huiyuanMoney == originMoney) {
            showP2 = 'none';
            p1 = huiyuanMoney;
            p2 = "";
        }else {
            p1 = huiyuanMoney;
            p2 = originMoney;
        }
        return{
            show: showP2,
            p1: p1,
            p2: p2,
        }

    },
    methods: {
        getMoney: function (str) {
            if (str == null || str == undefined || str == "" || str == 0) {
                return 0.00.toFixed(2);
            }else {
                return parseFloat(str).toFixed(2);
            }
        },
        lookBackOrderDetail: function () {
            window.location.href="./backOrderDetail.html?saleID=" + this.saleid
                + "&cardGuid=" + this.card.cardGuid
                + "&packageGuid=" + ""
                + "&productGuid=" + ""
            ;
        },
    },
    template: '<div style="background-color: #F8F8F8">'+
    '<div style="padding:0px 12px;height:60px;box-sizing: border-box;display: flex;align-items: center">' +

    // '<span class="font font-24-666" style="flex: 1">{{card.cardName}}</span>' +
    '<div style="flex: 1;display: flex; flex-direction: column;justify-content: center;">' +
    '<span class="font font-24-666">{{card.cardName}}</span>' +
    '<div v-if="card.backState > 0" style="margin-top: 8px">' +
    '<span class="font font-24-orange">{{card.backState == 1 ? "部分退货" : "全部退货"}}</span>' +
    '<span v-if="card.backState == 1" @click="lookBackOrderDetail()" class="font font-24-blue" style="padding: 4px 12px;border: 1px solid #4FD2C2;margin-left: 4px">退货详情</span>' +
    '</div>' +
    '</div>' +

    '<div style="float: right; display: flex; flex-direction: column;align-items: flex-end;justify-content: center">' +
    '<span class="font font-24-orange">￥{{p1}}</span>' +
    '<del class="font font-24-999" v-bind:style="{ display: show }">￥{{p2}}</del>' +
    '<span class="font font-22-666">x{{card.cardNum}}</span>' +
    '</div>' +
    '</div>' +
    '<div class="divider" style="margin-left: 12px"></div>' +
    '</div>'
});

Vue.component('project-template', {
    props: {
        project:Object,
        iswash: Boolean,
    },
    data: function () {
        var p1, p2, projectName;
        var showP2 = 'inline';
        var huiyuanMoney = this.getMoney(this.project.projectMoney_real);
        var originMoney = this.getMoney(this.project.projectMoney);

        if(huiyuanMoney == originMoney) {
            showP2 = 'none';
            p1 = huiyuanMoney;
            p2 = "";
        }else {
            p1 = huiyuanMoney;
            p2 = originMoney;
        }

        projectName = this.project.projectName;
        return{
            show: showP2,
            p1: p1,
            p2: p2,
            projectName:projectName,
        }

    },
    methods: {
        getMoney: function (str) {
            if (str == null || str == undefined || str == "" || str == 0) {
                return 0.00.toFixed(2);
            }else {
                return parseFloat(str).toFixed(2);
            }
        },
    },
    template: '<div style="background-color: #F8F8F8">'+
    '<div style="padding:0px 12px;height:60px;box-sizing: border-box;display: flex;align-items: center">' +
    '<span class="font font-24-666" style="flex: 1">{{projectName}}</span>' +
    '<div style="float: right; display: flex; flex-direction: column;align-items: flex-end;justify-content: center">' +
    '<span class="font font-24-orange">￥{{p1}}</span>' +
    '<del class="font font-24-999" v-bind:style="{ display: show }">￥{{p2}}</del>' +
    '<span class="font font-22-666">x{{parseFloat(project.projectNum)}}</span>' +
    '</div>' +
    '</div>' +
    '<div class="divider" style="margin-left: 12px"></div>' +
    '</div>'
});

Vue.component('product-template', {
    props: {
        product:Object,
        saleid:String,
    },
    data: function () {
        var p1, p2;
        var img = "./img/default.png";
        var showP2 = 'inline';
        var huiyuanMoney;
        if(this.saleid){
            huiyuanMoney = this.getMoney(this.product.productMoney_new);
        }else {
            huiyuanMoney = this.getMoney(this.product.productMoney_real);
        }

        var originMoney = this.getMoney(this.product.productMoney);

        if(huiyuanMoney == originMoney) {
            showP2 = 'none';
            p1 = huiyuanMoney;
            p2 = "";
        }else {
            p1 = huiyuanMoney;
            p2 = originMoney;
        }

        if(!(this.product.productPic == null || this.product.productPic == undefined || this.product.productPic == "")){
            img = getImgSrc(this.product.productPic);
        }
        return{
            show: showP2,
            p1: p1,
            p2: p2,
            img: img,
        }

    },
    methods: {
        getMoney: function (str) {
            if (str == null || str == undefined || str == "" || str == 0) {
                return 0.00.toFixed(2);
            }else {
                return parseFloat(str).toFixed(2);
            }
        },
        lookBackOrderDetail: function () {
            window.location.href="./backOrderDetail.html?saleID=" + this.saleid
                + "&cardGuid=" + ""
                + "&packageGuid=" + ""
                + "&productGuid=" + this.product.productGuid
            ;
        },
    },

    template: '<div style="background-color: #F8F8F8">'+
    '<div style="padding:0px 12px;height:60px;box-sizing: border-box;display: flex;align-items: center">' +
    '<img style="width: 40px;height:40px;margin-right: 12px;" v-bind:src="img">' +

    '<div style="flex: 1;display: flex; flex-direction: column;justify-content: center;">' +
    '<span class="font font-24-666">{{product.productName}}</span>' +
    '<div v-if="product.backState > 0" style="margin-top: 8px">' +
    '<span class="font font-24-orange">{{product.backState == 1 ? "部分退货" : "全部退货"}}</span>' +
    '<span v-if="product.backState == 1" @click="lookBackOrderDetail()" class="font font-24-blue" style="padding: 4px 12px;border: 1px solid #4FD2C2;margin-left: 4px">退货详情</span>' +
    '</div>' +
    '</div>' +

    '<div style="display: flex; flex-direction: column;align-items: flex-end;justify-content: flex-end">' +
    '<span class="font font-24-orange">￥{{p1}}</span>' +
    '<del class="font font-24-999" v-bind:style="{ display: show }">￥{{p2}}</del>' +
    '<span class="font font-22-666">x{{parseFloat(product.productNum)}}</span>' +
    '</div>' +
    '</div>' +
    '<div class="divider"></div>' +
    '</div>'
});


Vue.component('charge-template', {
    props: {
        info:Object,
    },
    data: function () {
        var productMoneys = this.getMoney(this.info.productMoneys);
        var freightMoney = this.getMoney(this.info.freightMoney);
        var discountMoney = this.getMoney(this.info.discountMoney);
        var specialMoney = this.getMoney(this.info.specialMoney);
        var orderMoney = this.getMoney(this.info.orderMoney);
        var redMoney = this.getMoney(this.info.redMoney);
        var cardMoney = this.getMoney(this.info.cardMoney);
        var payMoney = this.getMoney(this.info.payMoney);
        var cardList = this.info.cardList;
        var isMember = this.info.isMember;
        var isFromHistoryRepair = this.info.isFromHistoryRepair;
        var isWash = this.info.isWash;
        var activityMoney = this.getMoney(this.info.activityMoney);

        return{
            productMoneys: productMoneys,
            freightMoney: freightMoney,
            discountMoney: discountMoney,
            specialMoney: specialMoney,
            orderMoney: orderMoney,
            redMoney: redMoney,
            cardMoney: cardMoney,
            payMoney: payMoney,
            cardList: cardList,
            isMember: isMember,
            isFromHistoryRepair: isFromHistoryRepair,
            isWash: isWash,
            activityMoney: activityMoney,
        }

    },
    methods: {
        getMoney: function (str) {
            if (str == null || str == undefined || str == "" || str == 0) {
                return 0.00.toFixed(2);
            }else {
                return parseFloat(str).toFixed(2);
            }
        },
    },

    template:'<div>'+
    '<div style="background-color: white;padding:8px 12px;">' +

    '<div>' +
    '<span class="font font-24-999">总计</span>' +
    '<span class="font font-24-999" style="float: right">￥{{productMoneys}}</span>' +
    '</div>'+

    '<div>' +
    '<span class="font font-24-999">运费</span>' +
    '<span class="font font-24-999" style="float: right">+￥{{freightMoney}}</span>' +
    '</div>'+

    '<div>' +
    '<span class="font font-24-999">客户优惠</span>' +
    '<span class="font font-24-999" style="float: right">-￥{{discountMoney}}</span>' +
    '</div>'+

    '<div v-if="activityMoney!=0">' +
    '<span class="font font-24-999">活动优惠</span>' +
    '<span class="font font-24-999" style="float: right">-￥{{activityMoney}}</span>' +
    '</div>'+

    '<div v-if="specialMoney!=0">' +
    '<span class="font font-24-999">特批优惠</span>' +
    '<span class="font font-24-999" style="float: right">-￥{{specialMoney}}</span>' +
    '</div>'+

    '<div>' +
    '<span class="font font-30-333">订单总价</span>' +
    '<span class="font font-30-333" style="float: right">￥{{orderMoney}}</span>' +
    '</div>'+

    '</div>'+
    '<div class="divider"></div>' +
    <!--支付明细-->
    '<div style="background-color: white;padding:8px 12px;">'+

    '<div style="height: 20px">' +
        '<strong class="font font-22-999" style="float: right">支付明细</strong>'+
    '</div>' +

    '<div v-if="redMoney!=0">' +
        '<span class="font font-24-999">红包</span>' +
        '<span class="font font-24-999" style="float: right">-￥{{redMoney}}</span>' +
    '</div>' +

    '<div v-if="isFromHistoryRepair == 1 && cardMoney!=0">' +
        '<span class="font font-24-999">卡券</span>' +
        '<span class="font font-24-999" style="float: right">-￥{{cardMoney}}</span>' +
    '</div>' +

    '<div v-if="cardList && cardList.length > 0">' +
        '<template v-for="card in cardList">' +
            '<div>' +
                '<span class="font font-24-999">{{card.cardName}}</span>' +
                '<span class="font font-24-999" style="float: right">-￥{{parseFloat(card.money).toFixed(2)}}</span>' +
            '</div>'+
        '</template>' +
    '</div>' +

    '<div>' +
        '<span class="font font-30-333">实付款</span>' +
        '<span class="font font-30-orange" style="float: right">￥{{payMoney}}</span>' +
    '</div>' +

    '</div>' +


    <!--特批缘由-->
    '<div v-if="info.specialName" style="background-color: white;padding: 12px;margin-top: 12px">' +
        '<span class="font font-26-333">特批原由</span>' +
        '<span class="font font-26-666" style="float: right;">{{info.specialName}}</span>' +
    '</div>' +

    '</div>'
});


Vue.component('charge2-template', {
    props: {
        info:Object,
    },
    data: function () {
        var allMoney = this.getMoney(this.info.allMoney);
        var allWorkMoney = this.getMoney(this.info.allWorkMoney);

        return{
            allMoney: allMoney,
            allWorkMoney: allWorkMoney,
        }
    },
    methods: {
        getMoney: function (str) {
            if (str == null || str == undefined || str == "" || str == 0) {
                return 0.0.toFixed(2);
            }else {
                return parseFloat(str).toFixed(2);
            }
        },
    },

    template:
    '<div  style="background-color: white;padding: 12px;display: flex;justify-content: flex-end">' +

    '<span>共{{info.serviceNum}}项服务，合计 ' +
    '<strong class="font-22-orange" style="font-size: 1.5em" >￥{{allMoney}}</strong>' +
    '(含工时费￥{{allWorkMoney}})' +
    '</span>' +

    '</div>'
});

Vue.component('charge3-template', {
    props: {
        info:Object,
    },
    data: function () {
        var allMoney = this.getMoney(this.info.ServiceMoneys);
        var allWorkMoney = this.getMoney(this.info.workMoneys);

        return{
            allMoney: allMoney,
            allWorkMoney: allWorkMoney,
        }
    },
    methods: {
        getMoney: function (str) {
            if (str == null || str == undefined || str == "" || str == 0) {
                return 0.0.toFixed(2);
            }else {
                return parseFloat(str).toFixed(2);
            }
        },
    },

    template:
    '<div  style="background-color: white;padding: 12px;display: flex;justify-content: flex-end">' +

    '<span>共{{info.serviceNum}}项服务，合计 ' +
    '<strong class="font-22-orange" style="font-size: 1.5em" >￥{{allMoney}}</strong>' +
    '(含工时费￥{{allWorkMoney}})' +
    '</span>' +

    '</div>'
});

Vue.component('paytype-template', {
    props: {
        paytype:Number,
    },

    data: function () {
        var res;
        if(this.paytype == 0)
            res = "线下支付 门店支付";
        else if(this.paytype == 1)
            res = "线上支付 支付宝支付";
        else if(this.paytype == 2)
            res = "线上支付 微信支付";
        return{
            res: res,
        }
    },

    template:
    '<div  style="background-color: white;padding: 12px;margin: 12px 0px">' +

    '<span class="font font-26-333">支付方式</span> ' +
    '<span class="font font-26-999" style="float: right;">{{res}}</span>' +

    '</div>'
});


Vue.component('back-template', {
    props: {
        info:Object,
    },

    data: function () {

    },

    template:
    '<div>'+
    '<div style="padding: 8px 12px;display: flex;align-items: center;background-color: white;">' +
    '<span style="flex: 1" class="font font-28-999">退款金额</span>' +
    '<span class="font font-28-333">￥{{parseFloat(info.backMoney).toFixed(2)}}</span>' +
    '</div>' +
    '<div style="padding: 8px 12px;display: flex;align-items: center;background-color: white;">' +
    '<span style="flex: 1" class="font font-28-999">退料件数</span>' +
    '<span class="font font-28-333">{{info.backNum}}</span>' +
    '</div>' +
    '<div style="padding: 8px 12px;display: flex;align-items: center;background-color: white;">' +
    '<span style="flex: 1" class="font font-28-999">退料时间</span>' +
    '<span class="font font-28-333">{{info.backTime}}</span>' +
    '</div>' +
    '<div style="padding: 8px 12px;display: flex;align-items: center;background-color: white;">' +
    '<span style="flex: 1" class="font font-28-999">退款时间</span>' +
    '<span class="font font-28-333">{{info.backMoneyTime}}</span>' +
    '</div>'+
    '</div>'
});
