/**
 * Created by zhoufan on 2017/5/4.
 */
var ActivityModel = {

    hasOpenByPushMsg:false,//记录是否由后台的推送消息打开过 只由推送消息打开一次(打开游戏要弹出 断线重不弹出) 主动打开另当别论
    isSend:false,
    allActivityList:null,
    lastTime : 0,
    isSendShareMsg:false,
    activityId:null, //当前选择的是哪个活动
    isSendCashActivity:false,
    isCashActivityOpen:false,
    isInvitNewPopOpen:false,
    isIntivingNew:false,
    isAutomaticOpen :false,
    wasOlderBackOpen:false,//是否打开过活动
    isOlderBackBtnOpen:false,//按钮是否要显示
    wasNewUserHasGiftOpen:false,//新人有礼
    isNewUserHasGiftBtnOpen:false,//按钮是否要显示

    checkActvity: function() {
        if (!this.isSend) {
            this.sendOpenActivityMsg();
            this.isSend = true;
        }
    },

    initActivityList:function(allActivityList){
        this.allActivityList = allActivityList;
        for(var item in allActivityList){
            if (allActivityList[item].id ==24){
                this.isIntivingNew = true;
                SyEventManager.dispatchEvent(SyEvent.OPEN_INTIVE_BTN);
            }
            if(allActivityList[item].id ==25){
                ActivityModel.isOlderBackBtnOpen = true;
                SyEventManager.dispatchEvent(SyEvent.GET_OLDERBACK_BTN);
            }
            if(allActivityList[item].id ==26){
                ActivityModel.isNewUserHasGiftBtnOpen = true;
                SyEventManager.dispatchEvent(SyEvent.GET_NEWUSERHASGIFT_BTN);
            }
        }
    },

    /**
     * 打开活动面板 获取活动列表数据 和 后台当前第一页活动数据
     */
    sendOpenActivityMsg: function(activityPage) {
        ////params参数第0位 表示请求的操作类型 0打开 1领取 strParams参数第0位 表示请求的活动类型 amazingActivitys获取所有精彩活动
        sySocket.sendComReqMsg(1005,[0],[(parseInt(activityPage) || 0) + ""]);//;
    },

    /**
     * 请求打开活动 并且跳转到前端指定的活动页 (包含活动列表数据 和 当前切页数据)
     * @param params
     * @param strParams
     */
    reqOpenOneActivityById:function(activityPageId) {
        if(activityPageId && activityPageId != 0 ){
            var strParams = [];
            strParams.push(0 + "");
            strParams.push((parseInt(activityPageId)|| 0) + "");
            sySocket.sendComReqMsg(1005,[0],strParams);
        }
    },


    //具体活动
    sendActivity:function(params,strParams,isFromHomeLayer){
        var isFromMJHomeLayer = isFromHomeLayer || false;
        var paramsList = params;
        //if(isFromMJHomeLayer){
        //    paramsList = [params[0],1];
        //}
        sySocket.sendComReqMsg(1005,paramsList,strParams);
    },

    setLastTime:function(lastTime){
        this.lastTime = lastTime;
    },

    getLastTime:function(){
        return this.lastTime;
    },

    setIsSendShareMsg:function(isSendShareMsg){
        this.isSendShareMsg = isSendShareMsg;
    },

    isNeedSendMsg:function(){
        return this.isSendShareMsg;
    }

}
