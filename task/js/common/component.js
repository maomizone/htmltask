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
})
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
})


Vue.component('project-template', {
    props: {
        project:Object,
    },
    data: function () {
        var p1, p2;
        var showP2 = 'inline';
        var huiyuanMoney = this.project.projectMoney_real;
        var originMoney = this.project.projectMoney;

        if(huiyuanMoney == originMoney) {
            showP2 = 'none';
            p1 = parseFloat(this.project.projectMoney).toFixed(2);;
            p2 = "";
        }else {
            p1 = parseFloat(this.project.projectMoney_real).toFixed(2);
            p2 = parseFloat(this.project.projectMoney).toFixed(2);
        }
        return{
            show: showP2,
            p1: p1,
            p2: p2,
        }

    },
    template: '<div style="background-color: #F8F8F8">'+
    '<div style="padding:0px 12px;height:60px;box-sizing: border-box;display: flex;align-items: center">' +
    '<span class="font font-24-666" style="flex: 1">{{project.projectName}}工时费</span>' +
    '<div style="float: right; display: flex; flex-direction: column;align-items: flex-end;justify-content: center">' +
    '<span class="font font-24-orange">￥{{p1}}</span>' +
    '<del class="font font-24-999" v-bind:style="{ display: show }">￥{{p2}}</del>' +
    '<span class="font font-22-666">x{{project.projectNum}}</span>' +
    '</div>' +
    '</div>' +
    '<div class="divider" style="margin-left: 12px"></div>' +
    '</div>'
})
Vue.component('product-template', {
    props: {
        product:Object,
    },
    data: function () {
        var p1, p2;
        var img = "./img/default.png";
        var showP2 = 'inline';
        var huiyuanMoney = this.product.productMoney_real;
        var originMoney = this.product.productMoney;

        if(huiyuanMoney == originMoney) {
            showP2 = 'none';
            p1 = parseFloat(this.product.productMoney).toFixed(2);
            p2 = "";
        }else {
            p1 = parseFloat(this.product.productMoney_real).toFixed(2);
            p2 = parseFloat(this.product.productMoney).toFixed(2);
        }

        if(!(this.product.productPic == null || this.product.productPic == undefined || this.product.productPic == "")){
            img = this.product.productPic;
        }
        return{
            show: showP2,
            p1: p1,
            p2: p2,
            img: img,
        }

    },
    template: '<div style="background-color: #F8F8F8">'+
    '<div style="padding:0px 12px;height:60px;box-sizing: border-box;display: flex;align-items: center">' +
    '<img style="width: 40px;height:40px;margin-right: 12px;" v-bind:src="img">' +
    '<span class="font font-24-666" style="display: inline-block;flex: 1;">{{product.productName}}</span>' +
    '<div style="display: flex; flex-direction: column;align-items: flex-end;justify-content: flex-end">' +
    '<span class="font font-24-orange">￥{{p1}}</span>' +
    '<del class="font font-24-999" v-bind:style="{ display: show }">￥{{p2}}</del>' +
    '<span class="font font-22-666">x{{product.productNum}}</span>' +
    '</div>' +
    '</div>' +
    '<div class="divider"></div>' +
    '</div>'
})

