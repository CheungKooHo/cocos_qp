/**
 * Created by Administrator on 2019/11/23.
 */

var CSMJSmallResultOtherPop = BasePopup.extend({

    ctor: function (data,isReplay) {
        this.data = data;
        this.isHu = false;
        this.isReplay = isReplay || false;
        this.huSeat = 0;
        this._super("res/gdcsmjDipai.json");
    },

    selfRender: function () {
        var Image_title = this.getWidget("Image_title");
        Image_title.loadTexture("res/ui/mj/mjSmallResult/title_syp.png");

        var Panel_dipai = this.getWidget("Panel_dipai");
        var num = 20;
        for(var i = 0;i < this.data.leftCards.length;++i){
            var vo = MJAI.getMJDef(this.data.leftCards[i]);
            var scale = 0.75;
            var card = new CSMahjong(MJAI.getDisplayVo(1,3),vo);
            card.x = 27 + 50 * (i % num)*scale;
            card.y = 300 -55 * Math.floor(i / num)*scale;
            card.scale = scale;
            Panel_dipai.addChild(card);
        }
        var btnClose = this.getWidget("btn_close");
        UITools.addClickEvent(btnClose,this,this.onCloseClick);
    },

    onCloseClick:function(){
        PopupManager.remove(this);
    }
});

