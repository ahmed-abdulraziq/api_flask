from flask import Flask, render_template, request, jsonify, json
from pymongo import MongoClient
from flask_cors import CORS, cross_origin
from collections import defaultdict
from gensim import corpora, models
from googletrans import Translator
from bson import json_util
import math
import random

app = Flask(__name__)

client = MongoClient('mongodb+srv://ahmed:ahmed@cluster0.p3arxwz.mongodb.net/projectDB?retryWrites=true&w=majority')
db = client.projectDB
data =db.data
user =db.user

cors = CORS(app, resources={r"*": {"origins": "*"}})

translator = Translator()

@app.route("/")
def room():
    return render_template("index.html")

@app.route("/show")
def show():
    documents = json.loads(json_util.dumps(data.find()))

    res = []

    for item in documents:
        arr = []
        for i in item['lesson']:
            arr.append({
                "id": f"{i['id']}",
                "title" : f"{i['title']}",
                "time" : f"{i['time']}",
            })
        res.append({
            "lesson" : arr,
            "ques" : item['ques']['id']
        })

    return jsonify(res)

@app.route("/show/<id>")
def showId(id):
    documents = json.loads(json_util.dumps(data.find()))

    res = {}

    for item in documents:
        for i in item['lesson']:
            if f"{i['id']}" == id:
                res = {
                    "id": f"{i['id']}",
                    "title" : f"{i['title']}",
                    "sub-title" : f"{i['sub-title']}",
                    "desc" : f"{i['desc']}",
                    "video" : f"{i['video']}",
                }

    return jsonify({
        "type" : "lesson",
        "data" : res
        })

@app.route("/ques/<id>")
def quesId(id):
    documents = json.loads(json_util.dumps(data.find({})))
    users = json.loads(json_util.dumps(user.find_one({'course': "nlp", 'id': int(id)})))


    if len(users['notes']) == 0:
        return jsonify({
        "type" : "full"
        })
    elif len(users['notes']) <= 5:
        return jsonify({
        "type" : "notes",
        "data" : users['notes']
        })
    else:
        arr = []
        for item in documents:
            if f"{item['ques']['id']}" == id:
                index = item['ques']['ques']
                for i in range(10):
                    arr.append(index[math.floor((len(index) / 10 * random.random()) + (len(index) / 10) * i)])
        
        user.update_one({'course': "nlp", 'id': int(id)}, {"$set": {'notes': [1,1,1,1,1,1], 'ques': arr}})
        res = []

        for item in arr:
            res.append(item['ques'])

        return jsonify({
            "type" : "ques",
            "id" : id,
            "data" : res
            })

@app.route("/check/<id>", methods={"post"})
def check(id):
    answer = []
    documents = json.loads(json_util.dumps(user.find_one({"id" : int(id)})))
    item = documents['ques']
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

    user.update_one({'course': "nlp"}, {"$set": {'notes': answer}})

    return jsonify({ "answer": answer, "id": id })



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