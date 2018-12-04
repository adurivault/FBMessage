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
  var color_hist = undefined;


  var c_domain = []
  colorScale = d3.scaleOrdinal()
  colorScale.range((['#173F5F', '#20639B', '#3CAEA3', '#F6D55C', '#ED553B']))



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

  // Defin the pop-ups
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

  // Define div, svg, etc..
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
    var parseUTCDateHour = d3.timeParse("%Y-%m-%dT%H:%M%Z");
    var parseUTCDate = d3.timeParse("%Y-%m-%d");
    var parseUTCDate2 = d3.timeParse("%W-%m-%Y");
    var parseUTCDate_time = d3.timeParse("%Y-%m-%d-%H-%M");
  }

  // Define constants
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

    var num_to_day = d3.scaleOrdinal()
                .domain([0,6])
                .range(["Mon", "Sun", "Tue", "Wed", "Thu", "Fri", "Sat"]);

    var num_to_rs = d3.scaleOrdinal()
                .domain([0,1])
                .range(["Recvd", "Sent"]);

    // Density time
    var x4 = d3.scaleLinear()
                .range([0, w4]);

    var y4 = d3.scaleTime()
              .range([0, h4])
              .domain([min_time, max_time]);

    var yAxis4 = d3.axisLeft()
              .scale(y4);

  }

  // Define brush and zoom
  {
    var brush_date = d3.brushX()
        .extent([[0, margin2.top], [w2, margin2.top + h2]])
        .on("brush end", brushed_date);

    var brush_time = d3.brushY()
        .extent([[margin4.left, 0], [margin4.left + w4, h4]])
        .on("brush end", brushed_time);

    var zoom = d3.zoom()
      .scaleExtent([1, Infinity])
      .translateExtent([[0, margin2.top], [w2, margin2.top + h2]])
      .extent([[0, margin2.top], [w2, margin2.top + h2]])
      .on("zoom", zoomed);
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
    var default_color = "#737373";
  }
}

var histograms = [
  {
    "name": "Received / Sent",
    "n_bars": "all",
    "get_data": (function(d) {return d.sent;}),
    "get_legend": num_to_rs,
    "get_tooltip": (function(s){return ""})
  },
  {
    "name": "Week Day",
    "n_bars": "all",
    "get_data": (function(d) {return d.date.getDay();}),
    "get_legend": num_to_day,
    "get_tooltip": (function(s){return ""})
  },
  // {
  //   "name": "Reactions",
  //   "n_bars": "all",
  //   "get_data": (function(d) {return d.reactions;}),
  //   "get_legend": (function(s){return String(s)}),
  //   "get_tooltip": (function(s){return String(s)})
  // },
  {
    "name": "Top 10 Threads",
    "n_bars": 10,
    "get_data": (function(d) {return d.thread;}),
    "get_legend": (function(s){return s.substring(0,6)}),
    "get_tooltip": (function(s){return s.substring(0,40)})
  },
  {
    "name": "Number of Participants",
    "n_bars": "all",
    "get_data": (function(d) {return data_nb_part(d.nb_participants);}),
    "get_legend": (function(s){return String(s)}),
    "get_tooltip": (function(s){return String(s)})
  },
  {
    "name": "Top 10 Senders",
    "n_bars": 10,
    "get_data": (function(d) {return d.sender_name;}),
    "get_legend": (function(s){return s.substring(0,6)}),
    "get_tooltip": (function(s){return s.substring(0,40)})
  },
  {
    "name": "Media",
    "n_bars": "all",
    "get_data": (function(d) {return d.media;}),
    "get_legend": (function(s){return s.substring(0,6)}),
    "get_tooltip": (function(s){return s.substring(0,40)})
  },
  {
    "name": "Type of message",
    "n_bars": "all",
    "get_data": (function(d) {return d.type;}),
    "get_legend": (function(s){return s.substring(0,6)}),
    "get_tooltip": (function(s){return s.substring(0,40)})
  },
  {
    "name": "Number of characters",
    "n_bars": "all",
    "get_data": find_length_tick,
    "get_legend": tick_to_bin,
    "get_tooltip": (function(s){return ""})
  },
]

class Histogram {

  constructor(record) {
    this.name = record.name;
    this.n_bars = record.n_bars;
    this.div = div_filters.append("div");
    this.title = this.div.append("h1");
    this.svg = this.div.append("svg");
    this.clicked = new Set();
    this.x = d3.scaleLinear().range([0, w3]);
    this.y = record.y;
    this.dimension = messages.dimension(record.get_data)
    this.group = this.dimension.group()
    this.get_legend = record.get_legend
    this.get_tooltip = record.get_tooltip
    this.get_data = record.get_data

    this.title.attr("class", "title_graph").attr("text-anchor", "start").text(this.name);
    this.display()
  }

  get nested_data() {
    if (this.n_bars=="all"){ return this.group.all()}
    else {return this.group.top(this.n_bars)}
  }

  clear() {
   this.svg.selectAll('.bar')
      .remove();
   this.svg.selectAll('.y')
      .remove();
  }

  update_clicked(d) {
    if (this.clicked.has(d.key))
       {this.clicked.delete(d.key)}
    else
       {this.clicked.add(d.key);}
  }

  draw_bars() {
    this_temp = this
    this.bars = this.svg.selectAll(".bar")
     .data(this.nested_data)
     .enter().append("g")
       .attr("class", "bar")
       .attr("id", function(d){try {return this_temp.get_data(d)} catch {return "other"}})
       .attr("transform", function(d, i) { return "translate(" + 0 + "," + i*(h_bar+2) + ")"; });

    this.x.domain([0, d3.max(this.nested_data, function(d) {return d.value;})])
    var this_temp = this
    this.bars.append("rect")
        .style("fill", function(d){if(this_temp == color_hist.instance){return colorScale(d.key)} else {return default_color;}})
        .style("opacity", function(d){
            if(this_temp.clicked.size == 0){return 1;}
            if(this_temp.clicked.has(d.key)){
              return 1;
            } else {
              return 0.5;
            };})
       .attr("height", h_bar)
       .attr("width", function(d) {return this_temp.x(d.value); })
       .attr("transform", "translate(" + margin3.left + "," + 0 + ")")
       .on("mouseover", function(d) {
              div.transition()
                  .duration(200)
                  .style("opacity", .9);
              div.html(this_temp.get_tooltip(d.key))
                 .style("left", (d3.event.pageX) + "px")
                 .style("top", (d3.event.pageY - 28) + "px");

              d3.select(this).style("stroke-opacity", 1);
        })
       .on("mouseout", function () {d3.select(this).style("stroke-opacity", 0.0);})
       .on("click", function(d){
         gtag('event', 'Histogram', {
              'event_category': 'Filter',
              'event_label': this_temp.title})
          if (this_temp.clicked.has(d.key))
             {this_temp.clicked.delete(d.key)}
          else
             {this_temp.clicked.add(d.key);}

          if (this_temp.clicked.size == 0) {
            this_temp.dimension.filter()
          } else {
             this_temp.dimension.filter(function(a){return this_temp.clicked.has(a)})
          }
          this_temp.redraw_all();
       })
  }

  draw_stuff(){
     // Add legends and stuff
     var this_temp = this
     this.bars.append("text")
        .attr("class", "legend_hist_num")
        .attr("dy", "0.35em")
        .attr("y", h_bar/2 + "px")
        .attr("x", function(d) {return this_temp.x(d.value) +2; })
        .attr("text-anchor", "left")
        .text(function(d) { return d.value; })
        .attr("transform", "translate(" + margin3.left + "," + 0 + ")")
        .on("click", function(d){
                 gtag('event', 'Histogram', {
                      'event_category': 'Filter',
                      'event_label': this_temp.title})
                  if (this_temp.clicked.has(d.value))
                     {this_temp.clicked.delete(d.value)}
                  else
                     {this_temp.clicked.add(d.value);}

                  if (this_temp.clicked.size == 0) {
                    //Color all bar as selected
                    this_temp.svg.selectAll(".bar")
                      .selectAll("rect")
                      .style("fill", function(d){if(this_temp == color_hist.instance){return colorScale(d.id)} else {return default_color;}})
                      .style("opacity", 1);
                    //Remove filter
                    this_temp.dimension.filter()
                  } else {
                    //Color all bars according to selected or not
                    this_temp.svg.selectAll(".bar")
                      .selectAll("rect")
                      .style("fill", default_color)
                      .style("fill", function(d){
                          if(this_temp.clicked.has(d.value)){
                            return default_color;
                          } else {
                            return color_unselected;
                          };}
                      )
                     //Apply filters
                     this_temp.dimension.filter(function(a){return this_temp.clicked.has(a)})
                  }
                  this_temp.redraw_all();
               });

     this.bars.append("text")
        .attr("class", "legend_hist_text")
        .attr("dy", "0.35em")
        .attr("y", h_bar/2 + "px")
        .text(function(d){return this_temp.get_legend(d.key)})
        .on("click", function(d){
                 gtag('event', 'Histogram', {
                      'event_category': 'Filter',
                      'event_label': this_temp.title})
                  if (this_temp.clicked.has(d.key))
                     {this_temp.clicked.delete(d.key)}
                  else
                     {this_temp.clicked.add(d.key);}

                  if (this_temp.clicked.size == 0) {
                    //Color all bar as selected
                    this_temp.svg.selectAll(".bar")
                      .selectAll("rect")
                      .style("fill", function(d){if(this_temp == color_hist.instance){return colorScale(d.id)} else {return default_color;}})
                      .style("opacity", 1);
                    //Remove filter
                    this_temp.dimension.filter()
                  } else {
                    //Color all bars according to selected or not
                    this_temp.svg.selectAll(".bar")
                      .selectAll("rect")
                      .style("fill", function(d){
                          if(this_temp.clicked.has(d.key)){
                            return default_color;
                          } else {
                            return color_unselected;
                          };}
                      )
                     //Apply filters
                     this_temp.dimension.filter(function(a){return this_temp.clicked.has(a)})
                  }
                  this_temp.redraw_all();
               });;
  }

  update_colors_and_filters(d){
    if (this.clicked.size == 0) {
      //Color all bar as selected
      this.svg.selectAll(".bar")
        .selectAll("rect")
        .style("fill", function(d){if(this_temp == color_hist.instance){return colorScale(d.id)} else {return default_color;}})
        .style("opacity", 1);
      //Remove filter
      dimension.filter()
    } else {
      //Color all bars according to selected or not
      this.svg.selectAll(".bar")
        .selectAll("rect")
        .style("fill", function(d){
            if(this.clicked.has(d.key)){
              return default_color;
            } else {
              return color_unselected;
            };}
        )
       //Apply filters
       dimension.filter(function(a){return this.clicked.has(a)})
     }
  }

  adjust_svg_size(){
    var bbox = this.svg.nodes()[0].getBBox();
    this.svg
      .attr("width", bbox.x + bbox.width  + "px")
      .attr("height",bbox.y + bbox.height + "px")
  }

  redraw_all() {
    for (var i = 0; i < histograms.length; i++) {histograms[i].instance.display()};
    update_density_date();
    update_density_time();
    create_scatterplot();
  }

  update(d){
    this.update_clicked(d);
    this.update_colors_and_filters(d);
    this.redraw_all();
  }

  display() {
    this.clear();
    this.draw_bars();
    this.draw_stuff();
    this.adjust_svg_size();
  }
}

function read(files){
  explanationModal.style.display = "none"
  exploreModal.style.display = "none"
  processingModal.style.display = "block"
  messages_array = []
  gtag('event', 'Load', {
      'event_category': 'Load',
      'event_label': 'Custom'})
  for (var i = 0; i < files.length; i++) {
    (function(file, i) {
      if (file.webkitRelativePath.endsWith("message.json")){
        count_init += 1
        var reader = new FileReader()
        reader.onloadend = function(){
            thread = JSON.parse(reader.result)

          thread_info = {
            'is_still_participant': thread['is_still_participant'],
            'thread_type': thread['thread_type'],
            'thread': decodeURIComponent(escape(thread['title'])),
          }
          try {
            thread_info['nb_participants'] = thread['participants'].length
          } catch {
            thread_info['nb_participants'] = 0
          }

          thread_messages = thread['messages']
          for (var i=0; i<thread_messages.length; i++){
            message = thread_messages[i]
            message_info = {
              'sender_name': decodeURIComponent(escape(message['sender_name'])),
              'timestamp': message['timestamp'] || (message['timestamp_ms'] / 1000),
              'type': message['type'],
            }

            if(message['photos'] != undefined){
              message_info['media'] = "Photo"
            }
            else if (message['videos'] != undefined){
              message_info['media'] = "Video"
            }
            else if(message['files'] != undefined){
              message_info['media'] = "File"
            }
            else {
              message_info['media'] = "None"
            }

            try {
              message_info['message'] = decodeURIComponent(escape(message['content']))
            } catch {
              message_info['message'] = ""
            }

            try {
              message_info['length'] = decodeURIComponent(escape(message['content'])).length
            } catch {
              message_info['length'] = 0
            }

            // if (message['reactions'].length == undefined) {
            //     message_info['reactions'] = 0
            // } else {
            //     message_info['reactions'] = 0
            // }
            messages_array.push(Object.assign({}, message_info, thread_info));
          }
          count_end += 1
          if (count_init == count_end){
            main()
          }
        }
        reader.readAsText(file)
      }
    })(files[i], i);
  }
}

function main(){
  reset();
  parse_date();
  add_sent();
  initialize_length_ticks();
  initialize_crossfilter();
  draw_barcharts();
  add_message_displayer();
  initialize_scatterplot();
  draw_density_date();
  draw_density_time();
  initialize_brush();
  processingModal.style.display = "none"
}

function draw_barcharts(){
  color_hist = histograms[2];
  for(j=0; j<histograms.length; j++){
    try{histograms[j].instance.div.remove()} catch{} // If first round, cant remomve
    histograms[j].instance = new Histogram(histograms[j])
  }
  c_domain = []
  bars = color_hist.instance.bars._groups[0]
  bars.forEach(function(bar){c_domain.push(bar.__data__.key)})
  colorScale.domain(c_domain)
}

function add_sent(){
  user_name = get_username()
  messages_array.forEach(function(d){
    d.sent = d.sender_name == user_name
  })
}

function get_username(){
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
  dim_time = messages.dimension(function(d) {return d.time;})
  dim_date_tt = messages.dimension(function(d) {return d.date;}) //For tooltip
  dim_time_tt = messages.dimension(function(d) {return d.time;}) //For tooltip
  group_date = dim_date.group()
  group_time = dim_time.group()
}

function reset(){
  console.log("reset")
  try {
    gtag('event', 'reset', {
        'event_category': 'Reset',
        'event_Label': 'All'})
    initialize_crossfilter();
    update_density_date();
    update_density_time();
    create_scatterplot();
    initialize_brush();
  } catch {}
}

function initialize_length_ticks(){
  length_ticks = [0,1,2,5,10,20,50,100,200,500,1000,2000,5000,10000]
  length_ticks_str = ["0","1","2","5","10","20","50","100","200","500","1k","2k","5k","10k"]
}

function data_nb_part(n){
  if (n < 9) {return String(n)}
  else {return "9 +"}

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

  create_scatterplot();

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

    var find_date_min = x1.invert(d3.event.clientX - canvas_el.getBoundingClientRect().left-2);
    var find_date_max = x1.invert(d3.event.clientX - canvas_el.getBoundingClientRect().left+2);
    var find_time_min = y1.invert(d3.event.clientY - canvas_el.getBoundingClientRect().top-margin1.top-2);
    var find_time_max = y1.invert(d3.event.clientY - canvas_el.getBoundingClientRect().top-margin1.top+2);

    dim_date_tt.filterRange([find_date_min, find_date_max]);
    dim_time_tt.filterRange([find_time_min, find_time_max]);
    var message_tooltip = messages.allFiltered()

    dim_date_tt.filter();
    dim_time_tt.filter();

    if (message_tooltip.length > 0 ){
      var full_date = String(message_tooltip[0].date);
      var full_time = String(message_tooltip[0].time);

      md_sender.select("p").remove()
      md_sender.append("p").attr("class", "md_text").append("text").attr("class", "md_text").text(message_tooltip[0].sender_name);

      md_thread.select("p").remove()
      md_thread.append("p").attr("class", "md_text").append("text").attr("class", "md_text").text(message_tooltip[0].thread);

      md_message.select("p").remove()
      md_message.append("p").attr("class", "md_text").append("text").attr("class", "md_text").text(message_tooltip[0].message);

      md_datetime.select("p").remove()
      md_datetime.append("p").attr("class", "md_text").append("text").attr("class", "md_text").text(full_date.substring(0,16) + full_time.substring(17,33))
    }

  })
}

function parse_date(){
  messages_array.forEach(function(d){
     date = new Date(d.timestamp * 1000);
     d.time = getTime(date);
     d.date = getDate(date);
  })
};

function draw_density_date(){
  density_date.selectAll(".area").remove();
  density_date.selectAll(".axis--x").remove();

  var nested_data_date = group_date.all()
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

function zoomed(){
   if (d3.event.sourceEvent && d3.event.sourceEvent.type === "brush") {return;}; // ignore zoom-by-brush
   var t = d3.event.transform;
   x1.domain(t.rescaleX(x2).domain());
   dim_date.filter([x1.domain()[0], x1.domain()[1]])
   dim_time.filter([y1.domain()[0], y1.domain()[1]])
   update_density_date();
   update_density_time();
   for (var i = 0; i < histograms.length; i++) {histograms[i].instance.display()};
   create_scatterplot();

   axis_date_focus.select(".axis--x").call(xAxis1);
   axis_time_focus.select(".axis--y").call(yAxis1);

   density_date.select(".brush")
      .call(brush_date.move, x1.range().map(t.invertX, t));
}

function brushed_date() {
  gtag('event', 'Brush', {
      'event_category': 'Brush',
      'event_label': 'Date'})
  if (d3.event.sourceEvent && d3.event.sourceEvent.type === "zoom"){return;}; // ignore brush-by-zoom
  var s = d3.event.selection || x2.range();
  x1.domain(s.map(x2.invert, x2));
  dim_date.filter([x1.domain()[0], x1.domain()[1]]);
  update_density_time();
  for (var i = 0; i < histograms.length; i++) {histograms[i].instance.display()};
  create_scatterplot();

  axis_date_focus.select(".axis--x").call(xAxis1);

  density_date.select(".zoom")
   .call(zoom.transform, d3.zoomIdentity
                            .scale(width / (s[1] - s[0]))
                            .translate(-s[0], 0)
        );
}

function brushed_time() {
  gtag('event', 'Brush', {
      'event_category': 'Brush',
      'event_label': 'Time'})
  if (d3.event.sourceEvent && d3.event.sourceEvent.type === "zoom"){return;}; // ignore brush-by-zoom
  var s = d3.event.selection || y4.range();
  y1.domain(s.map(y4.invert, y4));
  dim_time.filter([y1.domain()[0], y1.domain()[1]]);
  update_density_date();
  for (var i = 0; i < histograms.length; i++) {histograms[i].instance.display()};
  create_scatterplot();

  axis_time_focus.select(".axis--y").call(yAxis1);

  density_date.select(".zoom")
   .call(zoom.transform, d3.zoomIdentity
                            .scale(width / (s[1] - s[0]))
                            .translate(-s[0], 0)
        );
}

function create_scatterplot(){
  context_canvas.clearRect(0, 0, canvas_el.width, canvas_el.height);
  messages.allFiltered().forEach(function(d){
    //Plot one dot
    context_canvas.beginPath();
    if (colorScale.domain().includes(color_hist.get_data(d))){
      context_canvas.fillStyle = colorScale(d.thread);
    } else {
      context_canvas.fillStyle = default_color;
    }
    context_canvas.globalAlpha = 1;
    context_canvas.arc(x1(d.date), y1(d.time), 1, 0,  2*Math.PI, true);
    context_canvas.fill()
    context_canvas.closePath();
  })
}

getDate = function(date){
  string = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
  return parseUTCDate(string);
}

getTime = function(date){
  var day = new Date(2000, 0, 1);
  day.setHours(date.getHours());
  day.setMinutes(date.getMinutes());
  return day;
};

Date.prototype.getWeek = function() {
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

function sortByDateAscending_time(a, b) {
   // Dates will be cast to numbers automagically:
   return (parseUTCDate_time(a.key) - parseUTCDate_time(b.key));
}

function sortByAscending(a, b) {
   // Dates will be cast to numbers automagically:
   return (a-b);
}

function precisionRound(number, precision) {
   var factor = Math.pow(10, precision);
   return Math.round(number * factor) / factor;
}

d3.json("data/demo_messages.json", load_demo)

function load_demo(json_file){
  gtag('event', 'Load', {
      'event_category': 'Load',
      'event_label': 'Demo'})
  messages_array = json_file["messages_array"];

  user_name = get_username()
  main();
}
