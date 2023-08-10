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
            x: selectedData.sample_values.slice(0, 10).reverse(),
            y: selectedData.otu_ids.slice(0, 10).reverse().map(id => `OTU ${id}`),
            text: selectedData.otu_labels.slice(0, 10).reverse(),
            type: "bar",
            orientation: "h"
        };
        const barLayout = {
            title: `Top 10 OTUs for Sample ${selectedSample}`
        };
        Plotly.newPlot("bar", [barTrace], barLayout);

        // Update the bubble chart
        const bubbleTrace = {
            x: selectedData.otu_ids,
            y: selectedData.sample_values,
            text: selectedData.otu_labels,
            mode: 'markers',
            marker: {
                size: selectedData.sample_values,
                color: selectedData.otu_ids,
                colorscale: 'Earth'
            }
        };
        const bubbleLayout = {
            title: `Bubble Chart for Sample ${selectedSample}`,
            xaxis: { title: "OTU IDs" },
            yaxis: { title: "Sample Values" }
        };
        Plotly.newPlot("bubble", [bubbleTrace], bubbleLayout);

        // Display sample metadata
        const selectedMetadata = metadata.find(item => item.id.toString() === selectedSample);
        const metadataPanel = d3.select("#sample-metadata");
        metadataPanel.html("");

        Object.entries(selectedMetadata).forEach(([key, value]) => {
            metadataPanel.append("p").text(`${key}: ${value}`);
        });

        // Update the gauge chart
        const weeklyWashingFrequency = selectedMetadata.wfreq;

        const gaugeTrace = {
            value: weeklyWashingFrequency,
            title: { text: "Weekly Washing Frequency" },
            type: "indicator",
            mode: "gauge+number",
            gauge: {
                axis: { range: [0, 9] },
                bar: { color: "dark green" },
                bgcolor: "white",
                borderwidth: 2,
                bordercolor: "gray",
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
                threshold: {
                    line: { color: "red", width: 4 },
                    thickness: 0.75,
                    value: weeklyWashingFrequency
                }
            }
        };

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