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

    // Function to update the bar chart and bubble chart based on selected sample
    function updateCharts(selectedSample) {
        // Compare sample ID with selectedSample and return sample when matched and store in selectedData
        const selectedData = samples.find(sample => sample.id === selectedSample);

        // Update the horizontal bar chart
        const barTrace = {
            // Select top 10 sample_values and put them in reverse order
            x: selectedData.sample_values.slice(0, 10).reverse(),
            // Select top 10 otu_ids and put them in reverse order, format them as strings with prefix "OTU"
            y: selectedData.otu_ids.slice(0, 10).reverse().map(id => `OTU ${id}`),
            // Create the hover text
            text: selectedData.otu_labels.slice(0, 10).reverse(),
            // Select a bar chart
            type: "bar",
            // Make it a horizontal bar chart
            orientation: "h"
        };
        // Create the bar layout with the title including selectedSample
        const barLayout = {
            title: `Top 10 OTUs for Sample ${selectedSample}`
        };
        // Create the plot
        Plotly.newPlot("bar", [barTrace], barLayout);

        // Update the bubble chart
        const bubbleTrace = {
            // Select otu_ids as x data
            x: selectedData.otu_ids,
            // Select sample values as y values
            y: selectedData.sample_values,
            // Use otu_labels as hover text
            text: selectedData.otu_labels,
            // Display data points as individual markers
            mode: 'markers',
            // Set appearance of markers
            marker: {
                // Size is related to sample_values
                size: selectedData.sample_values,
                // Color changes related to otu_ids
                color: selectedData.otu_ids,
                // Colorscale is Earth
                colorscale: 'Earth'
            }
        };
        // Set titles and axis labels for bubble chart
        const bubbleLayout = {
            title: `Bubble Chart for Sample ${selectedSample}`,
            xaxis: { title: "OTU IDs" },
            yaxis: { title: "Sample Values" }
        };
        // Create a new bubble plot
        Plotly.newPlot("bubble", [bubbleTrace], bubbleLayout);

        // Display sample metadata
        // Return item if item id matches selectedSample
        const selectedMetadata = metadata.find(item => item.id.toString() === selectedSample);
        // Select element with id sample-metadata
        const metadataPanel = d3.select("#sample-metadata");
        // Clear previous content
        metadataPanel.html(""); 

        // Run through each key-value pair to find the demographic info
        Object.entries(selectedMetadata).forEach(([key, value]) => {
            metadataPanel.append("p").text(`${key}: ${value}`);
        });
    }
 
    // Initial charts and metadata display
    updateCharts(samples[0].id);

    // Event listener for dropdown changes
    dropdown.on("change", function () {
        const selectedSample = d3.select(this).property("value");
        updateCharts(selectedSample);
    });
});