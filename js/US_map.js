export default function create_US_map(){
	var svg3 = d3.select("#canvas")
	.append("svg")
	.attr("height", 700)
	.attr("width", 700);
	
	var lengend = d3.selectAll("#lengend")
	.append("svg")
	.attr("height", 60)
	.attr("width", 200);
	
	var colors = ["#4373B6", "#ACD5EA", "#FFFFFF", "#FFAF5A", "#E9462A"];
	var colorScale = d3.scale.quantile()
	.domain([-2, 5, 2])
	.range(colors);
	
	lengend.selectAll("circle")
	.data(colors)
	.enter()
	.append("circle")
	.attr("cx", function(d,i) {
		return 20 + 35*i;
	})
	.attr("cy", 23)
	.attr("r", function(d,i) {
		if (i == 0 || i == 4)  return 12;
		else if (i == 1 || i ==3)  return 8;
		else  return 4;
	})
	.attr("fill", function(d,i) {
		return colors[i];
	})
	.attr("stroke", "black")
	.attr("stroke-width", 0.4);
	
	lengend.selectAll("text")
	.data(["-2°C", "-1°C", "0°C", "+1°C", "+2°C"])
	.enter()
	.append("text")
	.attr("x", function(d,i) {
		return 20 + 35*i;
	})
	.attr("y", 48)
	.style("font-size", 8)
	.style("stroke", "black")
	.style("stroke-width", 0.3)
	.style("text-anchor", "middle")
	.text(function(d) { return d; })
	
	var projection = d3.geo.mercator()
	.center([-83, 38])
	.scale(600);
	var path = d3.geo.path().projection(projection);
	
	
	var initial = 0;
	var repeat = function() {
		if (initial > 123)  initial = 0;
	
		document.getElementById('year').innerHTML = initial + 1895;
	
		svg3.selectAll(".circle")
		.each(function(d) {
			d3.select(this)
			.transition()
			.duration(40)
			.attr("r", function() {
				if (d[initial+1895]) {
					if (Math.abs(parseFloat(d[initial+1895])) == 0)  return 4;
					else if (Math.abs(parseFloat(d[initial+1895])) < 1)  return 8;
					else  return 12;
				}
				else {
					return 4;
				}
			})
			.attr("fill", function() {
				if (d[initial+1895]) {
					if (parseFloat(d[initial+1895]) <= -1)  return colors[0];
					else if (parseFloat(d[initial+1895]) > -1 && parseFloat(d[initial+1895]) < 0)  return colors[1];
					else if (parseFloat(d[initial+1895]) == 0)  return colors[2];
					else if (parseFloat(d[initial+1895]) > 0 && parseFloat(d[initial+1895]) < 1)  return colors[3];
					else if (parseFloat(d[initial+1895]) >= 1)  return colors[4];
				}
				else {
					return "#eee";
				}
			});
		})
		
		initial++;
	}
	
	d3.csv("all.csv", function(error, data) {
		//console.log(data);
	
		d3.json("states.json", function(error, states) {
			//console.log(states);
	
			svg3.selectAll("circle")
			.data(states.features)
			.enter()
			.append("circle")
			.attr("class", "circle")
			.attr("transform", function(d) {
				if (d.properties.name == "Alaska") {
					return "translate(50, 120)"
				}
				else if (d.properties.name == "Rhode Island") {
					return "translate(615, 200)"
				}
				else if (d.properties.name == "Massachusetts") {
					return "translate(610, 175)"
				}
				else if (d.properties.name == "New Hampshire") {
					return "translate(615, 145)"
				}
				else if (d.properties.name == "Delaware") {
					return "translate(570, 250)"
				}
				else if (d.properties.name == "Maine") {
					return "translate(640, 130)"
				}
				else {
					return "translate(" + path.centroid(d) + ")"; 
				}
					
			})
			.attr("r", 12)
			.attr("fill", "white")
			.style("stroke", "black")
			.attr("stroke-width", 0.5)
			.style("opacity", 0.8)
			.each(function(d, i) {
				console.log(i, d.properties.name);
				for (var i = 0; i < data.length; i++) {
					if (data[i].state == d.properties.name) {
						d3.select(this).datum(data[i]);
					}
				}
			})
			.on("click", function(d, i) {
				console.log(d);
			});
	
			svg3.selectAll("text")
			.data(states.features)
			.enter()
			.append("text")
			.attr("transform", function(d) {
				if (d.properties.name == "Alaska") {
					return "translate(50, 120)"
				}
				else if (d.properties.name == "Rhode Island") {
					return "translate(615, 200)"
				}
				else if (d.properties.name == "Massachusetts") {
					return "translate(610, 175)"
				}
				else if (d.properties.name == "New Hampshire") {
					return "translate(615, 145)"
				}
				else if (d.properties.name == "Delaware") {
					return "translate(570, 250)"
				}
				else if (d.properties.name == "Maine") {
					return "translate(640, 130)"
				}
				else {
					return "translate(" + path.centroid(d) + ")"; 
				}
					
			})
			.text(function(d) {
				return d.properties.name;
			})
			.style("font-family", "Arial")
			.style("font-size", 8)
			.style("text-anchor", "middle")
			.style("stroke", "black")
			.style("stroke-width", 0.2);
	
			var hehe = window.setInterval(repeat,100);
			document.getElementById('pei').onclick = function() {
				window.clearInterval(hehe);
			}
			
		});
    });
}