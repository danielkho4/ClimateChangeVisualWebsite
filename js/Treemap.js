var svg1 = d3.select("#temp_map")
.append("svg")
.attr("width",600)
.attr("height", 600)

// set the dimensions and margins of the graph
var margin = {top: 20, right: 10, bottom: 10, left: 10},
  width = 600 - margin.left - margin.right,
  height = 600 - margin.top - margin.bottom;
let tooltip;
// append the svg object to the body of the page
var svg = d3.select("#tree_map")
.append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
.append("g")
  .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

// Read data
d3.csv('data/CO2_real.csv', function(data) {
    data.sort((a, b) => parseFloat(b.value)-parseFloat(a.value));
    console.log(data[2])
  // stratify the data: reformatting for d3.js
  var root = d3.stratify()
    .id(function(d) { return d.name; })   // Name of the entity (column name is name in csv)
    .parentId(function(d) { return d.parent; })   // Name of the parent (column name is parent in csv)
    (data);
  root.sum(function(d) { return +d.value })   // Compute the numeric value for each entity

  // Then d3.treemap computes the position of each element of the hierarchy
  // The coordinates are added to the root object above
  d3.treemap()
    .size([width, height])
    .padding(4)
    (root)

console.log(root.leaves())
  // use this information to add rectangles:
  svg
    .selectAll("rect")
    .data(root.leaves())
    .enter()
    .append("rect")
      .attr('x', function (d) { return d.x0; })
      .attr('y', function (d) { return d.y0; })
      .attr('width', function (d) { return d.x1 - d.x0; })
      .attr('height', function (d) { return d.y1 - d.y0; })
      //.style("stroke", "black")
      .style("fill", "#add8e6")
      .on('mouseover', function(d){
          let xPosition = margin.left + (width / 2);
          let yPosition = margin.top;

          d3.select("#tooltip")
          .style("left", xPosition + "px")
          .style("top", yPosition + "px")
          .select("#value")
          .text(d.name);
          
          d3.select(".tooltip").classed("hidden", false);
        })
        .on("mouseout", function(d) {

            //Hide the tooltip
            d3.select("#tooltip").classed("hidden", true);
        });


  // and to add the text labels
  svg
    .selectAll("text")
    .data(root.leaves())
    .enter()
    .append("text")
      .attr("x", function(d){ return d.x0+2})    // +10 to adjust position (more right)
      .attr("y", function(d){ return d.y0+20})    // +20 to adjust position (lower)
      .text(function(d){
          if (d.data.value > 800000){
              return d.data.name;}})
      .attr("font-size", "15px")
      .attr("fill", "white")

  svg.append("text") 
      .attr("x", width/4)
      .attr("y", -10)
      .attr("dy", ".35em")
      .attr("font-size", "20px")
      .attr("font-family", "Baskerville")
      .text("Carbon Emissions by Country 2016");

    svg.append("text") 
      .attr("class", "tooltip")
      .attr("x", 20)
      .attr("y", 0)
      .attr("dy", ".35em")
      .attr("font-size", "15px")
      .attr("font-family", "Baskerville")
          

})