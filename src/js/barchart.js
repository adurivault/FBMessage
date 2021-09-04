function barChart(configGlobal) {
  const hBar = 12;
  const onMouseover = function () {};

  function chart(bc) {
    bc.xScale.domain([
      0,
      d3.max(bc.nestedData, function (d) {
        return d.value;
      }),
    ]);

    // On click, change the appearance of the bars, filter everything, and update barcharts, curves, and scatterplot
    function onClick(d) {
      gtag('event', 'Histogram', {
        eventCategory: 'Filter',
        eventLabel: bc.title,
      });

      // Update the "clicked" sets
      if (bc.clicked.has(d.key)) {
        bc.clicked.delete(d.key);
      } else {
        bc.clicked.add(d.key);
      }

      // Apply filters
      if (bc.clicked.size == 0) {
        bc.dimension.filter();
      } else {
        bc.dimension.filter(function (a) {
          return bc.clicked.has(a);
        });
      }

      // Update to match new filters
      updateAll();
    }

    // On mouseover, display tooltip
    function onMouseover(d) {
      div.transition().duration(200).style('opacity', 0.9);
      div
        .html(bc.getTooltip(d.key))
        .style('left', `${d3.event.pageX}px`)
        .style('top', `${d3.event.pageY - 28}px`);
      d3.select(this).classed('mouseovered', true);
    }

    // On mouseout, hide the tooltip
    function onMouseout(d) {
      div.transition().duration(200).style('opacity', 0);
      d3.select(this).classed('mouseovered', false);
    }

    // Select the svg element, if it exists.
    const svg = bc.divBody.selectAll('svg').data([bc.nestedData]);

    // Otherwise, create the skeletal chart.
    const svgEnter = svg.enter().append('svg');

    // Create a group for each bar. We will then add the bar and the labels to these groups
    const barElements = svgEnter
      .selectAll('.bar-element')
      .data(bc.nestedData)
      .enter()
      .append('g')
      .attr('class', 'bar-element')
      // .attr("id", function(d){try {return thisTemp.getData(d)} catch {return "other"}})
      .attr('transform', function (d, i) {
        return `translate(${0},${i * (hBar + 2)})`;
      });

    bc.xScale.domain([
      0,
      d3.max(bc.nestedData, function (d) {
        return d.value;
      }),
    ]);

    // Add bars
    barElements
      .append('rect')
      .attr('class', 'bar')
      .attr('height', hBar)
      .attr('width', function (d) {
        return bc.xScale(d.value);
      })
      .attr('transform', `translate(${margin3.left},${0})`)
      .style('fill', function (d) {
        if (bc.isColoredBarchart) {
          return colorScale(d.key);
        }
        return '';
      })
      .classed('unclicked', function (d) {
        return !(bc.clicked.size == 0 || bc.clicked.has(d.key));
      })
      .on('click', onClick)
      .on('mouseover', onMouseover)
      .on('mouseout', onMouseout);

    // Add number-labels to bar charts
    barElements
      .append('text')
      .attr('class', 'legend_hist_num')
      .attr('dy', '0.35em')
      .attr('y', `${hBar / 2}px`)
      .attr('x', function (d) {
        return bc.xScale(d.value) + 2;
      })
      .attr('text-anchor', 'left')
      .text(function (d) {
        return d.value;
      })
      .attr('transform', `translate(${margin3.left},${0})`)
      .on('click', onClick)
      .on('mouseover', onMouseover)
      .on('mouseout', onMouseout);

    // Add labels to bar charts
    barElements
      .append('text')
      .attr('class', 'legend_hist_text')
      .attr('dy', '0.35em')
      .attr('y', `${hBar / 2}px`)
      .text(function (d) {
        return bc.getLegend(d.key);
      })
      .on('click', onClick)
      .on('mouseover', onMouseover)
      .on('mouseout', onMouseout);

    // Adjust svg size
    bbox = svgEnter.nodes()[0].getBBox();
    svgEnter.attr('width', `${bbox.x + bbox.width}px`).attr('height', `${bbox.y + bbox.height}px`);
  }
  return chart;
}
