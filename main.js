/* features:
filter based on city/state
aggregate based on month/year

COLUMN OPTIONS:
actual_mean_temp : The measured average temperature for that day
actual_min_temp : The measured minimum temperature for that day
actual_max_temp : The measured maximum temperature for that day
average_min_temp : The average minimum temperature on that day since 1880
average_max_temp : The average maximum temperature on that day since 1880
record_min_temp : The lowest ever temperature on that day since 1880
record_max_temp : The highest ever temperature on that day since 1880
record_min_temp_year : The year that the lowest ever temperature occurred
record_max_temp_year : The year that the highest ever temperature occurred
actual_precipitation : The measured amount of rain or snow for that day
average_precipitation : The average amount of rain or snow on that day since 1880
record_precipitation : The highest amount of rain or snow on that day since 1880

vis: double sided clustered bar chart
x-axis: the date
y-axis: temp (specific value can be selected by user) + can have multiple values (i.e. separate lines/points)
filter: location
should be able to compare two years side by side on the bar chart
*/

// initialize global variables
let weather;
let freqScale;
let yScale;
let csv_file;
//let minFreq;
//let maxFreq;

// Global function called when selected location is changed
function onCityChanged() {
    let catSelect = d3.select('#categorySelect').node();

    // Get current value of select element
    let city = catSelect.options[catSelect.selectedIndex].value;

    console.log(city)

    if (city = 'Los Angeles') {
        csv_file = './data/CQT.csv';
    } else if (city = 'Indianapolis') {
        csv_file = './data/IND.csv';
    } else if (city = 'Jacksonville') {
        csv_file = './data/JAX.csv';
    } else if (city = 'Chicago') {
        csv_file = './data/MDW.csv';
    } else if (city = 'Philadelphia') {
        csv_file = './data/PHL.csv';
    } else if (city = 'Phoenix') {
        csv_file = './data/PHX.csv';
    } else {
        csv_file = './data/CLT.csv';
    }

    //updateChart(city);
}

let svg = d3.select('svg');

// Get layout parameters
let svgWidth = +svg.attr('width');
let svgHeight = +svg.attr('height');

let padding = {t: 60, r: 40, b: 30, l: 40};

// Compute chart dimensions
/*let chartWidth = svgWidth - padding.l - padding.r;
let chartHeight = svgHeight - padding.t - padding.b;*/

let chartWidth = svgWidth - padding.l - padding.r;
let chartHeight = svgHeight - padding.t - padding.b;

// Compute the spacing for bar bands based on all 26 letters
/*let barBand = chartHeight / 26;
let barHeight = barBand * 0.7;*/

let barBand = chartWidth / 26;
let barWidth = barBand * 0.7;

// Create a group element for appending chart elements
let chartG = svg.append('g')
    .attr('transform', 'translate('+[padding.l, padding.t]+')');

// add a chart title
svg.append('g')
   .attr('class', 'title')
   .attr('transform', 'translate('+[chartWidth / 3 + 20, 30]+')')
   .append('text')
   .text('Weather')
   .style('font-size', '14px');

d3.csv(csv_file).then(function(dataset) {
    // Create global variables here and intialize the chart

    // initialize letters
    weather = dataset;

    console.log('test');
    console.log(weather);

    // find min and max values for actual_mean_temp (CHANGE THIS LATER TO BE FLEXIBLE ON FILTER)
    maxTemp = 0;
    minTemp = 2000;
    for (i = 0; i < weather.length; i++) {
        if (weather[i].actual_mean_temp > maxTemp) {
            maxTemp = weather[i].actual_mean_temp;
        } else if (weather[i].actual_mean_temp < minTemp) {
            minTemp = weather[i].actual_mean_temp;
        }
    }

    // set up frequency scale
    freqScale = d3.scaleLinear().domain(weather.map(d => d.date)).range([0, chartWidth]);

    // set up y scale for bars
    //yScale = d3.scaleLinear().domain([0, weather.length]).range([0, chartHeight]);
    yScale = d3.scaleBand()
        .domain([0, maxTemp])
        .range([0, chartHeight]);

    // call updateChart function
    //updateChart('all-letters', minFreq * 100, maxFreq * 100);
    updateChart(weather);
});

function updateChart(data/*filterKey, minFreq, maxFreq*/) {
    /*
    // Create a filtered array of letters based on the filterKey
    let filteredLetters = letters.filter(function(d){
        return lettersMap[filterKey].indexOf(d.letter) >= 0;
    });

    // filter data based on slider input
    let filteredData = filteredLetters.filter(function(d) {
        if (maxFreq == 12.7) {
            maxFreq = 12.8
        }
        return d.frequency * 100 >= minFreq && d.frequency * 100 <= maxFreq;
      });
    */

    // create bars for each data point (for now)
    let bars = chartG.selectAll('rect')
                     .data(data, function(d){
                        return d.actual_mean_temp;
                    })
    
    /*
    bars.enter()
        .append('rect')
        .attr('class', 'bar')
        .attr('x', 0)
        .merge(bars)
        .attr('y', function(d, i) {
            return yScale(i);
        })
        .attr('width', d => freqScale(d.actual_mean_temp))
        .attr('height', barHeight)
        .attr('fill', 'black');
    */

    bars.enter()
    .append('rect')
    .attr('class', 'bar')
    .merge(bars)
    .attr('x', 0)
    .attr('y', d => yScale(d.actual_mean_temp)) // error here
    .attr('width', barWidth)
    .attr('height', d => chartHeight - yScale(d.actual_mean_temp)) // and here
    .attr('fill', 'black');

    bars.exit().remove(); // remove unnecessary bars

    // create label for each letter
    let labels = chartG.selectAll('text')
                       .data(data, function(d) {return d.letter})
    
    
    /*
    labels.enter()
          .append('text')
          .attr("class", "label")
          .merge(labels)
          .text(d => d.letter)
          .attr("x", -barBand)
          .attr("y", function(d, i) { return yScale(i) + barHeight / 2 + 5; })
    */
    labels.enter()
    .append('text')
    .attr('class', 'label')
    .merge(labels)
    .text(d => d.letter)
    .attr('x', function(d, i) {
    return barWidth / 2;
    })
    .attr('y', d => yScale(d.actual_mean_temp))
    .attr('text-anchor', 'middle')
    .attr('dominant-baseline', 'middle');
    
    labels.exit().remove();
};