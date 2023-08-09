// Get the URL with the data
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"

// Fetch the data from URL using D3 library
d3.json(url).then(data => {
    // Get data from JSON object
    const samples = data.samples;
    const metadata = data.metadata;

    // Populate the dropdown menu with sample IDs
    const dropdown = d3.select("#selDataset");

    samples.forEach(sample => {
        dropdown.append("option")
            .text(sample.id)
            .property("value", sample.id);
    });

     // Function to update the bar chart and bubble chart based on selected sample
     function updateCharts(selectedSample) {
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
        // Clear previous content
        metadataPanel.html(""); 

         // Update the gauge chart
        updateGaugeChart(selectedSample);

        Object.entries(selectedMetadata).forEach(([key, value]) => {
            metadataPanel.append("p").text(`${key}: ${value}`);
        });
        // Function to update the gauge chart based on selected sample
        function updateGaugeChart(selectedSample) {
            const selectedMetadata = metadata.find(item => item.id.toString() === selectedSample);
            const weeklyWashingFrequency = selectedMetadata.wfreq;

            const data = [
                {
                    domain: { x: [0, 1], y: [0, 1] },
                    value: weeklyWashingFrequency,
                    title: { text: "Weekly Washing Frequency" },
                    type: "indicator",
                    mode: "gauge+number",
                    gauge: {
                        axis: { range: [0, 9] },
                        bar: { color: "darkblue" },
                        bgcolor: "white",
                        borderwidth: 2,
                        bordercolor: "gray",
                        steps: [
                            { range: [0, 3], color: "lightgray" },
                            { range: [3, 6], color: "gray" },
                            { range: [6, 9], color: "darkgray" }
                        ],
                        threshold: {
                            line: { color: "red", width: 4 },
                            thickness: 0.75,
                            value: weeklyWashingFrequency
                        }
                    }
                }
            ];

            const layout = { width: 400, height: 300, margin: { t: 0, b: 0 } };
            Plotly.newPlot("gauge", data, layout);
    }
});

