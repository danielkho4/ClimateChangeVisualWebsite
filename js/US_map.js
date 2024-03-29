export default function create_US_map(){
	var svg3 = d3.select("#canvas")
.append("svg")
.attr("height", 500)
.attr("width", 800);

var lengend = d3.selectAll("#lengend")
.append("svg")
.attr("height", 90)
.attr("width", 300);

var colors = ["#4373B6", "#ACD5EA", "#FFFFFF", "#FFAF5A", "#E9462A"];
var colorScale = d3.scale.quantile()
.domain([-2, 5, 2])
.range(colors);

lengend.selectAll("circle")
.data(colors)
.enter()
.append("circle")
.attr("cx", function(d,i) {
    return 48 + 50*i;
})
.attr("cy", 40)
.attr("r", function(d,i) {
    if (i == 0 || i == 4)  return 24;
    else if (i == 1 || i ==3)  return 16;
    else  return 12;
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
    return 48 + 50*i;
})
.attr("y", 88)
.style("font-size", 10)
.style("stroke", "black")
.style("stroke-width", 0.3)
.style("text-anchor", "middle")
.text(function(d) { return d; })

var projection = d3.geo.mercator()
.center([-90, 36])
.scale(750);
var path = d3.geo.path().projection(projection);


var initial = 0;
var repeat = function() {
    console.log("initial is: ", initial)
    if (initial > 123)  initial = 0;
    document.getElementById('year').innerHTML = initial + 1895;
    
    svg3.selectAll(".circle")
    .each(function(d) {
        d3.select(this)
        .transition()
        .duration(40)
        .attr("r", function() {
            if (d[initial+1895]) {
                if (Math.abs(parseFloat(d[initial+1895])) == 0)  return 10;
                else if (Math.abs(parseFloat(d[initial+1895])) < 1.5)  return 16;
                else  return 30;
            }
            else {
                return 8;
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
            if (d.properties.name == "Vermont") {
                return "translate(1262, 230)"
            }
            else if (d.properties.name == "Rhode Island") {
                return "translate(1290, 325)"
            }
            else if (d.properties.name == "Connecticut") {
                return "translate(1255, 325)"
            }
            else if (d.properties.name == "Delaware") {
                return "translate(1210, 400)"
            }
            else if (d.properties.name == "Alaska") {
                return "translate(160, 31)"
            }
            else {
                return "translate(" + path.centroid(d) + ")"; 
            }
                
        })
        .attr("r", 12)
        .attr("fill", "white")
        .style("opacity", 0.8)
        .each(function(d, i) {
            console.log(i, d.properties.name);
            for (var i = 0; i < data.length; i++) {
                if (data[i].state == d.properties.name) {
                    d3.select(this).datum(data[i]);
                }
            }
        })
        .on('mouseenter', function(d){
            return tooltip.style("visibility", "visible").text(d.Country + ":" + d.Deathrate);
        })
        .on('mousemove', function(d){
            return tooltip.style("top", (d3.event.pageY-10)+"px").style("left", (d3.event.pageX+10)+"px").text(d.state + " had a value of " + d[1894+initial] +"°C in " + (1894+parseInt(initial)));
                   
        })
        .on('mouseleave', function(d){
            return tooltip.style("visibility", "hidden");
        })
        var tooltip = d3.select("body").append("div")  
            .style("position", "absolute")
            .style("font-family",  "sans-serif")
            .style("font-size", "15px")
            .style("color", "black")
            .style("z-index", "10")
            .style("visibility", "hidden")
            .style("background", "white")
            .style("opacity", "0.8");
        /* .on("click", function(d, i) {
            console.log(d)
            console.log(d.state)
             tooltip.style("visibility", "visible")
             .text(d.state + " had a value of " + d[1894+initial] +"°C in " + (1894+parseInt(initial)))

        });
        var tooltip = svg3.append("text")
        .attr("class", "tooltip")
        .style("visibility", "hidden")
        .attr("x", 100)
        .attr("y", 380)
 */
        svg3.selectAll("text")
        .data(states.features)
        .enter()
        .append("text")
        .attr("transform", function(d) {
            if (d.properties.name == "Vermont") {
                return "translate(1262, 230)"
            }
            else if (d.properties.name == "Rhode Island") {
                return "translate(1290, 325)"
            }
            else if (d.properties.name == "Connecticut") {
                return "translate(1255, 325)"
            }
            else if (d.properties.name == "Delaware") {
                return "translate(1210, 400)"
            }
            else if (d.properties.name == "Alaska") {
                return "translate(160, 31)"
            }
            else {
                return "translate(" + path.centroid(d) + ")"; 
            }
                
        })
        .text(function(d) {
            return d.properties.name;
        })
        .style("font-family", "Arial")
        .style("font-size", 10)
        .style("text-anchor", "middle")
        .style("stroke", "black")
        .style("stroke-width", 0.2);

        var change = window.setInterval(repeat,300);
        document.getElementById('btn').onclick = function() {
            if (this.value == "false") {
                change = window.setInterval(repeat,250);
                document.getElementById('btn').innerHTML = "Stop";
                this.value = "true";
            }
            else if (this.value == "true") {
                window.clearInterval(change);
                document.getElementById('btn').innerHTML = "Continue";
                this.value = "false";
            }
            console.log(this.value);
        }

        document.getElementById('slider').onchange = function() {
            //change = window.setInterval(repeat,250);
            //window.clearInterval(change);
            //change = window.setInterval(repeat,250);
            initial = document.getElementById('slider').value-1895
            repeat()
            window.clearInterval(change);
            document.getElementById('year').innerHTML = initial + 1895-1;
            document.getElementById('btn').innerHTML = "Continue";
            document.getElementById('btn').value = "false";
            console.log(initial)
            
    }
            
        
        
        
        
    });
});

}

