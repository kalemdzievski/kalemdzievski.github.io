
	$( document ).ready(function() {
		
		var modified = document.lastModified;
		var date = modified.split(" ")[0];
		var dateSplit = date.split("/");
		$("#lastmod").text("Last modified: " + dateSplit[1] + "." + dateSplit[0] + "." + dateSplit[2]);
		
		var currentDiv = $(document).find("title").text().toLowerCase();
		$("#"+currentDiv).css("color", "#0080FF");
		
		$(".nav").hover(function () {
            	$(this).css( 'cursor', 'pointer' );
				$(this).css("color", "#0080FF");
            },
            function() {
            	$(this).css( 'cursor', 'auto' );
				$(this).css("color", "white");
				var currentDiv = $(document).find("title").text().toLowerCase();
				$("#"+currentDiv).css("color", "#0080FF");
         });
         
         $(".socnet").hover(function () {
            	$(this).css( 'cursor', 'pointer' );
            },
            function() {
            	$(this).css( 'cursor', 'auto' );
         });
         
		$("#home").click(function () {
	    	window.location = "index.html";
	    });
	    
	    $("#biography").click(function () {
	    	window.location = "biography.html";
	    });
	    
	    $("#filmography").click(function () {
	    	window.location = "filmography.html";
	    });
	    
	    $("#photos").click(function () {
	    	window.location = "photos.html";
	    });
	    
	    $("#videos").click(function () {
	    	window.location = "videos.html";
	    });
	    
	    $("#fb").click(function () {
	    	window.location = "https://www.facebook.com/AaronPaulOnline";
	    });
	    
	    $("#tw").click(function () {
	    	window.location = "https://twitter.com/aaronpauldotorg";
	    });
	    
	    $("#tb").click(function () {
	    	window.location = "http://aaronpaulonline.tumblr.com/";
	    });
	    
	    $("#in").click(function () {
	    	window.location = "http://instagram.com/glassofwhiskey#";
	    });
		
	});