// Define stuff
let lengthTicks;
let reader;
let json;
let messages;
let dimSender;
let dimDate;
let dimTime;
let dimWeekday;
let dimSent;
let messagesArray = [];
let userName;
let coloredBarchart;

const cDomain = [];
colorScale = d3.scaleOrdinal();
colorScale.range([
  '#009688',
  '#8bc34a',
  '#ffeb3b',
  '#ff9800',
  '#f44336',
  '#ff66cc',
  '#9c27b0',
  '#673ab7',
  '#704880',
  '#795548',
]);

// Define div, svg, etc..
// D3 elements
const divTitle = d3.select('#title');
const divDensityTime = d3.select('#density_time');
const divMain = d3.select('#main');
const divFilters = d3.select('#filters');
const divDensityDate = d3.select('#density_date');
const divMessageDisplayer = d3.select('#message_displayer');
const divPlaceHolder = d3.select('#place_holder');

// JS Elements
const divTitleElement = document.getElementById('title');
const divFiltersElement = document.getElementById('filters');
const divMainElement = document.getElementById('main');
const divDensityDateElement = document.getElementById('density_date');
const divDensityTimeElement = document.getElementById('density_time');
const divMessageDisplayerElement = document.getElementById('message_displayer');
const divPlaceHolderElement = document.getElementById('place_holder');

// Define margins, heights and widths
// main
const margin1 = {
  top: 10,
  right: 20,
  bottom: 20,
  left: 40,
};
// Density date
const margin2 = {
  top: 10,
  right: 20,
  bottom: 30,
  left: 40,
};
// Filters
const margin3 = {
  top: 60,
  right: 60,
  bottom: 50,
  left: 40,
};
// Density time
const margin4 = {
  top: 10,
  right: 10,
  bottom: 20,
  left: 40,
};
// Message Displayer
const margin5 = {
  top: 10,
  right: 60,
  bottom: 10,
  left: 20,
};
// Title
const margin6 = {
  top: 40,
  right: 60,
  bottom: 10,
  left: 40,
};

const width = window.innerWidth;
const height = window.innerHeight;

// Set heights
const firstRowHeight = `${height * 0.7}px`;
const secondRowHeight = `${height * 0.2}px`;

divDensityTimeElement.style.height = firstRowHeight;
divMainElement.style.height = firstRowHeight;
divFiltersElement.style.height = firstRowHeight;
divPlaceHolderElement.style.height = secondRowHeight;
divDensityDateElement.style.height = secondRowHeight;
divMessageDisplayerElement.style.height = secondRowHeight;

// Set widths
const firstColWidth = '11%';
const secondColWidth = '69%';
const thirdColWidth = '19%';

divDensityTimeElement.style.width = firstColWidth;
divMainElement.style.width = secondColWidth;
divFiltersElement.style.width = thirdColWidth;
divPlaceHolderElement.style.width = firstColWidth;
divDensityDateElement.style.width = secondColWidth;
divMessageDisplayerElement.style.width = thirdColWidth;

const w1 = divMainElement.clientWidth - margin1.left - margin1.right;
const h1 = divMainElement.clientHeight - margin1.top - margin1.bottom;
const w2 = divDensityDateElement.clientWidth - margin2.left - margin2.right;
const h2 = divDensityDateElement.clientHeight - margin2.top - margin2.bottom;
const w3 = divFiltersElement.clientWidth - margin3.left - margin3.right;
const h3 = divFiltersElement.clientHeight - margin3.top - margin3.bottom;
const w4 = divDensityTimeElement.clientWidth - margin4.left - margin4.right;
const h4 = divDensityTimeElement.clientHeight - margin4.top - margin4.bottom;
const h5 = divMessageDisplayerElement.clientHeight - margin5.top - margin5.bottom;
const w5 = divMessageDisplayerElement.clientWidth - margin5.right - margin5.left;

margin3.inter = h3 / 10;

const hBar = 12;

// Define the pop-ups and the different action to open / close them
// Get the modal
const exploreModal = document.getElementById('ExploreModal');
const explanationModal = document.getElementById('ExplanationModal');
const processingModal = document.getElementById('ProcessingModal');

// Get the button that opens the modal
const exploreBtn = document.getElementById('ExploreBtn');
const explanationBtn = document.getElementById('ExplanationBtn');

// Get the <span> element that closes the modal
const span1 = document.getElementsByClassName('close')[0];
const span2 = document.getElementsByClassName('close')[1];
const span3 = document.getElementsByClassName('close')[2];
explanationModal.style.display = 'block';

// When the user clicks the button, open the modal
exploreBtn.onclick = function () {
  exploreModal.style.display = 'block';
};

explanationBtn.onclick = function () {
  explanationModal.style.display = 'block';
};

// When the user clicks on <span> (x), close the modal
span1.onclick = function () {
  exploreModal.style.display = 'none';
  explanationModal.style.display = 'none';
  processingModal.style.display = 'none';
};
span2.onclick = function () {
  exploreModal.style.display = 'none';
  explanationModal.style.display = 'none';
  processingModal.style.display = 'none';
};
span3.onclick = function () {
  exploreModal.style.display = 'none';
  explanationModal.style.display = 'none';
  processingModal.style.display = 'none';
};

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
  if (event.target == exploreModal || event.target == explanationModal) {
    exploreModal.style.display = 'none';
    explanationModal.style.display = 'none';
    processingModal.style.display = 'none';
  }
};

// Define the main elements : div, svg, etc..
const div = d3.select('body').append('div').attr('class', 'tooltip').style('opacity', 0);

const body = d3.select('body');

const densityDate = divDensityDate
  .append('svg')
  .attr('height', h2 + margin2.top + margin2.bottom)
  .attr('width', w2 + margin2.left + margin2.right);

const densityTime = divDensityTime
  .append('svg')
  .attr('height', h4 + margin4.top + margin4.bottom)
  .attr('width', w4 + margin4.left + margin4.right);

const axisTimeFocus = divMain
  .append('svg')
  .attr('width', margin1.left)
  .attr('height', h1 + margin1.bottom + margin1.top);

const canvas = divMain
  .append('canvas')
  .attr('width', w1)
  .attr('height', h1)
  .style('padding-top', `${margin1.top}px`)
  .style('vertical-align', 'top');

const canvasEl = document.querySelector('canvas');
const contextCanvas = canvasEl.getContext('2d');

const axisDateFocus = divMain
  .append('svg')
  .attr('width', w1 + margin1.left + margin1.right)
  .attr('height', margin1.bottom)
  .style('position', 'absolute')
  .style('left', `${0}px`)
  .style('top', `${margin1.top + h1}px`);

// Define parsers
const parseUTCDate = d3.timeParse('%Y-%m-%d');
const parseUTCDate2 = d3.timeParse('%W-%m-%Y');

// Define time constants which are used for the vertical scale
const minTime = new Date(2000, 0, 1);
minTime.setSeconds(1);
const maxTime = new Date(2000, 0, 1);
maxTime.setHours(23, 59, 59);

// Define scales and axes
// Main canvas
const x1 = d3.scaleTime().range([0, w1]);

const y1 = d3.scaleTime().range([0, h1]);

const xAxis1 = d3.axisBottom().scale(x1);

const yAxis1 = d3.axisLeft().scale(y1);

// Density date
const x2 = d3.scaleTime().range([0, w2]);

const y2 = d3.scaleLinear().range([h2, 0]);

const xAxis2 = d3.axisBottom().scale(x2);

// Density time
const x4 = d3.scaleLinear().range([0, w4]);

const y4 = d3.scaleTime().range([0, h4]).domain([minTime, maxTime]);

const yAxis4 = d3.axisLeft().scale(y4);

// Scale to convert numbers to labels and keep the correct order in barcharts
const numToDay = d3
  .scaleOrdinal()
  .domain([0, 6])
  .range(['Monday', 'Sunday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']);

const numToDayShort = d3.scaleOrdinal().domain([0, 6]).range(['Mon', 'Sun', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']);

const numToRs = d3.scaleOrdinal().domain([0, 1]).range(['Recvd', 'Sent']);

// Define brush and zoom
const brushDate = d3
  .brushX()
  .extent([
    [0, margin2.top],
    [w2, margin2.top + h2],
  ])
  .on('brush end', brushedDate);

const brushTime = d3
  .brushY()
  .extent([
    [margin4.left, 0],
    [margin4.left + w4, h4],
  ])
  .on('brush end', brushedTime);

// Define messageDisplayer
const mdSender = d3.select('#md_sender');
const mdThread = d3.select('#md_thread');
const mdDatetime = d3.select('#md_Datetime');
const mdMessage = d3.select('#md_message');

// Define colors
const colorBase = '#2c7bb6';

const barcharts = [
  {
    name: 'received-sent',
    title: 'Received / Sent',
    nBars: 'all',
    getData(d) {
      return d.sent;
    },
    getLegend: numToRs,
    getTooltip(s) {
      if (s) {
        return 'Sent';
      }
      return 'Received';
    },
  },
  {
    name: 'week-day',
    title: 'Week Day',
    nBars: 'all',
    getData(d) {
      return d.date.getDay();
    },
    getLegend: numToDayShort,
    getTooltip: numToDay,
  },
  // {
  //   "name": "Reactions",
  //   "nBars": "all",
  //   "getData": (function(d) {return d.reactions;}),
  //   "getLegend": (function(s){return String(s)}),
  //   "getTooltip": (function(s){return String(s)})
  // },
  {
    name: 'thread',
    title: 'Top 10 Threads',
    nBars: 10,
    getData(d) {
      return d.thread;
    },
    getLegend(s) {
      return s.substring(0, 5);
    },
    getTooltip(s) {
      return s.substring(0, 40);
    },
  },
  {
    name: 'nb-participants',
    title: 'Number of Participants',
    nBars: 'all',
    getData(d) {
      if (d.nbParticipants < 9) {
        return String(d.nbParticipants);
      }
      return '9 +';
    },
    getLegend(s) {
      return String(s);
    },
    getTooltip(s) {
      return String(s);
    },
  },
  {
    name: 'sender',
    title: 'Top 10 Senders',
    nBars: 10,
    getData(d) {
      return d.senderName;
    },
    getLegend(s) {
      return s.substring(0, 5);
    },
    getTooltip(s) {
      return s.substring(0, 40);
    },
  },
  {
    name: 'media',
    title: 'Media',
    nBars: 'all',
    getData(d) {
      return d.media;
    },
    getLegend(s) {
      return s.substring(0, 5);
    },
    getTooltip(s) {
      return s.substring(0, 40);
    },
  },
  {
    name: 'type',
    title: 'Type of message',
    nBars: 'all',
    getData(d) {
      return d.type;
    },
    getLegend(s) {
      return s.substring(0, 5);
    },
    getTooltip(s) {
      return s.substring(0, 40);
    },
  },
  {
    name: 'nb-characters',
    title: 'Number of characters',
    nBars: 'all',
    getData: findLengthTick,
    getLegend: tickToBin,
    getTooltip: tickToBin,
  },
];

function initializeBarchartParameters() {
  // Initialize parameters and build html structure
  divFilters.selectAll('.barchart-div').remove();
  for (j = 0; j < barcharts.length; j++) {
    bc = barcharts[j];
    bc.dimension = messages.dimension(bc.getData);
    bc.group = bc.dimension.group();
    bc.clicked = new Set();
    bc.isColoredBarchart = false;
    bc.xScale = d3.scaleLinear().range([0, w3]);

    bc.div = divFilters.append('div').attr('class', `barchart-div ${bc.name}`);

    bc.divHeader = bc.div.append('div').style('display', 'flex').style('align-items', 'center');

    bc.divImg = bc.divHeader.append('div').attr('width', '15 px').style('float', 'left');

    bc.img = bc.divImg
      .append('img')
      .attr('class', 'img-color')
      .attr('src', '../img/colors.png')
      .attr('height', '20px')
      .attr('width', '20px')
      .attr('onclick', `defineColoredBarchart("${bc.name}")`)
      .on('mouseover', function (d) {
        this.height = 22;
        this.width = 22;
      })
      .on('mouseout', function (d) {
        this.height = 20;
        this.width = 20;
      });

    bc.titleElement = bc.divHeader.append('div').style('float', 'left').style('margin-left', '20px').append('h1');

    bc.titleElement.attr('class', 'title_barchart').attr('text-anchor', 'start').style('margin', '2px').text(bc.title);

    bc.divBody = bc.div.append('div');
  }
}

// Create the function that will create all barcharts.
chart = barChart({});

function main() {
  parseDate();
  addSent();
  initializeLengthTicks();
  initializeCrossfilter();
  initializeBarchartParameters();
  drawBarcharts();
  addMessageDisplayer();
  initializeScatterplot();
  drawScatterplot();
  drawDensityDate();
  drawDensityTime();
  initializeBrush();
  processingModal.style.display = 'none';
}

function updateAll() {
  drawBarcharts();
  drawScatterplot();
  updateDensityDate();
  updateDensityTime();
}

function defineColoredBarchart(name) {
  barcharts.forEach(function (bc) {
    if (bc.name == name) {
      newColoredBarchart = bc;
    } // Identify the barchart corresponding to the name
  });
  if (coloredBarchart) {
    // If there already was one, remove attribute from old one
    coloredBarchart.isColoredBarchart = false;
    coloredBarchart.img.attr('src', '../img/colors.png');
  }
  if (newColoredBarchart == coloredBarchart) {
    // If clicked on the one active, remove everythin
    coloredBarchart = undefined;
    colorScale.domain([]);
  } else {
    // Else, change the colored barchart
    coloredBarchart = newColoredBarchart;
    coloredBarchart.isColoredBarchart = true;
    coloredBarchart.img.attr('src', '../img/colorsBw.png');
    colorScale.domain(coloredBarchart.nestedData.map((x) => x.key));
  }
  drawBarcharts();
  drawScatterplot();
}

function drawBarcharts() {
  for (j = 0; j < barcharts.length; j++) {
    bc = barcharts[j];

    if (bc.nBars == 'all') {
      bc.nestedData = bc.group.all();
    } else {
      bc.nestedData = bc.group.top(bc.nBars);
    }

    bc.divBody.select('svg').remove();
    chart(bc);
  }
}

function addSent() {
  // Identify the username of the user, and label each messaged as sent or not.
  userName = getUsername();
  messagesArray.forEach(function (d) {
    d.sent = d.senderName == userName;
  });
}

function getUsername() {
  // Identify the username of the user based on the user who appears in the most threads
  nbThreadsPerUser = d3
    .nest()
    .key(function (d) {
      return d.senderName;
    })
    .key(function (d) {
      return d.thread;
    })
    .rollup(function (leaves) {
      return leaves.length;
    })
    .entries(messagesArray);

  nbThreadsPerUser = nbThreadsPerUser.sort(function (x, y) {
    return d3.descending(x.values.length, y.values.length);
  });

  return nbThreadsPerUser[0].key;
}

function initializeCrossfilter() {
  messages = crossfilter(messagesArray);
  dimDate = messages.dimension(function (d) {
    return d.date;
  });
  dimTime = messages.dimension(function (d) {
    return d.timeMinutes;
  });
  dimDateTt = messages.dimension(function (d) {
    return d.date;
  }); // For tooltip
  dimTimeTt = messages.dimension(function (d) {
    return d.timeMinutes;
  }); // For tooltip
  groupDate = dimDate.group();
  groupTime = dimTime.group();
}

// reset the filter for a dimension
function resetDimensionFilter(dimension) {
  dimension.filter(null);
}

// reset filters for all given dimensions,
// remove all data from index and
// return empty index
function resetData(ndx, dimensions) {
  // Clear all filters from dimensions, because `ndx.remove`
  // only removes records matching the current filters.
  dimensions.forEach(resetDimensionFilter);

  // Remove all data from the cross filter
  ndx.remove();
}

function resetFilters() {
  gtag('event', 'reset', {
    eventCategory: 'Reset',
    eventLabel: 'All',
  });
  // Empty the clicked sets
  barcharts.forEach(function (bc) {
    bc.clicked = new Set();
  });
  // Reset the filter for each dimension
  dimensions = barcharts.map((x) => x.dimension);
  dimensions.forEach(resetDimensionFilter);
  // Update all charts to match nw filters
  updateAll();
  // Reset the brush position
  initializeBrush();
}

function reset() {
  dimensionsList = barcharts.map((x) => x.dimension);
  resetData(messages, dimensionsList);
  initializeCrossfilter();
  updateAll();
  initializeBrush();
}

function initializeLengthTicks() {
  // Define the bins' limits for the "number of characters" barchart"
  lengthTicks = [0, 1, 2, 5, 10, 20, 50, 100, 200, 500, 1000, 2000, 5000, 10000];
  lengthTicksStr = ['0', '1', '2', '5', '10', '20', '50', '100', '200', '500', '1k', '2k', '5k', '10k'];
}

function tickToBin(tick) {
  for (i = 1; i < 14; i++) {
    if (tick < lengthTicks[i]) {
      return `${lengthTicksStr[i - 1]}-${lengthTicksStr[i]}`;
    }
  }
  return `${lengthTicksStr[13]}- ∞`;
}

function findLengthTick(d) {
  for (i = 1; i < 14; i++) {
    if (d.length < lengthTicks[i]) {
      return lengthTicks[i - 1];
    }
  }
  return 10000;
}

function initializeScatterplot() {
  // initialize domains
  axisTimeFocus.selectAll('.axis--y').remove();
  axisDateFocus.selectAll('.axis--x').remove();

  const mindateTotal = d3.min(messagesArray, function (d) {
    return d.date;
  });
  const maxdateTotal = d3.max(messagesArray, function (d) {
    return d.date;
  });

  x1.domain([mindateTotal, maxdateTotal]);
  x2.domain([mindateTotal, maxdateTotal]);

  axisDateFocus
    .append('g')
    .attr('transform', `translate(${margin1.left},${0})`)
    .attr('class', 'x axis--x')
    .call(xAxis1);

  axisTimeFocus
    .append('g')
    .attr('transform', `translate(${margin1.left - 1},${margin1.top})`)
    .attr('class', 'y axis--y')
    .call(yAxis1);
}

function initializeBrush() {
  densityDate.selectAll('.brush').remove();
  densityTime.selectAll('.brush').remove();

  densityDate
    .append('g')
    .attr('class', 'brush')
    .call(brushDate)
    .call(brushDate.move, x2.range())
    .attr('transform', `translate(${margin2.left},${0})`);

  densityTime
    .append('g')
    .attr('class', 'brush')
    .call(brushTime)
    .call(brushTime.move, y4.range())
    .attr('transform', `translate(${0},${margin4.top})`);
}

function addMessageDisplayer() {
  canvas.on('mousemove', function () {
    // Identify the time and date corresponding to the mouse position. Add a +/- 2 pixel tolerance
    const findDateMin = x1.invert(d3.event.clientX - canvasEl.getBoundingClientRect().left - 2);
    const findDateMax = x1.invert(d3.event.clientX - canvasEl.getBoundingClientRect().left + 2);
    const findTimeMin = y1.invert(d3.event.clientY - canvasEl.getBoundingClientRect().top - margin1.top - 2);
    const findTimeMax = y1.invert(d3.event.clientY - canvasEl.getBoundingClientRect().top - margin1.top + 2);

    // Keep only messages that are in the tolerance window
    dimDateTt.filterRange([findDateMin, findDateMax]);
    dimTimeTt.filterRange([findTimeMin, findTimeMax]);
    const messageTooltip = messages.allFiltered();

    dimDateTt.filter();
    dimTimeTt.filter();

    if (messageTooltip.length > 0) {
      const fullDate = String(messageTooltip[0].date);
      const fullTime = String(messageTooltip[0].timeSeconds);

      mdSender.select('p').remove();
      mdSender
        .append('p')
        .attr('class', 'md_text')
        .append('text')
        .attr('class', 'md_text')
        .text(messageTooltip[0].senderName);

      mdThread.select('p').remove();
      mdThread
        .append('p')
        .attr('class', 'md_text')
        .append('text')
        .attr('class', 'md_text')
        .text(messageTooltip[0].thread);

      mdMessage.select('p').remove();
      mdMessage
        .append('p')
        .attr('class', 'md_text')
        .append('text')
        .attr('class', 'md_text')
        .text(messageTooltip[0].message);

      mdDatetime.select('p').remove();
      mdDatetime
        .append('p')
        .attr('class', 'md_text')
        .append('text')
        .attr('class', 'md_text')
        .text(fullDate.substring(0, 16) + fullTime.substring(16, 33));
    }
  });
}

function parseDate() {
  messagesArray.forEach(function (d) {
    date = new Date(d.timestamp * 1000);
    d.timeMinutes = getTimeMinutes(date); // Approximative (no seconds) used for the time density
    d.timeSeconds = getTimeSeconds(date); // Precise (add seconds) used for the scatterplot.
    d.date = getDate(date);
  });
}

function drawDensityDate() {
  // Draw the horizontal curve for density of messages along date of year
  densityDate.selectAll('.area').remove();
  densityDate.selectAll('.axis--x').remove();

  nestedDataDate = groupDate.all();
  nestedDataDate = d3
    .nest()
    .key(function (d) {
      return `${d.key.getWeek()}-${d.key.getMonth()}-${d.key.getFullYear()}`;
    })
    .rollup(function (leaves) {
      return d3.sum(leaves, function (d) {
        return parseFloat(d.value);
      });
    })
    .entries(nestedDataDate);

  nestedDataDate = nestedDataDate.sort(sortByDateAscending);

  const maxMessage = d3.max(nestedDataDate, function (d) {
    return d.value;
  });

  y2.domain([0, maxMessage]);

  const area = d3
    .area()
    .curve(d3.curveBasisOpen)
    .x(function (d) {
      return x2(parseUTCDate2(d.key));
    })
    .y0(h2)
    .y1(function (d) {
      return y2(d.value);
    });

  densityDate
    .append('path')
    .datum(nestedDataDate)
    .attr('class', 'area')
    .attr('d', area)
    .attr('transform', `translate(${margin2.left},${margin2.top})`);

  densityDate
    .append('g')
    .attr('transform', `translate(${margin2.left},${h2 + margin2.top})`)
    .attr('class', 'x axis--x')
    .call(xAxis2);
}

function updateDensityDate() {
  nestedDataDate = groupDate.all();
  nestedDataDate = d3
    .nest()
    .key(function (d) {
      return `${d.key.getWeek()}-${d.key.getMonth()}-${d.key.getFullYear()}`;
    })
    .rollup(function (leaves) {
      return d3.sum(leaves, function (d) {
        return parseFloat(d.value);
      });
    })
    .entries(nestedDataDate);

  nestedDataDate = nestedDataDate.sort(sortByDateAscending);

  const maxMessage = d3.max(nestedDataDate, function (d) {
    return d.value;
  });

  y2.domain([0, maxMessage]);

  const area = d3
    .area()
    .curve(d3.curveBasisOpen)
    .x(function (d) {
      return x2(parseUTCDate2(d.key));
    })
    .y0(h2)
    .y1(function (d) {
      return y2(d.value);
    });

  densityDate.selectAll('path').datum(nestedDataDate);

  densityDate.selectAll('.area').transition().attr('d', area);
}

function drawDensityTime() {
  // Draw the vertical curve for density of messages along time of day
  densityTime.selectAll().remove();
  nestedDataTime = groupTime.all();
  const maxMessage = d3.max(nestedDataTime, function (d) {
    return d.value;
  });

  x4.domain([0, maxMessage]);

  const area = d3
    .area()
    .curve(d3.curveBasisOpen)
    .y(function (d) {
      return y4(d.key);
    })
    .x0(0)
    .x1(function (d) {
      return x4(d.value);
    });

  densityTime
    .append('path')
    .datum(nestedDataTime)
    .attr('class', 'area')
    .attr('d', area)
    .attr('transform', `translate(${margin4.left},${margin4.top})`);

  densityTime
    .append('g')
    .attr('transform', `translate(${margin4.left},${margin4.top})`)
    .attr('class', function (d) {
      return 'y axis--y';
    })
    .call(yAxis4);
}

function updateDensityTime() {
  nestedDataTime = groupTime.all();
  const maxMessage = d3.max(nestedDataTime, function (d) {
    return d.value;
  });

  x4.domain([0, maxMessage]);

  const area = d3
    .area()
    .curve(d3.curveBasisOpen)
    .y(function (d) {
      return y4(d.key);
    })
    .x0(0)
    .x1(function (d) {
      return x4(d.value);
    });

  densityTime.selectAll('path').datum(nestedDataTime);

  densityTime.selectAll('.area').transition().attr('d', area);
}

function brushedDate() {
  gtag('event', 'Brush', {
    eventCategory: 'Brush',
    eventLabel: 'Date',
  });
  const s = d3.event.selection || x2.range();
  x1.domain(s.map(x2.invert, x2));
  dimDate.filter([x1.domain()[0], x1.domain()[1]]);
  updateDensityTime();
  drawScatterplot();
  drawBarcharts();

  axisDateFocus.select('.axis--x').call(xAxis1);
}

function brushedTime() {
  gtag('event', 'Brush', {
    eventCategory: 'Brush',
    eventLabel: 'Time',
  });
  const s = d3.event.selection || y4.range();
  y1.domain(s.map(y4.invert, y4));
  dimTime.filter([y1.domain()[0], y1.domain()[1]]);
  updateDensityDate();
  drawScatterplot();
  drawBarcharts();
  axisTimeFocus.select('.axis--y').call(yAxis1);
}

function drawScatterplot() {
  // Remove all the dots on the scatterplot, and redraw everything :
  // - based on the filtered datapoints
  // - based on the correct vertical and horizontal scales
  // - with the correct colors
  contextCanvas.clearRect(0, 0, canvasEl.width, canvasEl.height);
  messages.allFiltered().forEach(function (d) {
    // Plot one dot
    contextCanvas.beginPath();
    if (coloredBarchart && colorScale.domain().includes(coloredBarchart.getData(d))) {
      contextCanvas.fillStyle = colorScale(coloredBarchart.getData(d));
    } else {
      contextCanvas.fillStyle = colorBase;
    }
    contextCanvas.globalAlpha = 0.1;
    contextCanvas.arc(x1(d.date), y1(d.timeSeconds), 2, 0, 2 * Math.PI, true);
    contextCanvas.fill();
    contextCanvas.closePath();
  });
}

getDate = function (date) {
  string = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  return parseUTCDate(string);
};

getTimeSeconds = function (date) {
  const day = new Date(2000, 0, 1);
  day.setHours(date.getHours());
  day.setMinutes(date.getMinutes());
  day.setSeconds(date.getSeconds());
  return day;
};

getTimeMinutes = function (date) {
  const day = new Date(2000, 0, 1);
  day.setHours(date.getHours());
  day.setMinutes(date.getMinutes());
  return day;
};

Date.prototype.getWeek = function () {
  // Given a date, get the week number
  const date = new Date(this.getTime());
  date.setHours(0, 0, 0, 0);
  // Thursday in current week decides the year.
  date.setDate(date.getDate() + 3 - ((date.getDay() + 6) % 7));
  // January 4 is always in week 1.
  const week1 = new Date(date.getFullYear(), 0, 4);
  // Adjust to Thursday in week 1 and count number of weeks from date to week1.
  return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000 - 3 + ((week1.getDay() + 6) % 7)) / 7);
};

function sortByDateAscending(a, b) {
  // Dates will be cast to numbers automagically:
  return parseUTCDate2(a.key) - parseUTCDate2(b.key);
}

// Load the demo data to get an overview of the tool when first opening the website
d3.json('../data/demo_messages.json', loadDemo);

function loadDemo(jsonFile) {
  gtag('event', 'Load', {
    eventCategory: 'Load',
    eventLabel: 'Demo',
  });
  messagesArray = jsonFile.messagesArray;
  userName = getUsername();
  main();
}
