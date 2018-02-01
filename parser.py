import json
import pandas as pd
from pandas.io.json import json_normalize


def parser(file):

    with open(file) as f:
        d = json.load(f)

    df = json_normalize(d, ["threads", "messages"], [["threads", "participants"]], errors="ignore")
    df.head(2000).to_json("short_flat_messages.json", orient="table")
    df.to_json("flat_messages.json", orient="table")



