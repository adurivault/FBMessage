# FBMessage : Facebook Messages Vizualisation

Authors : [Mathilde Reynaud](https://github.com/MathReynaud) | [Augustin Durivault](https://github.com/adurivault) 

The goal of this project is to allow you to visualize your own Facebook Messages in your browser, with a nice graphical display that gives insights on when, to whom, etc... you send (or receive) messages. If you have always been curious about your Facebook messages
history, maybe you will find some answers here.

## How does it work ? 

### Create your datafile from your Facebook History
Just follow the instructions from the <a href="/DATA.md"> DATA.md</a> file and the <a href="/PROCESSING.md"> PROCESSING.md</a>, everything is explained. Once you got your data ready, you can go on the [website](https://mathreynaud.github.io). 

## Presentation video

There is a presentation [video] of this project, and if you are a little bit lost on how to use the tool, or on how to get your data
you will theoretically find an answer here. 

### General design

If you go [here](https://mathreynaud.github.io) you will see that there is already some data on the interface. It is just there for
the demonstration and if you want to get familiar with the tool, or if you do not have any facebook account, you can
play with the demo data but this will not be very interesting, as everything is anonymous.

What it is represented is very simple : one point corresponds to one message received or send, and the color of the point depends on if the message has been receveid or sent. The top of the graph represents the begining of the day (12pm) and the bottom of the graph represents the end of the day (12pm).

<table border="0">
  <tr>
    <td>
      <img src="img/1-presentation.png" style="width: 100px;">
    </td>
  </tr>
</table>

But if you click on "Use you own file" you can load the JSON file that you have just created ``flat_messages.json``.
Do not worry, nothing is uploaded online. The computations are made locally, on you computer.

Be patient, it can take a little time, depending on how much you use facebook for talking to people.
Once everything is loaded, you can discover which day you speak the most, what are you top contacts on the evening, or 
in the morning, on some conversations who speaks the most, or send the longest messages, etc.

## Brush and Zoom

<table border="0">
  <tr>
    <td>
      <img src="img/2-presentation.png" style="width: 100px;">
    </td>
    <td>
      <img src="img/3-presentation.png" style="width: 100px;">
    </td>
  </tr>
</table>

On the left and on the bottom you will find two tools in order to select the hours and the date you want. For example if you want to select only the messages between April 2015 and August 2017 and received/send between 2am and 6pm you can use this tool.

The blue area on the left represents the density of message depending on the time of the day, whereas the blue area on the bottom represents the density of message dependging on the date.

Those densities of message varies when you select some filters. For example if you select a conversation, you may see something like this :

<table border="0">
  <tr>
    <td>
      <img src="img/4-presentation.png" style="width: 100px;">
    </td>
  </tr>
</table>

You can notice that this conversation was most active between 2015 and mid-2016 and that people spoke the most at 12pm and barely spoke at night.

## Message Displayer 

If you pass over some messages you can see that the message displayer will be updated. You can see :
- The date of the message
- The sender
- The message

If you wonder what is that strange message at 3am on a Monday, here is your answer !

<table border="0">
  <tr>
    <td>
      <img src="img/5-presentation.png" height= "150">
    </td>
  </tr>
</table>

## Filters 

On the right, you will find a bunch of filters :
- Filter based on the day of the week
- Send/Received
- Top 10 conversations (which is different from contacts, you can have the same person in a lot of different conversations)
- Top 10 contacts
- Lenght of messages 

They are all connected so if you click on one filter, than the others one should be affected.
For example, if you click on one particular conversation, on top 10 contacts you will find who speak the most **for this conversation**.
And of course all of this filters are linked to the brush & zoom. So if you are between **July 2016 and August 2016**, you will discover who were your 10 contacts for the **summer 2016**, and that you possibly sent few messages on the morning.

If you clicked everywhere on the filters and you want to reset everything, just click on **"Reset All Filters"** on the top right.

<table border="0">
  <tr>
    <td>
      <img src="img/6-presentation.png" height= "500">
    </td>
  </tr>
</table>

## Credits

- [Interactive Data Visualization course (ECL MOS 5.5) - Romain Vuillemot](https://github.com/LyonDataViz/MOS5.5-Dataviz)

- [Facebook Chat Archive Parser](https://github.com/ownaginatious/fbchat-archive-parser). The fbmexplorer that we created uses this library to transform the html messages on a JSON file. Then based on the JSON file we have created our own parser.
