import json
import pandas as pd
from pandas.io.json import json_normalize
import sys

def parse(file):

    with open(file) as f:
        d = json.load(f)

    user_name = d['user']
    df = json_normalize(d, ["threads", "messages"], [["threads", "participants"]], errors="ignore")
    df["sent"] = df["sender"] == user_name
    df["length"] = df["message"].str.len()
    df.head(2000).to_json("short_flat_messages.json", orient="table") # Short file, in order to do tests
    df.to_json("flat_messages.json", orient="table") # Full file
    df["message"] = "Message.."
    df["sender"] = "Sender.."

    # Convert to string
    df["threads_participants_string"] = df["threads.participants"].apply(str)
    list_conversations = list(df.threads_participants_string.unique())
    df["threads.participants"] = df["threads_participants_string"].apply(lambda string: list_conversations.index(string))
    df.drop("threads_participants_string", axis=1, inplace=True)
    df.head(40000).to_json("anonyms_flat_messages.json", orient="table") # Full file

    # Add the user name to the full file
    with open("flat_messages.json", "r") as f:
        d = json.load(f)
    d['user'] = user_name
    with open("flat_messages.json", "w") as f:
        json.dump(d, f)

    # Add the user name to the short file
    with open("short_flat_messages.json", "r") as f:
        d = json.load(f)
    d['user'] = user_name
    with open("short_flat_messages.json", "w") as f:
        json.dump(d, f)


if __name__ == '__main__':
    parse(sys.argv[1])
