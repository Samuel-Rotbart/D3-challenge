// build SVG
var svgWidth = 1000;
var svgHeight = 600;

// frame margins
var margin = {
  top: 20,
  right: 40,
  bottom: 100,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight)
  .attr("class", "chart");

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

var chosenXaxis = "obesity";

d3.csv("assets/data/data.csv").then(function(fullData){
//grab data from CSV
    fullData.forEach(function(data){
        data.state = data.state;
        data.age = +data.age;
        data.smokes = +data.smokes;
        data.healthcare = +data.healthcare;
        data.poverty = +data.poverty;
        data.obesity = +data.obesity;
        data.income = +data.income;
    });
// scale data based on chosen x axis
    var xLinearScale = d3.scaleLinear()
        .domain([d3.min(fullData, d=> d.obesity)-.5, d3.max(fullData, d => d.obesity)])
        .range([0, width]);

    var yLinearScale = d3.scaleLinear()
        .domain([d3.min(fullData, d => d.age)-.5, d3.max(fullData, d=> d.age)])
        .range([height, 0]);


    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);


    chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

    chartGroup.append("g")
        .call(leftAxis);

// create circles on chart
    var circlesGroup = chartGroup.selectAll("circle")
        .data(fullData)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d.obesity))
        .attr("cy", d => yLinearScale(d.age))
        .attr("r", 20)
        .attr("fill", "orange")
        .attr("opacity", ".5");
    //create text for inside the circles
    var textgroup = chartGroup.selectAll('text')
        .exit()
        .data(fullData)
        .enter()
        .append('text')
        .text(function(d){
            return `${d.abbr}`
        })
        .attr("x", d => xLinearScale(d.obesity))
        .attr("y", d => yLinearScale(d.age)+5)
        .attr("text-anchor", "middle")
        .attr("font-size",10)
        .style("fill", "black")
        .on("mouseover", function(data) {toolTip.show(data);})
        .on("mouseout", function(data, index) {toolTip.hide(data);}
        );
// add tooltip
    var toolTip = d3.tip()
        .attr("class", "d3-tip")
        .html(function(d) {
        return (`${d.state}<br>Obesity: ${d.obesity}%<br>Age: ${d.age}`);
        });
    svg.call(toolTip);

    var labelsGroup = svg.append("g")
        .attr("transform", `translate(${width / 2}, ${height + 30})`);
// add labels
    var obesityLabel = labelsGroup.append("text")
        .attr("x", 80)
        .attr("y", 40)
        .attr("value", "obesity")
        .classed("active", true)
        .text("Percent with obesity");
    
    var ageLabel = labelsGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", 250)
        .attr("y", -400)
        .attr("value", "Age") 
        .classed("active", true)
        .text("Age");
      })
;