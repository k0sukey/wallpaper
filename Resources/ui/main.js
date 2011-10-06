(function(){
	wp.ui.createMainWindow = function(){
		/***
		 * メインのウィンドウ
		 */
		var mainWindow = Ti.UI.createWindow({
			fullscreen: true,
			navBarHidden: true,
			backgroundColor: '#000'
		});

		/***
		 * 上部のナビゲーションの親
		 */
		var navigateView = Ti.UI.createView({
			top: 0,
			left: 0,
			height: 60,
			width: 320,
			backgroundColor: '#000',
		});
		mainWindow.add(navigateView);

		/***
		 * このアプリについて
		 */
		var aboutButton = Ti.UI.createButton({
			top: 14,
			left: 10,
			height: 32,
			width: 100,
			backgroundColor: '#eee',
			borderColor: '#333',
			borderRadius: 16,
			borderWidth: 4,
			color: '#333',
			title: 'about',
			style: Ti.UI.iPhone.SystemButtonStyle.PLAIN
		});
		navigateView.add(aboutButton);

		aboutButton.addEventListener('click', function(){
			/***
			 * 画面を透明のビューで覆う
			 */
			var modalView = Ti.UI.createView({
				width: '100%',
				height: '100%'
			});
			mainWindow.add(modalView);

			var aboutView = Ti.UI.createView({
				top: -440,
				left: 20,
				height: 440,
				width: 280,
				backgroundColor: '#eee',
				borderColor: '#333',
				borderRadius: 16,
				borderWidth: 4
			});
			modalView.add(aboutView);

			var aboutLabel = Ti.UI.createLabel({
				top: 10,
				left: 10,
				height: 420,
				width: 260,
				textAlign: 'center',
				text: '著作権表示とか'
			});
			aboutView.add(aboutLabel);

			var closeButton = Ti.UI.createButton({
				top: 26,
				left: 228,
				height: 32,
				width: 32,
				backgroundColor: '#eee',
				borderColor: '#333',
				borderRadius: 16,
				borderWidth: 4,
				color: '#333',
				title: String.fromCharCode(0x2713),
				opacity: 0,
				style: Ti.UI.iPhone.SystemButtonStyle.PLAIN
			});
			aboutView.add(closeButton);

			/***
			 * 閉じる際のアニメーション
			 */
			closeButton.addEventListener('click', function(){
				aboutView.animate({ duration: 200, top: -440 }, function(){
					/***
					 * 念のためremove
					 */
					aboutView.remove(aboutLabel);
					aboutView.remove(closeButton);
					modalView.remove(aboutView);
					mainWindow.remove(modalView);
				});
			});

			/***
			 * 表示する際のアニメーション
			 */
			aboutView.animate({ duration: 400, top: -16 }, function(){
				aboutView.animate({ duration: 100, top: -26 }, function(){
					aboutView.animate({ duration: 200, top: -16 }, function(){
						/***
						 * 閉じるボタンをフェードイン
						 */
						closeButton.animate({
							duration: 200,
							opacity: 1
						}, function(){});
					});
				});
			});
		});

		/***
		 * サイトをsafariで開く
		 */
		var logoButton = Ti.UI.createButton({
			top: 14,
			left: 210,
			height: 32,
			width: 100,
			backgroundColor: '#eee',
			borderColor: '#333',
			borderRadius: 16,
			borderWidth: 4,
			color: '#333',
			title: wp.ui.website.title,
			style: Ti.UI.iPhone.SystemButtonStyle.PLAIN
		});
		navigateView.add(logoButton);

		logoButton.addEventListener('click', function(){
			/***
			 * ユーザパーミッション
			 */
			var websiteDialog = Ti.UI.createAlertDialog({
				cancel: 1,
				message: wp.ui.website.title + 'をSafariで開きます',
				buttonNames: ['はい', 'いいえ']
			});
			websiteDialog.addEventListener('click', function(e){
				if (e.index == 0) {
					/***
					 * safariで開く
					 */
					Ti.Platform.openURL(wp.ui.website.url);
				}
			});
			websiteDialog.show();
		});

		/***
		 * 壁紙サムネイルを並べるスクロールビュー
		 */
		var wallpaperScrollView = Ti.UI.createScrollView({
			top: 70,
			left: 0,
			contentHeight: 'auto',
			contentWidth: 320,
			showVerticalScrollIndicator: true
		});

		/***
		 * 壁紙のサムネイル一覧を生成
		 */
		for (var i = 0; i < wp.ui.wallpaper.filepath.length; i++) {
			/***
			 * j　は並べる場所（0：左、1：中央、2：右）
			 */
			var j = i % 3;

			/***
			 * wp.ui.wallpaper.row は行数
			 */
			var thumbnailImage = Ti.UI.createImageView({
				top: (wp.ui.wallpaper.setting[j].height + 10) * wp.ui.wallpaper.row,
				left: wp.ui.wallpaper.setting[j].left,
				height: wp.ui.wallpaper.setting[j].height,
				width: wp.ui.wallpaper.setting[j].width,
				borderRadius: 6,
				image: wp.ui.wallpaper.filepath[i].thumbnail,
				number: i
			});
			wallpaperScrollView.add(thumbnailImage);

			wp.ui.wallpaper.thumbnail.push({
				top: thumbnailImage.top,
				left: thumbnailImage.left,
				height: thumbnailImage.height,
				width: thumbnailImage.width,
				wallpaper: wp.ui.wallpaper.filepath[i].wallpaper
			});

			/***
			 * サムネイルをタップして壁紙を表示
			 */
			thumbnailImage.addEventListener('click', function(){
				wallpaperScrollableView.currentPage = this.number;
				wp.ui.wallpaper.current = this.number;

				/***
				 * 壁紙をフェードイン
				 */
				wallpaperScrollableView.animate({
					duration: 800,
					opacity: 1
				}, function(){});
			});

			/***
			 * 初めてのfor以外で右にサムネイルを配置したら折り返し
			 */
			wp.ui.wallpaper.row = (i > 0 && j === 2) ? wp.ui.wallpaper.row + 1 : wp.ui.wallpaper.row;
		}

		mainWindow.add(wallpaperScrollView);

		/***
		 * スクロールビューのy軸移動値から閉じるアニメーションのためにオフセットを取得
		 * このオフセットがないと、画面外へすっ飛んでいく場合あり
		 */
		wallpaperScrollView.addEventListener('scroll', function(e){
			wp.ui.wallpaper.scrolloffset = e.y;
		});

		var wallpaperScrollableView = Ti.UI.createScrollableView({
			top: 0,
			left: 0,
			backgroundColor: '#000',
			opacity: 0,
			showPagingControl: false,
			views: (function(){
				var views = [];

				for (var i = 0; i < wp.ui.wallpaper.filepath.length; i++) {
					/***
					 * 壁紙のイメージビュー（サイズを拡大するアニメーションにしようとしたらなぜかズレるので、
					 * フェードインだけ＝サイズはいじらない）
					 */
					var wallpaperImage = Ti.UI.createImageView({
/*						top: this.top + 70 - wp.ui.wallpaper.scrolloffset,
						left: this.left,
						height: this.height,
						width: this.width,*/
						top: 0,
						left: 0,
						height: 480,
						width: 320,
						image: wp.ui.wallpaper.thumbnail[i].wallpaper
					});

					views.push(wallpaperImage);
				}

				return views;
			})()
		});

		mainWindow.add(wallpaperScrollableView);

		wallpaperScrollableView.addEventListener('scroll', function(){
			wp.ui.wallpaper.current = this.currentPage;
		});

		/***
		 * 壁紙をカメラロールへ保存
		 */
		var saveButton = Ti.UI.createButton({
			top: 10,
			left: 10,
			height: 32,
			width: 32,
			backgroundColor: '#eee',
			borderColor: '#333',
			borderRadius: 16,
			borderWidth: 4,
			color: '#333',
			title: '▼',
			style: Ti.UI.iPhone.SystemButtonStyle.PLAIN
		});
		wallpaperScrollableView.add(saveButton);

		saveButton.addEventListener('click', function(){
			/***
			 * 画面を透明のビューで覆う
			 */
			var modalView = Ti.UI.createView({
				width: '100%',
				height: '100%'
			});
			wallpaperScrollableView.add(modalView);

			/***
			 * インジケータ表示用ビュー
			 */
			var indicatorView = Ti.UI.createView({
				width: 150,
				height: 150,
				backgroundColor: '#000',
				borderRadius: 8,
				opacity: 0.8
			});
			modalView.add(indicatorView);

			var indicatorLabel = Ti.UI.createLabel({
				top: 80,
				width: 320,
				textAlign: 'center',
				font: { fontSize:14, fontWeight:'notmal', fontFamily:'Arial' },
				color: '#fff',
				text: '保存中'
			});
			modalView.add(indicatorLabel);

			/***
			 * このインジケータはiOSのみ
			 */
			var indicator = Ti.UI.createActivityIndicator({
				style: Ti.UI.iPhone.ActivityIndicatorStyle.BIG
			});
			modalView.add(indicator);
			indicator.show();

			/***
			 * 壁紙を保存。successでもerrorでも同一の処理ができるメソッドを知りたい
			 */
			Ti.Media.saveToPhotoGallery(wallpaperScrollableView.views[wp.ui.wallpaper.current].toBlob(), {
				success: function(e){
					/***
					 * 念のためremove
					 */
					modalView.remove(indicatorView);
					modalView.remove(indicatorLabel);
					modalView.remove(indicator);
					wallpaperScrollableView.remove(modalView);

					Ti.UI.createAlertDialog({
						title: '通知',
						message: 'カメラロールへ保存しました'
					}).show();
				},
				error: function(e){
					/***
					 * 念のためremove
					 */
					modalView.remove(indicatorView);
					modalView.remove(indicatorLabel);
					modalView.remove(indicator);
					wallpaperScrollableView.remove(modalView);

					Ti.UI.createAlertDialog({
						title: 'エラー',
						message: 'カメラロールへ保存できません'
					}).show();
				}
			});
		});

		/***
		 * wallpaperScrollableView を閉じる（opacityを0にするだけ）
		 */
		var closeButton = Ti.UI.createButton({
			top: 10,
			left: 278,
			height: 32,
			width: 32,
			backgroundColor: '#eee',
			borderColor: '#333',
			borderRadius: 16,
			borderWidth: 4,
			color: '#333',
			title: String.fromCharCode(0x2713),
			style: Ti.UI.iPhone.SystemButtonStyle.PLAIN
		});
		wallpaperScrollableView.add(closeButton);

		/***
		 * 閉じるときもアニメーション
		 */
		closeButton.addEventListener('click', function(){
			wallpaperScrollableView.borderRadius = 6;
			wallpaperScrollableView.animate({
				duration: 400,
				top: wp.ui.wallpaper.thumbnail[wp.ui.wallpaper.current].top + 70 - wp.ui.wallpaper.scrolloffset,
				left: wp.ui.wallpaper.thumbnail[wp.ui.wallpaper.current].left,
				height: wp.ui.wallpaper.thumbnail[wp.ui.wallpaper.current].height,
				width: wp.ui.wallpaper.thumbnail[wp.ui.wallpaper.current].width,
				opacity: 0
			}, function(){
				wallpaperScrollableView.top = 0;
				wallpaperScrollableView.left = 0;
				wallpaperScrollableView.height = 480;
				wallpaperScrollableView.width = 320;
			});
		});

		return mainWindow;
	};
})();