function read_files(files){
  // Go through selected files and perform pre-processing.
  explanationModal.style.display = "none"
  exploreModal.style.display = "none"
  processingModal.style.display = "block"
  // Any JSON file in messages/ folder that contains "message" in its name
  var re1 = new RegExp('messages/.*message.*\.json');
  // or any JSON file directly in messages/encrypted folder (but not in subfolders)
  var re2 = new RegExp('messages/encrypted/[^/]*\.json');
  messages_array = []
  gtag('event', 'Load', {
      'event_category': 'Load',
      'event_label': 'Custom'})
  for (var i = 0; i < files.length; i++) {
    (function(file, i) {
      if (re1.test(file.webkitRelativePath) || re2.test(file.webkitRelativePath)){
      // if (file.webkitRelativePath.endsWith(".json")){
        count_init += 1
        var reader = new FileReader()
        reader.onloadend = function(){
            thread = JSON.parse(reader.result)

          thread_info = {
            'is_still_participant': thread['is_still_participant'] ?? true,
            'thread_type': thread['thread_type'],
            'thread': thread['title'] !== undefined ? decodeURIComponent(escape(thread['title'])) : thread["threadName"]
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
              'sender_name': message['sender_name'] !== undefined ? decodeURIComponent(escape(message['sender_name'])) : message["senderName"],
              'timestamp': ((message['timestamp_ms'] ?? message["timestamp"]) / 1000),
              'type': message['type'] ?? "Generic"
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
            else if(message['media']?.length > 0){
              uri = message['media'][0]['uri']
              // check uri extension
              if (uri.endsWith('.jpg') || uri.endsWith('.jpeg') || uri.endsWith('.png')){
                message_info['media'] = "Photo"
              }
              else if (uri.endsWith(".mp4")) {
                message_info['media'] = "Video"
              }
              else {
                message_info['media'] = "File"
              }
            }
            else {
              message_info['media'] = "None"
            }

            try {
              message_info['message'] = message['content'] !== undefined ? decodeURIComponent(escape(message['content'])) : message["text"]
            } catch {
              message_info['message'] = ""
            }

            try {
              message_info['length'] = message_info['message'].length
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
