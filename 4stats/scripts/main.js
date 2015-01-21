	
	var TOP = 5;
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
							$("#venuesList").append('<a data-id="' + venueId + '" href="#" onclick="javascript:venueClick(this, \'' + token + '\');" class="list-group-item venue active">' + venueName + '</a>');
						else
							$("#venuesList").append('<a data-id="' + venueId + '" href="#" onclick="javascript:venueClick(this, \'' + token + '\');" class="list-group-item venue">' + venueName + '</a>');
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
		
		getVenue($(".venue.active").data('id'), token);	
		venues.sort(compareVenuesByRating);
		showAllGeneralCharts(venues);
	}
		
	function getVenue(id, token) {
		showLoader();
		$.ajax({
			url: config.apiUrl + 'v2/venues/' + id + '?oauth_token=' + token + '&v=' + config.date,
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
					
					var venueLTP = {
						"likes": venueLikes,
						"tips": venueTips,
						"photos": venuePhotos
					};
					
					var venueUC = {
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
						tipsDates.push({"date": tipsItems[i]['createdAt'], "text": tipsItems[i]['text']});
						
					var photosItems = venue['photos']['groups'][0]['items'];
					var photosDates = []
					for(var i=0; i<photosItems.length; i++)
						photosDates.push(photosItems[i]['createdAt']);

					venueData = {
						"ltp": venueLTP,
						"uc": venueUC,
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
		showVenueLTPChart(venueData['ltp']);
		showVenueUCChart(venueData['uc']);
		showVenueTipsChart(venueData['tipsDates']);
		showVenuePhotosChart(venueData['photosDates']);
	}

	function venueClick(target, token) {
		$(".venue").removeClass('active');
		$(target).addClass('active');
		venueId = $(target).data('id');
		getVenue(venueId, token);
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
	
	function showVenuesRatingsCharts(venues) {
		var venuesCopy = venues.slice();
		venuesCopy.sort(compareVenuesByRating);
		var venuesData = [];
		for(var i=0; i<TOP; i++) {
			venuesData.push({"y": venues[i]['rating'], "label": venues[i]['name']});
		}
		var chartVenuesRatings1 = new CanvasJS.Chart("chartVenuesRatings1", {
			title:{
				text: "Top " + TOP + " venues by rating"    
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
			chartVenuesRatings1.render();
		},10);
	}

	function showVenuesUsersCharts(venues) {
		var venuesCopy = venues.slice();
		venuesCopy.sort(compareVenuesByUsers);
		var venuesData = [];
		for(var i=0; i<TOP; i++) {
			venuesData.push({"y": venuesCopy[i]['users'], "label": venuesCopy[i]['name']});
		}
		var chartVenuesUsers1 = new CanvasJS.Chart("chartVenuesUsers1", {
			theme: "theme2",
			title:{ 
				text: "Top " + TOP + " venues by number of users"
			},
			axisY: {				
				title: "Number of users"
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
		var chartVenuesUsers2 = new CanvasJS.Chart("chartVenuesUsers2", {
			title:{
				text: "Top " + TOP + " venues by number of users"
			},
			animationEnabled: true,
			legend:{
				verticalAlign: "bottom",
				horizontalAlign: "center"
			},
			data: [
				{        
					indexLabelFontSize: 20,
					indexLabelFontFamily: "Monospace",       
					indexLabelFontColor: "darkgrey", 
					indexLabelLineColor: "darkgrey",        
					indexLabelPlacement: "outside",
					type: "pie",       
					toolTipContent: "{label}: {y} - <strong>#percent%</strong>",
					dataPoints: venuesData
				}
			]
		});
		var chartVenuesUsers3 = new CanvasJS.Chart("chartVenuesUsers3", {
			title:{
				text: "Top " + TOP + " venues by number of users"
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
			chartVenuesUsers1.render();
			chartVenuesUsers2.render();
			chartVenuesUsers3.render();
		},10);
	}
	
	function showVenuesTipsCharts(venues) {
		var venuesCopy = venues.slice();
		venuesCopy.sort(compareVenuesByTips);
		var venuesData = [];
		for(var i=0; i<TOP; i++) {
			venuesData.push({"y": venuesCopy[i]['tips'], "label": venuesCopy[i]['name']});
		}
		var chartVenuesTips1 = new CanvasJS.Chart("chartVenuesTips1", {
			title:{ 
				text: "Top " + TOP + " venues by number of tips"
			},
			axisY: {				
				title: "Number of tips"
			},	
			theme: "theme2",				
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
		var chartVenuesTips2 = new CanvasJS.Chart("chartVenuesTips2", {
			title:{
				text: "Top " + TOP + " venues by number of tips"
			},
			animationEnabled: true,
			legend:{
				verticalAlign: "bottom",
				horizontalAlign: "center"
			},
			data: [
				{        
					indexLabelFontSize: 20,
					indexLabelFontFamily: "Monospace",       
					indexLabelFontColor: "darkgrey", 
					indexLabelLineColor: "darkgrey",        
					indexLabelPlacement: "outside",
					type: "pie",       
					toolTipContent: "{label}: {y} - <strong>#percent%</strong>",
					dataPoints: venuesData
				}
			]
		});
		var chartVenuesTips3 = new CanvasJS.Chart("chartVenuesTips3", {
			title:{
				text: "Top " + TOP + " venues by number of tips"
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
			chartVenuesTips1.render();
			chartVenuesTips2.render();
			chartVenuesTips3.render();
		},10);
	}
	
	function showVenuesPhotosCharts(venues) {
	
		var venuesCopy = venues.slice();
		venuesCopy.sort(compareVenuesByPhotos);
		var venuesData = [];
		for(var i=0; i<TOP; i++) {
			venuesData.push({"y": venuesCopy[i]['photos'], "label": venuesCopy[i]['name']});
		}
		var chartVenuesPhotos1 = new CanvasJS.Chart("chartVenuesPhotos1", {
			title:{ 
				text: "Top " + TOP + " venues by number of photos"
			},
			axisY: {				
				title: "Number of photos"
			},	
			theme: "theme2",				
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
		var chartVenuesPhotos2 = new CanvasJS.Chart("chartVenuesPhotos2", {
			title:{
				text: "Top " + TOP + " venues by number of photos"
			},
			animationEnabled: true,
			legend:{
				verticalAlign: "bottom",
				horizontalAlign: "center"
			},
			data: [
				{        
					indexLabelFontSize: 20,
					indexLabelFontFamily: "Monospace",       
					indexLabelFontColor: "darkgrey", 
					indexLabelLineColor: "darkgrey",        
					indexLabelPlacement: "outside",
					type: "pie",       
					toolTipContent: "{label}: {y} - <strong>#percent%</strong>",
					dataPoints: venuesData
				}
			]
		});
		var chartVenuesPhotos3 = new CanvasJS.Chart("chartVenuesPhotos3", {
			title:{
				text: "Top " + TOP + " venues by number of photos"
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
			chartVenuesPhotos1.render();
			chartVenuesPhotos2.render();
			chartVenuesPhotos3.render();
		},10);
	}
	
	function showVenuesCheckinsCharts(venues) {
	
		var venuesCopy = venues.slice();
		venuesCopy.sort(compareVenuesByCheckins);
		var venuesData = [];
		for(var i=0; i<TOP; i++) {
				venuesData.push({"y": venuesCopy[i]['checkins'], "legendText": venuesCopy[i]['name'], "label": venuesCopy[i]['name']});
		}
		var chartVenuesCheckins1 = new CanvasJS.Chart("chartVenuesCheckins1", {
			title:{ 
				text: "Top " + TOP + " venues by number of checkins"
			},
			axisY: {				
				title: "Number of checkins"
			},	
			theme: "theme2",				
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
		var chartVenuesCheckins2 = new CanvasJS.Chart("chartVenuesCheckins2", {
			title:{
				text: "Top " + TOP + " venues by number of checkins"
			},
			animationEnabled: true,
			legend:{
				verticalAlign: "bottom",
				horizontalAlign: "center"
			},
			data: [
				{        
					indexLabelFontSize: 20,
					indexLabelFontFamily: "Monospace",       
					indexLabelFontColor: "darkgrey", 
					indexLabelLineColor: "darkgrey",        
					indexLabelPlacement: "outside",
					type: "pie",       
					toolTipContent: "{label}: {y} - <strong>#percent%</strong>",
					dataPoints: venuesData
				}
			]
		});
		var chartVenuesCheckins3 = new CanvasJS.Chart("chartVenuesCheckins3", {
			title:{
				text: "Top " + TOP + " venues by number of checkins"
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
			chartVenuesCheckins1.render();
			chartVenuesCheckins2.render();
			chartVenuesCheckins3.render();
		},10);
	}
	
	function showVenueLTPChart(venuesData) {
		var chartData = [];
		$.each(venuesData, function (key, val) {
			chartData.push({"y": val, "label": key});
		});
		var chartVenueLTP = new CanvasJS.Chart("chartVenueLTP", {
			title:{
				text: "Likes / Tips / Photos"
			},
			animationEnabled: true,
			legend:{
				verticalAlign: "bottom",
				horizontalAlign: "center"
			},
			data: [
				{        
					indexLabelFontSize: 20,
					indexLabelFontFamily: "Monospace",       
					indexLabelFontColor: "darkgrey", 
					indexLabelLineColor: "darkgrey",        
					indexLabelPlacement: "outside",
					type: "pie",       
					toolTipContent: "{label}: {y} - <strong>#percent%</strong>",
					dataPoints: chartData
				}
			]
		});
		setTimeout(function(){
			chartVenueLTP.render();
		},10);
	}
	
	function showVenueUCChart(venuesData) {
		var chartData = [];
		$.each(venuesData, function (key, val) {
			chartData.push({"y": val, "label": key});
		});
		var chartVenueUC = new CanvasJS.Chart("chartVenueUC", {
			title:{
				text: "Users / Checkins"
			},
			animationEnabled: true,
			legend:{
				verticalAlign: "bottom",
				horizontalAlign: "center"
			},
			data: [
				{        
					indexLabelFontSize: 20,
					indexLabelFontFamily: "Monospace",       
					indexLabelFontColor: "darkgrey", 
					indexLabelLineColor: "darkgrey",        
					indexLabelPlacement: "outside",
					type: "pie",       
					toolTipContent: "{label}: {y} - <strong>#percent%</strong>",
					dataPoints: chartData
				}
			]
		});
		setTimeout(function(){
			chartVenueUC.render();
		},10);
	}
	
	function showVenueTipsChart(venuesData) {
	
		var data = [];
		for(var i=0; i<venuesData.length; i++)
		{
			var date = new Date(0);
			date.setUTCSeconds(venuesData[i]['date']);
			data.push({"x": date, "y": date.getHours(), "name": venuesData[i]['text']});
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
				toolTipContent: "<span style='\"'color: {color};'\"'><strong>{name}</strong></span> <br/> <strong>Hour</strong> {y} h<br/> <strong>Date</strong> {x} ",
				dataPoints: data
			}
			]
		});
		setTimeout(function(){
			chartVenueTips.render();
		},10);
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
				toolTipContent: "<span style='\"'color: {color};'\"'><strong>Photo</strong></span> <br/> <strong>Hour</strong> {y} h<br/> <strong>Date</strong> {x} ",
				dataPoints: data
			}
			]
		});
		setTimeout(function(){
			chartVenuePhotos.render();
		},10);
	}
	
	function showAllGeneralCharts(venues) {
		showVenuesRatingsCharts(venues);
		showVenuesUsersCharts(venues);
		showVenuesPhotosCharts(venues)
		showVenuesTipsCharts(venues);
		showVenuesCheckinsCharts(venues);
	}
	
	function hideAll() {
		$("#mainStats").addClass('hide');
		$("#ratingStats").addClass('hide');
		$("#usersStats").addClass('hide');
		$("#tipsStats").addClass('hide');
		$("#photosStats").addClass('hide');
		$("#hereNowStats").addClass('hide');
		$("#checkinsStats").addClass('hide');
		$("#documentation").addClass('hide');
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
			zIndex:"9999999",
            spinner: "spinner2"
        });
    }

    function hideLoader() {
        $(".fakeloader").fadeOut();
    }
	
$(document).ready(function () {
	
	//var token = window.location.hash.split("=")[1];
	var token = "HLT4UTYZGZXWPBZCHNJHXDSDWK221H41HNRQS4EPCHAM0VMK";
	if(token) {
	
		connected();
		getVenues(category, token);
		
		$(".venuesCategory").click(function () {
			category = $(this).data('id');
			getVenues(category, token);
		});
		
		$(".venuesCity").click(function () {
			city = $(this).data('id');
			if(city != "enter") {
				config.city = city;
				getVenues(category, token);
			}
		});
		
		$("#btnMain").click(function () {
			hideAll();
			$("#mainStats").removeClass('hide');
		});
		
		$("#btnAddCity").click(function () {
			config.city = $("#txtCity").val();
			getVenues(category, token);
			$('#newCity').modal('hide');
		});
		
		$("#btnRating").click(function () {
			showVenuesRatingsCharts(venues);
			hideAll();
			$("#ratingStats").removeClass('hide');
		});
		
		$("#btnUsers").click(function () {
			showVenuesUsersCharts(venues);
			hideAll();
			$("#usersStats").removeClass('hide');
		});
		
		$("#btnTips").click(function () {
			showVenuesTipsCharts(venues);
			hideAll();
			$("#tipsStats").removeClass('hide');
		});
		
		$("#btnPhotos").click(function () {
			showVenuesPhotosCharts(venues);
			hideAll();
			$("#photosStats").removeClass('hide');
		});
		
		$("#btnCheckins").click(function () {
			showVenuesCheckinsCharts(venues);
			hideAll();
			$("#checkinsStats").removeClass('hide');
		});
		
		$(document).on('shown.bs.tab', 'a[data-toggle="tab"]', function (e) {
			if($(this).data('id') == 0){
				showVenueLTPChart(venueData['ltp']);
			}
			else if($(this).data('id') == 1){
				showVenueUCChart(venueData['uc']);
			}
			else if($(this).data('id') == 2){
				showVenueTipsChart(venueData['tipsDates']);
			}
			else if($(this).data('id') == 3){
				showVenuePhotosChart(venueData['photosDates']);
			}
		});
		
		$("#documentationLink").click(function () {
			hideAll();
			$("#documentation").removeClass('hide');
		});
	}
});