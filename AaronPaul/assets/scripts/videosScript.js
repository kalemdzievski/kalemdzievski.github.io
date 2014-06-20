	
	$( document ).ready(function() {
		
		$(".vthumb").hover(function () {
            	$(this).css( 'cursor', 'pointer' );
            },
            function() {
            	$(this).css( 'cursor', 'auto' );
         });
		
		$(".vthumb").click(function () {
	    	var code = $(this).attr("name");
	    	var src = "https://www.youtube.com/embed/" + code;
	    	$("#ytplayer").attr("src", src);
	   }); 
		
	});