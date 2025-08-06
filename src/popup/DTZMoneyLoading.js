/**
 * Created by Administrator on 2017/5/12.
 */
var DTZMoneyLoadingPopup = BasePopup.extend({

    ctor: function (wanfa) {
        this.wanfa = wanfa || 115;
        this._super("res/DTZMoneyLoading.json");

        cc.log("DtzMoneyLoadingPopup::" , this.wanfa);
    },


    selfRender: function () {

        this.addCustomEvent(SyEvent.REMOVE_MONEY_LOADING , this , this.onRemoveMySelf);
        //显示版本号
        this.getWidget("Label_version").setString(SyVersion.v);

        this.Panel_15 = this.getWidget("Panel_15");
        this.Image_bg = this.getWidget("Image_bg");//背景图
        if(this.Image_bg){
            this.Image_bg.visible = true;
        }
        //初始化牌桌字体颜色
        cc.log("this.wanfa::" , this.wanfa);
        this.initBg();
        this.playOrRemoveWaitingAnm();

    },

    onRemoveMySelf:function(){
        if(this.waitAnimation){
            this.waitAnimation.removeFromParent();
            this.waitAnimation = null;
        }
        PopupManager.remove(this);
    },

    /**
     * 增加等待好友动画
     */
    playOrRemoveWaitingAnm:function(){

        if(this.waitAnimation == null){
            ccs.armatureDataManager.addArmatureFileInfo(
                        "res/plist/dengren0.png",
                        "res/plist/dengren0.plist",
                        "res/plist/dengren.ExportJson");
            this.waitAnimation = new ccs.Armature("dengren");
            this.waitAnimation.x = 673;
            this.waitAnimation.y = 336;
            this.root.addChild(this.waitAnimation,99);
            this.waitAnimation.getAnimation().play("dengren",-1,1);

        }
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
                bgTexture = "res/ui/bbt/Bgc1.jpg";
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
        }else if(this.isDdzMoney()){
            bgTexture = "res/ui/ddz/tongyong/ddz_pz.jpg";
        }
        this.Panel_15.setBackGroundImage(bgTexture);

        if(this.isPdkMoney()){
            this.getWidget("Image_bg").visible = false;

            this.getWidget("Image_dtz").visible = false;
            this.getWidget("Image_phz").visible = false;
            this.getWidget("Image_pdk").visible = true;
        }else if(this.isPhzMoney()){
            this.getWidget("Image_phz").loadTexture(gameTexture);
            this.getWidget("Image_bg").visible = false;
            this.getWidget("Image_phz").visible = true;
            this.getWidget("Image_dtz").visible = false;
            this.getWidget("Image_pdk").visible = false;
        } else if(this.isDdzMoney()){
            this.getWidget("Image_bg").visible = false;
            this.getWidget("Image_phz").visible = false;
            this.getWidget("Image_dtz").visible = false;
            this.getWidget("Image_pdk").visible = false;
        }else{
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
    },

    isDdzMoney:function(){
        return this.wanfa == 91;
    }

});