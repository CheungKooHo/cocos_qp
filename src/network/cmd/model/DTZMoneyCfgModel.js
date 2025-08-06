var DTZMoneyCfgModel = {
	dtzCfgData:[],
	pdkCfgData:[],
	phzCfgData:[],
	ddzCfgData:[],

	checkWanfa:function(wanfaKey){
		this.checkingWanfa = wanfaKey;
	},

	getCheckWanfa:function(){
		return this.checkingWanfa;
	},

	initDtz:function(curData){
		this.dtzCfgData = [];
		if(curData){
			//cc.log("金币场配置信息..." , JSON.stringify(curData));
			curData = JSON.parse(curData);
			for(var index = 0 ; index < curData.length ; index++){
				var tConfig = curData[index];
				this.dtzCfgData.push(tConfig);
				//cc.log("dtzCfgData ..." , tConfig.min , tConfig.modeId , tConfig.ratio);
			}
		}
		//cc.log("this.dtzCfgData..." , this.dtzCfgData);
	},

	initPdk:function(curData){
		this.pdkCfgData = [];
		if(curData){
			//cc.log("金币场配置信息..." , JSON.stringify(curData));
			curData = JSON.parse(curData);
			for(var index = 0 ; index < curData.length ; index++){
				var tConfig = curData[index];
				this.pdkCfgData.push(tConfig);
				//cc.log("pdkCfgData ..." , tConfig.min , tConfig.modeId , tConfig.ratio);
			}
		}
		//cc.log("this.pdkCfgData..." , this.pdkCfgData);
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

	initDdz:function(curData){
		this.ddzCfgData = [];
		if(curData){
			//cc.log("金币场配置信息..." , JSON.stringify(curData));
			curData = JSON.parse(curData);
			for(var index = 0 ; index < curData.length ; index++){
				var tConfig = curData[index];
				this.ddzCfgData.push(tConfig);
				//cc.log("ddzCfgData ..." , tConfig.min , tConfig.modeId , tConfig.ratio);
			}
		}
		//cc.log("this.ddzCfgData..." , this.ddzCfgData);
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

	getDdzConfig:function(){
		return this.ddzCfgData;
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
		}else if (wanfa == "ddz"){
			tConfig = this.getDdzConfig();
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
		this.ddzCfgData = [];
	},

}