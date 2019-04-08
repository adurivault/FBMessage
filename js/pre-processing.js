function read_files(files){
  // Go through selected files and perform pre-processing.
  explanationModal.style.display = "none"
  exploreModal.style.display = "none"
  processingModal.style.display = "block"
  var re = new RegExp('messages/.*message.*\.json');
  messages_array = []
  gtag('event', 'Load', {
      'event_category': 'Load',
      'event_label': 'Custom'})
  for (var i = 0; i < files.length; i++) {
    (function(file, i) {
      if (re.test(file.webkitRelativePath)){
      // if (file.webkitRelativePath.endsWith(".json")){
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
          count_end += 1 // Count the number of files that were processsed up to the end
          if (count_init == count_end){ // If allfiles were processed to the end, the launch main program
            // reset();
            main()
          }
        }
        reader.readAsText(file)
      }
    })(files[i], i);
  }
}
