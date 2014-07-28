define(function( require, exports, module ) {

	/* <Round ParRelativeScoreToday="-6" RoundNumber="1" RoundScore="66" Out="32" In="34" Front9Par="36" 
	Back9Par="36" TotalPar="72" CourseName="Trump Doral Golf Club and Resort" StartingHole="10"> */
	
	var _holeVO = require("./HoleVO"),
	    ensureArray = require("ensureArray/ensureArray");

	function RoundVO() {
		this._data;
		this._holes = [];
	}

	RoundVO.prototype = {
		setData: function(data) {
			this._data = data;
			this._data.Hole = ensureArray(this._data.Hole);

			for(var i=0,l=this._data.Hole.length;i<l;i++) {
				var tmpHole = new _holeVO();
				tmpHole.setData(this._data.Hole[i]);
				this._holes.push(tmpHole);
			}
		},
		playerHasCompletedAnyHolesYet: function() {
			for(var i=0,l=this._holes.length;i<l;i++) {
				if(this._holes[i].inTheHoleTS !== null) {
					return true;
				}
			}
			return false;
		},
		parRelativeScoreToday: function() {
			return this._data.ParRelativeScoreToday || "";
		},
		roundNumber: function() {
			return this._data.RoundNumber || "";
		},
		isPlayoff: function() {
			return roundNumber() > 6;
		},
		roundScore: function() {
			return this._data.RoundScore || "";
		},
		outScore: function() {
			return this._data.Out || "";
		},
		inScore: function() {
			return this._data.In || "";
		},
		front9Par: function() {
			return this._data.Front9Par || "";
		},
		back9Par: function() {
			return this._data.Back9Par || "";
		},
		totalPar: function() {
			return this._data.TotalPar || "";
		},
		courseName: function() {
			return this._data.CourseName || "";
		},
		startingHole: function() {
			return this._data.StartingHole || "";
		},
		getHoles: function() {
			return this._holes;
		}
	}

	return RoundVO;
});