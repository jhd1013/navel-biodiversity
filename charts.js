function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });
    console.log(data)

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    let metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    let resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    let result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    let PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array.
    allSamples = data.samples; 

    // 4. Create a variable that filters the samples for the object with the desired sample number.
    let resultArray = allSamples.filter(sampleObj => sampleObj.id == sample);

    //  5. Create a variable that holds the first sample in the array.
    let result = resultArray[0];

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    let otuIDs = result.otu_ids.slice(0,10);
    let otuLabels = result.otu_labels.slice(0,10);
    let sampleValues = result.sample_values.slice(0,10);
    
    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last.
    let yticks = otuIDs.map(value => ("OTU " + value)).reverse();

    console.log(yticks);
    // 8. Create the trace for the bar chart. 
    let barTrace = {
      x: sampleValues.reverse(),
      y: yticks,
      text: otuLabels,
      type: "bar",
      orientation: 'h'
    };
      
    // 9. Create the layout for the bar chart. 
    let barLayout = {
      title: "Top 10 Bacteria Cultures Found",
      margin: { t: 25, r: 50, l: 100, b: 25 }
    };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", [barTrace], barLayout)

    // Create the bubble chart
    // 1. Create the trace for the bubble chart.
    var bubbleData = {
      x: result.otu_ids,
      y: result.sample_values,
      mode: "markers",
      marker: {
        size: result.sample_values,
        color: result.otu_ids,
        colorscale: 'YlGnBu' 
      },
      text: otuLabels
    };

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: "Bacteria Cultures Per Sample",
      xaxis: {
        title: "OTU ID"
      },
      hovermode: "closest",
      margin: { t: 100, r: 50, l: 50, b: 100 }
    };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", [bubbleData], bubbleLayout); 

      // 4. Create the trace for the gauge chart.
      var gaugeData = {
        type: "indicator",
        mode: "gauge+number",
        title: "<b>Belly Button Washing Frequency</b><br>Scrubs per Week",
        value: data.metadata.filter(person => person.id == sample)[0].wfreq,
        bordercolor : "gray",
        gauge:{
          axis: {range: [null,10]},
          steps: [
            { range: [0, 2], color: "red" },
            { range: [2, 4], color: "orange" },
            { range: [4, 6], color: "yellow" },
            { range: [6, 8], color: "greenyellow" },
            { range: [8, 10], color: "green" }
          ],
          bar: {color : "black"}
        }
      };
      
      // 5. Create the layout for the gauge chart.
      var gaugeLayout = { 
        width : 400,
        height: 300,
        margin : { t: 100, r: 50, l: 50, b: 25 }
      };
  
      // 6. Use Plotly to plot the gauge data and layout.
      Plotly.newPlot("gauge", [gaugeData], gaugeLayout);
  });
}
