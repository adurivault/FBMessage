function barChart(config_global) {
  var h_bar = 12,
      onMouseover = function(){}


  function chart(bc){
    bc.xScale.domain([0, d3.max(bc.nested_data, function(d) {return d.value;})])

    // On click, change the appearance of the bars, filter everything, and update barcharts, curves, and scatterplot
    function onClick(d){
      gtag('event', 'Histogram', {
           'event_category': 'Filter',
           'event_label': bc.title})

       // Update the "clicked" sets
       if (bc.clicked.has(d.key)) {
         bc.clicked.delete(d.key)
       } else {
         bc.clicked.add(d.key)
       }

       // Apply filters
       if (bc.clicked.size == 0) {
         bc.dimension.filter()
       } else {
          bc.dimension.filter(function(a){return bc.clicked.has(a)})
       }

       // Update to match new filters
       update_all()
    }

    // On mouseover, display tooltip
    function onMouseover(d){
      div.transition()
         .duration(200)
         .style("opacity", .9);
      div.html(bc.get_tooltip(d.key))
         .style("left", (d3.event.pageX) + "px")
         .style("top", (d3.event.pageY - 28) + "px");
      d3.select(this).classed("mouseovered", true);
    }

    // On mouseout, hide the tooltip
    function onMouseout(d){
      div.transition()
         .duration(200)
         .style("opacity", 0);
      d3.select(this).classed("mouseovered", false);
    }

    // Select the svg element, if it exists.
    var svg = bc.div_body.selectAll("svg").data([bc.nested_data]);

    // Otherwise, create the skeletal chart.
    var svgEnter = svg.enter().append("svg");

    // Create a group for each bar. We will then add the bar and the labels to these groups
    var bar_elements = svgEnter.selectAll(".bar-element")
        .data(bc.nested_data).enter()
        .append("g")
        .attr("class", "bar-element")
        // .attr("id", function(d){try {return this_temp.get_data(d)} catch {return "other"}})
        .attr("transform", function(d, i) { return "translate(" + 0 + "," + i*(h_bar+2) + ")"; });

    bc.xScale.domain([0, d3.max(bc.nested_data, function(d) {return d.value;})])

    // Add bars
    bar_elements.append("rect")
        .attr("class", "bar")
        .attr("height", h_bar)
        .attr("width", function(d) {return (bc.xScale(d.value))})
        .attr("transform", "translate(" + margin3.left + "," + 0 + ")")
        .style("fill", function(d){if(bc.isColoredBarchart){return colorScale(d.key)} else {return ""}})
        .classed("unclicked", function(d){return !(bc.clicked.size == 0 || bc.clicked.has(d.key))})
        .on("click", onClick)
        .on("mouseover", onMouseover)
        .on("mouseout", onMouseout)

    // Add number-labels to bar charts
    bar_elements.append("text")
      .attr("class", "legend_hist_num")
      .attr("dy", "0.35em")
      .attr("y", h_bar/2 + "px")
      .attr("x", function(d) {return bc.xScale(d.value) +2; })
      .attr("text-anchor", "left")
      .text(function(d) { return d.value; })
      .attr("transform", "translate(" + margin3.left + "," + 0 + ")")
      .on("click", onClick)
      .on("mouseover", onMouseover)
      .on("mouseout", onMouseout)

    // Add labels to bar charts
    bar_elements.append("text")
        .attr("class", "legend_hist_text")
        .attr("dy", "0.35em")
        .attr("y", h_bar/2 + "px")
        .text(function(d){return bc.get_legend(d.key)})
        .on("click", onClick)
        .on("mouseover", onMouseover)
        .on("mouseout", onMouseout)

    // Adjust svg size
    bbox = svgEnter.nodes()[0].getBBox();
    svgEnter.attr("width", bbox.x + bbox.width  + "px")
        .attr("height",bbox.y + bbox.height + "px");
  }
  return chart
}
