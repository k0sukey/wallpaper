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
			 * 初期化
			 */
			wp.ui.wallpaper.current = {};

			/***
			 * j　は並べる場所（0：左、1：中央、2：右）
			 */
			var j = i % 3;
			wp.ui.wallpaper.current = wp.ui.wallpaper.setting[j];
			wp.ui.wallpaper.current.thumbnail = wp.ui.wallpaper.filepath[i].thumbnail;
			wp.ui.wallpaper.current.wallpaper = wp.ui.wallpaper.filepath[i].wallpaper;

			/***
			 * wp.ui.wallpaper.row は行数
			 */
			var thumbnailImage = Ti.UI.createImageView({
				top: (wp.ui.wallpaper.current.height + 10) * wp.ui.wallpaper.row,
				left: wp.ui.wallpaper.current.left,
				height: wp.ui.wallpaper.current.height,
				width: wp.ui.wallpaper.current.width,
				borderRadius: 6,
				image: wp.ui.wallpaper.current.thumbnail,
				wallpaper: wp.ui.wallpaper.current.wallpaper
			});

			/***
			 * サムネイルをタップして壁紙を表示
			 */
			thumbnailImage.addEventListener('click', function(){
				/***
				 * 元情報を保管
				 */
				var original = {
					top: this.top + 70 - wp.ui.wallpaper.scrolloffset,
					left: this.left,
					height: this.height,
					width: this.width,
					image: this.wallpaper
				};

				/***
				 * 壁紙のイメージビュー（サイズを拡大するアニメーションにしようとしたらなぜかズレるので、
				 * フェードインだけ＝サイズはいじらない）
				 */
				var wallpaperImage = Ti.UI.createImageView({
/*					top: this.top + 70 - wp.ui.wallpaper.scrolloffset,
					left: this.left,
					height: this.height,
					width: this.width,*/
					top: 0,
					left: 0,
					height: 480,
					width: 320,
					opacity: 0,
					image: this.wallpaper
				});
				mainWindow.add(wallpaperImage);

				/***
				 * 壁紙をフェードイン
				 */
				wallpaperImage.animate({
					duration: 800,
					opacity: 1
				}, function(){
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
						opacity: 0,
						style: Ti.UI.iPhone.SystemButtonStyle.PLAIN
					});
					wallpaperImage.add(saveButton);

					/***
					 * 保存ボタンをフェードイン
					 */
					saveButton.animate({
						duration: 200,
						opacity: 1
					}, function(){});

					saveButton.addEventListener('click', function(){
						/***
						 * 画面を透明のビューで覆う
						 */
						var modalView = Ti.UI.createView({
							width: '100%',
							height: '100%'
						});
						mainWindow.add(modalView);

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
						Ti.Media.saveToPhotoGallery(wallpaperImage.toBlob(), {
							success: function(e){
								/***
								 * 念のためremove
								 */
								modalView.remove(indicatorView);
								modalView.remove(indicatorLabel);
								modalView.remove(indicator);
								mainWindow.remove(modalView);

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
								mainWindow.remove(modalView);

								Ti.UI.createAlertDialog({
									title: 'エラー',
									message: 'カメラロールへ保存できません'
								}).show();
							}
						});
					});

					/***
					 * 壁紙を閉じる
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
						opacity: 0,
						style: Ti.UI.iPhone.SystemButtonStyle.PLAIN
					});
					wallpaperImage.add(closeButton);

					/***
					 * 閉じるボタンをフェードイン
					 */
					closeButton.animate({
						duration: 200,
						opacity: 1
					}, function(){});

					/***
					 * 閉じるときもアニメーション
					 */
					closeButton.addEventListener('click', function(){
						/***
						 * 念のためremove
						 */
						wallpaperImage.remove(saveButton);
						wallpaperImage.remove(closeButton);

						wallpaperImage.borderRadius = 6;
						wallpaperImage.animate({
							duration: 400,
							top: original.top,
							left: original.left,
							height: original.height,
							width: original.width,
							opacity: 0
						}, function(){
							/***
							 * 年のためremove
							 */
							mainWindow.remove(wallpaperImage);
						});
					});
				});
			});
			wallpaperScrollView.add(thumbnailImage);

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

		return mainWindow;
	};
})();