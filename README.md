# Belly_Button_Challenge
Module 14 Challenge

In this challenge, we were tasked with creating an interactive dashboard to explore the "Belly Button Biodiversity" dataset, which provides information about the microbial species found in human navels. Our dashboard is deployed to https://aliciahlavac.github.io/Belly-Button-Challenge/.

We made a JavaScript file, [app.js](https://github.com/aliciahlavac/Belly_Button_Challenge/blob/main/StarterCode/static/js/app.js), and used that to write the code that would make charts related to this data set.  

Our first step was to use the D3 library to read the data from the provided URL, which contained the [samples.json](https://github.com/aliciahlavac/Belly_Button_Challenge/blob/main/StarterCode/samples.json) file. This data would serve as the foundation for our interactive dashboard.

Next, we created a horizontal bar chart with a dropdown menu to display the top 10 operational taxonomic units (OTUs) found in an individual's navel. We used the sample_values as the values for the bar chart, otu_ids as the labels for the bars, and otu_labels as hovertext to provide additional information.

In addition to the bar chart, we created a bubble chart that displayed each sample. The bubble chart used otu_ids for the x-axis values, sample_values for the y-axis values, sample_values for the marker size, otu_ids for marker colors, and otu_labels for text values.

To enhance the dashboard's interactivity, we displayed the sample metadata, which included demographic information about the selected individual. We showed each key-value pair from the metadata JSON object on the page.

![BellyButtonChallenge](https://github.com/aliciahlavac/Belly_Button_Challenge/assets/127240852/9169b6d9-9506-4080-801f-0bdca4b35b38)

We ensured that all the plots on the dashboard were updated dynamically when a new sample was selected from the dropdown menu, providing users with real-time visualizations based on their choices.

Overall, this challenge allowed us to demonstrate our ability to use D3, Plotly, and HTML to create an interactive dashboard that visually represents and explores the microbial diversity in human navels.
