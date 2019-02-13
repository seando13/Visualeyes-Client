let marginPop = {top: 10, right: 150, bottom: 50, left: 100};
let widthPop = 800 - marginPop.left - marginPop.right;
let heightPop = 800 - marginPop.top - marginPop.bottom;
let filteredDataPop;
let nestedDataPop;
let countryPop = 'all';

let svgPop = d3.select('#chart-area-4')
  .append('svg')
  .attr('width', widthPop + marginPop.left + marginPop.right)
  .attr('height', heightPop + marginPop.top + marginPop.bottom)
  //.style('background-color', 'pink')

let gPop = svgPop.append('g')
  .attr('transform', 'translate(' + marginPop.left + ', ' + marginPop.top + ')')
  .attr('class', 'g-parent')

//////////// Scales ////////////
let xPop = d3.scaleLinear()
  .range([0, widthPop])
  .domain([1960, 2017])

let yPop = d3.scaleLinear()
  .range([heightPop, 0])
  .domain([0, 1500000000])

let xAxisCallPop = d3.axisBottom()
  .ticks(15)
  // .tickFormat(function(d) {
  //   return +d
  // })

  let yAxisCallPop = d3.axisLeft()
    .ticks(15)


let linePop = d3.line()
  .x(function(d) { return x(d.Year); })
  .y(function(d) { return y(+d['Total Population']);})

//////////// IMPORT CSV ////////////
d3.csv("../resources/alldata_flat.csv").then(function(data) {
  data.forEach(function(d) {
    d.Year = +d.Year;
    //d['Total Population'] = +d['Total Population'];
    d.Total_Population = +d.Total_Population.split(',').join('');
  });

  filteredDataPop = data.filter(function(d) {
    if (d.Year !== 2018) {
      console.log(d);
      return d;
    }
  });

  // Nesteed data by country
  nestedDataPop = d3.nest()
    .key(function(d) {
      return d.Country;
    })
     .entries(filteredDataPop)

//////////// Initialise Tooltip ////////////
const tip = d3.tip()
      .attr('class', 'd3-tip')
      .html(function(d) {
        // console.log(d);
        let text = "<strong>Country</strong>: " + d.key + "<br />";
        text += "<strong>Year</strong>: " + this.Year + "<br />";
        text += "<strong>Total Population</strong>: " + d['Total Population'] + "<br />";
        return text;
      })
    svg.call(tip);

let xAxis = g.append('g')
      .attr('class', 'x axis')
      .attr('transform', 'translate(0,' + height + ')')
      .call(xAxisCall.scale(x))

    let yAxis = g.append('g')
      .attr('class', 'y axis')
      .call(yAxisCall.scale(y))

    // Y Axis Label
    yAxis.append('text')
      .attr('class', 'axis-title')
      .attr('transform', 'rotate(-90)')
      .attr('y', 6)
      .attr('dy', '.71em')
      .attr('fill', 'white')
      .attr('font-family', 'Raleway')
      .style('text-anchor', 'end')

    // X Axis Label
    gPop.append('text')
      .attr('class', 'axis-label')
      .attr('x', width / 2)
      .attr('y', '400')
      .attr('fill', 'white')
      .attr('font-family', 'Raleway')
      .attr('font-size', '18px')
      .attr('text-anchor', 'middle')

    let linesPop = g.selectAll('.line')
      .data(nestedDataPop)
      .enter()
        .append('path')
        .attr('stroke', 'black')
        .attr('stroke-width', '2px')
        .attr('class', 'line')
        .attr('fill', 'none')
          .on('mouseover', tip.show)
          .on('mouseout', tip.hide)
          .attr('d', function(d) {
            return line(d.values)
          });

    function update(data) {
      country = $('#country-select').val();
      console.log(country);

      let updatedDataPop = data.filter(function(d) {
        if (country === 'all') {
          return true;
        } else {
          return d.Country === country;
        }
      });

      updatedDataPop = updatedDataPop.filter(function(d) {
        if (d.Year !== 2018) {
          return d;
        }
      });
      console.log(updatedDataPop);

      gPop.selectAll('.line')
        .remove();

      gPop.selectAll('.line')
        .data(function() {
          if (country === 'all') {
            return nestedDataPop;
          } else {
            return [updatedDataPop];
          }
        })
        .enter()
          .append('path')
          .attr('class', 'line')
          .attr('fill', 'none')
          .attr('d', function(d) {
            if (country === 'all') {
              return line(d.values);
            } else {
              return line(d);
            }
          });
    }
});