import wikipedia

wikipedia.set_user_agent("DetectAIFactChecker/1.0 (contact@example.com)")

try:
    wiki_res = wikipedia.search("CM of karnataka")
    print("Wiki Results:", wiki_res)
    if wiki_res:
        summary = wikipedia.summary(wiki_res[0], sentences=2)
        print("Wiki Summary:", summary)
except Exception as e:
    print("Wiki Error:", e)
