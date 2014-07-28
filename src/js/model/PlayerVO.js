define(function( require, exports, module ) {

	/* <Player IsMember="Yes" IsBackNineStart="No" PlayerName="Tiger Woods" TournamentPlayerId="08793" ParRelativeScore="-19" 
	Score="269" StartingHole="1" ParRelativeScoreToday="-1" NumberOfHolesPlayed="F" CurrentPosition="1" StandingsSortIndex="1">*/
	
	var _roundVO = require("./RoundVO"),
	    ensureArray = require("ensureArray/ensureArray");

	function PlayerVO() {
		this._data;
		this._rounds = [];
	}

	PlayerVO.prototype = {
		setData: function(data) {
			this._data = data;
			this._data.Round = ensureArray(this._data.Round);

			for(var i=0,l=this._data.Round.length;i<l;i++) {
				var tmpRound = new _roundVO();
				tmpRound.setData(this._data.Round[i]);
				this._rounds.push(tmpRound);
			}
		},
		getRound: function($roundIdx) {
			if(this._rounds[$roundIdx]) {
				return this._rounds[$roundIdx];
			}
			return this._rounds[this.lastAvailableRoundIdx()];
		},
		lastAvailableRoundIdx: function() {
			return this._rounds.length - 1;
		},
		isMember: function() {
			return this._data.IsMember === "Yes";
		},
		isBackNineStart: function() {
			return this._data.IsBackNineStart === "Yes";
		},
		playerName: function() {
			return this._data.PlayerName || "";
		},
		tournamentPlayerId: function() {
			return this._data.TournamentPlayerId || "";
		},
		parRelativeScore: function() {
			return this._data.ParRelativeScore || "";
		},
		score: function() {
			return this._data.Score || "";
		},
		startingHole: function() {
			return this._data.StartingHole || "";
		},
		parRelativeScoreToday: function() {
			return this._data.ParRelativeScoreToday || "";
		},
		numberOfHolesPlayed: function() {
			return this._data.NumberOfHolesPlayed || "";
		},
		currentPosition: function() {
			return this._data.CurrentPosition || "";
		},
		standingsSortIndex: function() {
			return this._data.StandingsSortIndex || "";
		}
	}

	return PlayerVO;
});