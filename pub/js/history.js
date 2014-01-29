$(function() {
  new HISTORY.HistoryList();
});

/* history */
var HISTORY;
(function(HISTORY) {
	HISTORY.HistoryList = function() {
		this.allData = webStorage.getAllData();
		this.allDataLen = this.allData.length;
		this.historyList = $(".historyList");
		this.setHistory();
	}

	var historyP = HISTORY.HistoryList.prototype;

	historyP.setHistory = function() {
		if (this.allDataLen > 0) {
			this.createHistory();
		}
		else {
			this.historyList.html('<li class="historyItem"><div class="noLogMsg">No Log Data</div></li>');
		}
	}

	historyP.createHistory = function() {
		for (var i = this.allDataLen - 1; i >= 0 ; i--) {
			var src = "";
			src += '<li class="historyItem" rel="' + this.allData[i].no + '">';
			src += '<div class="historyHead">';
			src += '<p class="siteTitle" style="background-image:url(' + this.allData[i].favicon + ');">' + this.allData[i].title.chgEntity() + '</p>';
			src += '<div class="regDate">' + this.allData[i].regDate + '</div>';
			src += '</div>';
			src += '<div class="clearfix siteQr">';
			src += '<div class="siteQrImg"><img src="https://chart.googleapis.com/chart?cht=qr&chld=L|1&chco=0099cc&chs=150x150&chl=' + encodeURIComponent(this.allData[i].url) + '"></div>';
			src += '<div class="siteUri"><a href="this.allData[i].url">' + this.allData[i].url + '</a></div>';
			src += '</div>';
			src += '</li>';
			this.historyList.append(src);
		}
	}
})(HISTORY || (HISTORY = {}));