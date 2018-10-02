function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
  const metadataURL = "/metadata/" + sample;
  d3.json(metadataURL).then(function(data) {

    // Use d3 to select the panel with id of `#sample-metadata`
    metadataPanel = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    metadataPanel.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(data).forEach(([key, value]) => {
          var cell = metadataPanel.append("p");
          cell.text(key + ": " + value);
    });
  });
}

    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);


function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots'
  const sampleDataURL = "/samples/" + sample;
  d3.json(sampleDataURL).then(function(data) {

    // @TODO: Build a Bubble Chart using the sample data
    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
    result = [];
    for (var i = 0; i < data.otu_ids.length; i++) {
      result.push({"otu_ids": data.otu_ids[i], "otu_labels": data.otu_labels[i], "sample_values": data.sample_values[i]});
    };
    //result.sort((a, b) => b.sample_values - a.sample_values);
    result.sort(function(a, b){
      return parseFloat(b.sample_values) - parseFloat(a.sample_values);
    });
    result = result.slice(0, 10);
    console.log(result);

    var trace1 = {
      values: result.map(row => row.sample_values),
      labels: result.map(row => row.otu_ids),
      hovertext: result.map(row => row.otu_labels),
      type: "pie",
      orientation: "h"
    };
    var pieChart = [trace1];
    Plotly.newPlot("pie", pieChart);

    var trace2 = {
      x: data.otu_ids,
      y: data.sample_values,
      type: "scatter",
      mode: "markers",
      marker: {
        size: data.sample_values,
        color: data.otu_ids
      },
      text: data.otu_labels
    };
    var bubbleChart = [trace2];
    Plotly.newPlot("bubble", bubbleChart);

    // BONUS: Build the Gauge Chart
    //const washDataURL = "/wfreq/" + sample;
    //d3.json(washDataURL).then(function(data){
      d3.json("/wfreq/<sample>").then(function(data){
      //buildGauge(data.WFREQ);
    });

    // Enter a speed between 0 and 180
var level = 25;

// Trig to calc meter point
var degrees = 180 - level,
     radius = .5;
var radians = degrees * Math.PI / 180;
var x = radius * Math.cos(radians);
var y = radius * Math.sin(radians);

// Path: may have to change to create a better triangle
var mainPath = 'M -.0 -0.025 L .0 0.025 L ',
     pathX = String(x),
     space = ' ',
     pathY = String(y),
     pathEnd = ' Z';
var path = mainPath.concat(pathX,space,pathY,pathEnd);

var data = [{ type: 'scatter',
   x: [0], y:[0],
    marker: {size: 20, color:'850000'},
    showlegend: false,
    name: 'speed',
    text: level,
    hoverinfo: 'text+name'},
  { values: [50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50],
  rotation: 90,
  text: ['8-9', '7-8', '6-7', '5-6', '4-5', '3-4', '2-3', '1-2', '0-1', ''],
  textinfo: 'text',
  textposition:'inside',
  marker: {colors:['rgba(0, 105, 11, .5)','rgba(10, 120, 22, .5)',
                        'rgba(14, 127, 0, .5)', 'rgba(110, 154, 22, .5)',
                        'rgba(170, 202, 42, .5)', 'rgba(202, 209, 95, .5)',
                        'rgba(210, 206, 145, .5)', 'rgba(232, 226, 202, .5)',
                        'rgba(240, 230, 215, .5)','rgba(255, 255, 255, 0)']},
  labels: ['8-9', '7-8', '6-7', '5-6', '4-5', '3-4', '2-3', '1-2', '0-1', ''],
  hoverinfo: 'label',
  hole: .5,
  type: 'pie',
  showlegend: false
}];

var layout = {
  shapes:[{
      type: 'path',
      path: path,
      fillcolor: '850000',
      line: {
        color: '850000'
      }
    }],
  title: '<b>Belly Button Washing Frequency</b> <br> Scrubs per Week',
  height: 600,
  width: 400,
  xaxis: {zeroline:false, showticklabels:false,
             showgrid: false, range: [-1, 1]},
  yaxis: {zeroline:false, showticklabels:false,
             showgrid: false, range: [-1, 1]}
};

var gauge = document.getElementById("gauge-chart")
Plotly.newPlot("gauge", data, layout);
    
  });

} 

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();