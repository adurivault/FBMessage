# FBMessage : Facebook Messages Vizualisation

Authors : [Mathilde Reynaud](https://github.com/MathReynaud) | [Augustin Durivault](https://github.com/adurivault) 

The goal of this project is to allow you to visualize your own Facebook Messages in your browser, with a nice graphical display that gives insights on when, to whom, etc... you send (or receive) messages. If you have always been curious about your Facebook messages
history, maybe you will find some answers here.

## How does it work ? 

### Create your datafile from your Facebook History
Just follow the instructions from the <a href="/DATA.md"> DATA.md</a> file and the <a href="/PROCESSING.md"> PROCESSING.md</a>, everything is explained. Once you got your data ready, you can go on the [website](https://mathreynaud.github.io). 

## Presentation video

There is a presentation [video] of this project, and if you are a little bit lost on how to use the tool, or how to get your data
you will theoretically find an answer here. 

### General design

If you go [here](https://mathreynaud.github.io) you will see that there is already some data on the interface. It is just there for
the demonstration and if you want to get familiar with the tool, or if you do not have any facebook account, you can
play with the demo data but this will not be very interesting, as everything is anonymous.

What it is represented is very simple : one point corresponds to one message received or send, and the color of the point depends on if the message has been receveid or sent. The top of the graph represents the begining of the day (12am) and the bottom of the graph represents the end of the day (12pm).

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

On the left and on the bottom you will find two tools in order to select the 


## Credits

- [Interactive Data Visualization course (ECL MOS 5.5) - Romain Vuillemot](https://github.com/LyonDataViz/MOS5.5-Dataviz)

-[Facebook Chat Archive Parser](https://github.com/ownaginatious/fbchat-archive-parser). The fbmexplorer that we created uses this library
to transform the html messages on a JSON file. Then based on the JSON file we have created our own parser.
