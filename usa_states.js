const width = 1600;
const height = 800;
const margin = { top: 50, bottom: 50, left: 50, right: 50 };

const usa_states = 56;

const svg = d3.select('#d3-container')
  .append('svg')
  .attr('height', height - margin.top - margin.bottom)
  .attr('width', width - margin.left - margin.right)
  .attr('viewBox', [0, 0, width, height]);

const x = d3.scaleBand()
  .domain(d3.range(usa_states))
  .range([margin.left, width - margin.right])
  .padding(0.1);

const y = d3.scaleLinear()
  .domain([0, 800000])
  .range([height - margin.bottom, margin.top]);

let data = d3.json("https://covidtracking.com/api/v1/states/current.json", function(error, d) { return d; });

data.then(function(result) {
  console.log(result);

  svg
    .append("g")
    .attr('fill', 'royalblue')
    .selectAll('rect')
    .data(result)
    .join('rect')
      .attr('x', (d, i) => x(i))
      .attr('y', (d) => y(d.positive))
      .attr('height', d => y(0) - y(d.positive))
      .attr('width', x.bandwidth())
      .attr('class', 'rectangle');

  function xAxis(g) {
    g.attr('transform', `translate(0, ${height - margin.bottom})`)
      .call(d3.axisBottom(x).tickFormat(i => result[i].state))
      .attr('font-size', '12px');
  }

  function yAxis(g) {
    g.attr('transform', `translate(${margin.left}, 0)`)
      .call(d3.axisLeft(y).ticks(null, result.format))
      .attr('font-size', '20px');
  }

  svg.append('g').call(xAxis);
  svg.append('g').call(yAxis);

  svg.node();
})