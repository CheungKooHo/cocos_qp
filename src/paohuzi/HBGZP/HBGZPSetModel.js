/**
 * Created by Administrator on 2019/12/3.
 */
var HBGZPSetModel = {
    kscp:0,//快速吃牌
    kqtp:0,//开启听牌
    yyxz:1,//语音选择
    cpsd:1,//出牌速度
    zpdx:1,//字牌大小
    //zpxz:1,//字牌选择
    zmbj:1,//桌面背景
    cardTouchend:320,//出牌位置
    init:function(){
        this.kscp = parseInt(this.getLocalItem("hbgzp_kscp"+PHZGameTypeModel.HBGZP)) == 1 ? 1:parseInt(this.getLocalItem("hbgzp_kscp")) == 1?1:0;  //1,0
        this.kqtp = (parseInt(this.getLocalItem("hbgzp_kqtp"+PHZGameTypeModel.HBGZP)) == 0 ? 0:parseInt(this.getLocalItem("hbgzp_kqtp")) == 0?0:1)||this.getDefaultKqtp();  //1,0
        this.yyxz = parseInt(this.getLocalItem("hbgzp_yyxz"+PHZGameTypeModel.HBGZP)) || this.getDefaultYyxz();  //1,2,3
        this.cpsd = this.getLocalItem("hbgzp_cpsd"+PHZGameTypeModel.HBGZP)||this.getLocalItem("hbgzp_cpsd") || this.getDefaultCpsd();  //1,2,3
        this.xxxz = parseInt(this.getLocalItem("hbgzp_xxxz"+PHZGameTypeModel.HBGZP)) == 1 ? 1:parseInt(this.getLocalItem("hbgzp_xxxz")) == 1 ? 1:0;  //1,0
        this.zpdx = parseInt(this.getLocalItem("hbgzp_zpdx"+PHZGameTypeModel.HBGZP)) ||parseInt(this.getLocalItem("hbgzp_zpdx"))|| this.getDefaultZpdx();  //1,2,3
        //this.zpxz = this.getLocalItem("hbgzp_zpxz"+PHZGameTypeModel.HBGZP)||this.getLocalItem("hbgzp_zpxz") || this.getDefaultZpxz();  //1,2,3
        this.zmbj = this.getLocalItem("hbgzp_zmbj"+PHZGameTypeModel.HBGZP)||this.getLocalItem("hbgzp_zmbj") || this.getDefaultZmbj();  //1,2,3
    },
    getDefaultKqtp:function(){
        return 0;
    },
    getDefaultCpsd:function(){
        return 1;
    },
    getDefaultZmbj:function(){
        return 5;
    },
    getDefaultYyxz:function(){
        return 3;
    },
    getDefaultZpdx:function(){
        return 3;
    },
    //getDefaultZpxz:function(){
    //    return 1;
    //},
    getValue:function(string){
        if (this.getLocalItem(string+PHZGameTypeModel.HBGZP) == null){
            this.init();
            if (string =="hbgzp_kscp"){
                return this.kscp;
            }else if (string =="hbgzp_kqtp"){
                return this.kqtp;
            }else if (string =="hbgzp_yyxz"){
                return this.yyxz;
            }else if (string =="hbgzp_cpsd"){
                return this.cpsd;
            }else if (string =="hbgzp_xxxz"){
                return this.xxxz;
            }
            //else if (string =="hbgzp_zpxz"){
            //    return this.zpxz;
            //}
            else if (string =="hbgzp_zmbj"){
                return this.zmbj;
            }
        }else {
            return this.getLocalItem(string+PHZGameTypeModel.HBGZP);
        }

    },

    setLocalItem:function(key,values){
        cc.sys.localStorage.setItem(key,values);
    },

    getLocalItem:function(key){
        var val = cc.sys.localStorage.getItem(key);
        if(val)
            val = parseInt(val);
        return val;
    }
}