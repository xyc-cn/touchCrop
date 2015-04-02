var Crop = function(option) {
			var file = document.getElementById(option.fileId);
			var canvas = document.getElementById(option.canvasId);
			var img = new Image(); //创建一个Image对象，实现图片的预下载  
			var reader = new FileReader();
			var _width = canvas.offsetWidth;
			var _height = canvas.offsetHeight;
			var img_height;
			var img_width;
			var move_left = 0;
			var move_top = 0;
			var images_size = 1;
			var cxt = canvas.getContext("2d");
			reader.onloadend = function(e) {
				img.src = e.target.result;
				_init();
			};
			var _preImage = function(callback) {
				if (img.complete) { // 如果图片已经存在于浏览器缓存，直接调用回调函数  
					callback.call(img);
					return; // 直接返回，不用再处理onload事件  
				}
				img.onload = function() { //图片下载完毕时异步调用callback函数。  
					callback.call(img); //将回调函数的this替换为Image对象  
				};

			}

			var _translate = function(x, y) {

				cxt.clearRect(0, 0, _width, _height);
				cxt.drawImage(img, x - _width, y - _height, img_width * images_size, img_height * images_size);

			}

			var _init = function(url) {
				_preImage(function() {
					img_height = img.height;
					img_width = img.width;
					cxt.drawImage(img, 0, 0, img_width * images_size, img_height * images_size);
				});
			}

			var scale = function(value) {
				images_size = images_size + value;
				cxt.clearRect(0, 0, _width, _height);
				cxt.drawImage(img, 0, 0, img_width * images_size, img_height * images_size);
			}
			

			var getPicture =  function() {
				return canvas.toDataURL("image/png");
			}

			file.addEventListener("change", function() {
				if (!/image\/\w+/.test(file.files[0].type)) {
					alert("看清楚，这个需要图片！");
					return false;
				}
				reader.readAsDataURL(file.files[0]);
			})

			canvas.addEventListener("touchmove", function(e) {
				if (e.targetTouches.length == 1) {
					e.preventDefault();
					var touch = event.targetTouches[0];
					_translate(touch.clientX, touch.clientY)
				}

			});

			return {
				scale:scale,
				getPicture:getPicture
			}
		}