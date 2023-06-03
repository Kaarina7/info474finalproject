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

// Global function called when selected location is changed
function onCityChanged() {
    let catSelect = d3.select('#citySelect').node();

    city = catSelect.options[catSelect.selectedIndex].value;

    updateChart(city, tempCol1, tempCol2, precCol1, precCol2, year);
}

function onCol1Changed() {
    let catSelect = d3.select('#col1Select').node();

    tempCol1 = catSelect.options[catSelect.selectedIndex].value;

    updateChart(city, tempCol1, tempCol2, precCol1, precCol2, year);
}

function onCol2Changed() {
    let catSelect = d3.select('#col2Select').node();

    tempCol2 = catSelect.options[catSelect.selectedIndex].value;

    updateChart(city, tempCol1, tempCol2, precCol1, precCol2, year);
}

function onPrec1Changed() {
    let catSelect = d3.select('#prec1Select').node();

    precCol1 = catSelect.options[catSelect.selectedIndex].value;

    updateChart(city, tempCol1, tempCol2, precCol1, precCol2, year);
}

function onPrec2Changed() {
    let catSelect = d3.select('#prec2Select').node();

    precCol2 = catSelect.options[catSelect.selectedIndex].value;

    updateChart(city, tempCol1, tempCol2, precCol1, precCol2, year);
}

function onYearChanged() {
    let catSelect = d3.select('#yearSelect').node();

    year = catSelect.options[catSelect.selectedIndex].value;

    updateChart(city, tempCol1, tempCol2, precCol1, precCol2, year);
}

let svg = d3.select('svg');

// Get layout parameters
let svgWidth = +svg.attr('width');
let svgHeight = +svg.attr('height');

let padding = {t: 60, r: 40, b: 30, l: 40};

let chartWidth = svgWidth - padding.l - padding.r;
let chartHeight = svgHeight - padding.t - padding.b;

let barBand = chartWidth / 26;
let barWidth = barBand * 0.7;

// Create a group element for appending chart elements
let chartG = svg.append('g')
    .attr('transform', 'translate('+[padding.l, padding.t]+')');

d3.csv('./DataProcessing/final.csv').then(function(dataset) {

    // initialize weather
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
    yScale = d3.scaleLinear()
        .domain([0, maxTemp])
        .range([0, chartHeight]);

    // call updateChart function
    updateChart(city, tempCol1, tempCol2, precCol1, precCol2, year);
});

function updateChart(selected_city, tempColumn1, tempColumn2, precColumn1, precColumn2, selected_year) {
    // Create a filtered array of letters based on the filterKey
    let filteredData = weather.filter(item => item.city === selected_city);
    filteredData = filteredData.filter(item => item.year === selected_year);

    console.log(filteredData);

    let rectWidth = (680 - (filteredData.length * 50)) / filteredData.length;

    // remove all rectangles in order to regenerate them
    let rectangles = svg.selectAll('rect');
    rectangles.remove();

    // remove all month labels
    let text = svg.selectAll('text');
    text.remove();

    // add a chart title
    svg.append('g')
        .attr('class', 'title')
        .attr('transform', 'translate('+[chartWidth / 3 + 20, 30]+')')
        .append('text')
        .text('Weather')
        .style('font-size', '16px');

    for (i = 0; i < filteredData.length; i++) {
        // append one rectangle for tempColumn1
        chartG.append('rect')
            .attr('x', 50 + (rectWidth + 50)*i)
            .attr('y', 200 - (filteredData[i][tempColumn1] * 2))
            .attr('width', 50)
            .attr('height', filteredData[i][tempColumn1] * 2)
            .attr('fill', 'blue');
        // append another rectangle for tempColumn2
        chartG.append('rect')
            .attr('x', 100 + (rectWidth + 50)*i)
            .attr('y', 200 - (filteredData[i][tempColumn2] * 2))
            .attr('width', 50)
            .attr('height', filteredData[i][tempColumn2] * 2)
            .attr('fill', 'red');
        // append a rectangle for precColumn1
        chartG.append('rect')
            .attr('x', 50 + (rectWidth + 50)*i)
            .attr('y', 300)
            .attr('width', 50)
            .attr('height', filteredData[i][precColumn1] * 50)
            .attr('fill', 'green');
        // append another rectangle for tempColumn2
        chartG.append('rect')
            .attr('x', 100 + (rectWidth + 50)*i)
            .attr('y', 300)
            .attr('width', 50)
            .attr('height', filteredData[i][precColumn2] * 50)
            .attr('fill', 'black');
        // add text
        chartG.append('text')
        .text(filteredData[i].month_name)
        .attr('x', 75 + (rectWidth + 50) * i + 25)
        .attr('y', 250)
        .attr('text-anchor', 'middle')
        .attr('font-size', '16px')
        .attr('fill', 'black');
    }
};