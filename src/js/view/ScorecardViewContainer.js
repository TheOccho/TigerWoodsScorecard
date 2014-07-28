define(function( require, exports, module ) {

	var _controller = require("../controller/ScorecardController"),
		_scorecardTemplate = require("hgn!../../templates/scorecard"),
		$overallPosition, $overallToPar, $startingHole, $currentRound, $currentRoundToPar, $currentRoundThru,
		$parOut, $parIn, $parTotal,
		$roundOut, $roundIn, $roundTotal,
		$statusTotal,
		_playoffRoundAdded = false,
		_scorecardFileVO,
		_containerID;

	function addPlayoffRoundButton() {
		_playoffRoundAdded = true;
		$("#round-selector ul").append('|<li class="active">P</li>');
	}

	function handleInitialModelUpdate(args) {
		_controller.off("ScorecardModelUpdateEvent.UPDATE", handleInitialModelUpdate);
		_controller.on("ScorecardModelUpdateEvent.UPDATE", handleModelUpdate);

		//set the VO
		_scorecardFileVO = args.getScorecardFileVO();
		
		$(_containerID).append(_scorecardTemplate({}));
		
		//set cached elements
		$overallPosition = $("table.table-horizontal tr:eq(1) td:eq(0), table.table-vertical td:eq(0)");
		$overallToPar = $("table.table-horizontal tr:eq(1) td:eq(1), table.table-vertical td:eq(1)");
		$startingHole = $("table.table-horizontal tr:eq(1) td:eq(2), table.table-vertical td:eq(2)");
		$currentRound = $("table.table-horizontal tr:eq(1) td:eq(3), table.table-vertical td:eq(3)");
		$currentRoundToPar = $("table.table-horizontal tr:eq(1) td:eq(4), table.table-vertical td:eq(4)");
		$currentRoundThru = $("table.table-horizontal tr:eq(1) td:eq(5), table.table-vertical td:eq(5)");
		$parOut = $("table.table-fixie tr:eq(1) td:eq(10)");
		$parIn = $("table.table-fixie tr:eq(1) td:eq(20)");
		$parTotal = $("table.table-fixie tr:eq(1) td:eq(21)");
		$roundOut = $("table.table-fixie tr:eq(2) td:eq(10)");
		$roundIn = $("table.table-fixie tr:eq(2) td:eq(20)");
		$roundTotal = $("table.table-fixie tr:eq(2) td:eq(21)");
		$statusTotal = $("table.table-fixie tr:eq(3) td:eq(21)");

		//init the view here
		$("section.module-tournament-detail h2:eq(0)").html(_scorecardFileVO.tournamentName().toUpperCase());
		$("section.module-tournament-detail p strong").html(_scorecardFileVO.hostCourse());
		$("section.module-tournament-detail p:eq(1)").html(_scorecardFileVO.scheduledDates());

		//set the active round
		var currentRoundIdx = args.currentRoundIdx();
		$("#round-selector ul li:eq("+currentRoundIdx+")").addClass("active");
		//disable rounds that haven't occurred yet
		for(var i=(currentRoundIdx+1);i<4;i++) {
			$("#round-selector ul li:eq("+i+")").addClass("disabled");
		}

		//playoff round detected, add P indicator
		if(_scorecardFileVO.firstPlayer().lastAvailableRoundIdx() === 4) {
			addPlayoffRoundButton();
		}

		handleModelUpdate(args);
	
		//add click listener for rounds
		$(document).on("click", "#round-selector ul li", function(e) {
			//return if disabled round is clicked on
			if($(this).index() > _scorecardFileVO.firstPlayer().lastAvailableRoundIdx()) {
				return;
			}
			$("#round-selector ul li").removeClass("active");
			$(this).addClass("active");
			//tell the model about the user round selection
			_controller.dispatchEvent("ScorecardExternalGoToRoundEvent.GO_TO_ROUND", {roundIdx:$(this).index()} );
			//do the actual selected round rendering
			handleModelUpdate(args, true);
		});
	}

	function handleModelUpdate(args, override) {
		//updated the scorecardFileVO reference
		_scorecardFileVO = args.getScorecardFileVO();

		//check if the user is currently viewing a round that is different than the update coming in
		if(args.currentRoundIdx() !== _scorecardFileVO.firstPlayer().lastAvailableRoundIdx() && typeof override === "undefined") {
			return;
		}
		
		//check for a playoff round
		if( !_playoffRoundAdded && _scorecardFileVO.firstPlayer().lastAvailableRoundIdx() === 4 ) {
			addPlayoffRoundButton();
		}

		var currentRoundVO = args.getCurrentRoundVOForFirstPlayer();
		var currentRoundNumber = args.currentRoundIdx()+1;
		var player = args.getScorecardFileVO().firstPlayer();

		//render Tournament Summary
		$overallPosition.html(player.currentPosition()); //OVERALL POSITION
		$overallToPar.html(player.parRelativeScore()); //OVERALL TO PAR
		$startingHole.html("#"+player.startingHole()); //STARTING HOLE
		$currentRound.html((_scorecardFileVO.firstPlayer().lastAvailableRoundIdx() === 4) ? 4 : _scorecardFileVO.firstPlayer().lastAvailableRoundIdx() + 1); //CURRENT ROUND
		$currentRoundToPar.html(player.parRelativeScoreToday()); //CURRENT ROUND TO PAR
		$currentRoundThru.html(player.numberOfHolesPlayed()); //CURRENT ROUND THRU
		
		//clean table
		$("table.table-fixie tr:not(tr:eq(0)) td:not(.first-label)").removeClass().empty();

		//render Scorecard
		$("section.module-tournament-detail h2:eq(2)").html((args.currentRoundIdx() === 4) ? "SCORECARD &mdash; PLAYOFF" : "SCORECARD &mdash; ROUND "+currentRoundNumber);
		$("table.table-fixie tr:eq(2) td:eq(0)").html((args.currentRoundIdx() === 4) ? "Playoff" : "Round "+currentRoundNumber);
		
		//render round par/current round scores/current round status
		var holes = currentRoundVO.getHoles();
		for(var i=0,l=holes.length;i<l;i++) {
			var par = holes[i].holePar();
			var round = holes[i].holeScore();
			var status = holes[i].holeParRelativeScoreSoFar();

			$("table.table-fixie tr:eq(1) td:eq("+(i+((i>8)?2:1))+")").html(par);
			$("table.table-fixie tr:eq(2) td:eq("+(i+((i>8)?2:1))+")").html(round).removeClass().addClass(getScoreColorCode(par, round));
			$("table.table-fixie tr:eq(3) td:eq("+(i+((i>8)?2:1))+")").html(status);
		}
		//set OUT/IN/TOTAL
		$parOut.html(currentRoundVO.front9Par());
		$roundOut.html(currentRoundVO.outScore());
		$parIn.html(currentRoundVO.back9Par());
		$roundIn.html(currentRoundVO.inScore());
		$parTotal.html(currentRoundVO.totalPar());
		$roundTotal.html(currentRoundVO.roundScore());
		$statusTotal.html(currentRoundVO.parRelativeScoreToday());
	}

	function getScoreColorCode(par,score) {
		switch(score - par) {
			case -5:
			case -4:
			case -3:
				return "score-double-eagle";
			case -2:
				return "score-eagle";
			case -1:
				return "score-birdie";
			case 0:
				return "score-par";
			case 1:
				return "score-bogey";
			case 2:
				return "score-double-bogey";
			case 3:
			case 4:
			case 5:
				return "score-3plus-bogey";
			default:
				return "score-par";
		}
	}

	function handleModelUpdateError(args) {}

	exports.init = function(containerID) {
		//set internal container ID
		_containerID = containerID;

		//attach listeners for updates
		_controller.on("ScorecardModelUpdateEvent.UPDATE", handleInitialModelUpdate);
		_controller.on("ScorecardModelUpdateEvent.ERROR", handleModelUpdateError);
	}
});