from flask import Flask, render_template, request, url_for, jsonify, Response, make_response
from flask_cors import CORS

app = Flask(__name__)
cors = CORS(app, resources={r"/*": {"origins": "*"}})

@app.route("/")
def room():
    return render_template("index.html")

@app.route("/ques", methods={"post"})
def ques():
    from collections import defaultdict
    from gensim import corpora
    from googletrans import Translator

    translator = Translator()

    # documents = [
    #     "واجهة الإنسان و الآلة لتطبيقات الكمبيوتر المعملية ABC",
    #     "استطلاع رأي المستخدم بشأن زمن استجابة نظام الكمبيوتر",
    #     "نظام إدارة واجهة المستخدم EPS",
    #     "اختبار هندسة النظم و الأنظمة البشرية لـ EPS",
    #     "علاقة وقت الاستجابة المدرك للمستخدم بقياس الخطأ",
    #     "توليد أشجار ثنائية عشوائية غير مرتبة",
    #     "رسم تقاطع المسارات في الأشجار",
    #     "رسم بياني القصر الرابع عرض الأشجار و شبه الترتيب جيدًا",
    #     "رسم بياني قاصرين مسح",
    # ]

    # documents = [
    #     translator.translate(document, dest='en').text
    #     for document in documents
    # ]

    documents = [
        translator.translate(request.json['a'][0]['notes'], dest='en').text,
        translator.translate(request.json['a'][0]['notes'], dest='en').text
    ]

    # remove common words and tokenize
    stoplist = set('for a of the and to in'.split())
    texts = [
        [word for word in document.lower().split()]
        for document in documents
    ]

    # remove words that appear only once
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

    from gensim import models
    lsi = models.LsiModel(corpus, id2word=dictionary, num_topics=5)

    doc = "تفاعل الإنسان و الحاسوب"
    doc = translator.translate(request.json['b'][0], dest='en').text
    vec_bow = dictionary.doc2bow(doc.lower().split())
    vec_lsi = lsi[vec_bow]  # convert the query to LSI space

    from gensim import similarities
    index = similarities.MatrixSimilarity(lsi[corpus])  # transform corpus to LSI space and index it

    sims = index[vec_lsi]  # perform a similarity query against the corpus
    print(sims)
    return jsonify({
        "sims": f"{sims}",
        "item": request.json['a'],
        "arr": request.json['b']
    })  # print (document_number, document_similarity) 2-tuples


if __name__ == "__main__":
    app.run(debug=True, port=2200)