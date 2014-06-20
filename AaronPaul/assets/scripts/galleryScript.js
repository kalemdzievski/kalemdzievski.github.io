	
	$( document ).ready(function() {
		
		$("#gallery").css("width", 565);
		$("#0").css("background-color", "#0080FF");
	
		$("#gallery").jcarousel({
			wrap: 'circular',
		}).jcarouselAutoscroll({
			interval: 4000,
			target: '+=1',
			autostart: true
		});

		$('#gallery').on('jcarousel:scrollend', function(event, carousel) {
			
		    var img = $('ul li').eq(carousel.first().index()).children().prop('src');
		    var path = img.split('/');
		    var name = "assets/images/" + path[path.length-1];
		    var index = path[path.length-1][path[path.length-1].length-5];
		    var x = $("img[src$='" + name + "']");
		    var width = x.css("width");
		    $("#gallery").css("width", width);
		    $("#gallery").css("width", "+=15");
		    $(".circle").css("background-color", "#FFFFFF");
		    $("#" + index).css("background-color", "#0080FF");
		});
		
		$(".circle").hover(function () {
            	$(this).css( 'cursor', 'pointer' );
            },
            function() {
            	$(this).css( 'cursor', 'auto' );
         });
		
		$(".circle").click(function () {
			var index = $(this).attr("id");
			$('#gallery').jcarousel('scroll', index);
		    $(".circle").css("background-color", "#FFFFFF");
		    $("#" + index).css("background-color", "#0080FF");
	    });
	    
		
	});