window.onload = function () {

	var chart1 = new CanvasJS.Chart("chartContainer1",
    {
      title:{
        text: "Top Oil Reserves"    
      },
      axisY: {
        title: "Reserves(MMbbl)"
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
        legendText: "MMbbl = one million barrels",
        dataPoints: [      
        {y: 297571, label: "Venezuela"},
        {y: 267017,  label: "Saudi" },
        {y: 175200,  label: "Canada"},
        {y: 154580,  label: "Iran"},
        {y: 116000,  label: "Russia"},
        {y: 97800, label: "UAE"},
        {y: 20682,  label: "US"},        
        {y: 20350,  label: "China"}        
        ]
      }   
      ]
    });

    chart1.render();
	
	var chart2 = new CanvasJS.Chart("chartContainer2",
	{
		title:{
			text: "US Mobile / Tablet OS Market Share, Dec 2012"
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
			
			dataPoints: [
			{  y: 67.34, label: "iOS {y}%" },
			{  y: 28.6, label: "Android {y}%" },
			{  y: 1.78, label: "Kindle {y}%" },
			{  y: 0.84,  label: "Symbian {y}%"},
			{  y: 0.74, label: "BlackBerry {y}%" },
			{  y: 2.06,  label: "Others {y}%"}

			]
		}
		]
	});
	
	chart2.render();
	
	var chart3 = new CanvasJS.Chart("chartContainer3",
	{
		title:{
			text: "Top Categoires of New Year's Resolution"
		},
		exportFileName: "Pie Chart",
		exportEnabled: true,
		legend:{
			verticalAlign: "bottom",
			horizontalAlign: "center"
		},
		data: [
		{       
			type: "pie",
			showInLegend: true,
			toolTipContent: "{legendText}: <strong>{y}%</strong>",
			indexLabel: "{label} {y}%",
			dataPoints: [
				{  y: 35, legendText: "Health", exploded: true, label: "Health" },
				{  y: 20, legendText: "Finance", label: "Finance" },
				{  y: 18, legendText: "Career", label: "Career" },
				{  y: 15, legendText: "Education", label: "Education"},
				{  y: 5, legendText: "Family", label: "Family" },
				{  y: 7, legendText: "Real Estate", label: "Real Estate"}
			]
	}
	]
	});
	
	chart3.render();
	
	var chart4 = new CanvasJS.Chart("chartContainer4", {
            title: {
                text: "Mobile Phones Used For",
                fontFamily: "Verdana",
                fontColor: "Peru",
                fontSize: 28

            },
            axisY: {
                tickThickness: 0,
                lineThickness: 0,
                valueFormatString: " ",
                gridThickness: 0                    
            },
            axisX: {
                tickThickness: 0,
                lineThickness: 0,
                labelFontSize: 18,
                labelFontColor: "Peru"

            },
            data: [
            {
                indexLabelFontSize: 26,
                toolTipContent: "<span style='\"'color: {color};'\"'><strong>{indexLabel}</strong></span><span style='\"'font-size: 20px; color:peru '\"'><strong>{y}</strong></span>",

                indexLabelPlacement: "inside",
                indexLabelFontColor: "white",
                indexLabelFontWeight: 600,
                indexLabelFontFamily: "Verdana",
                color: "#62C9C3",
                type: "bar",
                dataPoints: [
                    { y: 21, label: "21%", indexLabel: "Video" },
                    { y: 25, label: "25%", indexLabel: "Dining" },
                    { y: 33, label: "33%", indexLabel: "Entertainment" },
                    { y: 36, label: "36%", indexLabel: "News" },
                    { y: 42, label: "42%", indexLabel: "Music" },
                    { y: 49, label: "49%", indexLabel: "Social Networking" },
                    { y: 50, label: "50%", indexLabel: "Maps/ Search" },
                    { y: 55, label: "55%", indexLabel: "Weather" },
                    { y: 61, label: "61%", indexLabel: "Games" }


                ]
            }
            ]
        });

        chart4.render();
}