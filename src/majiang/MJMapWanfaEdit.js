/**
 * Created by admin on 2018/8/22.
 */
//"陇南摆叫_xiaogankefu008;兰州二报_lzmj166;兰州翻金_lzmj166;酒泉麻将_xiaogankefu888;武威麻将_wwmj222;
// 陇西麻将_lxmj020&lxmj021;平凉麻将_plmj066;二报麻将_gsmj088;秦安麻将_qamj066&qamj088;滑水麻将_qymj066;
// 咣咣麻将_mxmj066&mxmj088;兰州麻将_lzmj166;谷仓麻将_lzmj166;张掖麻将_zymj116;金昌麻将_xiaogankefu030&xiaogankefu031;"
var phoneInitConfing    ={
    isInit:false,
    init:function(data){
        //"陇南摆叫_xiaogankefu008;兰州二报_lzmj166;兰州翻金_lzmj166;酒泉麻将_xiaogankefu888;武威麻将_wwmj222;
// 陇西麻将_lxmj020&lxmj021;平凉麻将_plmj066;二报麻将_gsmj088;秦安麻将_qamj066&qamj088;滑水麻将_qymj066;
// 咣咣麻将_mxmj066&mxmj088;兰州麻将_lzmj166;谷仓麻将_lzmj166;张掖麻将_zymj116;金昌麻将_xiaogankefu030&xiaogankefu031;"
        var service = data.split(";");
        for(var i=0;i<service.length;i++){
            var items = service[i].split("_");
            for(var j in phoneConfing ){
                if (phoneConfing[j].tag == items[0]){
                    var phone = items[1].split("&");
                    phoneConfing[j].phone = phone;
                    break;
                }
            }
        }
        this.isInit = true;
    }

}
var phoneConfing = {
    baijiao:{
        temp:1,
        tag:"陇南摆叫",
       // phone:["xiaogankefu008"]
        phone:null
    },
    lanzhou:{
        temp:2,
        tag:"兰州麻将",
        //phone:["lzmj166"]
        phone:null
    },
    jinchang:{
        temp:3,
        tag:"金昌麻将",
       // phone:["xiaogankefu030","xiaogankefu031"]
        phone:null
    },
    zhangye:{
        temp:4,
        tag:"张掖麻将",
       //phone:["zymj116"]
        phone:null
    },

    lanzhouguichang:{
        temp:5,
        tag:"谷仓麻将",
        //phone:["lzmj166"]
        phone:null
    },
    guangguang:{
        temp:6,
        tag:"咣咣麻将",
       // phone:["mxmj066","mxmj088"]
        phone:null
    },
    huashui:{
        temp:7,
        tag:"滑水麻将",
       // phone:["qymj066"]
        phone:null
    },
    taian:{
        temp:8,
        tag:"秦安麻将",
        //phone:["qamj066","qamj088"]
        phone:null
    },

    pingliang:{
        temp:9,
        tag:"平凉麻将",
        //phone:["plmj066"]
        phone:null
    },
    erbao:{
        temp:10,
        tag:"二报麻将",
        //phone:["gsmj088"]
        phone:null
    },
    longxi:{
        temp:11,
        tag:"陇西麻将",
        //phone:["lxmj020","lxmj021"]
        phone:null
    },
    wuwei:{
        temp:12,
        tag:"武威麻将",
        //phone:["wwmj222"]
        phone:null
    },

    jiuquan:{
        temp:13,
        tag:"酒泉麻将",
        //phone:["xiaogankefu888"]
        phone:null
    },
    lanzhouerbao:{
        temp:14,
        tag:"兰州二报",
        //phone:["lzmj166"]
        phone:null
    },
    lanzhoufanjin:{
        temp:15,
        tag:"兰州翻金",
        //phone:["lzmj166"]
        phone:null
    },

}

var MapWanfaConfig = {

    jiangyuguan:{
        id:1,
        wanfa:[13],
        imageUrl:"res/ui/gansu_mj/mjCreateRoom/jiayuguan.png"
    },
    jiuquan:{
        id:2,
        wanfa:[13],
        imageUrl:"res/ui/gansu_mj/mjCreateRoom/jiuquan.png"
    },
    gannan:{
        id:3,
        wanfa:[],
        imageUrl:"res/ui/gansu_mj/mjCreateRoom/gannan.png"
    },
    linxia:{
        id:4,
        wanfa:[],
        imageUrl:"res/ui/gansu_mj/mjCreateRoom/linxia.png"
    },
    lanzhou:{
        id:5,
        wanfa:[2,5,14,15],
        imageUrl:"res/ui/gansu_mj/mjCreateRoom/lanzhou.png"
    },
    longnan:{
        id:6,
        wanfa:[1],
        imageUrl:"res/ui/gansu_mj/mjCreateRoom/longnan.png"
    },
    tianshui:{
        id:7,
        wanfa:[8,10],
        imageUrl:"res/ui/gansu_mj/mjCreateRoom/tianshui.png"
    },
    pingliang:{
        id:8,
        wanfa:[9],
        imageUrl:"res/ui/gansu_mj/mjCreateRoom/pingliang.png"
    },
    qingyang:{
        id:9,
        wanfa:[7],
        imageUrl:"res/ui/gansu_mj/mjCreateRoom/qingyang.png"
    },
    dingxi:{
        id:10,
        wanfa:[6,11],
        imageUrl:"res/ui/gansu_mj/mjCreateRoom/dingxi.png"
    },
    baiyin:{
        id:11,
        wanfa:[],
        imageUrl:"res/ui/gansu_mj/mjCreateRoom/baiyin.png"
    },
    wuwei:{
        id:12,
        wanfa:[12],
        imageUrl:"res/ui/gansu_mj/mjCreateRoom/wuwei.png"
    },
    jinchang:{
        id:13,
        wanfa:[3],
        imageUrl:"res/ui/gansu_mj/mjCreateRoom/jinchang.png"
    },
    zhangye:{
        id:14,
        wanfa:[4],
        imageUrl:"res/ui/gansu_mj/mjCreateRoom/zhangye.png"
    }
}

var JLBMapWanfaConfig = {
    jiangyuguan: {
        id: 1,
        wanfa: [11],
        imageUrl: "res/ui/gansu_mj/mjCreateRoom/jiayuguan.png"
    },
    jiuquan: {
        id: 2,
        wanfa: [11],
        imageUrl: "res/ui/gansu_mj/mjCreateRoom/jiuquan.png"
    },
    gannan: {
        id: 3,
        wanfa: [],
        imageUrl: "res/ui/gansu_mj/mjCreateRoom/gannan.png"
    },
    linxia: {
        id: 4,
        wanfa: [],
        imageUrl: "res/ui/gansu_mj/mjCreateRoom/linxia.png"
    },
    lanzhou: {
        id: 5,
        wanfa: [2, 5, 12, 13],
        imageUrl: "res/ui/gansu_mj/mjCreateRoom/lanzhou.png"
    },
    longnan: {
        id: 6,
        wanfa: [1],
        imageUrl: "res/ui/gansu_mj/mjCreateRoom/longnan.png"
    },
    tianshui: {
        id: 7,
        wanfa: [8],
        imageUrl: "res/ui/gansu_mj/mjCreateRoom/tianshui.png"
    },
    pingliang: {
        id: 8,
        wanfa: [9],
        imageUrl: "res/ui/gansu_mj/mjCreateRoom/pingliang.png"
    },
    qingyang: {
        id: 9,
        wanfa: [7],
        imageUrl: "res/ui/gansu_mj/mjCreateRoom/qingyang.png"
    },
    dingxi: {
        id: 10,
        wanfa: [6, 11],
        imageUrl: "res/ui/gansu_mj/mjCreateRoom/dingxi.png"
    },
    baiyin: {
        id: 11,
        wanfa: [],
        imageUrl: "res/ui/gansu_mj/mjCreateRoom/baiyin.png"
    },
    wuwei: {
        id: 12,
        wanfa: [],
        imageUrl: "res/ui/gansu_mj/mjCreateRoom/wuwei.png"
    },
    jinchang: {
        id: 13,
        wanfa: [3],
        imageUrl: "res/ui/gansu_mj/mjCreateRoom/jinchang.png"
    },
    zhangye: {
        id: 14,
        wanfa: [4],
        imageUrl: "res/ui/gansu_mj/mjCreateRoom/zhangye.png"
    }
}



var MJMapWanfaEdit = BasePopup.extend({

    ctor:function(){
        this._super("res/mapCreateRoom.json");
    },

    selfRender:function(){
        this.Button_zixuan = this.getWidget("Button_zixuan");
        var  widgets = {"Button_jiangyuguan":1,"Button_jiuquan":2,"Button_gannan":3,"Button_linxia":4,"Button_lanzhou":5,"Button_longnan":6,"Button_tianshui":7,"Button_pingliang":8,
            "Button_qingyang":9,"Button_dingxi":10,"Button_baiyin":11,"Button_wuwei":12,"Button_jinchang":13,"Button_zhangye":14}
        this.addClickEvent(widgets,this.onDelMapWanfaClick);
        UITools.addClickEvent(this.Button_zixuan,this,this.zixuan);
    },
    onDelMapWanfaClick:function(obj){
        for(var item in MapWanfaConfig ){
           if( MapWanfaConfig[item].id == obj.temp){
               if ( MapWanfaConfig[item].wanfa.length<1){
                   FloatLabelUtil.comText("暂无玩法，敬请期待");
               }else{
                   //this.removeFromParent(true);
                   cc.sys.localStorage.setItem("sy_mj_wanfaLists",MapWanfaConfig[item].wanfa);
                   SyEventManager.dispatchEvent(SyEvent.CREATEROOM_WANFALIST,MapWanfaConfig[item].wanfa);
                   cc.sys.localStorage.setItem("sy_mj_wanfaTag",obj.temp);
                   SyEventManager.dispatchEvent(SyEvent.CREATEROOM_TAG,obj.temp);
               }
               return;
           }
        }
        FloatLabelUtil.comText("错误点击");
    },
    zixuan:function(){
        var wfbj = new MJWanfaEdit();
        var parent = this.getParent()
        parent.addChild(wfbj,10);
       // this.onClose();
    },
    onClose:function(){
        this.removeFromParent(true);
    },

    addClickEvent:function(widgets,selector){
        for(var key in widgets){
            var widget = this[key] = this.getWidget(key);
            widget.temp = parseInt(widgets[key]);
            UITools.addClickEvent(widget,this,selector,true);
        }
    },

});




var JLBMJMapWanfaEdit = BasePopup.extend({

    ctor:function(){
        this._super("res/mapCreateRoom.json");
    },

    selfRender:function(){
        this.Button_zixuan = this.getWidget("Button_zixuan");
        this.Button_wuwei = this.getWidget("Button_wuwei");
        this.Button_wuwei.loadTextureNormal("res/ui/gansu_mj/mjCreateRoom/map/btn-wuwei2.png")
        var  widgets = {"Button_jiangyuguan":1,"Button_jiuquan":2,"Button_gannan":3,"Button_linxia":4,"Button_lanzhou":5,"Button_longnan":6,"Button_tianshui":7,"Button_pingliang":8,
            "Button_qingyang":9,"Button_dingxi":10,"Button_baiyin":11,"Button_wuwei":12,"Button_jinchang":13,"Button_zhangye":14}
        this.addClickEvent(widgets,this.onDelMapWanfaClick);
        UITools.addClickEvent(this.Button_zixuan,this,this.zixuan);
    },
    onDelMapWanfaClick:function(obj){
        for(var item in JLBMapWanfaConfig ){
            if( JLBMapWanfaConfig[item].id == obj.temp){
                if ( JLBMapWanfaConfig[item].wanfa.length<1){
                    FloatLabelUtil.comText("暂无玩法，敬请期待");
                }else{
                    //this.removeFromParent(true);
                    cc.sys.localStorage.setItem("sy_jlbmj_wanfaLists",JLBMapWanfaConfig[item].wanfa);
                    SyEventManager.dispatchEvent(SyEvent.CREATEROOM_WANFALIST_JLB,JLBMapWanfaConfig[item].wanfa);
                    cc.sys.localStorage.setItem("sy_jlbmj_wanfaTag",obj.temp);
                    SyEventManager.dispatchEvent(SyEvent.CREATEROOM_TAG_JLB,obj.temp);
                }
                return;
            }
        }
        FloatLabelUtil.comText("错误点击");
    },
    zixuan:function(){
        var wfbj = new MJJLBWanfaEdit();
        var parent = this.getParent()
        parent.addChild(wfbj,10);
        // this.onClose();
    },
    onClose:function(){
        this.removeFromParent(true);
    },

    addClickEvent:function(widgets,selector){
        for(var key in widgets){
            var widget = this[key] = this.getWidget(key);
            widget.temp = parseInt(widgets[key]);
            UITools.addClickEvent(widget,this,selector,false);
        }
    },

});




