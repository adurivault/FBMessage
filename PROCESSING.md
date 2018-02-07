## Transform your Archive Facebook into a Json file

The Facebook Chat Archive Parser is a command line tool (and library for advanced users) for easily transforming your ``messages.htm`` file into something actually useful.

You can install the Facebook Chat Archive Parser via ``pip`` under at least
Python 2.7:

    pip install fbchat-archive-parser

If you already have an older version installed, you can upgrade it to the latest with the following command:

    pip install --upgrade fbchat-archive-parser

You can now transform ``messages.htm`` into a pretty Json file with the simple commande line :

    fbcap ./messages.htm -f pretty json > messages.json 

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

This structure is a little bit complicated for our work, so we need to simplify it. 

In order to do that please run ``parser.py `` on your ``messages.json ``. Here is the [parser.py](https://github.com/adurivault/FBMessage/blob/master/parser.py)

It will create a new Json file ``short_flat_messages.json`` that will have the following structure :

                    {
                        "date": "ISO 8601 formatted date",
                        "sender": "sender name",
                        "message": "message text"
                        "participants": ["participant_0", "...", "participant_n"],
                    },


You are all set now !
