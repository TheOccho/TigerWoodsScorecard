define(function(require, exports, module) {

	var _controller = require("./controller/ScorecardController"),
	    _model = require("./model/ScorecardModel"),
	    _view = require("./view/ScorecardViewContainer");

	exports.init = function(containerID, scorecardXMLPath, pollInterval) {
		//create the main view container 
		_view.init(containerID);

		//create and configure the model
		var scorecardFileURL = scorecardXMLPath || "src/xml/Scorecard.xml";
		_model.init(scorecardFileURL);

		//fire the initialize command from the controller
		_controller.dispatchEvent("ScorecardControllerEvent.INIT_MODEL_DATA");

		//start the app polling
		_controller.startPolling(pollInterval || 30);
	}
});