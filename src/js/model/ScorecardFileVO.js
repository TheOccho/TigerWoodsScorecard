define(function( require, exports, module ) {

	/* <Scorecards CurrentTime="7:30 PM ET. 03/10/2013" Directory="" TournamentName="World Golf Championships-Cadillac Championship" 
	TournamentTourType="TOR" TournamentNumber="473" IsEventOfficial="Yes" CurrentRound="4" HostCourse="Trump Doral Golf Club and Resort" 
	Yardage="7,334" Purse="$8,750,000" ScheduledDates=" 3/7/2013 - 3/10/2013" WinningShare="$1,500,000"> */
	
	var _playerVO = require("./PlayerVO"),
		ensureArray = require("ensureArray/ensureArray");

	function ScorecardFileVO() {
		this._data;
		this._players = [];
	}

	ScorecardFileVO.prototype = {
		setData: function(data) {
			this._data = data;
			this._data.Player = ensureArray(this._data.Player);

			for(var i=0,l=this._data.Player.length;i<l;i++) {
				var tmpPlayer = new _playerVO();
				tmpPlayer.setData(this._data.Player[i]);
				this._players.push(tmpPlayer);
			}
		},
		firstPlayer: function() {
			return this._players[0];
		},
		currentTime: function() {
			return this._data.CurrentTime || "";
		},
		directory: function() {
			return this._data.Directory || "";
		},
		tournamentName: function() {
			return this._data.TournamentName || "";
		},
		tournamentTourType: function() {
			return this._data.TournamentTourType || "";
		},
		tournamentNumber: function() {
			return this._data.TournamentNumber || "";
		},
		isEventOfficial: function() {
			return this._data.isEventOfficial === "Yes";
		},
		currentRound: function()  {
			return this._data.CurrentRound || "";
		},
		hostCourse: function() {
			return this._data.HostCourse || "";
		},
		yardage: function() {
			return this._data.Yardage || "";
		},
		purse: function() {
			return this._data.Purse || "";
		},
		scheduledDates: function() {
			return this._data.ScheduledDates || "";
		},
		winningShare: function() {
			return this._data.WinningShare || "";
		}
	}

	return ScorecardFileVO;	
});