require.config({
	baseUrl: "bower_components",
	paths: {
		"jquery": "jquery/jquery",
		"hgn": "requirejs-hogan-plugin/hgn",
		"hogan": "requirejs-hogan-plugin/hogan",
		"text": "requirejs-hogan-plugin/text"
	}
});
require(["jquery", "../src/js/TigerWoodsScorecardApp"], function($, twsc) {
	twsc.init("div.container.container-tournament");
});