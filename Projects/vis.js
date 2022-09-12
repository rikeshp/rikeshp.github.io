<script src="https://d3js.org/d3.v4.js"></script>
<script src="https://d3js.org/d3-scale-chromatic.v1.min.js"></script>

<script>
// set the dimensions and margins of the graph
var margin = {position: "fixed", top: 40, left: 70, right: 10, bottom: 50}, width = 700, height = 500;
// append the svg object to the body of the page
var svg = d3.select("#my_dataviz")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");
// Parse the Data
d3.csv("https://raw.githubusercontent.com/rikeshp/data_sources_for_projects/master/yearly_background_check_data.csv", function(data) {
  // List of groups = header of the csv files
  var keys = data.columns.slice(1)
  // Add X axis
  var x = d3.scaleLinear()
    .domain(d3.extent(data, function(d) { return d.year; }))
    .range([ 0, width ]);
  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x).ticks(5));
  // Add X axis label:
  svg.append("text")
      .attr("text-anchor", "end")
      .attr("x", width)
      .attr("y", height-22 )
	  .style("font-family", "Arial")
	  .style("font-size", 12)
      .text("Time (year)");
  // Add Y axis
  var y = d3.scaleLinear()
    .domain([-10000000, 10000000])
    .range([ height, 0 ]);
  svg.append("g")
    .call(d3.axisLeft(y));
  // Add Y axis label:
  svg.append("text")
      .attr("text-anchor", "end")
      .attr("x", 140)
      .attr("y", 10)
	  .style("font-family", "Arial")
	  .style("font-size", 12)
      .text("# of Checks Conducted");
  // color palette
  var color = d3.scaleOrdinal()
    .domain(keys)
    .range(["#3E6680", "#81DA87"]);
  //stack the data?
  var stackedData = d3.stack()
    .offset(d3.stackOffsetSilhouette)
    .keys(keys)
    (data)
  // create a tooltip
  var Tooltip = svg
    .append("text")
    .attr("x", 100)
    .attr("y", 100)
    .style("opacity", 0)
    .style("font-size", 18)
	.style("font-family", "Arial")
	.style("font-style", "italic")

  // Three function that change the tooltip when user hover / move / leave a cell
  var mouseover = function(d) {
    Tooltip.style("opacity", .7)
    d3.selectAll(".myArea").style("opacity", .2)
    d3.select(this)
      .style("stroke", "black")
      .style("opacity", 1)
  }
  var mousemove = function(d,i) {
    grp = keys[i]
    Tooltip.text(grp)

  }
  var mouseleave = function(d) {
    Tooltip.style("opacity", 0)
    d3.selectAll(".myArea").style("opacity", 1).style("stroke", "none")
   }
  // Area generator
  var area = d3.area()
    .x(function(d) { return x(d.data.year); })
    .y0(function(d) { return y(d[0]); })
    .y1(function(d) { return y(d[1]); })
  // Show the areas
  svg
    .selectAll("mylayers")
    .data(stackedData)
    .enter()
    .append("path")
      .attr("class", "myArea")
      .style("fill", function(d) { return color(d.key); })
      .attr("d", area)
      .on("mouseover", mouseover)
      .on("mousemove", mousemove)
      .on("mouseleave", mouseleave)
})
</script>
