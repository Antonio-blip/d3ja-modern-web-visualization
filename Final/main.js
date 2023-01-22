
//general constants
const width = 1000
const height = 700
const margin = {
    top: 10, 
    bottom:100, 
    left:40, 
    right:10}

//margins for inner labels
const axisMargin = {
    top:60,
    bottom: 106,
    left: -20,
    right: 16
}

//groups
const svg = d3.select("div#chart").append("svg")
    .attr("width", width)
    .attr("height", height)
const elementGroup = svg.append("g")
    .attr("id", "elementGroup")
    .attr("transform", `translate(${margin.left}, ${margin.top})`)
const axisGroup = svg.append("g")
    .attr("id", "axisGroup")
const xAxisGroup = axisGroup.append("g")
    .attr("id", "xAxisGroup")
    .attr("transform", `translate(${margin.left}, ${height - margin.bottom})`)
const yAxisGroup = axisGroup.append("g")
    .attr("id", "yAxisGroup")
    .attr("transform", `translate(${margin.left}, ${margin.top})`)

//inner labels
const xAxisText = svg.append("text")
    .attr("class" ,"axisLabel")
    .attr("text-anchor", "end")
    .attr("x", width-axisMargin.right)
    .attr("y", height-axisMargin.bottom)
    .text("Country")
const yAxisText = svg.append("text")
    .attr("class" ,"axisLabel")
    .attr("text-anchor", "end")
    .attr("x", axisMargin.left)
    .attr("y", 0 + axisMargin.top)
    .attr("transform","rotate(-90)")
    .text("World cups won")

//scales
const x = d3.scaleBand().range([0, width - margin.left - margin.right]).padding(0.1)
const y = d3.scaleLinear().range([height - margin.bottom - margin.top, 0])

const xAxis = d3.axisBottom().scale(x)
const yAxis = d3.axisLeft().scale(y)

//data binding

d3.csv("worldCup.csv").then(data => {
    console.log(data)

    let nest = d3.nest()
        .key(d => d.Winner)
        .entries(data)
    console.log(nest)

    //domains
    x.domain(nest.map(d => d.key))
    y.domain([0, d3.max(nest.map(d => d.values.length))])

    yAxis.ticks(y.domain()[1])
    xAxisGroup.call(xAxis)
    yAxisGroup.call(yAxis)

    //place holder
    let elements = elementGroup.selectAll("rect").data(nest)
    elements.enter().append("rect")
        .attr("class", d => d.key)
        .attr("class", "bar")
        .attr("x", d => x(d.key))
        .attr("width", x.bandwidth())
        .attr("height", d => height - margin.top - margin.bottom - y(d.values.length))
        .attr("y", d => y(d.values.length))
})