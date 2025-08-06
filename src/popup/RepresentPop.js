/**
 * Created by zhoufan on 2016/8/10.
 */
var RepresentPop = BasePopup.extend({

    ctor: function () {
        this._super("res/representPop.json");
    },

    selfRender: function () {

        this.closeBtn = this.getWidget("btn_Close");

        //背景图
        //this.bgImage = this.getWidget("mainBg");

        UITools.addClickEvent(this.closeBtn , this, this.onCloseBtn);


    },

    onCloseBtn:function(){
        PopupManager.remove(this);

    },

});

