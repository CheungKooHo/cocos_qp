/**
 * Created by cyp on 2019/9/16.
 */

var PyqCheckRoomPop = BasePopup.extend({
    inputStr:"",
    ctor:function(){
        this._super("res/pyqCheckInputPop.json");
    },

    selfRender:function(){
        for(var i=0;i<=9;i++){
            var btn = this.getWidget("btn"+i);
            btn.temp = i;
            UITools.addClickEvent(btn,this,this.onClick);
        }


        this.btnd = this.getWidget("btnd");
        this.btnd.temp = "del";
        this.btnd.visible = true;
        UITools.addClickEvent(this.btnd,this,this.onClick);

        this.btn_reset = this.getWidget("btnr");
        this.btn_reset.temp = "reset";
        UITools.addClickEvent(this.btn_reset,this,this.onClick);

        this.inputNum = this.getWidget("inputNum");
        this.inputNum.setString("");

        this.btn_check_room = this.getWidget("btn_check_room");
        this.btn_check_user = this.getWidget("btn_check_user");

        UITools.addClickEvent(this.btn_check_room,this,this.onClickCheckRoom);
        UITools.addClickEvent(this.btn_check_user,this,this.onClickCheckUser);
    },

    onClick:function(obj){
        var temp = obj.temp;

        if(temp == "del"){
            if(this.inputStr.length > 0){
                this.inputStr = this.inputStr.substr(0,this.inputStr.length - 1);
            }
        }else if(temp == "reset"){
            this.inputStr = "";
        }else if(this.inputStr.length < 10){
            this.inputStr += String(temp);
        }
        this.inputNum.setString("" + this.inputStr);
    },

    onClickCheckRoom:function(){
        var tableId = this.inputStr;
        if(tableId){
            ComReq.comReqGetClubBagRoomsData([ClickClubModel.getCurClubId(),2],[tableId]);
        }

    },

    onClickCheckUser:function(){
        var userId = this.inputStr;
        if(userId){
            ComReq.comReqGetClubBagRoomsData([ClickClubModel.getCurClubId(),3],[userId]);
        }
    },

    onCloseHandler : function(){
        this.removeFromParent(true);
    },
});
