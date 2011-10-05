wp.ui = {};

(function(){
	wp.ui.createApplicationTabGroup = function(){
		/***
		 * navBarとtabBarは表示せず、純粋にフルスクリーン
		 */
		var mainWindow = wp.ui.createMainWindow();
		mainWindow.tabBarHidden = true;

		var mainTab = Ti.UI.createTab({
			window: mainWindow
		});

		var tabGroup = Ti.UI.createTabGroup();
		tabGroup.addTab(mainTab);

		return tabGroup;
	};
})();