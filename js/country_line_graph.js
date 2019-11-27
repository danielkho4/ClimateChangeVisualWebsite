export default function createTreemap(){

    // set the dimensions and margins of the graph
    var margin = {top: 20, right: 10, bottom: 20, left: 10},
      width = 600 - margin.left - margin.right,
      height = 600 - margin.top - margin.bottom;
      // var tooltip = d3.select("#tree_map")
      // .append("text")
      // .style("position", "absolute")
      // .attr("y", 600)
      // //.style("right", "0px")
      // //.style("z-index", "100000")
      // .style("visibility", "hidden")
      

    
    var colorScale = d3.scale.linear()
      .range(['lightcyan', 'darkturquoise']) // or use hex values
      .domain([0, 3000000]);
    // append the svg object to the body of the page
    var svg = d3.select("#tree_map")
    .append("svg")
      .attr("class", "svg_tree")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");
    d3.csv('data/CO2_data_years.csv', function(data) {
        data = data.filter(a => a.Year == "2016")
        data.sort((a, b) => parseFloat(b.value)-parseFloat(a.value));
        console.log(data)
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
          .attr("class", "rect_tree")
          .attr('x', function (d) { return d.x0; })
          .attr('y', function (d) { return d.y0; })
          .attr('width', function (d) { return d.x1 - d.x0; })
          .attr('height', function (d) { return d.y1 - d.y0; })
          .style("fill", function(d) { return colorScale(d.value)})
          //.style("stroke", "black")
          //.style("fill", "#add8e6")
          .on('mouseover', function(d){
            tooltip.style("visibility", "visible")
            .text(d.data.name + " had emmisions of " + d.data.value + " moles of Co2 in 2016")
            d3.select(this)
              .transition(50)
              .style("opacity", 1)
              .style("fill", "darkcyan")
              .style("stroke", "#3f3f3f")
              .style("stroke-width", 0.5);
            })
            .on("mouseout", function(d) {
                tooltip.style("visibility", "hidden")
                d3.select(this)
                .transition(50)
                .style("fill", function(d){return colorScale(d.value)})
                .style("stroke", "white")           
            })
            .on("click", function(d){
              d3.select(this)
              d3.selectAll('.rect_tree').remove();
              d3.selectAll(".svg_tree").remove();
              d3.selectAll('text').remove();
              line_graph_country(d.data.name)
            })
            ;
    
    
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
          .attr ("font-family", "Kulim Park, sans-serif")
          .attr("font-size", "15px")
          .attr("fill", "white")
      var tooltip = svg.append("text")
          .style("visibility", "hidden")
          .attr("x", 0)
          .attr("y", height+10)
      svg.append("text") 
          .attr("x", width/4)
          .attr("y", -10)
          .attr("dy", ".35em")
          .attr("font-size", "20px")
          .attr ("font-family", "Kulim Park, sans-serif")
          .text("Carbon Emissions by Country 2016");
    
    })
    
    }

function line_graph_country(name){
console.log(name);
var margin = {top: 50, right: 30, bottom: 50, left: 100},
    width = 550 - margin.left - margin.right,
    height = 460 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#tree_map")
  .append("svg")
  .attr("class","bar_svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");
//Read the data
d3.csv("data/CO2_data_years.csv",
  // Now I can use this dataset:
  function(data) {
    data = data.filter(a => a.name ==name)

     var x = d3.scaleTime()
       .domain(d3.extent(data, function(d) { return d.Year; }))
       .range([ 0, width ])
    //   //.ticks(d3.timeYear.every(5))
      //.attr("width", x.bandwidth());
    svg.append("g")

      .attr("transform", "translate(0," + height  + ")")
      .attr("class", "axis")
     // .attr("width", x.bandwidth())
      .call(d3.axisBottom(x).tickFormat(d3.format('.0f')).ticks(5))
      

    // Add Y axis
    var y = d3.scaleLinear()
      .domain([0, d3.max(data, function(d) { return +d.value; })])
      .range([ height, 0 ])
    svg.append("g")
        .attr("class", "axis")
      .call(d3.axisLeft(y));
    svg.on("click", function(d){
        d3.selectAll('.bar_svg').remove();
        createTreemap()
      });
    svg.append("text")
      .text(name + " Co2 Emissions 1990-2016")
      .attr("x", (width)/2-200)
      .attr("y", -10)
      .attr ("font-family", "Kulim Park, sans-serif")
      .attr("font-size", "15px");

    // Add the line
    svg.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 3)
      .attr("d", d3.line()
        .x(function(d) { return x(d.Year) })
        .y(function(d) { return y(d.value) })
        );
        svg.append('svg:image')
        .attr("xlink:href", function() {return "images/Back_arrow.svg"})
        .attr('width', "50")
        .attr('height', "50")
        .attr("x", -60)
        .attr("y", -50)
    
})
};