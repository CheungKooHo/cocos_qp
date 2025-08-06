/**
 * Created by zhoufan on 2016/1/9.
 */
var ProtoBuf = dcodeIO.ProtoBuf;
var ByteBuffer = dcodeIO.ByteBuffer;
var Long = dcodeIO.Long;
var SySocket = cc.Class.extend({
    url:null,
    socket:null,
    checkCode:0,
    clength:0,
    cmsgType:0,
    cbuffer:null,
    isConflict:false,
    reqtimes:null,
    isCrossServer:false,

    ctor:function(){
        this.socket = null;
        this.isConflict = false;
        this.checkCode = 0;
        this.reqtimes = {};
    },

    isOpen:function(){
        if(this.socket && this.socket.readyState == WebSocket.OPEN)
            return true;
        return false;
    },

    disconnect:function(callback){
        if(this.socket){
            this.socket.onclose = function(e) {
                this.socket = null;
                PingClientModel.close();
                if(callback)
                    callback();
                cc.log("websocket is close.....................................2");
            }.bind(this);
            this.socket.close();
        }
    },

    sendOpenMsg:function(tag){
        this.checkCode=0;
        var build = MsgHandler.getBuilder("proto/openMsg.txt");
        var msgType = build.msgType;
        var builder = build.builder;
        var Open = builder.build("Open");
        var open = new Open();
        var userId = PlayerModel.userId+"";
        open.userId = userId;
        var time = md5(ServerTimeManager.getServerTime());
        var sign = userId+time+"Zehy6f3TDoZhtyWlHiyJmoFGrQWjxiT9";
        open.t = time;
        open.s = md5(sign);
        open.c = PlayerModel.sessCode;
        open.v = SyVersion.v;
        if(PlayerModel.isDirect2Room())
            open.fromUrl = "fromUrlScheme";
        if(this.isCrossServer)
            open.isCrossServer = 1;
        open.msg = [];
        open.msg[0] = tag || 0;

        this.send(open,msgType);
    },

    sendComReqMsg:function(code,params,strParams){
        //cc.log("sendComReqMsg ... code : " + code + " params " +  JSON.stringify(params) +" strParams " + JSON.stringify(strParams) );
        var build = MsgHandler.getBuilder("proto/ComReqMsg.txt");
        var msgType = build.msgType;
        var builder = build.builder;
        var ComReq = builder.build("ComReq");
        var msg = new ComReq();
        msg.code  = code;
        if(params)
            msg.params = params;
        if(strParams)
            msg.strParams = strParams;
        this.send(msg,msgType);
    },

    sendLoginReqMsg:function(code,params,strParams){
        //cc.log("sendComReqMsg ... code : " + code + " params " +  JSON.stringify(params) +" strParams " + JSON.stringify(strParams) );
        var build = MsgHandler.getBuilder("proto/LoginReqMsg.txt");
        var msgType = build.msgType;
        var builder = build.builder;
        var ComReq = builder.build("ComReq");
        var msg = new ComReq();
        msg.code  = code;
        if(params)
            msg.params = params;
        if(strParams)
            msg.strParams = strParams;
        this.send(msg,msgType);
    },

    connect:function(jsonParams,tag){
        GameData.channelId = 0;
        if(this.isConflict){
            return;
        }
        this.clength = 0;
        var _this = this;
        if(this.socket){
            this.socket.onclose = function(e) {
                SdkUtil.sdkLog("websocket is close.....................................2");
            }
            this.socket.close();
        }
        var url = ServerUtil.getWSFromTJD(this.url);
        cc.log("web-socket this.url::", this.url);
        cc.log("web-socket url::", url);
        this.socket = new WebSocket(url);
        if(!cc.sys.isNative){
            this.socket.binaryType = "arraybuffer";// 设置数据传输格式！
        }

        //连接成功
        this.socket.onopen = function(e) {
            _this.reqtimes = {};
            //发送连接成功的消息
            if (jsonParams) {
                _this.sendLoginReqMsg(1, [], [jsonParams]);
            } else {
                _this.sendOpenMsg(tag);
            }
            SdkUtil.sdkLog("websocket is connect success.....................................");
        }
        //收到消息
        this.socket.onmessage = function(e) {
            _this.receive(e.data);
        }
        //关闭连接
        this.socket.onclose = function(e) {
            SdkUtil.sdkLog("websocket is close.....................................1");
            PingClientModel.close();
            _this.socket = null;
            if (PlayerModel.userId > 0) {
                NetErrorPop.show(true);
            } else {
                sy.scene.hideLoading();
            }
        }
        //连接异常
        this.socket.onerror = function(e) {
            SdkUtil.sdkLog("websocket is error.....................................");
            if (PlayerModel.userId > 0) {
                NetErrorPop.show(true);
            } else {
                sy.scene.hideLoading();
            }
        }
    },

    send:function(message,msgType){
        if(this.socket){
            if(this.socket.readyState == WebSocket.OPEN){
                var prefix = (msgType==1002) ? msgType+"_"+message.code : msgType;
                if(prefix!=1003 && prefix!="1002_13" && prefix!="1002_5" && prefix!="1002_14" && prefix!="1002_11" &&
                    prefix!="1002_10"&& prefix!="1002_30" && prefix!="1002_100" && prefix!="1002_95" && prefix!="1002_135" && prefix!="1002_136"){
                    var lasttime = this.reqtimes[prefix];
                    lasttime = lasttime || 0;
                    var now = new Date().getTime();
                    var diff = now - lasttime;
                    if(diff < 750){
                        cc.log("requet is too fast! diff is "+diff+", msgType is "+prefix);
                        return;
                    }
                }
                this.reqtimes[prefix] = now;
                var checkCode = this.checkCode;
                var arrayBuffer = message.encode().toBuffer();
                var msgLength = arrayBuffer.byteLength;
                var byteBuffer = new ByteBuffer();
                byteBuffer.writeUint16(msgLength);
                if(msgType == 1001){
                    checkCode = 0;
                }else{
                    var bytes = new Int8Array(arrayBuffer);
                    for(var i=0;i<msgLength;i+=2){
                        checkCode += bytes[i];
                    }
                }
                byteBuffer.writeUint32(checkCode);
                byteBuffer.writeUint16(msgType);
                byteBuffer.append(arrayBuffer);
                byteBuffer.flip();
                this.socket.send(byteBuffer.toArrayBuffer());
            }else{
                SdkUtil.sdkLog("websocket is error.....................................1");
                NetErrorPop.show(true);
            }
        }else{
            SdkUtil.sdkLog("websocket is error.....................................2");
            NetErrorPop.show(true);
        }
    },

    receive:function(data) {
        if (!TypeUtil.isString(data)) {
            var byteBuffer = ByteBuffer.wrap(data);
            if(this.clength == 0){
                var length = this.clength = byteBuffer.readUint16();
                var checkcode = byteBuffer.readUint32();
                if(this.checkCode!=0 && (checkcode-this.checkCode)>1){//checkcode对不上了
                    NetErrorPop.show(true);
                    return;
                }
                this.checkCode = checkcode;
                var msgType = this.cmsgType = byteBuffer.readUint16();
                cc.log("l::" + length + " c::" + checkcode + " m::" + msgType);
                this.cbuffer = byteBuffer;
            }else{
                var finalbuffer = ByteBuffer.concat([this.cbuffer,byteBuffer]);
                this.cbuffer = finalbuffer;
            }
            var arrayBuffer = this.cbuffer.toBuffer();
            var nowLength = arrayBuffer.byteLength;
            if(this.clength==nowLength){
                this.clength = 0;
                var resBuilder = MsgHandler.getResBuilder(this.cmsgType);
                if(resBuilder){
                    var className = resBuilder.className;
                    var builder = resBuilder.builder;
                    var MsgClass = builder.build(className);
                    var message = MsgClass.decode(arrayBuffer);
                    MsgHandler.getResponder(this.cmsgType).respond(message);
                    if (this.cmsgType != 5021){
                        PingClientModel.respond();
                    }
                }else{
                    cc.log("message can not decode::"+this.cmsgType);
                }
            }
        }
    }
});
var _sySocket = null;
var sySocket = function () {
    if (_sySocket == null) {
        _sySocket = new SySocket();
    }
    return _sySocket;
}();