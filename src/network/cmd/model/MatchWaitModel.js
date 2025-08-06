var MatchWaitModel = {
	currRound:0,
	matchTableNum:0,
	integral:0,
	selfRank:0,
	userGameSites:[],
	configRound:0,

	init:function(user){
		if(user){
			this.currRound = user.currRound;
			this.matchTableNum = user.tables;
			this.integral = user.integral;
			this.selfRank = user.selfRank;
			this.userGameSites = user.userGameSites;
			this.configRound = user.configRound;
		}

	}
}