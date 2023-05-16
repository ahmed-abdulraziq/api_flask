from flask import Flask, render_template, request, jsonify, json
from pymongo import MongoClient
from flask_cors import CORS
from collections import defaultdict
from gensim import corpora, models
from googletrans import Translator
from bson import json_util

app = Flask(__name__)

client = MongoClient('mongodb+srv://ahmed:ahmed@cluster0.p3arxwz.mongodb.net/projectDB?retryWrites=true&w=majority')
db = client.flask_db
pro = db.pro
user = db.user

cors = CORS(app, resources={r"/*": {"origins": "*"}})

translator = Translator()
@app.route("/show")
def b():
    # a= {}
    # json.dumps(user.find()[0])
    # return jsonify({"a": f"{json.loads(json.dumps(user.find()[0]))}"})

    # return jsonify({"a": f"{user.find()[0]}"})
    documents = [json.loads(json_util.dumps(doc)) for doc in user.find()]
    return jsonify(documents)

@app.route("/")
def room():
    return render_template("index.html")

@app.route("/ques", methods={"post"})
def ques():
    answer = []
    item = request.json['item']
    arr = request.json['arr']

    for index in range(len(item)):
        documents = [
            translator.translate(item[index]['notes'], dest='en').text,
            translator.translate(item[index]['notes'], dest='en').text
        ]

        stoplist = set('for a of the and to in'.split())
        texts = [
            [word for word in document.lower().split() if word not in stoplist]
            for document in documents
        ]

        frequency = defaultdict(int)
        for text in texts:
            for token in text:
                frequency[token] += 1

        texts = [
            [token for token in text if frequency[token] > 1]
            for text in texts
        ]

        dictionary = corpora.Dictionary(texts)
        corpus = [dictionary.doc2bow(text) for text in texts]

        lsi = models.LsiModel(corpus, id2word=dictionary, num_topics=5)

        doc = translator.translate(arr[index], dest='en').text
        vec_bow = dictionary.doc2bow(doc.lower().split())
        vec_lsi = lsi[vec_bow]

        if len(vec_lsi) == 0:
            answer.append(item[index]['notes'])

    return jsonify({ "answer": answer })


if __name__ == "__main__":
    app.run(debug=True, port=2400)