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
		this.qrUrl.autosize();  
	}

})(CRTE || (CRTE = {}));

var QRGENE
(function(QRGENE) {
	QRGENE.SetQr = function(url) {
		this.url = encodeURIComponent(url);
		this.qrImg = $(".qrImg");
		this.qrSize = $(".qrsize");
		this.qrImgSize = [100, 150, 200];
		this.qrChart = "https://chart.googleapis.com/chart?cht=qr&chs=150x150&chld=L|1&chco=0099cc&chl="
		this.init();
	}

	var qrgeneP = QRGENE.SetQr.prototype;

	qrgeneP.init = function() {
		this.setQrAreaSize();
		this.setQrImg();
		this.getImgSize();
	}

	qrgeneP.setQrAreaSize = function() {
		this.qrImg.width(this.qrImgSize[1] + "px");
		this.qrImg.height(this.qrImgSize[1] + "px");
	}

	qrgeneP.createQrPath = function() {
		var qrImgPath = this.qrChart + this.url;
		return qrImgPath;
	}

	qrgeneP.setQrImg = function() {
		var qrImgPath = this.createQrPath();
		var qrCreateImg = $("<img/>").attr("src", qrImgPath);
		this.qrImg.append(qrCreateImg);
	}

	qrgeneP.getImgSize = function() {
		return this.qrSize.val();
	}

	qrgeneP.setImgSize = function() {

	}

	qrgeneP.resetImg = function() {
		this.qrImg.html("");
	}

})(QRGENE || (QRGENE = {}));

var UTIL
(function(UTIL) {

})(UTIL || (UTIL = {}));

new PAGEINFO.GetTabInfo();