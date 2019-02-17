// Define stuff
{
  var length_ticks;
  var reader;
  var json;
  var messages, dim_sender, dim_date, dim_time, dim_weekday, dim_sent;
  var messages_array = [];
  var count_init = 0;
  var count_end = 0;
  var user_name = undefined;
  var coloredBarchart = undefined;
  var cnt_reset = 0;

  var c_domain = []
  colorScale = d3.scaleOrdinal()
  colorScale.range((['#009688', '#8bc34a', '#ffeb3b', '#ff9800', '#f44336',
  '#ff66cc', '#9c27b0', '#673ab7', '#704880', '#795548' ]))

  // Define div, svg, etc..
  {
    //D3 elements
      var div_title = d3.select('#title')
      var div_density_time = d3.select('#density_time')
      var div_main = d3.select('#main')
      var div_filters = d3.select('#filters')
      var div_density_date = d3.select('#density_date')
      var div_message_displayer = d3.select('#message_displayer')
      var div_place_holder = d3.select('#place_holder')

    //JS Elements
      var div_title_2 = document.getElementById("title")
      var div_filters_2 = document.getElementById("filters")
      var div_main_2 = document.getElementById("main")
      var div_density_date_2 = document.getElementById("density_date")
      var div_density_time_2 = document.getElementById("density_time")
      var div_message_displayer_2 = document.getElementById("message_displayer")
      var div_place_holder_2 = document.getElementById("place_holder")
  }

  //Define margins, heights and widths
  {
    //main
    var margin1 = {
      top: 10,
      right: 20,
      bottom: 20,
      left: 40,
    };
    //Density date
    var margin2 = {
      top: 10,
      right: 20,
      bottom: 30,
      left: 40,
    };
    // Filters
    var margin3 = {
      top: 60,
      right: 60,
      bottom: 50,
      left: 40,
    };
    //Density time
    var margin4 = {
      top: 10,
      right: 10,
      bottom: 20,
      left: 40,
    };
    //Message Displayer
    var margin5 = {
      top: 10,
      right: 60,
      bottom: 10,
      left: 20,
    };
    //Title
    var margin6 = {
      top: 40,
      right: 60,
      bottom: 10,
      left: 40,
    };

    var width = window.innerWidth;
    var height = window.innerHeight;

    // Set heights
    var first_row_height = (height*0.70) + "px";
    var second_row_height = (height*0.20) + "px";

    div_density_time_2.style.height = first_row_height;
    div_main_2.style.height = first_row_height;
    div_filters_2.style.height = first_row_height;
    div_place_holder_2.style.height = second_row_height;
    div_density_date_2.style.height = second_row_height;
    div_message_displayer_2.style.height = second_row_height;

    // Set widths
    var first_col_width = "11%";
    var second_col_width = "69%";
    var third_col_width = "19%";

    div_density_time_2.style.width = first_col_width;
    div_main_2.style.width = second_col_width;
    div_filters_2.style.width = third_col_width;
    div_place_holder_2.style.width = first_col_width;
    div_density_date_2.style.width = second_col_width;
    div_message_displayer_2.style.width = third_col_width;

    var w1 = div_main_2.clientWidth - margin1.left - margin1.right;
    var h1 = div_main_2.clientHeight - margin1.top - margin1.bottom;
    var w2 = div_density_date_2.clientWidth - margin2.left - margin2.right;
    var h2 = div_density_date_2.clientHeight - margin2.top - margin2.bottom;
    var w3 = div_filters_2.clientWidth - margin3.left - margin3.right;
    var h3 = div_filters_2.clientHeight - margin3.top - margin3.bottom;
    var w4 = div_density_time_2.clientWidth - margin4.left - margin4.right;
    var h4 = div_density_time_2.clientHeight - margin4.top - margin4.bottom;
    var h5 = div_message_displayer_2.clientHeight - margin5.top - margin5.bottom;
    var w5 = div_message_displayer_2.clientWidth - margin5.right - margin5.left;

    margin3.inter = h3/10

    var h_bar = 12;
  }

  // Define the pop-ups and the different action to open / close them
  {
    // Get the modal
    var exploreModal = document.getElementById('ExploreModal');
    var explanationModal = document.getElementById('ExplanationModal');
    var processingModal = document.getElementById('ProcessingModal');

    // Get the button that opens the modal
    var exploreBtn = document.getElementById("ExploreBtn");
    var explanationBtn = document.getElementById("ExplanationBtn");

    // Get the <span> element that closes the modal
    var span1 = document.getElementsByClassName("close")[0];
    var span2 = document.getElementsByClassName("close")[1];
    var span3 = document.getElementsByClassName("close")[2];
    explanationModal.style.display = "block";

    // When the user clicks the button, open the modal
    exploreBtn.onclick = function() {
        exploreModal.style.display = "block";
    }

    explanationBtn.onclick = function() {
        explanationModal.style.display = "block";
    }

    // When the user clicks on <span> (x), close the modal
    span1.onclick = function() {
        exploreModal.style.display = "none";
        explanationModal.style.display = "none";
        processingModal.style.display = "none";
    }
    span2.onclick = function() {
        exploreModal.style.display = "none";
        explanationModal.style.display = "none";
        processingModal.style.display = "none";
    }
    span3.onclick = function() {
        exploreModal.style.display = "none";
        explanationModal.style.display = "none";
        processingModal.style.display = "none";
    }

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
        if (event.target == exploreModal || event.target == explanationModal) {
            exploreModal.style.display = "none";
            explanationModal.style.display = "none";
            processingModal.style.display = "none";
        }
    }
  }

  // Define the main elements : div, svg, etc..
  {
    var div = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    var body = d3.select("body");

    var density_date = div_density_date
        .append("svg")
        .attr("height", (h2 + margin2.top + margin2.bottom))
        .attr("width", (w2 + margin2.left + margin2.right));

    var density_time = div_density_time
        .append("svg")
        .attr("height", (h4 + margin4.top + margin4.bottom))
        .attr("width", (w4 + margin4.left + margin4.right));

    var axis_time_focus = div_main
        .append("svg")
        .attr("width", margin1.left)
        .attr("height", h1 + margin1.bottom + margin1.top);

    var canvas = div_main
        .append("canvas")
        .attr("width", w1)
        .attr("height", h1)
        .style("padding-top", margin1.top + "px")
        .style("vertical-align", "top")

    var canvas_el = document.querySelector("canvas");
    var context_canvas = canvas_el.getContext("2d");

    var axis_date_focus = div_main
        .append("svg")
        .attr("width", (w1 + margin1.left + margin1.right))
        .attr("height", margin1.bottom)
        .style("position", "absolute")
        .style("left", 0 + "px")
        .style("top", (margin1.top + h1) + "px");
  }

  //Define parsers
  {
    var parseUTCDate = d3.timeParse("%Y-%m-%d");
    var parseUTCDate2 = d3.timeParse("%W-%m-%Y");
  }

  // Define time constants which are used for the vertical scale
  {
    var min_time = new Date(2000, 0, 1);
    min_time.setSeconds(1)
    var max_time = new Date(2000, 0, 1);
    max_time.setHours(23, 59, 59)
  }

  // Define scales and axes
  {
    //Main canvas
    var x1 = d3.scaleTime()
              .range([0, w1]);

    var y1 = d3.scaleTime()
              .range([0,h1]);

    var xAxis1 = d3.axisBottom()
              .scale(x1);

    var yAxis1 = d3.axisLeft()
              .scale(y1);

    // Density date
    var x2 = d3.scaleTime()
              .range([0, w2]);

    var y2 = d3.scaleLinear()
              .range([h2,0]);

    var xAxis2 = d3.axisBottom()
                .scale(x2);

    // Density time
    var x4 = d3.scaleLinear()
                .range([0, w4]);

    var y4 = d3.scaleTime()
              .range([0, h4])
              .domain([min_time, max_time]);

    var yAxis4 = d3.axisLeft()
              .scale(y4);

    // Scale to convert numbers to labels and keep the correct order in barcharts
    var num_to_day = d3.scaleOrdinal()
                .domain([0,6])
                .range(["Monday", "Sunday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]);

    var num_to_day_short = d3.scaleOrdinal()
                .domain([0,6])
                .range(["Mon", "Sun", "Tue", "Wed", "Thu", "Fri", "Sat"]);

    var num_to_rs = d3.scaleOrdinal()
                .domain([0,1])
                .range(["Recvd", "Sent"]);

  }

  // Define brush and zoom
  {
    var brush_date = d3.brushX()
        .extent([[0, margin2.top], [w2, margin2.top + h2]])
        .on("brush end", brushed_date);

    var brush_time = d3.brushY()
        .extent([[margin4.left, 0], [margin4.left + w4, h4]])
        .on("brush end", brushed_time);
  }

  // Define message_displayer
  {
      var md_sender = d3.select('#md_sender')
      var md_thread = d3.select('#md_thread')
      var md_datetime = d3.select('#md_datetime')
      var md_message = d3.select('#md_message')
  }

  // Define colors
  {
    var color_base =  "#2c7bb6";
  }
}

var barcharts = [
  {
    "name": "received-sent",
    "title": "Received / Sent",
    "n_bars": "all",
    "get_data": (function(d) {return d.sent;}),
    "get_legend": num_to_rs,
    "get_tooltip": (function(s){if (s) {return "Sent"} else {return "Received"}})
  },
  {
    "name": "week-day",
    "title": "Week Day",
    "n_bars": "all",
    "get_data": (function(d) {return d.date.getDay();}),
    "get_legend": num_to_day_short,
    "get_tooltip": num_to_day
  },
  // {
  //   "name": "Reactions",
  //   "n_bars": "all",
  //   "get_data": (function(d) {return d.reactions;}),
  //   "get_legend": (function(s){return String(s)}),
  //   "get_tooltip": (function(s){return String(s)})
  // },
  {
    "name": "thread",
    "title": "Top 10 Threads",
    "n_bars": 10,
    "get_data": (function(d) {return d.thread;}),
    "get_legend": (function(s){return s.substring(0,5)}),
    "get_tooltip": (function(s){return s.substring(0,40)})
  },
  {
    "name": "nb-participants",
    "title": "Number of Participants",
    "n_bars": "all",
    "get_data": (function(d){ if (d.nb_participants < 9){return String(d.nb_participants);} else {return "9 +";};}),
    "get_legend": (function(s){return String(s)}),
    "get_tooltip": (function(s){return String(s)})
  },
  {
    "name": "sender",
    "title": "Top 10 Senders",
    "n_bars": 10,
    "get_data": (function(d) {return d.sender_name;}),
    "get_legend": (function(s){return s.substring(0,5)}),
    "get_tooltip": (function(s){return s.substring(0,40)})
  },
  {
    "name": "media",
    "title": "Media",
    "n_bars": "all",
    "get_data": (function(d) {return d.media;}),
    "get_legend": (function(s){return s.substring(0,5)}),
    "get_tooltip": (function(s){return s.substring(0,40)})
  },
  {
    "name": "type",
    "title": "Type of message",
    "n_bars": "all",
    "get_data": (function(d) {return d.type;}),
    "get_legend": (function(s){return s.substring(0,5)}),
    "get_tooltip": (function(s){return s.substring(0,40)})
  },
  {
    "name": "nb-characters",
    "title": "Number of characters",
    "n_bars": "all",
    "get_data": find_length_tick,
    "get_legend": tick_to_bin,
    "get_tooltip": tick_to_bin
  },
]

function initialize_barchart_parameters() {
  // Initialize parameters and build html structure
  div_filters.selectAll(".barchart-div").remove()
  for(j=0; j<barcharts.length; j++){
    bc = barcharts[j]
    bc.dimension = messages.dimension(bc.get_data)
    bc.group = bc.dimension.group()
    bc.clicked = new Set()
    bc.isColoredBarchart = false
    bc.xScale = d3.scaleLinear().range([0, w3])

    bc.div = div_filters.append("div").attr("class", "barchart-div " + bc.name)

    bc.div_header = bc.div.append("div")
        .style("display", "flex")
        .style("align-items", "center")

    bc.div_img = bc.div_header.append("div")
        .attr("width", "15 px")
        .style("float", "left")

    bc.img = bc.div_img.append("img")
        .attr("class", "img-color")
        .attr("src", "img/colors.png")
        .attr("height", "20px")
        .attr("width", "20px")
        .attr("onclick", 'define_colored_barchart("' + bc.name + '")')
        .on("mouseover", function(d){this.height = 22; this.width = 22; })
        .on("mouseout", function(d){this.height = 20; this.width = 20; })

    bc.title_element = bc.div_header
        .append("div")
        .style("float", "left")
        .style("margin-left", "20px")
        .append("h1");

    bc.title_element
        .attr("class", "title_barchart")
        .attr("text-anchor", "start")
        .style("margin", "2px")
        .text(bc.title);


    bc.div_body = bc.div.append("div")
  }
}

// Create the function that will create all barcharts.
chart = barChart({})

function main(){
  parse_date();
  add_sent();
  initialize_length_ticks();
  initialize_crossfilter();
  initialize_barchart_parameters();
  draw_barcharts();
  add_message_displayer();
  initialize_scatterplot();
  draw_scatterplot();
  draw_density_date();
  draw_density_time();
  initialize_brush();
  processingModal.style.display = "none"
}

function update_all(){
  draw_barcharts()
  draw_scatterplot()
  update_density_date()
  update_density_time()
}

function define_colored_barchart(name){
  barcharts.forEach(function(bc){
    if (bc.name == name) {newColoredBarchart = bc} // Identify the barchart corresponding to the name
  })
  if (coloredBarchart) {  // If there already was one, remove attribute from old one
    coloredBarchart.isColoredBarchart = false
    coloredBarchart.img.attr("src", "img/colors.png")
  }
  if (newColoredBarchart == coloredBarchart){ // If clicked on the one active, remove everythin
    coloredBarchart = undefined;
    colorScale.domain([])
  } else { // Else, change the colored barchart
    coloredBarchart = newColoredBarchart
    coloredBarchart.isColoredBarchart = true
    coloredBarchart.img.attr("src", "img/colors_bw.png")
    colorScale.domain(coloredBarchart.nested_data.map(x=>x.key))
  }
  draw_barcharts()
  draw_scatterplot()
}


function draw_barcharts(){
  for(j=0; j<barcharts.length; j++){
    bc = barcharts[j]

    if (bc.n_bars=="all"){
      bc.nested_data =  bc.group.all()
    } else {
      bc.nested_data = bc.group.top(bc.n_bars)
    };

    bc.div_body.select("svg").remove()
    chart(bc)
  }
}

function add_sent(){
  // Identify the username of the user, and label each messaged as sent or not.
  user_name = get_username()
  messages_array.forEach(function(d){
    d.sent = d.sender_name == user_name
  })
}

function get_username(){
  // Identify the username of the user based on the user who appears in the most threads
  nb_threads_per_user = d3.nest()
        .key(function(d){return d.sender_name})
        .key(function(d) { return d.thread; })
        .rollup(function(leaves) { return leaves.length; })
        .entries(messages_array)

  nb_threads_per_user = nb_threads_per_user.sort(function(x, y){
         return d3.descending(x.values.length, y.values.length);
      })

  return nb_threads_per_user[0].key
}

function initialize_crossfilter(){
  messages = crossfilter(messages_array)
  dim_date = messages.dimension(function(d) {return d.date;})
  dim_time = messages.dimension(function(d) {return d.timeMinutes;})
  dim_date_tt = messages.dimension(function(d) {return d.date;}) //For tooltip
  dim_time_tt = messages.dimension(function(d) {return d.timeMinutes;}) //For tooltip
  group_date = dim_date.group()
  group_time = dim_time.group()
}


// reset the filter for a dimension
function resetDimensionFilter (dimension) {
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

function reset_filters(){
  gtag('event', 'reset', {
      'event_category': 'Reset',
      'event_Label': 'All'});
  // Empty the clicked sets
  barcharts.forEach(function(bc){bc.clicked = new Set()});
  // Reset the filter for each dimension
  dimensions = barcharts.map(x=>x.dimension)
  dimensions.forEach(resetDimensionFilter);
  // Update all charts to match nw filters
  update_all();
  // Reset the brush position
  initialize_brush();
}

function reset(){
  // if(cnt_reset>0){
    // try {
      dimensions_list = barcharts.map(x=>x.dimension)
      resetData(messages, dimensions_list)
      initialize_crossfilter();
      update_all();
      initialize_brush();
    // } catch {}
  // };
  // cnt_reset += 1

}

function initialize_length_ticks(){
  // Define the bins' limits for the "number of characters" barchart"
  length_ticks = [0,1,2,5,10,20,50,100,200,500,1000,2000,5000,10000]
  length_ticks_str = ["0","1","2","5","10","20","50","100","200","500","1k","2k","5k","10k"]
}

function tick_to_bin(tick){
  for (i=1; i<14; i++){
    if (tick < length_ticks[i]) {
      return  length_ticks_str[i-1] + "-" + length_ticks_str[i];
    }
  }
  return length_ticks_str[13] + "- ∞"
}

function find_length_tick(d){
  for (i=1; i<14; i++){
    if (d.length < length_ticks[i]) {return length_ticks[i-1];}
  }
  return 10000;
}

function initialize_scatterplot(){
  //initialize domains
  axis_time_focus.selectAll(".axis--y").remove();
  axis_date_focus.selectAll(".axis--x").remove();

  var mindate_total = d3.min(messages_array, function(d){return d.date}),
      maxdate_total = d3.max(messages_array, function(d){return d.date});

  x1.domain([mindate_total, maxdate_total]);
  x2.domain([mindate_total, maxdate_total]);


  axis_date_focus.append('g')
    .attr('transform', 'translate(' + margin1.left + ',' + 0 + ')')
    .attr('class', 'x axis--x')
    .call(xAxis1);

  axis_time_focus.append('g')
    .attr('transform', 'translate(' + (margin1.left - 1) + ',' + margin1.top + ')')
    .attr('class', 'y axis--y')
    .call(yAxis1);
}

function initialize_brush(){
  density_date.selectAll(".brush").remove()
  density_time.selectAll(".brush").remove()

  density_date.append("g")
        .attr("class", "brush")
        .call(brush_date)
        .call(brush_date.move, x2.range())
        .attr('transform', 'translate(' + margin2.left + ',' + 0 + ')');

  density_time.append("g")
        .attr("class", "brush")
        .call(brush_time)
        .call(brush_time.move, y4.range())
        .attr('transform', 'translate(' + 0 + ',' + margin4.top + ')');
}

function add_message_displayer(){
  canvas.on("mousemove", function() {

    // Identify the time and date corresponding to the mouse position. Add a +/- 2 pixel tolerance
    var find_date_min = x1.invert(d3.event.clientX - canvas_el.getBoundingClientRect().left-2);
    var find_date_max = x1.invert(d3.event.clientX - canvas_el.getBoundingClientRect().left+2);
    var find_time_min = y1.invert(d3.event.clientY - canvas_el.getBoundingClientRect().top-margin1.top-2);
    var find_time_max = y1.invert(d3.event.clientY - canvas_el.getBoundingClientRect().top-margin1.top+2);

    // Keep only messages that are in the tolerance window
    dim_date_tt.filterRange([find_date_min, find_date_max]);
    dim_time_tt.filterRange([find_time_min, find_time_max]);
    var message_tooltip = messages.allFiltered()

    dim_date_tt.filter();
    dim_time_tt.filter();

    if (message_tooltip.length > 0 ){
      var full_date = String(message_tooltip[0].date);
      var full_time = String(message_tooltip[0].timeSeconds);

      md_sender.select("p").remove()
      md_sender.append("p").attr("class", "md_text").append("text").attr("class", "md_text").text(message_tooltip[0].sender_name);

      md_thread.select("p").remove()
      md_thread.append("p").attr("class", "md_text").append("text").attr("class", "md_text").text(message_tooltip[0].thread);

      md_message.select("p").remove()
      md_message.append("p").attr("class", "md_text").append("text").attr("class", "md_text").text(message_tooltip[0].message);

      md_datetime.select("p").remove()
      md_datetime.append("p").attr("class", "md_text").append("text").attr("class", "md_text").text(full_date.substring(0,16) + full_time.substring(16,33))
    }

  })
}

function parse_date(){
  messages_array.forEach(function(d){
     date = new Date(d.timestamp * 1000);
     d.timeMinutes = getTimeMinutes(date); // Approximative (no seconds) used for the time density
     d.timeSeconds = getTimeSeconds(date); // Precise (add seconds) used for the scatterplot.
     d.date = getDate(date);
  })
};

function draw_density_date(){
  // Draw the horizontal curve for density of messages along date of year
  density_date.selectAll(".area").remove();
  density_date.selectAll(".axis--x").remove();

  nested_data_date = group_date.all()
  nested_data_date = d3.nest()
                          .key(function(d){ return d.key.getWeek() + '-' + d.key.getMonth() + '-' + d.key.getFullYear();})
                          .rollup(function(leaves) { return d3.sum(leaves, function(d) {return parseFloat(d.value);})})
                          .entries(nested_data_date)

  nested_data_date = nested_data_date.sort(sortByDateAscending);

  var max_message = d3.max(nested_data_date, function(d){return d.value});

  y2.domain([0, max_message]);

  var area = d3.area()
    .curve(d3.curveBasisOpen)
    .x(function(d) { return x2(parseUTCDate2(d.key));})
    .y0(h2)
    .y1(function(d) { return y2(d.value); });

  density_date.append("path")
      .datum(nested_data_date)
      .attr("class", "area")
      .attr("d", area)
      .attr('transform', 'translate(' + margin2.left + ',' + (margin2.top) + ')')

  density_date.append('g')
    .attr('transform', 'translate(' + margin2.left + ',' + (h2 + margin2.top) + ')')
    .attr('class', 'x axis--x')
    .call(xAxis2);
}

function update_density_date(){
  nested_data_date = group_date.all()
  nested_data_date = d3.nest()
                          .key(function(d){ return d.key.getWeek() + '-' + d.key.getMonth() + '-' + d.key.getFullYear();})
                          .rollup(function(leaves) { return d3.sum(leaves, function(d) {return parseFloat(d.value);})})
                          .entries(nested_data_date)

  nested_data_date = nested_data_date.sort(sortByDateAscending);

  var max_message = d3.max(nested_data_date, function(d){return d.value});

  y2.domain([0, max_message]);

  var area = d3.area()
    .curve(d3.curveBasisOpen)
    .x(function(d) {return x2(parseUTCDate2(d.key));})
    .y0(h2)
    .y1(function(d) { return y2(d.value); });

  density_date.selectAll("path")
    .datum(nested_data_date)

  density_date.selectAll(".area")
    .transition()
    .attr("d", area)
}

function draw_density_time(){
  // Draw the vertical curve for density of messages along time of day
  density_time.selectAll().remove()
  nested_data_time = group_time.all();
  var max_message = d3.max(nested_data_time, function(d){return d.value});

  x4.domain([0, max_message]);

  var area = d3.area()
    .curve(d3.curveBasisOpen)
    .y(function(d) { return y4(d.key);})
    .x0(0)
    .x1(function(d) { return x4(d.value); });

  density_time.append("path")
      .datum(nested_data_time)
      .attr("class", "area")
      .attr("d", area)
      .attr('transform', 'translate(' + margin4.left + ',' + (margin4.top) + ')');

  density_time.append('g')
    .attr('transform', 'translate(' + margin4.left + ',' + (margin4.top) + ')')
    .attr('class', function(d) {return 'y axis--y'})
    .call(yAxis4);
}

function update_density_time(){
  nested_data_time = group_time.all();
  var max_message = d3.max(nested_data_time, function(d){return d.value});

  x4.domain([0, max_message]);

  var area = d3.area()
    .curve(d3.curveBasisOpen)
    .y(function(d) { return y4(d.key);})
    .x0(0)
    .x1(function(d) { return x4(d.value); });

  density_time.selectAll("path")
    .datum(nested_data_time)

  density_time.selectAll(".area")
    .transition()
    .attr("d", area)
}

function brushed_date() {
  gtag('event', 'Brush', {
      'event_category': 'Brush',
      'event_label': 'Date'})
  var s = d3.event.selection || x2.range();
  x1.domain(s.map(x2.invert, x2));
  dim_date.filter([x1.domain()[0], x1.domain()[1]]);
  update_density_time();
  draw_scatterplot();
  draw_barcharts();

  axis_date_focus.select(".axis--x").call(xAxis1);

}

function brushed_time() {
  gtag('event', 'Brush', {
      'event_category': 'Brush',
      'event_label': 'Time'})
  var s = d3.event.selection || y4.range();
  y1.domain(s.map(y4.invert, y4));
  dim_time.filter([y1.domain()[0], y1.domain()[1]]);
  update_density_date();
  draw_scatterplot();
  draw_barcharts();
  axis_time_focus.select(".axis--y").call(yAxis1);
}

function draw_scatterplot(){
  // Remove all the dots on the scatterplot, and redraw everything :
  // - based on the filtered datapoints
  // - based on the correct vertical and horizontal scales
  // - with the correct colors
  context_canvas.clearRect(0, 0, canvas_el.width, canvas_el.height);
  messages.allFiltered().forEach(function(d){
    //Plot one dot
    context_canvas.beginPath();
    if (coloredBarchart && colorScale.domain().includes(coloredBarchart.get_data(d))){
      context_canvas.fillStyle = colorScale(coloredBarchart.get_data(d));
    } else {
      context_canvas.fillStyle = color_base;
    }
    context_canvas.globalAlpha = 0.1;
    context_canvas.arc(x1(d.date), y1(d.timeSeconds), 2, 0,  2 * Math.PI, true);
    context_canvas.fill()
    context_canvas.closePath();
  })
}

getDate = function(date){
  string = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
  return parseUTCDate(string);
}

getTimeSeconds = function(date){
  var day = new Date(2000, 0, 1);
  day.setHours(date.getHours());
  day.setMinutes(date.getMinutes());
  day.setSeconds(date.getSeconds());
  return day;
};

getTimeMinutes = function(date){
  var day = new Date(2000, 0, 1);
  day.setHours(date.getHours());
  day.setMinutes(date.getMinutes());
  return day;
};

Date.prototype.getWeek = function() {
  // Given a date, get the week number
   var date = new Date(this.getTime());
    date.setHours(0, 0, 0, 0);
   // Thursday in current week decides the year.
   date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
   // January 4 is always in week 1.
   var week1 = new Date(date.getFullYear(), 0, 4);
   // Adjust to Thursday in week 1 and count number of weeks from date to week1.
   return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000
                         - 3 + (week1.getDay() + 6) % 7) / 7);
}

function sortByDateAscending(a, b) {
   // Dates will be cast to numbers automagically:
   return (parseUTCDate2(a.key) - parseUTCDate2(b.key));
}

// Load the demo data to get an overview of the tool when first opening the website
d3.json("data/demo_messages.json", load_demo)

function load_demo(json_file){
  gtag('event', 'Load', {
      'event_category': 'Load',
      'event_label': 'Demo'})
  messages_array = json_file["messages_array"];
  user_name = get_username()
  main();
}
