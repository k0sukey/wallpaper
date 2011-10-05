Ti.UI.setBackgroundColor('#fff');

var Ti;
var wp = {};

Ti.include(
	'ui/ui.js',
	'ui/setting.js',
	'ui/main.js'
);

wp.tabGroup = wp.ui.createApplicationTabGroup();
wp.tabGroup.open();