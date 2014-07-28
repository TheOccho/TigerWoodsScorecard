define(function( require, exports, module ) {

	var paperboy = require("paperboy/paperboy");

	var _instance = null,
		_timer;
	 
	function ScorecardController() {
		if(_instance !== null){
			throw new Error("Cannot instantiate more than one ScorecardController, use ScorecardController.getInstance()");
		}
		this.trigger = paperboy.mixin(this);
	}

	function handlePollTimer() {
		_instance.dispatchEvent("ScorecardControllerEvent.REFRESH_DATA");
	}

	ScorecardController.prototype = {
		dispatchEvent: function(eventEnum, eventArgs) {
			this.trigger(eventEnum, eventArgs);
		},
		startPolling: function($freqSeconds) {
			if(_timer) {
				clearInterval(_timer);
			}
			_timer = setInterval(handlePollTimer, $freqSeconds*1000);
		},
		goToRound: function($roundIdx) {
			this.dispatchEvent("ScorecardExternalGoToRoundEvent.GO_TO_ROUND", {roundIdx:($roundIdx-1)});
		}
	};
	ScorecardController.getInstance = function() {
		// Gets an instance of the singleton. It is better to use
		if(_instance === null){
			_instance = new ScorecardController();
		}
		return _instance;
	};

	return ScorecardController.getInstance();
});