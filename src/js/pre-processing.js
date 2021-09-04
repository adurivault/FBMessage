function readFiles(files) {
  // Go through selected files and perform pre-processing.
  explanationModal.style.display = 'none';
  exploreModal.style.display = 'none';
  processingModal.style.display = 'block';
  const re = new RegExp('messages/.*message.*.json');
  messagesArray = [];
  gtag('event', 'Load', {
    eventCategory: 'Load',
    eventLabel: 'Custom',
  });
  let countEnd = 0;
  let countInit = 0;
  for (let i = 0; i < files.length; i++) {
    (function (file, i) {
      if (re.test(file.webkitRelativePath)) {
        // if (file.webkitRelativePath.endsWith(".json")){
        countInit += 1;
        const reader = new FileReader();
        reader.onloadend = function () {
          thread = JSON.parse(reader.result);

          threadInfo = {
            isStillParticipant: thread.isStillParticipant,
            threadType: thread.threadType,
            thread: decodeURIComponent(escape(thread.title)),
          };
          try {
            threadInfo.nbParticipants = thread.participants.length;
          } catch (error) {
            threadInfo.nbParticipants = 0;
          }

          threadMessages = thread.messages;
          for (let i = 0; i < threadMessages.length; i++) {
            message = threadMessages[i];
            messageInfo = {
              senderName: decodeURIComponent(escape(message.senderName)),
              timestamp: message.timestamp || message.timestampMs / 1000,
              type: message.type,
            };

            if (message.photos != undefined) {
              messageInfo.media = 'Photo';
            } else if (message.videos != undefined) {
              messageInfo.media = 'Video';
            } else if (message.files != undefined) {
              messageInfo.media = 'File';
            } else {
              messageInfo.media = 'None';
            }

            try {
              messageInfo.message = decodeURIComponent(escape(message.content));
            } catch (error) {
              messageInfo.message = '';
            }

            try {
              messageInfo.length = decodeURIComponent(escape(message.content)).length;
            } catch (error) {
              messageInfo.length = 0;
            }

            // if (message['reactions'].length == undefined) {
            //     messageInfo['reactions'] = 0
            // } else {
            //     messageInfo['reactions'] = 0
            // }
            messagesArray.push({ ...messageInfo, ...threadInfo });
          }
          countEnd += 1; // Count the number of files that were processsed up to the end
          if (countInit == countEnd) {
            // If allfiles were processed to the end, the launch main program
            // reset();
            main();
          }
        };
        reader.readAsText(file);
      }
    })(files[i], i);
  }
}
