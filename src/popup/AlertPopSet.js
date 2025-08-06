/**
 * Created by cyp on 2019/3/12.
 */
var SetPop = BasePopup.extend({
    bgMusic:1,
    ctor:function(){
        this._super("res/alertPopSet.json");
    },

    selfRender:function(){

        this.btn_yinyue = this.getWidget("btn_yy");
        this.btn_yinxiao = this.getWidget("btn_yx");

        UITools.addClickEvent(this.btn_yinyue, this, this.onClickYinYue);
        UITools.addClickEvent(this.btn_yinxiao, this, this.onClickYinXiao);
        UITools.addClickEvent(this.getWidget("btn_swich"), this, this.onClickQieHuan);
        UITools.addClickEvent(this.getWidget("Button_report"), this, this.onClickReportBtn);

        UITools.addClickEvent(this.getWidget("btn_check"), this, this.onClickCheck);

        var btn_cancel_bind = this.getWidget("btn_cancel_bind");
        var btn_change_bind = this.getWidget("btn_change_bind");

        UITools.addClickEvent(btn_cancel_bind,this,this.onClickCancelBind);
        UITools.addClickEvent(btn_change_bind,this,this.onClickChangeBind);

        this.setBtnTexture(this.btn_yinyue,PlayerModel.isMusic);
        this.setBtnTexture(this.btn_yinxiao,PlayerModel.isEffect);

        this.panelHall = this.getWidget("panel_hall");
        this.panelRoom = this.getWidget("panel_room");

        if(LayerManager.isInRoom()){
            this.bgMusic = 2;
            this.panelHall.setVisible(false);
            this.panelRoom.setVisible(true);
        }else{
            this.bgMusic = 1;
            this.panelHall.setVisible(true);
            this.panelRoom.setVisible(false);
        }
        this.getWidget("label_version").setString("版本：" + SyVersion.v);
        this.getWidget("label_version_1").setString("版本：" + SyVersion.v);
    },

    onClickReportBtn:function(){
        var mc = new ReportPop();
        PopupManager.addPopup(mc);
    },

    onClickCancelBind:function(){
        if(PlayerModel.phoneNum){
            var mc = new PhoneLoginPop(5);
            PopupManager.addPopup(mc);
        }else{
            FloatLabelUtil.comText("暂未绑定手机号");
        }
    },

    onClickChangeBind:function(){
        if(PlayerModel.phoneNum){
            var mc = new PhoneLoginPop(6);
            PopupManager.addPopup(mc);
        }else{
            FloatLabelUtil.comText("暂未绑定手机号");
        }
    },

    onClickQieHuan:function(){
        AlertPop.show("您确定退出登录吗？",function(){
            cc.sys.localStorage.setItem("LastLoginType","");
            PopupManager.removeAll();
            WXHelper.cleanCache();//清除掉微信的值
            XLHelper.xl_cleanCache();//清除掉闲聊的值
            var userInfo = cc.sys.localStorage;
            userInfo.removeItem("pdkFlatId");//游客账号
            WXHeadIconManager.clean();
            AudioManager.stop_bg();
            NetErrorPopData.mc = null;
            PingClientModel.reset();
            PlayerModel.clear();
            sySocket.disconnect();
            LayerManager.dispose();
            LayerManager.showLayer(LayerFactory.LOGIN);
            IMSdkUtil.gotyeExit();
        });
    },

    onClickCheck:function(){
        var mc = new AgreementPop();
        PopupManager.addPopup(mc);
    },

    onClickYinYue:function(sender){
        var newState = sender.state >0?0:50;
        this.setBtnTexture(sender,newState);

        AudioManager.isMusic = PlayerModel.isMusic = newState;
        if(AudioManager.isMusic){
            cc.audioEngine.resumeMusic();
        }else{
            cc.audioEngine.pauseMusic();
        }
    },

    onClickYinXiao:function(sender){
        var newState = sender.state >0?0:50;
        this.setBtnTexture(sender,newState);

        AudioManager.isEffects = PlayerModel.isEffect = newState;
    },

    setBtnTexture:function(btn,state){
        btn.state = state;
        btn.loadTextureNormal(state?"popup_setting_btn_kai.png":"popup_setting_btn_guan.png", ccui.Widget.PLIST_TEXTURE);
    },

    onClose:function(){
        var state1 = this.btn_yinyue.state;
        var state2 = this.btn_yinxiao.state;
        AudioManager.reloadFromData(state1,state2,this.bgMusic);
        sySocket.sendComReqMsg(10,[state1,state2,state1,state2,this.bgMusic]);
    },
});