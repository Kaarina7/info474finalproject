/*
COMMAND TO START LOCAL PYTHON SERVER: python -m http.server 8080

THINGS TO DO:
- make the y-axes dynamic
*/

// initialize global variables
let weather;
let yScaleTop;
let yScaleBottom;
let city = 'Charlotte';
let tempCol1 = 'actual_mean_temp';
let tempCol2 = 'actual_min_temp';
let precCol1 = 'actual_precipitation';
let precCol2 = 'average_precipitation';
let year = "2014";

// update chart when city is changed
function onCityChanged() {
    let catSelect = d3.select('#citySelect').node();
    city = catSelect.options[catSelect.selectedIndex].value;
    updateChart(city, tempCol1, tempCol2, precCol1, precCol2, year);
}

// update chart when first temp column is changed
function onCol1Changed() {
    let catSelect = d3.select('#col1Select').node();

    tempCol1 = catSelect.options[catSelect.selectedIndex].value;

    updateChart(city, tempCol1, tempCol2, precCol1, precCol2, year);
}

// update chart when second temp column is changed
function onCol2Changed() {
    let catSelect = d3.select('#col2Select').node();
    tempCol2 = catSelect.options[catSelect.selectedIndex].value;
    updateChart(city, tempCol1, tempCol2, precCol1, precCol2, year);
}

// update chart when first precipitation column is changed
function onPrec1Changed() {
    let catSelect = d3.select('#prec1Select').node();
    precCol1 = catSelect.options[catSelect.selectedIndex].value;
    updateChart(city, tempCol1, tempCol2, precCol1, precCol2, year);
}

// update chart when second precipitation column is changed
function onPrec2Changed() {
    let catSelect = d3.select('#prec2Select').node();
    precCol2 = catSelect.options[catSelect.selectedIndex].value;
    updateChart(city, tempCol1, tempCol2, precCol1, precCol2, year);
}

// update chart when year is changed
function onYearChanged() {
    let catSelect = d3.select('#yearSelect').node();
    year = catSelect.options[catSelect.selectedIndex].value;
    updateChart(city, tempCol1, tempCol2, precCol1, precCol2, year);
}

// set up SVG/chart parameters
let svg = d3.select('svg');

let svgWidth = +svg.attr('width');
let svgHeight = +svg.attr('height');

let padding = {t: 60, r: 40, b: 30, l: 40};

let chartWidth = svgWidth - padding.l - padding.r;
let chartHeight = svgHeight - padding.t - padding.b;

let chartG = svg.append('g').attr('transform', 'translate('+[padding.l, padding.t]+')'); // Create group element for appending chart elements

d3.csv('./DataProcessing/final.csv').then(function(dataset) {

    // initialize weather
    weather = dataset;

    // call updateChart function
    updateChart(city, tempCol1, tempCol2, precCol1, precCol2, year);
});

function updateChart(selected_city, tempColumn1, tempColumn2, precColumn1, precColumn2, selected_year) {
    // filter the data based on the selected city & year
    let filteredData = weather.filter(item => item.city === selected_city);
    filteredData = filteredData.filter(item => item.year === selected_year);

    // calculate the width of the bars based on the total number of data points
    let rectWidth = (680 - (filteredData.length * 50)) / filteredData.length;

    // remove all rectangles in order to regenerate them
    let rectangles = svg.selectAll('rect');
    rectangles.remove();

    // remove all month labels
    let text = svg.selectAll('text');
    text.remove();

    // map states to cities
    let state = "NC";
    if (selected_city === "Los Angeles") {
        state = "CA";
    } else if (selected_city === "Indianapolis") {
        state = "IN";
    } else if (selected_city === "Jacksonville") {
        state = "FL";
    } else if (selected_city === "Chicago") {
        state = "IL";
    } else if (selected_city === "Philadelphia") {
        state = "PA";
    } else if (selected_city === "Charlotte") {
        state = "NC";
    } else {
        state = "AZ";
    }

    // add a chart title
    svg.append('g')
        .attr('class', 'title')
        .attr('transform', 'translate('+[270, 30]+')')
        .append('text')
        .text('Weather for ' + selected_city + ', ' + state + ' (' + selected_year + ')')
        .style('font-size', '20px')
        .style('font-family', 'Arial, sans-serif');

    /* SET UP THE LEGEND AT THE TOP OF THE GRAPH */
    // first rectangle: tempColumn1
    chartG.append('rect')
        .attr('x', 10)
        .attr('y', -10)
        .attr('width', 20)
        .attr('height', 20)
        .attr('fill', '#ffb703');
    
    chartG.append('text')
        .text(tempColumn1)
        .attr('x', 40)
        .attr('y', 4)
        .attr('text-anchor', 'start')
        .attr('font-size', '14px')
        .attr('font-family', 'Arial, sans-serif')
        .attr('fill', 'black');
    
    // second rectangle: tempColumn2
    chartG.append('rect')
        .attr('x', 190)
        .attr('y', -10)
        .attr('width', 20)
        .attr('height', 20)
        .attr('fill', '#fb8500');

    chartG.append('text')
        .text(tempColumn2)
        .attr('x', 220)
        .attr('y', 4)
        .attr('text-anchor', 'start')
        .attr('font-size', '14px')
        .attr('font-family', 'Arial, sans-serif')
        .attr('fill', 'black');
    
    // third rectangle: precColumn1
    chartG.append('rect')
        .attr('x', 380)
        .attr('y', -10)
        .attr('width', 20)
        .attr('height', 20)
        .attr('fill', '#8ecae6');

    chartG.append('text')
        .text(precColumn1)
        .attr('x', 410)
        .attr('y', 4)
        .attr('text-anchor', 'start')
        .attr('font-size', '14px')
        .attr('font-family', 'Arial, sans-serif')
        .attr('fill', 'black');

    // fourth rectangle: precColumn2
    chartG.append('rect')
        .attr('x', 570)
        .attr('y', -10)
        .attr('width', 20)
        .attr('height', 20)
        .attr('fill', '#219ebc');

    chartG.append('text')
        .text(precColumn2)
        .attr('x', 600)
        .attr('y', 4)
        .attr('text-anchor', 'start')
        .attr('font-size', '14px')
        .attr('font-family', 'Arial, sans-serif')
        .attr('fill', 'black');
    
    /* END SETUP OF LEGEND */

    /* SET UP THE TWO Y-AXES */
    // set up y scale for top bars
    yScaleTop = d3.scaleLinear()
        .domain([110, 0])
        .range([0, 220]);

    // set up y scale for bottom bars
    yScaleBottom = d3.scaleLinear()
        .domain([0, 5])
        .range([0, 250]);

    // Create top y-axis
    let yAxisTop = d3.axisLeft(yScaleTop);

    let yAxisTopG = chartG.append("g")
        .attr("class", "y-axis")
        .attr("transform", "translate(30, 55)")
        .call(yAxisTop);

    yAxisTopG.select(".domain").remove(); // Remove the y-axis line if not needed

    yAxisTopG.selectAll(".tick line")
        .attr("stroke", "black")  // Set the color of the tick lines
        .attr("stroke-width", "2px");  // Set the width of the tick lines

    yAxisTopG.selectAll(".tick text")
        .attr("font-size", "12px");  // Set the font size of the tick labels      
    
    yAxisTopG.append("line")
        .attr("class", "y-axis-line")
        .attr("x1", 0)  // Start x-coordinate at 0 (left side)
        .attr("y1", 0)  // Start y-coordinate at 0 (top)
        .attr("x2", 0)  // End x-coordinate at 0 (left side)
        .attr("y2", 220)  // End y-coordinate at chartHeight (bottom)
        .attr("stroke", "black")  // Set the color of the line
        .attr("stroke-width", "2px");  // Set the width of the line
    
    // add y-axis label for top y-axis
    chartG.append("text")
        .attr("class", "y-axis-label")
        .attr("transform", "rotate(-90)")
        .attr("x", -225)
        .attr("y", -10)
        .style("text-anchor", "start")
        .style('font-family', 'Arial, sans-serif')
        .text("Temperature (\u00B0F)");

    // Create bottom y-axis
    let yAxisBottom = d3.axisLeft(yScaleBottom);

    let yAxisBottomG = chartG.append("g")
        .attr("class", "y-axis")
        .attr("transform", "translate(30, 325)")
        .call(yAxisBottom);

    yAxisBottomG.select(".domain").remove(); // Remove the y-axis line if not needed

    yAxisBottomG.selectAll(".tick line")
        .attr("stroke", "black")  // Set the color of the tick lines
        .attr("stroke-width", "2px");  // Set the width of the tick lines

    yAxisBottomG.selectAll(".tick text")
        .attr("font-size", "12px");  // Set the font size of the tick labels      
    
    yAxisBottomG.append("line")
        .attr("class", "y-axis-line")
        .attr("x1", 0)  // Start x-coordinate at 0 (left side)
        .attr("y1", 0)  // Start y-coordinate at 0 (top)
        .attr("x2", 0)  // End x-coordinate at 0 (left side)
        .attr("y2", 250)  // End y-coordinate at chartHeight (bottom)
        .attr("stroke", "black")  // Set the color of the line
        .attr("stroke-width", "2px");  // Set the width of the line
    
    // add y-axis label for bottom y-axis
    chartG.append("text")
        .attr("class", "y-axis-label")
        .attr("transform", "rotate(-90)")
        .attr("x", -500)
        .attr("y", -10)
        .style("text-anchor", "start")
        .style('font-family', 'Arial, sans-serif')
        .text("Precipitation (in)");
    
    /* END SETUP OF Y-AXES */

    /* CREATE BARS & LABELS FOR DATA */
    for (i = 0; i < filteredData.length; i++) {
        /* CREATE BARS */
        // append a rectangle for tempColumn1
        chartG.append('rect')
            .attr('x', 50 + (rectWidth + 50)*i)
            .attr('y', 275 - (filteredData[i][tempColumn1] * 2))
            .attr('width', 50)
            .attr('height', filteredData[i][tempColumn1] * 2)
            .attr('fill', '#ffb703');
        // append a rectangle for tempColumn2
        chartG.append('rect')
            .attr('x', 100 + (rectWidth + 50)*i)
            .attr('y', 275 - (filteredData[i][tempColumn2] * 2))
            .attr('width', 50)
            .attr('height', filteredData[i][tempColumn2] * 2)
            .attr('fill', '#fb8500');
        // append a rectangle for precColumn1
        chartG.append('rect')
            .attr('x', 50 + (rectWidth + 50)*i)
            .attr('y', 325)
            .attr('width', 50)
            .attr('height', filteredData[i][precColumn1] * 50)
            .attr('fill', '#8ecae6');
        // append another rectangle for precColumn2
        chartG.append('rect')
            .attr('x', 100 + (rectWidth + 50)*i)
            .attr('y', 325)
            .attr('width', 50)
            .attr('height', filteredData[i][precColumn2] * 50)
            .attr('fill', '#219ebc');
        /* END BAR CREATION */

        /* ADD DATA LABELS */
        // add data label for tempColumn1 rectangle
        chartG.append('text')
            .text(Math.round(filteredData[i][tempColumn1] * 100) / 100)
            .attr('x', 50 + (rectWidth + 50)*i + 25)
            .attr('y', 275 - (filteredData[i][tempColumn1] * 2) - 5)
            .attr('text-anchor', 'middle')
            .attr('font-size', '12px')
            .attr('font-family', 'Arial, sans-serif')
            .attr('fill', 'black');
        // add data label for tempColumn2 rectangle
        chartG.append('text')
            .text(Math.round(filteredData[i][tempColumn2] * 100) / 100)
            .attr('x', 100 + (rectWidth + 50)*i + 25)
            .attr('y', 275 - (filteredData[i][tempColumn2] * 2) - 5)
            .attr('text-anchor', 'middle')
            .attr('font-size', '12px')
            .attr('font-family', 'Arial, sans-serif')
            .attr('fill', 'black');
        // add data label for precColumn1 rectangle
        chartG.append('text')
            .text(Math.round(filteredData[i][precColumn1] * 100) / 100)
            .attr('x', 50 + (rectWidth + 50) * i + 25)
            .attr('y', 325 + filteredData[i][precColumn1] * 50 + 10)
            .attr('text-anchor', 'middle')
            .attr('font-size', '12px')
            .attr('font-family', 'Arial, sans-serif')
            .attr('fill', 'black');
        // add data label for precColumn2 rectangle
        chartG.append('text')
            .text(Math.round(filteredData[i][precColumn2] * 100) / 100)
            .attr('x', 100 + (rectWidth + 50) * i + 25)
            .attr('y', 325 + filteredData[i][precColumn2] * 50 + 10)
            .attr('text-anchor', 'middle')
            .attr('font-size', '12px')
            .attr('font-family', 'Arial, sans-serif')
            .attr('fill', 'black');
        // add month labels
        chartG.append('text')
            .text(filteredData[i].month_name)
            .attr('x', 75 + (rectWidth + 50) * i + 25)
            .attr('y', 300)
            .attr('text-anchor', 'middle')
            .attr('font-size', '16px')
            .attr('font-family', 'Arial, sans-serif')
            .attr('fill', 'black');
        /* END ADDITION OF DATA LABELS */
    }
    /* END CREATION OF BARS & LABELS FOR DATA */
};