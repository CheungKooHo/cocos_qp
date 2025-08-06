/**
 * Created by Administrator on 2017/5/12.
 */
var MatchRoomWaitPop = BasePopup.extend({

    ctor: function (wanfa,tableCount) {
        this.wanfa = wanfa || 16;
        this._dt = 1;
        this.matchWaitTime = 0;
        this.tableCount = tableCount || 0;
        cc.log("MatchRoomWaitPop::" , this.wanfa);
        this._super("res/matchWaitRoom.json");
    },


    selfRender: function () {

        //显示版本号
        this.getWidget("Label_version").setString(SyVersion.v);

        this.Panel_15 = this.getWidget("Panel_15");

        //比赛提示时间
        this.Label_matchTip = this.getWidget("Label_matchTip");
        this.Label_matchTip.setString("正在计算晋级排名，请稍后...");

        this.Label_matchTipTime = this.getWidget("Label_matchTipTime");
        this.Label_matchTipTime.setString("");

        this.Label_nowTable = this.getWidget("Label_nowTable");
        this.Label_nowTable.setString("(当前剩余"+this.tableCount+"桌)");

        this.addCustomEvent(SyEvent.MATCH_REMOVE_WAIT , this , this.onRemoveMySelf);
        this.addCustomEvent(SyEvent.MATCH_REFRESH_WAIT , this , this.updateTableCount);

        this.initBg();
        this.scheduleUpdate();

    },

    update:function(dt){
        this._dt += dt;
        if(this._dt>=1){
            this._dt = 0;
            this.matchWaitTime = this.matchWaitTime + 1;
            this.Label_nowTable.setString("(当前剩余"+this.tableCount+"桌)"+this.matchWaitTime+"s")
        }
    },

    onRemoveMySelf:function(){
        PopupManager.remove(this);
    },

    /**
     * 刷新显示牌桌人数
     */
    updateTableCount:function(event){
        var count = event.getUserData();
        this.Label_nowTable.setString("(当前剩余"+count+"桌)"+this.matchWaitTime+"s");
    },

    initBg: function () {
        var type = this.getLocalItem("sy_dtz_pz") || 1;
        this.showBgColor(type);
    },

    getLocalItem:function(key){
        var val = cc.sys.localStorage.getItem(key);
        if(val)
            val = parseInt(val);
        return val;
    },

    //更新背景图和 更新字体颜色
    showBgColor: function (_type) {
        //绿色背景1蓝色背景2紫色背景3
        cc.log("showBgColor::" , this.wanfa);
        var bgTexture = "res/ui/dtz/dtzRoom/background1.jpg";
        var gameTexture = "res/ui/phz/pp/gametype1.png";
        if(this.wanfa == 115){
            if (_type == 1){
                bgTexture = "res/ui/dtz/dtzRoom/background1.jpg";
            }else if (_type == 2){
                bgTexture = "res/ui/dtz/dtzRoom/background2.jpg";
            }else if (_type == 3){
                bgTexture = "res/ui/dtz/dtzRoom/background3.jpg";
            }
        }else if(this.wanfa == 16){
            var type = this.getLocalItem("sy_pdk_pz") || 1;
            if (type == 1){
                bgTexture = "res/ui/bbt/Bgc1.png";
            }else if (type == 2){
                bgTexture = "res/ui/bbt/Bgc2.jpg";
            }else if (type == 3){
                bgTexture = "res/ui/bbt/Bgc3.jpg";
            }
        }else if(this.wanfa == 33){
            var bgType =  this.getLocalItem("sy_phz_zmbj") || 1;  //1,2,3
            bgTexture = "res/ui/phz/pp/room_bg1.jpg";
            if (bgType == 1){
            }else if (bgType == 2){
                gameTexture = "res/ui/phz/pp/gametype2.png";
                bgTexture = "res/ui/phz/pp/room_bg2.jpg";
            }else if (bgType == 3){
                gameTexture = "res/ui/phz/pp/gametype3.png";
                bgTexture = "res/ui/phz/pp/room_bg3.jpg";
            }else if (bgType == 4){
                bgTexture = "res/ui/phz/pp/room_bg4.jpg";
            }
        }
        this.Panel_15.setBackGroundImage(bgTexture);

        if(this.isPdkMoney()){

            this.getWidget("Image_dtz").visible = false;
            this.getWidget("Image_phz").visible = false;
            this.getWidget("Image_pdk").visible = true;
        }else if(this.isPhzMoney()){
            this.getWidget("Image_phz").loadTexture(gameTexture);
            this.getWidget("Image_phz").visible = true;
            this.getWidget("Image_dtz").visible = false;
            this.getWidget("Image_pdk").visible = false;
        } else{
            this.getWidget("Image_dtz").visible = true;
            this.getWidget("Image_pdk").visible = false;
            this.getWidget("Image_phz").visible = false;
        }

    },

    isDtzMoney:function(){
        return this.wanfa == 115;
    },

    isPdkMoney:function(){
        return this.wanfa == 16;
    },

    isPhzMoney:function(){
        return this.wanfa == 33;
    }

});