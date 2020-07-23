const api_key = '61336cd6-47ff-4494-a02c-7fd5aa7c795e';

const api_url = "https://api.coronatracker.com/v3/analytics/newcases/country?countryCode=CA&startDate=2020-01-01&endDate=2020-07-20";

let data = d3.json(api_url, function(error, d) { return d; });

data.then(function(result) {
  console.log(result);

  var data = result;

  data.forEach(function(d){ 
    d.last_updated = d.last_updated.slice(0, 10);
    d.last_updated = d3.timeParse("%Y-%m-%d")(d.last_updated);
  });

  // if (error) throw error;

  var svg = d3.select("svg"),
      margin = {top: 20, right: 20, bottom: 30, left: 50},
      width = +svg.attr("width") - margin.left - margin.right,
      height = +svg.attr("height") - margin.top - margin.bottom,
      g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var x = d3.scaleTime()
      .rangeRound([0, width]);

  var y = d3.scaleLinear()
      .rangeRound([height, 0]);

  var line = d3.line()
      .x(function(d) { return x(d.last_updated); })
      .y(function(d) { return y(d.new_infections); });
      
  x.domain(d3.extent(data, function(d) { 
    //console.log(d.last_updated);
    return d.last_updated;
  }));

  y.domain(d3.extent(data, function(d) {
    //console.log(d.new_infections);
    return d.new_infections;
  }));

  g.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x))
    .select(".domain");

  g.append("g")
      .call(d3.axisLeft(y))
    .append("text")
      .attr("fill", "#000")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", "0.71em")
      .attr("text-anchor", "end")
      .text("New Cases");

  g.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
      .attr("stroke-width", 1.5)
      .attr("d", line);
})