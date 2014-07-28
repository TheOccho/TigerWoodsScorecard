define(function( require, exports, module ) {

	var xml2json = require("xml2json/xml2json");

	var _instance = null,
	    _xmlUrl,
	    _userSpecifiedRoundIdx = -1,
	    _scorecardFileVOObject,
	    _controller = require("../controller/ScorecardController"),
	    _scorecardFileVO = require("../model/ScorecardFileVO");

	function ScorecardModel() {
		if(_instance !== null) {
			throw new Error("Cannot instantiate more than one ScorecardModel, use ScorecardModel.getInstance()");
		}
	}

	function loadScorecardXml() {
		var that = this;
		$.ajax({
			url: _xmlUrl,
			dataType: "xml",
			success: function(resp) {
				_scorecardFileVOObject = new _scorecardFileVO();
				_scorecardFileVOObject.setData(xml2json(resp));
				_controller.dispatchEvent("ScorecardModelUpdateEvent.UPDATE", _instance);
			},
			error: function(error) {
				_controller.dispatchEvent("ScorecardModelUpdateEvent.ERROR");
			}
		});
	}

	function handleGoToRoundEvent(args) {
		if(args.roundIdx === _scorecardFileVOObject.firstPlayer().lastAvailableRoundIdx()) {
			_userSpecifiedRoundIdx = -1;
		} else {
			_userSpecifiedRoundIdx = args.roundIdx;
		}
	}

	ScorecardModel.prototype = {
		init: function($xmlUrl) {
			_xmlUrl = $xmlUrl;
			_controller.on("ScorecardControllerEvent.INIT_MODEL_DATA", loadScorecardXml);
			_controller.on("ScorecardControllerEvent.REFRESH_DATA", loadScorecardXml);
			_controller.on("ScorecardExternalGoToRoundEvent.GO_TO_ROUND", handleGoToRoundEvent);
		},
		currentRoundIdx: function() {
			return (_userSpecifiedRoundIdx >= 0) ? _userSpecifiedRoundIdx : _scorecardFileVOObject.firstPlayer().lastAvailableRoundIdx();
		},
		holesPlayedInCurrentRound: function() {
			if(this.currentRoundIdx() === (_scorecardFileVOObject.currentRound() - 1) && this.getCurrentRoundVOForFirstPlayer().playerHasCompletedAnyHolesYet()) {
				return _scorecardFileVOObject.firstPlayer().numberOfHolesPlayed();
			} else if(this.currentRoundIdx() < (_scorecardFileVOObject.currentRound() - 1) && this.getCurrentRoundVOForFirstPlayer().playerHasCompletedAnyHolesYet()) {
				return "F";
			} else {
				return "--";
			}
		},
		getCurrentRoundVOForFirstPlayer: function() {
			return _scorecardFileVOObject.firstPlayer().getRound(this.currentRoundIdx());
		},
		getScorecardFileVO: function() {
			return _scorecardFileVOObject;
		}
	}

	ScorecardModel.getInstance = function() {
		// Gets an instance of the singleton. It is better to use
		if(_instance === null){
			_instance = new ScorecardModel();
		}
		return _instance;
	};

	return ScorecardModel.getInstance();
});