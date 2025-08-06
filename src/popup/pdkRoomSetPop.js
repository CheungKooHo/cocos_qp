/**
 * Created by Administrator on 2017/7/6.
 */
var pdkRoomSetPop = BasePopup.extend({
    ctor:function(){
        this._super("res/pdkRoomSetPop.json");
    },

    selfRender:function(){
        this.Button_9 = this.getWidget("Button_9");//退出房间
        this.Button_8 = this.getWidget("Button_8");//解散房间
        this.Button_10 =this.getWidget("Button_10");//设置
        UITools.addClickEvent(this.Button_9,this,this.onLeave);
        UITools.addClickEvent(this.Button_10,this,this.onSetUp);
        UITools.addClickEvent(this.Button_8,this,this.onBreak);
    },

    onSetUp:function(){
        if (LayerManager.isInPDK()){
            var mc = new PDKSetUpPop();
            PopupManager.addPopup(mc);
        }else{
            var mc = new SetUpPop();
            PopupManager.addPopup(mc);
        }

    },

    /**
     * 解散
     */
    onBreak:function(){
        AlertPop.show("解散房间需所有玩家同意，确定要申请解散吗？",function(){
            sySocket.sendComReqMsg(7);
        })
    },

    /**
     * 暂离房间
     */
    onLeave:function(){
        sySocket.sendComReqMsg(6);
    },

})