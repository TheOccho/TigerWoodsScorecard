define(function( require, exports, module ){

	/* <Hole HoleNumber="1" HolePar="5" HoleScore="4" HoleParRelativeScoreSoFar="-3" InTheHoleTS="03/07/2013 2:25pm"/> */
	
	function HoleVO() {
		this._data;
	}

	HoleVO.prototype = {
		setData: function(data) {
			this._data = data;
		},
		holeNumber: function() {
			return this._data.HoleNumber || "";
		},
		holePar: function() {
			return this._data.HolePar || "";
		},
		holeScore: function() {
			return this._data.HoleScore || "";
		},
		holeParRelativeScoreSoFar: function() {
			return this._data.HoleParRelativeScoreSoFar || "";
		},
		inTheHoleTS: function() {
			return this._data.InTheHoleTS || "";
		},
		holeHasBeenCompleted: function() {
			return this.inTheHoleTS() !== "";
		}
	}

	return HoleVO;
});