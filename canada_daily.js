var today = new Date();
var date_today = today.getFullYear()+'-'+("0" + (today.getMonth()+1)).slice(-2)+'-'+today.getDate();

//console.log(date_today);

const api_url = "https://api.coronatracker.com/v3/analytics/newcases/country?countryCode=CA&startDate=2020-01-01&endDate=" + date_today;

let data = d3.json(api_url, function(error, d) { return d; });

data.then(function(result) {
  var data = result;

  data.forEach(function(d){ 
    d.last_updated = d.last_updated.slice(0, 10);
    d.last_updated = d3.timeParse("%Y-%m-%d")(d.last_updated);
    d.new_infections = +d.new_infections;
  });

  //console.log(data);

  var svg = d3.select("svg"),
      margin = {top: 20, right: 200, bottom: 30, left: 50},
      width = +svg.attr("width") - margin.left - margin.right,
      height = +svg.attr("height") - margin.top - margin.bottom,
      g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var bisectDate = d3.bisector(function(d) { return d.last_updated; }).left;

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

  
  // Tooltip Code
  var focus = g.append("g")
        .attr("class", "focus")
        .style("display", "none");

    focus.append("line")
        .attr("class", "x-hover-line hover-line")
        .attr("y1", 0)
        .attr("y2", height);

    focus.append("line")
        .attr("class", "y-hover-line hover-line")
        .attr("x1", width)
        .attr("x2", width);

    focus.append("circle")
        .attr("r", 6);

    focus.append("text")
        .attr("x", 15)
        .attr("dy", ".31em");

    svg.append("rect")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .attr("class", "overlay")
        .attr("width", width)
        .attr("height", height)
        .on("mouseover", function() { focus.style("display", null); })
        .on("mouseout", function() { focus.style("display", "none"); })
        .on("mousemove", mousemove);

    function mousemove() {
      var x0 = x.invert(d3.mouse(this)[0]),
          i = bisectDate(data, x0, 1),
          d0 = data[i - 1],
          d1 = data[i],
          d = x0 - d0.last_updated > d1.last_updated - x0 ? d1 : d0;
      focus.attr("transform", "translate(" + x(d.last_updated) + "," + y(d.new_infections) + ")");
      focus.select("text").text(function() { return d.last_updated.toLocaleDateString('en-US') + ": " + d.new_infections; });
      focus.select(".x-hover-line").attr("y2", height - y(d.new_infections));
      focus.select(".y-hover-line").attr("x2", width + width);
    }
})