	
	var	category = 0;
	var venues = [];
	var venueData = {};
	var config = {
		authUrl: 'https://foursquare.com/',
		apiUrl: 'https://api.foursquare.com/',
		apiRedirect: 'https://foursquare.com/oauth2/authenticate?client_id=FKE1MV550J1HSBVSZKNJ4HE1HLYCUG4YADVCGNXPUGSIE0KA&response_type=token&redirect_uri=http://kalemdzievski.github.io/4stats/',	
		categoryNames: [
			"Pizza places",
			"Restaurants",
			"Bars",
			"Cockatils", 
			"Lounges",
			"Night clubs",
			"Cafe"
		],
		categories: [
			"4bf58dd8d48988d1ca941735",
			"4bf58dd8d48988d1df931735",
			"4bf58dd8d48988d116941735",
			"4bf58dd8d48988d11e941735",
			"4bf58dd8d48988d121941735",
			"4bf58dd8d48988d11f941735",
			"4bf58dd8d48988d16d941735" 
		],
		city: "Skopje",
		date: today()
	};
	
	function getParameterByName(name) {
		name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
		var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
			results = regex.exec(location.search);
		return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
	}

	function getVenues(categoryId, token) {
		venues = [];
		$("#venuesList").empty();
		showLoader();
		$.ajax({
			url: config.apiUrl + 'v2/venues/explore?oauth_token=' + token + '&near=' + config.city + '&limit=50&categoryId=' + config.categories[categoryId] + '&v=' + config.date,
			type: 'GET',
			async: false,
			dataType: 'json',
			success: function (data) {
				hideLoader();
				if (data.meta['code'] == 200) {
					var items = data['response']['groups'][0]['items'];
					for(var i=0; i<items.length; i++) {
					
						var venueId = items[i]['venue']['id'];
						var venueName = items[i]['venue']['name'];
						var venueRating = items[i]['venue']['rating'];
						var venueHereNow = items[i]['venue']['hereNow']['count'];
						var venueTips = items[i]['venue']['stats']['tipCount'];
						var venuePhotos = items[i]['venue']['photos']['count'];
						var venueCheckins = items[i]['venue']['stats']['checkinsCount'];
						var venueUsers = items[i]['venue']['stats']['usersCount'];
						
						var venue = {
							"id": venueId, 
							"name": venueName, 
							"rating": venueRating,
							"hereNow": venueHereNow,
							"tips": venueTips,
							"photos": venuePhotos,
							"checkins": venueCheckins,
							"users": venueUsers
						};
						
						venues.push(venue);
						
						if(i == 0)
							$("#venuesList").append('<a data-id="' + venueId + '" href="#" onclick="javascript:venueClick(this);" class="list-group-item venue active">' + venueName + '</a>');
						else
							$("#venuesList").append('<a data-id="' + venueId + '" href="#" onclick="javascript:venueClick(this);" class="list-group-item venue">' + venueName + '</a>');
					}
				}
				else {
					alert("ERROR");
				}
			},
			error: function (data) {
				hideLoader();
				alert("ERROR");
			}
		});
		
		getVenue($(".venue.active").data('id'));	
		venues.sort(compareVenuesByRating);
	}
		
	function getVenue(id) {
		showLoader();
		$.ajax({
			url: config.apiUrl + 'v2/venues/' + id + '?oauth_token=KV3WTKON301SAXW1HNF4BC40WVRARJL2OO5UTV0SDIP5NMPA&v=' + config.date,
			type: 'GET',
			async: false,
			dataType: 'json',
			success: function (data) {
				hideLoader();
				if (data.meta['code'] == 200) {
					var venue = data.response['venue'];
					
					var venueId = venue['id'];
					var venueLikes = venue['likes']['count'];
					var venuePhotos = venue['photos']['count'];
					var venueCheckins = venue['stats']['checkinsCount'];
					var venueUsers = venue['stats']['usersCount'];
					var venueTips = venue['stats']['tipCount'];
					
					var venueGeneralData = {
						"likes": venueLikes,
						"tips": venueTips,
						"photos": venuePhotos,
						"checkins": venueCheckins,
						"users": venueUsers
					};
					
					var tipsItems;
					var tipsGroups = venue['tips']['groups'];
					for(var i=0; i<tipsGroups.length; i++) {
						if(tipsGroups[i]['type'] == "others")
							tipsItems = tipsGroups[i]['items'];
					}
					
					var tipsDates = []
					for(var i=0; i<tipsItems.length; i++)
						tipsDates.push(tipsItems[i]['createdAt']);
						
					var photosItems = venue['photos']['groups'][0]['items'];
					var photosDates = []
					for(var i=0; i<photosItems.length; i++)
						photosDates.push(photosItems[i]['createdAt']);

					venueData = {
						"generalData": venueGeneralData,
						"tipsDates": tipsDates,
						"photosDates": photosDates
					}
			
				}
				else {
					alert("ERROR");
				}
			},
			error: function (data) {
				hideLoader();
				alert("ERROR");
			}
		});
		
		$("#venueName").text($(".venue.active").text());
		showVenueGeneralDataChart(venueData['generalData']);
		showVenueTipsChart(venueData['tipsDates']);
		showVenuePhotosChart(venueData['photosDates']);
	}

	function venueClick(target) {
		$(".venue").removeClass('active');
		$(target).addClass('active');
		venueId = $(target).data('id');
		getVenue(venueId);
    }	
	
	function compareVenuesByRating(venue1, venue2) {
		if (venue1.rating < venue2.rating)
			return 1;
		if (venue1.rating > venue2.rating)
			return -1;
		return 0;
	}
	
	function compareVenuesByCheckins(venue1, venue2) {
		if (venue1.checkins < venue2.checkins)
			return 1;
		if (venue1.checkins > venue2.checkins)
			return -1;
		return 0;
	}
	
	function compareVenuesByUsers(venue1, venue2) {
		if (venue1.users < venue2.users)
			return 1;
		if (venue1.users > venue2.users)
			return -1;
		return 0;
	}
	
	function compareVenuesByHereNow(venue1, venue2) {
		if (venue1.hereNow < venue2.hereNow)
			return 1;
		if (venue1.hereNow > venue2.hereNow)
			return -1;
		return 0;
	}
	
	function compareVenuesByTips(venue1, venue2) {
		if (venue1.tips < venue2.tips)
			return 1;
		if (venue1.tips > venue2.tips)
			return -1;
		return 0;
	}
	
	function compareVenuesByPhotos(venue1, venue2) {
		if (venue1.photos < venue2.photos)
			return 1;
		if (venue1.photos > venue2.photos)
			return -1;
		return 0;
	}
	
	function showVenuesRatingsChart(venuesData) {
		var chartVenuesRatings = new CanvasJS.Chart("chartVenuesRatings", {
			title:{
				text: "Top 10 venues by rating"    
			},
			axisY: {
				title: "Rating"
			},
			legend: {
				verticalAlign: "bottom",
				horizontalAlign: "center"
			},
			theme: "theme2",
			data: [
				{        
					type: "column",  
					legendMarkerColor: "grey",
					dataPoints: venuesData
				}   
			]
		});
		setTimeout(function(){
			chartVenuesRatings.render();
		},10);
	}

	function showVenuesUsersChart(venuesData) {
		var chartVenuesUsers = new CanvasJS.Chart("chartVenuesUsers", {
			title:{
				text: "Top 10 venues by number of users"
			},
			theme: "theme2",
			data: [
				{        
					type: "doughnut",
					indexLabelFontFamily: "Garamond",       
					indexLabelFontSize: 20,
					startAngle:0,
					indexLabelFontColor: "dimgrey",       
					indexLabelLineColor: "darkgrey", 
					toolTipContent: "{y} %", 
					dataPoints: venuesData
				}
			]
		});
		setTimeout(function(){
			chartVenuesUsers.render();
		},10);
	}
	
	function showVenuesTipsChart(venuesData) {
		var chartVenuesTips = new CanvasJS.Chart("chartVenuesTips", {
			theme: "theme2",
			title:{ 
				text: "Top 10 venus by number of tips"
			},
			axisY: {				
				title: "Number of People"
			},					
			legend:{
				verticalAlign: "top",
				horizontalAlign: "centre",
				fontSize: 16

			},
			data : [{
				type: "column",
				legendMarkerType: "none",	
				indexLabel: "{y}",
				dataPoints: venuesData
			}]
		});
		setTimeout(function(){
			chartVenuesTips.render();
		},10);
	}
	
	function showVenuesPhotosChart(venuesData) {
		var chartVenuesPhotos = new CanvasJS.Chart("chartVenuesPhotos", {
			title:{
				text: "Top 10 venus by number of photos"	
			},
            animationEnabled: true,
			axisX:{
				interval: 1,
				gridThickness: 0,
				labelFontSize: 10,
				labelFontStyle: "normal",
				labelFontWeight: "normal",
				labelFontFamily: "Lucida Sans Unicode"

			},
			axisY2:{
				interlacedColor: "rgba(1,77,101,.2)",
				gridColor: "rgba(1,77,101,.1)"
			},
			data: [
				{     
					type: "bar",
					name: "companies",
					axisYType: "secondary",
					color: "#014D65",				
					dataPoints: venuesData
				}
			]
		});
		setTimeout(function(){
			chartVenuesPhotos.render();
		},10);
	}
	
	function showVenuesHereNowChart(venuesData) {
		var chartVenuesHereNow = new CanvasJS.Chart("chartVenuesHereNow", {
			title:{
				text: "Top 10 venus by here now"	
			},
            animationEnabled: true,
			axisX:{
				interval: 1,
				gridThickness: 0,
				labelFontSize: 10,
				labelFontStyle: "normal",
				labelFontWeight: "normal",
				labelFontFamily: "Lucida Sans Unicode"

			},
			axisY2:{
				interlacedColor: "rgba(1,77,101,.2)",
				gridColor: "rgba(1,77,101,.1)"
			},
			data: [
				{     
					type: "bar",
					name: "Venues",
					axisYType: "secondary",
					color: "#014D65",				
					dataPoints: venuesData
				}
			]
		});
		setTimeout(function(){
			chartVenuesHereNow.render();
		},10);
	}
	
	function showVenuesCheckinsChart(venuesData) {
		var chartVenuesCheckins = new CanvasJS.Chart("chartVenuesCheckins", {
			title:{
			text: "Top 10 venues by checkins"
			},
			legend:{
				verticalAlign: "center",
				horizontalAlign: "left",
				fontSize: 20,
				fontFamily: "Helvetica"        
			},
			theme: "theme2",
			data: [
				{        
					type: "pie",       
					indexLabelFontFamily: "Garamond",       
					indexLabelFontSize: 20,
					indexLabel: "{label} {y}%",
					startAngle:-20,      
					showInLegend: true,
					toolTipContent:"{legendText} {y}%",
					dataPoints: venuesData
				}
			]
		});
		setTimeout(function(){
			chartVenuesCheckins.render();
		},10);
	}
	
	function showVenueGeneralDataChart(venuesData) {
		var chartData = [];
		$.each(venuesData, function (key, val) {
			chartData.push({"y": val, "label": key});
		});
		var chartVenueGeneralData = new CanvasJS.Chart("chartVenueGeneralData", {
			title:{
			text: "General statistics"    
		  },
		  animationEnabled: true,
		  axisY: {
			title: "Count"
		  },
		  legend: {
			verticalAlign: "bottom",
			horizontalAlign: "center"
		  },
		  theme: "theme2",
		  data: [

		  {        
			type: "column",  
			showInLegend: true, 
			legendMarkerColor: "grey",
			dataPoints: chartData
		  }   
		  ]
		});
		chartVenueGeneralData.render();
	}
	
	function showVenueTipsChart(venuesData) {
	
		var data = [];
		for(var i=0; i<venuesData.length; i++)
		{
			var date = new Date(0);
			date.setUTCSeconds(venuesData[i]);
			data.push({"x": date, "y": date.getHours(), "name": "Tip"});
		}
		var chartVenueTips = new CanvasJS.Chart("chartVenueTips", {
			title:{
				text: "Tips by date and hour",      
				fontFamily: "arial black",
				fontColor: "DarkSlateGrey"
			},
                        animationEnabled: true,
			axisX: {
				title:"Date",
				titleFontFamily: "arial",
				titleFontSize: 14
			},
			axisY:{
				title: "Hour",
				titleFontFamily: "arial",
				valueFormatString:"0 h",
				titleFontSize: 12
			},

			data: [
			{        
				type: "scatter",  
				toolTipContent: "<span style='\"'color: {color};'\"'><strong>Tip</strong></span> <br/> <strong>Hour</strong> {y} h<br/> <strong>Date</strong> {x} ",
				dataPoints: data
			}
			]
		});
		chartVenueTips.render();
	}
	
	function showVenuePhotosChart(venuesData) {
		var data = [];
		for(var i=0; i<venuesData.length; i++)
		{
			var date = new Date(0);
			date.setUTCSeconds(venuesData[i]);
			data.push({"x": date, "y": date.getHours(), "name": "Photo"});
		}
		var chartVenuePhotos = new CanvasJS.Chart("chartVenuePhotos", {
			title:{
				text: "Photos by date and hour",      
				fontFamily: "arial black",
				fontColor: "DarkSlateGrey"
			},
            animationEnabled: true,
			axisX: {
				title:"Date",
				titleFontFamily: "arial",
				titleFontSize: 14
			},
			axisY:{
				title: "Hour",
				titleFontFamily: "arial",
				valueFormatString:"0 h",
				titleFontSize: 12
			},

			data: [
			{        
				type: "scatter",  
				toolTipContent: "<span style='\"'color: {color};'\"'><strong>Tip</strong></span> <br/> <strong>Hour</strong> {y} h<br/> <strong>Date</strong> {x} ",
				dataPoints: data
			}
			]
		});
		chartVenuePhotos.render();
	}
	
	function hideAll() {
		$("#mainStats").addClass('hide');
		$("#ratingStats").addClass('hide');
		$("#usersStats").addClass('hide');
		$("#tipsStats").addClass('hide');
		$("#photosStats").addClass('hide');
		$("#hereNowStats").addClass('hide');
		$("#checkinsStats").addClass('hide');
	}
	
	function today() {
		var today = new Date();
		var dd = today.getDate();
		var mm = today.getMonth()+1; //January is 0!
		var yyyy = today.getFullYear();

		if(dd<10) {
			dd='0'+dd
		} 

		if(mm<10) {
			mm='0'+mm
		} 

		today = yyyy + mm + dd;
		return today;
	}
	
	function connect() {
		window.location.replace(config.apiRedirect);
	}

	function connected() {
		$("#connectContainer").addClass('hide');
		$("#mainStats").removeClass('hide');
	}
	
	function showLoader() {
        $(".fakeloader").fakeLoader({
            bgColor: "rgba(0,0,0,0.7)",
			zIndex:"999",
            spinner: "spinner2"
        });
    }

    function hideLoader() {
        $(".fakeloader").fadeOut();
    }
	
$(document).ready(function () {
	
	var token = window.location.hash.split("=")[1];
	if(token) {
	
		connected();
		getVenues(category, token);
		
		$(".venueCategory").click(function () {
			category = $(this).data('id');
			$("#venuesCategoryName").text(config.categoryNames[category]);
			getVenues(category, token);
		});
		
		$("#btnMain").click(function () {
			hideAll();
			$("#mainStats").removeClass('hide');
		});
		
		$("#btnRating").click(function () {
			var venuesCopy = venues.slice();
			venuesCopy.sort(compareVenuesByRating);
			var venuesData = [];
			for(var i=0; i<10; i++) {
				venuesData.push({"y": venues[i]['rating'], "label": venues[i]['name']});
			}
			showVenuesRatingsChart(venuesData);
			hideAll();
			$("#ratingStats").removeClass('hide');
		});
		
		$("#btnUsers").click(function () {
			var venuesCopy = venues.slice();
			venuesCopy.sort(compareVenuesByUsers);
			var venuesData = [];
			for(var i=0; i<10; i++) {
				venuesData.push({"y": venuesCopy[i]['users'], "label": venuesCopy[i]['name']});
			}
			showVenuesUsersChart(venuesData);
			hideAll();
			$("#usersStats").removeClass('hide');
		});
		
		$("#btnTips").click(function () {
			var venuesCopy = venues.slice();
			venuesCopy.sort(compareVenuesByTips);
			var venuesData = [];
			for(var i=0; i<10; i++) {
				venuesData.push({"y": venuesCopy[i]['tips'], "label": venuesCopy[i]['name']});
			}
			showVenuesTipsChart(venuesData);
			hideAll();
			$("#tipsStats").removeClass('hide');
		});
		
		$("#btnPhotos").click(function () {
			var venuesCopy = venues.slice();
			venuesCopy.sort(compareVenuesByPhotos);
			var venuesData = [];
			for(var i=0; i<10; i++) {
				venuesData.push({"y": venuesCopy[i]['photos'], "label": venuesCopy[i]['name']});
			}
			showVenuesPhotosChart(venuesData);
			hideAll();
			$("#photosStats").removeClass('hide');
		});
		
		$("#btnHereNow").click(function () {
			var venuesCopy = venues.slice();
			venuesCopy.sort(compareVenuesByHereNow);
			var venuesData = [];
			for(var i=0; i<10; i++) {
				venuesData.push({"y": venuesCopy[i]['hereNow'], "label": venuesCopy[i]['name']});
			}
			showVenuesHereNowChart(venuesData);
			hideAll();
			$("#hereNowStats").removeClass('hide');
		});
		
		$("#btnCheckins").click(function () {
			var venuesCopy = venues.slice();
			venuesCopy.sort(compareVenuesByCheckins);
			var venuesData = [];
			for(var i=0; i<10; i++) {
				venuesData.push({"y": venuesCopy[i]['checkins'], "legendText": venuesCopy[i]['name'], "label": venuesCopy[i]['name']});
			}
			showVenuesCheckinsChart(venuesData);
			hideAll();
			$("#checkinsStats").removeClass('hide');
		});
		
		$(document).on('shown.bs.tab', 'a[data-toggle="tab"]', function (e) {
		if($(this).data('id') == 0){
			setTimeout(function(){
				showVenueGeneralDataChart(venueData['generalData']);
			},10);
		}
		else if($(this).data('id') == 1){
			setTimeout(function(){
				showVenueTipsChart(venueData['tipsDates']);
			},10);
		}
		else if($(this).data('id') == 2){
			setTimeout(function(){
				showVenuePhotosChart(venueData['photosDates']);
			},10);
		}
	});
	}
});