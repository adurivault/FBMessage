Once you downloaded all your Facebook History archive, you now need to extract just the relevant data, under the right format. Here is how you should proceed:

If you are familiar with the command line tool, and Python, then this should be easy just read the quick explanation below. If not, then it might be a little harder, but nothing too difficult: we explained everything in details in the section **"if you are not familiar with Python or the command line tool"**.

## If you are familiar with Python and the command line tool

Download our parser module from pip:

    pip3 install fbmexplorer

With the command line interface, go to the root directory of the Facebook archive (where there are ``html``, ``messages``, ``photos``, and ``videos`` folder, and just run:

    fbm-parser
    
No need to add arguments, this should create a ``flat_messages.json`` file. Once you have it, you can go to the <a href="/README.md"> README.md</a> file and start using the tool.


## If you are not familiar with Python or the command line tool

### If you are on Mac

- Got to [this website](https://www.python.org/downloads/) and install the latest version of Python. 
- In the finder, go to the Facebook History Archive, and unzip it
- Go to the root folder of the Facebook Archive 
- Parallel to this, open a terminal window
- Type "cd" in the terminal window (as in Change Directory) but don't press enter yet
- Drag and drop the name of the Facebook Archive folder from the navigation bar to the terminal window. You should now see the path of the Facebook folder written in the terminal window
- Press enter in the terminal window.
- Install our Python library by typing the following command line in the terminal window and press enter:

    pip3 install fbmexplorer
    
  You should see a lot of obscure lines displayed. Wait for it to be over.
- Create the json file with our facebook library by typing the following command in the terminal window, and press enter:

    fbm-parse
    
  You should now see a new file called ``flat_messages.json``. If so, then you are all set, you can go to the <a href="/README.md"> README.md</a> file and start using the tool.
