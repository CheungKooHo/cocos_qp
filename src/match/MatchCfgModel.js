var MatchCfgModel = {
	dtzCfgData:[],
	pdkCfgData:[],
	phzCfgData:[],
	bbtCfgData:[],

	checkWanfa:function(wanfaKey){
		this.checkingWanfa = wanfaKey;
	},

	getCheckWanfa:function(){
		return this.checkingWanfa;
	},

	initDtz:function(data){
		this.dtzCfgData = [];
		//cc.log("data===="+JSON.stringify(data));
		if(data){
			//cc.log("比赛场配置信息..." , JSON.stringify(curData));
			var curData = JSON.parse(data);
			if (curData.jjs_dtz && curData.jjs_dtz.length > 0) {
				for(var index = 0 ; index < curData.jjs_dtz.length ; index++){
					var tConfig = curData.jjs_dtz[index];
					this.dtzCfgData.push(tConfig);
				}
				//this.dtzCfgData.push(curData.jjs_free_pdk);
			}
		}
		//cc.log("this.dtzCfgData..." , this.dtzCfgData);
	},

	initPdk:function(data){
		this.pdkCfgData = [];
		if(data){
			//cc.log("比赛场配置信息..." , JSON.stringify(data));
			var curData = JSON.parse(data);
			if (curData.jjs_share_pdk && curData.jjs_share_pdk.length > 0) {
				for(var index = 0 ; index < curData.jjs_share_pdk.length ; index++){
					var tConfig = curData.jjs_share_pdk[index];
					this.pdkCfgData.push(tConfig);
				}
				//this.pdkCfgData.push(curData.jjs_free_pdk);
			}
		}
		//cc.log("this.pdkCfgData..." , JSON.stringify(this.pdkCfgData));
	},

	initPhz:function(curData){
		this.phzCfgData = [];
		if(curData){
			//cc.log("金币场配置信息..." , JSON.stringify(curData));
			curData = JSON.parse(curData);
			for(var index = 0 ; index < curData.length ; index++){
				var tConfig = curData[index];
				this.phzCfgData.push(tConfig);
				//cc.log("pdkCfgData ..." , tConfig.min , tConfig.modeId , tConfig.ratio);
			}
		}
		//cc.log("this.pdkCfgData..." , this.pdkCfgData);
	},

	initBbt:function(curData){
		this.bbtCfgData = [];
		if(curData){
			//cc.log("金币场配置信息..." , JSON.stringify(curData));
			curData = JSON.parse(curData);
			for(var index = 0 ; index < curData.length ; index++){
				var tConfig = curData[index];
				this.bbtCfgData.push(tConfig);
				//cc.log("pdkCfgData ..." , tConfig.min , tConfig.modeId , tConfig.ratio);
			}
		}
		//cc.log("this.pdkCfgData..." , this.pdkCfgData);
	},

	getDtzConfig:function(){
		return this.dtzCfgData;
	},

	getPdkConfig:function(){
		return this.pdkCfgData;
	},

	getPhzConfig:function(){
		return this.phzCfgData;
	},
	getBbtConfig:function(){
		return this.bbtCfgData;
	},


	/**
	 * data =  [{"min":3000,"modeId":"1154","max":0,"pay":200,"ratio":20},
	 * @param wanfa
	 * @param index
	 * @returns {*}
	 */
	getConfigData:function(wanfa , index){
 		var tConfig = null;
		if(wanfa == "dtz"){
			tConfig = this.getDtzConfig();
		}else if (wanfa == "pdk"){
			tConfig = this.getPdkConfig();
		}else if (wanfa == "phz"){
			tConfig = this.getPhzConfig();
		}else if (wanfa == "bbt"){
			tConfig = this.getBbtConfig();
		}

		if(tConfig && tConfig.length > index){
			return tConfig[index];
		}else{
			cc.log("DTZMoneyCfgModel::getConfigData Error::" , tConfig , index);
		}
	},

	/**
	 * 根据玩法和配置获取modeId
	 */
	getConfigModeId:function(wanfa , index){
		var tConfig = this.getConfigData(wanfa , index);
		return tConfig.modeId;
	},

	cleanConfig:function(){
		this.pdkCfgData = [];
		this.dtzCfgData = [];
		this.phzCfgData = [];
		this.bbtCfgData = [];
	},

}