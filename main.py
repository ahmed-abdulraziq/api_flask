from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
from collections import defaultdict
from gensim import corpora, models
from googletrans import Translator

app = Flask(__name__)

cors = CORS(app, resources={r"/*": {"origins": "*"}})

translator = Translator()

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