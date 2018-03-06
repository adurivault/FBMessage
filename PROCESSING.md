## Transform your Archive Facebook into a Json file

The Facebook Chat Archive Parser is a command line tool (and library for advanced users) for easily transforming your ``messages.htm`` file into something actually useful.

You can install the Facebook Chat Archive Parser via ``pip`` under at least
Python 2.7:

    pip install fbchat-archive-parser

If you already have an older version installed, you can upgrade it to the latest with the following command:

    pip install --upgrade fbchat-archive-parser

``messages.htm`` just acts as a manifest for the contents of a directory called ``messages/``. Both are required to use this tool.

Under the ``html/`` folder simply run the command fbcap in your terminal with your messages.htm file as the argument.

You can now transform ``messages.htm`` into a pretty Json file with the simple commande line :

    fbcap ./messages.htm -f pretty-json > messages.json 

It will transorme ``messages.htm`` into a pretty Json and then store it in a new Json file call ``messages.json ``

You can do some others thing with fcap, like storing it in a CSV file, or text File, computing some statistics about your data, etc, but here we are only interested about the Json functionnality.

## Transform the original Json file

If you open ``messages.json `` you would see that the Json file has the following structure:

    {
        "threads": [
            {
                "participants": ["participant_0", "...", "participant_n"],
                "messages": [
                    {
                        "date": "ISO 8601 formatted date",
                        "sender": "sender name",
                        "message": "message text"
                    },
                    "..."
                ]
            },
            "..."
        ]
    }

This structure is a little bit complicated for our work, so we need to simplify it with a custom file of ours. 
In order to do this, please download the script [parser.py](https://github.com/adurivault/FBMessage/blob/master/parser.py), and insert it in the folder where you created your ``messages.json`` file. 

If you have a Mac or Linux, then python is already installed. Through your terminal, just type in the command : 

    python parser.py "message.json"

If you have a PC, then maybe you need to install Python first. 

This will create a new JSON file ``flat_messages.json`` that will have the following structure :

                    {
                        "date": "ISO 8601 formatted date",
                        "sender": "sender name",
                        "message": "message text"
                        "participants": ["participant_0", "...", "participant_n"],
                    },

NB : It will also create a smaller JSON file ``short_flat_messages.json`` which is the same one as above, except only the 2000 first messages are kept. You can use it in case you need to run some quick test for example. 

You are all set now !
