/**
 * Created by Administrator on 2017/6/26 0026.
 */
Array.prototype.clone=function(){ return [].concat(this); } //或者 Array.prototype.clone=function(){ return this.concat(); }

String.prototype.getQuery = function(name)
{
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    var r = this.substr(this.indexOf("?")+1).match(reg);
    if (r!=null) return unescape(r[2]); return null;
}


