/*
vis: double sided clustered bar chart
x-axis: the date
y-axis: temp (specific value can be selected by user) + can have multiple values (i.e. separate lines/points)
filter: location, what columns to show
should be able to compare two years side by side on the bar chart

COMMAND TO START LOCAL PYTHON SERVER: python -m http.server 8080

THINGS TO DO:
- add title(s)
- change bar colors to be more appealing
- standardize font & size
- add data labels to each bar
- move down the top chart & up the bottom chart so that the title isn't blocked & the whole bottom y-scale shows
- add labels to y-axes
*/

// initialize global variables
let weather;
let freqScale;
let yScaleTop;
let yScaleBottom;
let city = 'Charlotte';
let tempCol1 = 'actual_mean_temp';
let tempCol2 = 'actual_min_temp';
let precCol1 = 'actual_precipitation';
let precCol2 = 'average_precipitation';
let year = "2014";
let maxTemp;
let minTemp;
let maxPrec;

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

    // find min and max values for record min/max temps
    maxTemp = 0;
    minTemp = 2000;
    for (i = 0; i < weather.length; i++) {
        if (weather[i].record_max_temp > maxTemp) {
            maxTemp = weather[i].record_max_temp;
        } else if (weather[i].record_min_temp < minTemp) {
            minTemp = weather[i].record_min_temp;
        }
    }
    console.log('test');

    // find min and max values for record min/max prec
    maxPrec = 0;
    for (i = 0; i < weather.length; i++) {
        if (weather[i].record_precipitation > maxPrec) {
            maxPrec = weather[i].record_precipitation;
        }
    }

    // set up frequency scale
    freqScale = d3.scaleLinear().domain(weather.map(d => d.date)).range([0, chartWidth]);

    // set up y scale for top bars
    yScaleTop = d3.scaleLinear()
        .domain([maxTemp, 0])
        .range([0, chartHeight / 2, ]);

    // set up y scale for bottom bars
    yScaleBottom = d3.scaleLinear()
        .domain([0, maxPrec])
        .range([0, chartHeight / 2, ]);

    // call updateChart function
    updateChart(city, tempCol1, tempCol2, precCol1, precCol2, year);
});

function updateChart(selected_city, tempColumn1, tempColumn2, precColumn1, precColumn2, selected_year) {
    // Create a filtered array of letters based on the filterKey
    let filteredData = weather.filter(item => item.city === selected_city);
    filteredData = filteredData.filter(item => item.year === selected_year);

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

    // Create top y-axis
    let yAxisTop = d3.axisLeft(yScaleTop);

    let yAxisTopG = chartG.append("g")
        .attr("class", "y-axis")
        .attr("transform", "translate(30, -55)")
        .call(yAxisTop);

    yAxisTopG.select(".domain").remove(); // Remove the y-axis line if not needed

    yAxisTopG.selectAll(".tick line")
        .attr("stroke", "black")  // Set the color of the tick lines
        .attr("stroke-width", "1px");  // Set the width of the tick lines

    yAxisTopG.selectAll(".tick text")
        .attr("font-size", "12px");  // Set the font size of the tick labels      
    
    yAxisTopG.append("line")
        .attr("class", "y-axis-line")
        .attr("x1", 0)  // Start x-coordinate at 0 (left side)
        .attr("y1", 0)  // Start y-coordinate at 0 (top)
        .attr("x2", 0)  // End x-coordinate at 0 (left side)
        .attr("y2", chartHeight / 2)  // End y-coordinate at chartHeight (bottom)
        .attr("stroke", "black")  // Set the color of the line
        .attr("stroke-width", "2px");  // Set the width of the line

    // Create bottom y-axis
    let yAxisBottom = d3.axisLeft(yScaleBottom);

    let yAxisBottomG = chartG.append("g")
        .attr("class", "y-axis")
        .attr("transform", "translate(30, 300)")
        .call(yAxisBottom);

    yAxisBottomG.select(".domain").remove(); // Remove the y-axis line if not needed

    yAxisBottomG.selectAll(".tick line")
        .attr("stroke", "black")  // Set the color of the tick lines
        .attr("stroke-width", "1px");  // Set the width of the tick lines

    yAxisBottomG.selectAll(".tick text")
        .attr("font-size", "12px");  // Set the font size of the tick labels      
    
    yAxisBottomG.append("line")
        .attr("class", "y-axis-line")
        .attr("x1", 0)  // Start x-coordinate at 0 (left side)
        .attr("y1", 0)  // Start y-coordinate at 0 (top)
        .attr("x2", 0)  // End x-coordinate at 0 (left side)
        .attr("y2", chartHeight / 2)  // End y-coordinate at chartHeight (bottom)
        .attr("stroke", "black")  // Set the color of the line
        .attr("stroke-width", "2px");  // Set the width of the line

    for (i = 0; i < filteredData.length; i++) {
        // append one rectangle for tempColumn1
        chartG.append('rect')
            .attr('x', 50 + (rectWidth + 50)*i)
            .attr('y', 200 - (filteredData[i][tempColumn1] * 2))
            .attr('width', 50)
            .attr('height', filteredData[i][tempColumn1] * 2)
            .attr('fill', '#ffb703');
        // append another rectangle for tempColumn2
        chartG.append('rect')
            .attr('x', 100 + (rectWidth + 50)*i)
            .attr('y', 200 - (filteredData[i][tempColumn2] * 2))
            .attr('width', 50)
            .attr('height', filteredData[i][tempColumn2] * 2)
            .attr('fill', '#fb8500');
        // append a rectangle for precColumn1
        chartG.append('rect')
            .attr('x', 50 + (rectWidth + 50)*i)
            .attr('y', 300)
            .attr('width', 50)
            .attr('height', filteredData[i][precColumn1] * 50)
            .attr('fill', '#8ecae6');
        // append another rectangle for tempColumn2
        chartG.append('rect')
            .attr('x', 100 + (rectWidth + 50)*i)
            .attr('y', 300)
            .attr('width', 50)
            .attr('height', filteredData[i][precColumn2] * 50)
            .attr('fill', '#219ebc');
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