/**
 * Created by Administrator on 2016/7/9.
 */
var NetErrorPopData = {
    mc:null
}
var NetErrorPop = BasePopup.extend({

    ctor: function (isError) {
        this.iserror = isError || false;
        this.timeId = -1;
        this.errorTimes = 0;
        this._super("res/loadingCircle.json");
    },

    selfRender: function () {
        this.Label_35 = this.getWidget("Label_35");
        this.addCustomEvent(SyEvent.SOCKET_OPENED,this,this.onSuc);
        var mc = this.lmc = this.getWidget("Image_7");
        mc.runAction(cc.rotateTo(3,720,720).repeatForever());

        //重连转圈延时一秒显示
        this.visible = false;
        var self = this;
        this.runAction(cc.sequence(cc.delayTime(1),cc.callFunc(function(){
            self.visible = true;
        })));

        this.reConnect();
    },

    reConnect:function(timing){
        var self = this;
        if(this.iserror){//sockect已经断开
            if(timing){
                if(this.timeId>=0)
                    return;
                self.errorTimes+=1;
                SdkUtil.sdkLog("NetErrorPop socket error...try reconnect...1");
                this.timeId = setTimeout(function(){
                    self.Label_35.setString("连接中");
                    self.timeId = -1;
                    if(!sySocket.isOpen()){
                        sySocket.connect(null,8);
                    }
                },3000);
            }else{
                if(this.timeId>=0)
                    clearTimeout(this.timeId);
                SdkUtil.sdkLog("NetErrorPop socket error...try reconnect...2");
                this.timeId = -1;
                sySocket.connect(null,9);
            }
        }else{
            //if(this.timeId>=0)
            //    clearTimeout(this.timeId);
            //sySocket.sendComReqMsg(5,[1]);
            //this.timeId = setTimeout(function(){
            //    self.timeId = -1;
            //    if(PingClientModel.isRespond()){
            //        SdkUtil.sdkLog("NetErrorPop timeout is ready.....respond suc...");
            //        self.onSuc();
            //    }else{
            //        SdkUtil.sdkLog("NetErrorPop timeout is ready.....need to reconnect...");
            //        sySocket.connect();
            //    }
            //},3000);
        }
    },

    onSuc:function(){
        this.errorTimes=0;
        SdkUtil.sdkLog("NetErrorPop socket has connect success...");
        sy.scene.hideLoading();
        if(this.lmc)
            this.lmc.stopAllActions();
        clearTimeout(this.timeId);
        PopupManager.remove(this);
        NetErrorPopData.mc = null;
    }
});
NetErrorPop.show = function(isError){
    if(GameData.conflict)//账号冲突
        return;
    sy.scene.hideLoading();
    var nowmc = NetErrorPopData.mc;
    if(nowmc){
        if(nowmc.iserror && !isError)
            return;
        nowmc.iserror = isError;
        nowmc.reConnect(isError);
        return;
    }
    var mc = NetErrorPopData.mc = new NetErrorPop(isError);
    PopupManager.addPopup(mc);
}