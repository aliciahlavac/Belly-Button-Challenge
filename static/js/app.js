// Get the URL with the data
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// Fetch the data from URL using D3 library
d3.json(url).then(data => {
    // Get data from JSON object
    const samples = data.samples;
    const metadata = data.metadata;

    // Populate the dropdown menu with sample IDs
    const dropdown = d3.select("#selDataset");

    // Iterate through sample array and append option element to the dropdown menu for each sample ID
    samples.forEach(sample => {
        dropdown.append("option")
            .text(sample.id)
            .property("value", sample.id);
    });

    // Function to update the bar chart, bubble chart, and gauge chart based on selected sample
    function updateCharts(selectedSample) {
        // Compare sample ID with selectedSample and return sample when matched and store in selectedData
        const selectedData = samples.find(sample => sample.id === selectedSample);

        // Update the horizontal bar chart
        const barTrace = {
            // Get the top 10 sample_values and put them in reverse order for the bar plot
            x: selectedData.sample_values.slice(0, 10).reverse(),
            // Get the top 10 otu_ids, put them in reverse order and set them to a string with OTU in front of it
            y: selectedData.otu_ids.slice(0, 10).reverse().map(id => `OTU ${id}`),
            // Make otu_labels the haver values
            text: selectedData.otu_labels.slice(0, 10).reverse(),
            // Set type of chart to bar
            type: "bar",
            // Make it horizontal
            orientation: "h"
        };
        // Set the layout of the bar plot and plot it
        const barLayout = {
            title: `Top 10 OTUs for Sample ${selectedSample}`
        };
        Plotly.newPlot("bar", [barTrace], barLayout);

        // Update the bubble chart
        const bubbleTrace = {
            // Choose otu_ids for x value
            x: selectedData.otu_ids,
            // Choose sample values as y values
            y: selectedData.sample_values,
            // Have hover text equal to otu_labels
            text: selectedData.otu_labels,
            // Display data points as individual markers
            mode: 'markers',
            // Set appearance of markers
            marker: {
                // Size is proportional to sample_values
                size: selectedData.sample_values,
                // Color is related to otu_ids
                color: selectedData.otu_ids,
                // Color scale to use is Earth
                colorscale: 'Earth'
            }
        };
        // Set the layout of the bubble chart
        const bubbleLayout = {
            // Set title
            title: `Bubble Chart for Sample ${selectedSample}`,
            // Set x axis label
            xaxis: { title: "OTU IDs" },
            // Set y axis label
            yaxis: { title: "Sample Values" }
        };
        Plotly.newPlot("bubble", [bubbleTrace], bubbleLayout);

        // Display sample metadata
       // Return item if item id matches selectedSample
        const selectedMetadata = metadata.find(item => item.id.toString() === selectedSample);
        // Get the sample data/demographic information to display 
        const metadataPanel = d3.select("#sample-metadata");
        // Clear previous content
        metadataPanel.html("");
        
        // Run through each key-value pair to find the demographic info
        Object.entries(selectedMetadata).forEach(([key, value]) => {
            metadataPanel.append("p").text(`${key}: ${value}`);
        });

        // Update the gauge chart
        // Find the weekly wahsing frequency
        const weeklyWashingFrequency = selectedMetadata.wfreq;

        // Set parameters for gauge chart
        const gaugeTrace = {
            // Set value of gauge meter
            value: weeklyWashingFrequency,
            // Set title
            title: { text: "Weekly Washing Frequency" },
            // Set type of gauge chart
            type: "indicator",
            // Set the mode
            mode: "gauge+number",
            // Modify the guage meter
            gauge: {
                // Range from 0 to 9
                axis: { range: [0, 9] },
                // Set bar color
                bar: { color: "dark green" },
                // Set background color
                bgcolor: "white",
                // Set border width and color
                borderwidth: 2,
                bordercolor: "black",
                // Set color of meter
                steps: [
                    {range: [0, 1], color: "rgba(255, 255, 255, 0)"},
                    {range: [1, 2], color: "rgba(232, 226, 202, .5)"},
                    {range: [2, 3], color: "rgba(210, 206, 145, .5)"},
                    {range: [3, 4], color:  "rgba(202, 209, 95, .5)"},
                    {range: [4, 5], color:  "rgba(184, 205, 68, .5)"},
                    {range: [5, 6], color: "rgba(170, 202, 42, .5)"},
                    {range: [6, 7], color: "rgba(142, 178, 35 , .5)"},
                    {range: [7, 8], color:  "rgba(110, 154, 22, .5)"},
                    {range: [8, 9], color: "rgba(50, 143, 10, 0.5)"},
                    {range: [9, 10], color: "rgba(14, 127, 0, .5)"}
                ],
                // Set threshold bar color and width
                threshold: {
                    line: { color: "dark green", width: 4 },
                    thickness: 0.75,
                    value: weeklyWashingFrequency
                }
            }
        };
        // Set gauge layout
        const gaugeLayout = {
            width: 400,
            height: 300,
            margin: { t: 0, b: 0 }
        };
        Plotly.newPlot("gauge", [gaugeTrace], gaugeLayout);
    }

    // Initial charts and metadata display
    updateCharts(samples[0].id);

    // Event listener for dropdown changes
    dropdown.on("change", function () {
        const selectedSample = d3.select(this).property("value");
        updateCharts(selectedSample);
    });
});