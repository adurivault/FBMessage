# How can I access and transform my conversation history ?

## Create your facebook archive

Facebook allows you to dowload all of your data history , particularly your messages archive. In order to do that :

1. Go to your Facebook account
2. Then click on <b>"Settings"</b>
3. Click <b>General</b> in the lefthand column.
4. Click <b>Download a copy of your Facebook data</b> at the bottom of the General Account Settings page.

Then you have to wait for approximatly 10/15 minutes to receive a email with a link to dowload your data.

Be patient ! Sometimes it can be very long, up to few hours. 

One you have it, you can see that all of your conversation history is stored in ``messages.htm``.

## Transform it into a pretty Json

The Facebook Chat Archive Parser is a command line tool (and library for
advanced users) for easily transforming your ``messages.htm`` file into
something actually useful.

You can install the Facebook Chat Archive Parser via ``pip`` under at least
Python 2.7:

    pip install fbchat-archive-parser

If you already have an older version installed, you can upgrade to the latest with the following command:

    pip install --upgrade fbchat-archive-parser

You can now transform ``messages.htm`` into a pretty Json file with the simple commande line :

    fbcap ./messages.htm -f pretty json > messages.json 

It will transorme ``messages.htm`` into a pretty Json and then store it a new Json file call ``messages.json ``

You can do some others thing with fcap, as store it in a CSV file, or text File, but here we are only interested about Json.

## Transform the original Json file

If you open ``messages.json `` you would see that the Json file has the following structure 

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

This structue is a little bit complicated for our work, so we need to simplify it. 

In order to do that please run ``parser.py `` on your ``messages.json ``.

It will create a new Json file ``short_flat_messages.json`` that will have the following structure :



You are all set now !

