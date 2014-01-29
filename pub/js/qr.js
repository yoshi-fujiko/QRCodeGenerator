if (!Number.prototype.zeroPad) {
    Number.prototype.zeroPad = function(padNum) {
        var temp = this + padNum;
        return temp.toString().substr(1);
    }
}

if (!String.prototype.chgEntity) {
  String.prototype.chgEntity = function(obj) {
      var regQuote = function(str) {
          return str.toString()
          .replace(/\\/g, '\\\\')
          .replace(/\^/g, '\\^')
          .replace(/\$/g, '\\$')
          .replace(/\./g, '\\.')
          .replace(/\*/g, '\\*')
          .replace(/\+/g, '\\+')
          .replace(/\?/g, '\\?')
          .replace(/\(/g, '\\(')
          .replace(/\)/g, '\\)')
          .replace(/\[/g, '\\[')
          .replace(/\]/g, '\\]')
          .replace(/\{/g, '\\{')
          .replace(/\}/g, '\\}')
          .replace(/\|/g, '\\|')
          .replace(/\=/g, '\\=')
          .replace(/\!/g, '\\!')
          .replace(/\:/g, '\\:')
          .replace(/\-/g, '\\-');
      }
      var regStr = new Array('&', '"', '<', '>');
      var entityRef = {'&':'&amp;', '"':'&quot;', '<':'&lt;', '>':'&gt;'};
      if (typeof(obj) == "object") {
          for (var i in obj) {
              entityRef[i] = obj[i];
              regStr.push(regQuote(i));
          }
      }
      var reg = new RegExp(regStr.join("|"), "g");
      var repEntity = function(word) {return entityRef[word];}
      return this.replace(reg, repEntity);
    }
}

var PAGEINFO;
(function(PAGEINFO) {
  PAGEINFO.GetTabInfo = function() {
  	this.getTabObject();
 	}

  var tabinfoP = PAGEINFO.GetTabInfo.prototype;

  tabinfoP.getTabObject = function() {
		chrome.tabs.getSelected(null, function(tab) {
			new CRTE.SetPage(tab);
			new QRGENE.SetQr(tab.url);
    });
  }
})(PAGEINFO || (PAGEINFO = {}));

var CRTE;
(function(CRTE) {
	CRTE.SetPage = function(tab) {
		this.title = tab.title;
		this.url = tab.url;
		this.favicon = tab.favIconUrl;
		this.noFavicon = "./img/nofavicon.png"
		this.pgTtl = $(".pgTtl");
		this.qrUrl = $(".qrUrl");
		this.init();
	}

	var crteP = CRTE.SetPage.prototype;

	crteP.init = function() {
		this.setTitle();
		this.setFavicon();
		this.setUrl();
		this.setHistory();
	}

	// ページタイトルセット
	crteP.setTitle = function() {
		this.pgTtl.html(this.title.chgEntity());
	}

	// ファビコンセット
	crteP.setFavicon = function() {
		if (!this.favicon) {
			this.favicon = this.noFavicon;
		}
		this.pgTtl.css("background-image", "url(" + this.favicon + ")");
	}

	// URLセット
	crteP.setUrl = function() {
		this.qrUrl.html(this.url);
		//this.qrUrl.autosize();  
	}

	// 履歴作成
	crteP.setHistory = function() {
		webStorage.setData(this.title, this.url, this.favicon);
	}

})(CRTE || (CRTE = {}));

var QRGENE
(function(QRGENE) {
	QRGENE.SetQr = function(url) {
		this.url = encodeURIComponent(url);
		this.qrImg = $(".qrImg");
		this.qrSize = $(".qrsize");
		this.qrImgSize = [100, 150, 200];
		this.qrChart = "https://chart.googleapis.com/chart?cht=qr&chld=L|1&chco=0099cc"
		this.init();
	}

	var qrgeneP = QRGENE.SetQr.prototype;

	qrgeneP.init = function() {
		var size = this.getCookieSize();
		this.setQrAreaSize(size);
		this.setSizeRange(size);
		this.setQrImg(size);
		this.getImgSize(size);
	}

	// クッキーの値取得
	qrgeneP.getCookieSize = function() {
		cookVal = $.cookie("QRSIZE");
		if (!cookVal) cookVal = 1;
		return cookVal;
	}

	// QRコード表示エリアサイズ指定
	qrgeneP.setQrAreaSize = function(n) {
		this.qrImg.width(this.qrImgSize[n] + "px");
		this.qrImg.height(this.qrImgSize[n] + "px");
	}

	// QRコード画像パス生成
	qrgeneP.createQrPath = function(n) {
		var qrImgPath = this.qrChart + "&chs=" + this.qrImgSize[n] + "x" + this.qrImgSize[n] + "&chl=" + this.url;
		return qrImgPath;
	}

	// QRコード画像表示
	qrgeneP.setQrImg = function(n) {
		var qrImgPath = this.createQrPath(n);
		var qrCreateImg = $("<img/>").attr("src", qrImgPath);
		this.qrImg.html(qrCreateImg);
	}

	// サイズ変更レンジ
	qrgeneP.setSizeRange = function(n) {
		this.qrSize.val(n);
	}

	// サイズ変更
	qrgeneP.getImgSize = function() {
		var self = this;
		var sizeVal;
		this.qrSize.on("change", function() {
			sizeVal = $(this).val();
			$.cookie("QRSIZE", sizeVal, { expires: 700, path: "/" });
			self.resetImg();
			self.setQrAreaSize(sizeVal);
			self.setQrImg(sizeVal);
		});
	}

	// QRコード画像削除
	qrgeneP.resetImg = function() {
		this.qrImg.html("");
	}

})(QRGENE || (QRGENE = {}));

/* local storage */
var STRG
(function(STRG) {
	STRG.WebStorage = function() {
		this.strg = localStorage;
		//this.clearData();
		this.num = 0;
		this.max = 20;
	}

	var strgP = STRG.WebStorage.prototype;

	strgP.dataNum = function() {
		return localStorage.length;
	}

	strgP.setData = function(qrTtl, qrUri, qrFavicon) {
		var key, num;
		if (num = this.chkDiffData(qrUri)) {
			this.rmData(num);
		}
		this.setRegNumber();
		key = this.num + 1;
		this.strg["num"] = key;
		var dataStr = JSON.stringify(this.createData(key, qrTtl, qrUri, qrFavicon));
		this.strg[key] = dataStr;
		this.shiftData();
	}

	strgP.shiftData = function() {
		if (this.dataNum() - 1 > this.max) {
			var delNo = this.getAllData()[0].no;
			this.rmData(delNo);
		}
	}

	strgP.getData = function(key) {
		return JSON.parse(this.strg.getItem(key));
	}

	strgP.rmData = function(key) {
		this.strg.removeItem(key);
	}

	strgP.clearData = function() {
		this.strg.clear();
	}

	strgP.chkDiffData = function(uri) {
		var dataObj, key;
		for (var i in this.strg) {
			dataObj = JSON.parse(this.strg.getItem(i));
			if (dataObj.url === uri) key = i;
		}
		return key;
	}

	strgP.setRegNumber = function() {
		if (this.dataNum() > 0) {
			this.num = this.getData("num");
		}
	}

	strgP.getAllData = function() {
		var allData = [];
		for (var i in this.strg) {
			if (i === "num") continue;
			allData[i] = JSON.parse(this.strg.getItem(i));
		}
		return allData.filter(function(e) {return e !== "";});
	}

	strgP.createData = function(key, qrTtl, qrUri, qrFavicon) {
		var siteInfo = {
			no: key,
			title: qrTtl,
			url: qrUri,
			favicon: qrFavicon,
			regDate: this.setDate()
		};
		return siteInfo;
	}

	strgP.setDate = function() {
		var date = new Date();
		var y = date.getFullYear();
		var m = date.getMonth() + 1;
		var d = date.getDay();
		var h = date.getHours();
		var mm = date.getMinutes();
		return y + "/" + m.zeroPad(100) + "/" + d.zeroPad(100) + " " + h.zeroPad(100) + ":" + mm.zeroPad(100);
	}

})(STRG || (STRG = {}));

var webStorage = new STRG.WebStorage();
new PAGEINFO.GetTabInfo();