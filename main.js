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
filter: location, what columns to show
should be able to compare two years side by side on the bar chart

COMMAND TO START LOCAL PYTHON SERVER: python -m http.server 8080
*/

// initialize global variables
let weather;
let freqScale;
let yScale;
let city = 'Charlotte';
let tempCol1 = 'actual_mean_temp';
let tempCol2 = 'actual_min_temp';
let precCol1 = 'actual_precipitation';
let precCol2 = 'average_precipitation';
let year = "2014";
//let minFreq;
//let maxFreq;

// Global function called when selected location is changed
function onCityChanged() {
    let catSelect = d3.select('#citySelect').node();

    // Get current value of select element
    city = catSelect.options[catSelect.selectedIndex].value;

    updateChart(city, tempCol1, tempCol2, precCol1, precCol2, year);
}

function onCol1Changed() {
    let catSelect = d3.select('#col1Select').node();

    // Get current value of select element
    tempCol1 = catSelect.options[catSelect.selectedIndex].value;

    updateChart(city, tempCol1, tempCol2, precCol1, precCol2, year);
}

function onCol2Changed() {
    let catSelect = d3.select('#col2Select').node();

    // Get current value of select element
    tempCol2 = catSelect.options[catSelect.selectedIndex].value;

    updateChart(city, tempCol1, tempCol2, precCol1, precCol2, year);
}

function onPrec1Changed() {
    let catSelect = d3.select('#prec1Select').node();

    // Get current value of select element
    precCol1 = catSelect.options[catSelect.selectedIndex].value;

    updateChart(city, tempCol1, tempCol2, precCol1, precCol2, year);
}

function onPrec2Changed() {
    let catSelect = d3.select('#prec2Select').node();

    // Get current value of select element
    precCol2 = catSelect.options[catSelect.selectedIndex].value;

    updateChart(city, tempCol1, tempCol2, precCol1, precCol2, year);
}

function onYearChanged() {
    let catSelect = d3.select('#yearSelect').node();

    // Get current value of select element
    year = catSelect.options[catSelect.selectedIndex].value;
    console.log(year);

    updateChart(city, tempCol1, tempCol2, precCol1, precCol2, year);
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

d3.csv('./DataProcessing/final.csv').then(function(dataset) {
    // Create global variables here and intialize the chart

    // initialize letters
    weather = dataset;

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
    yScale = d3.scaleLinear()
        .domain([0, maxTemp])
        .range([0, chartHeight]);

    // call updateChart function
    //updateChart('all-letters', minFreq * 100, maxFreq * 100);
    updateChart(city, tempCol1, tempCol2, precCol1, precCol2, year);
});

function updateChart(selected_city, tempColumn1, tempColumn2, precColumn1, precColumn2, selected_year) {
    // Create a filtered array of letters based on the filterKey
    let filteredData = weather.filter(item => item.city === selected_city);
    filteredData = filteredData.filter(item => item.year === selected_year);

    console.log(filteredData);

    // create bars for each data point (for now)
    let bars = chartG.selectAll('rect')
                     .data(filteredData, function(d){
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
        .attr('y', d => yScale(d.actual_mean_temp))
        .attr('width', barWidth)
        .attr('height', d => chartHeight - yScale(d.actual_mean_temp))
        .attr('fill', 'black');

    bars.exit().remove(); // remove unnecessary bars

    // create label for each letter
    let labels = chartG.selectAll('text')
                       .data(filteredData, function(d) {
                        return d.month_name;
                    })
    
    
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