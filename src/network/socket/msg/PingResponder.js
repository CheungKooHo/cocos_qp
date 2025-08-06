var PingClientModel = {
    lastTime:null,
    DIFF:10,
    badTimes:0,
    fromMJ:false,
    isFistIn:true,

    reset:function(){
        this.isFistIn = true;
        this.fromMJ = false;
        this.isSocketClose = false;
    },

    setCustomLastTime:function(second){
        this.fromMJ = true;
        this.lastTime = new Date().getTime()-this.DIFF*1000+second*1000;
    },

    /**
     * socket连接成功
     */
    connectSuc:function(){
        this.lastTime = new Date().getTime();
        this.isSocketClose = false;
        this.badTimes = 0;
    },

    /**
     * socket连接关闭
     */
    close:function(){
        this.isSocketClose = true;
        this.badTimes = 0;
    },

    /**
     * 检查是否需要发送ping的消息
     * @returns {boolean}
     */
    isNeedSendMsg:function(){
        if(this.lastTime!=null && !this.fromMJ){
            //强制第一次发送心跳
            if (this.isFistIn){
                this.isFistIn = false;
                return true;
            }
            var now = new Date().getTime();
            return (now-this.lastTime>=(this.DIFF*1000));
        }

        return false;
    },

    /**
     * 发送ping消息
     * @param isFromBad
     */
    sendMsg:function(isFromBad){
        if(isFromBad){
            this.badTimes+=1;
        }
        //cc.log("PingClientModel.sendMsg::"+isFromBad);
        sySocket.sendComReqMsg(5,[1]);
    },

    /**
     * 有新消息响应
     */
    respond:function(){
        this.lastTime = new Date().getTime();
        this.badTimes=0;
        this.fromMJ = false;
        //cc.log("PingClientModel.respond::"+this.lastTime);
    },

    /**
     * 检查网络是否不好，响应时间过长
     * @returns {boolean}
     */
    isNetBad:function(){
        if(this.lastTime!=null && !this.isSocketClose){
            var now = new Date().getTime();
            if(now-this.lastTime>(this.DIFF+1.5)*1000)
                return true;
        }
        return false;
    },

    /**
     * 是否需要重连
     * @returns {boolean}
     */
    isNeedReconect:function(isInRoom){
        this.DIFF = isInRoom ? 8 : 15;
        return this.badTimes>=5;
        //return (this.badTimes>=5 || (this.isSocketClose && PlayerModel.userId>0));
    }
}
/**
 * Created by Administrator on 2016/6/27.
 */
var PingResponder = BaseResponder.extend({

    respond:function(message){
        if(!LayerManager.isInRoom()
            && LayerManager.getCurrentLayer()!=LayerFactory.LOGIN
            && message.v && SyVersion.isNeedUpdate(message.v)
            && !PopupManager.hasClassByPopup(OnlineUpdatePop)){
            OnlineUpdatePop.showOnlyOk("游戏需要更新，请退出游戏重新登录！",function(){
                sy.scene.exitGame();
            })
        }
    }
})