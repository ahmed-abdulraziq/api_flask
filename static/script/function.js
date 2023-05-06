const run = () => {
    const show = localStorage.getItem("show") || 0;
    const {i, type} = item(+show);

    root.innerHTML = "";

    if (type === "lesson") lesson(i);
    else if (type === "ques") ques(i);
    else if (type === "full") full();
    else if (type === "notes") notes(i);
    
    scrollTo(0,0);
}

const item = (show) => {
    const item = data[show];
    
    if (item.type === "lesson") {
        return {
            i: item,
            type: item.type,
        }
    } else if (item.type === "ques") {
        let arr = [];

        for (let i = 0; i < 10; i++) {
            arr.push(item.ques[Math.floor((Math.random() * item.ques.length / 10) + (item.ques.length / 10) * i)]);
        }

        return {
            i: arr,
            type: item.type,
        }
    } else if (item.type === "full") {
        return {
            i: "",
            type: item.type,
        }
    } else if (item.type === "notes") {
        return {
            i: item.notes,
            type: item.type,
        }
    }
}

const lesson = (item) => {
    const title = document.createElement("h1");
    title.className = "title";
    title.textContent = item.title;

    const divVideo = document.createElement("div");
    divVideo.className = "video";

    const video = document.createElement("video");
    video.src = item.video;
    video.name = "media"

    divVideo.append(video);

    const info = document.createElement("div");
    info.className = "info";

    const subTitle = document.createElement("h2");
    subTitle.textContent = item["sub-title"];

    const desc = document.createElement("p");
    desc.className = "desc";
    desc.textContent = item.desc;

    info.append(subTitle);
    info.append(desc);

    root.append(title);
    root.append(divVideo);
    root.append(info);
}

const ques = (item) => {
    console.log(item)
    const title = document.createElement("h1");
    title.className = "title";
    title.textContent = "الامتحان";

    const form = document.createElement("form");
    form.id = "ques"

    for (let i = 0; i < 10; i++) {
        const divTextarea = document.createElement("div");
        divTextarea.className = "textarea";
    
        const label = document.createElement("label");
        label.textContent = item[i].ques
        
        const textarea = document.createElement("textarea");
        textarea.name = `ques-${i}`;
        textarea.id = `ques-${i}`;
        
        divTextarea.append(label);
        divTextarea.append(textarea);
        
        form.append(divTextarea);
    }

    const send = document.createElement("div");
    send.className = "send";

    const input = document.createElement("input");
    input.id = "send";
    input.type = "submit";
    input.value = "أرسل";

    form.addEventListener("submit", (e) => { 
        e.preventDefault();

        let arr = [];
        for (let i = 0; i < e.target.length - 1; i++) {
            arr.push(e.target[i].value);
        }
        check(item, arr)
    }
    
    );

    send.append(input)
    form.append(send);

    root.append(form);
}

const full = () => {
    const divMsg = document.createElement("div");
    divMsg.className = "msg";

    const title = document.createElement("h2");
    title.textContent = "أحسنت لقد تجوزة الامتحان بدون أى أخطاء ";

    divMsg.append(title);

    root.append(divMsg)
}

const notes = (item) => {
    const divMsg = document.createElement("div");
    divMsg.className = "msg";

    const title = document.createElement("h2");
    title.textContent = "أحسنت لقد تجوزة الامتحان ولكن هناك بعض الملاحظات";

    divMsg.append(title);

    for (let i = 0; i < i.length; i++) {
        const b = document.createElement("b");
        b.textContent = `ملاحظه`;

        const p = document.createElement("p");
        p.textContent = item[i];
        p.append(b);

        divMsg.append(p);
    }

    root.append(divMsg);
}

const check = async (item, arr) => {
    let response = await fetch("/ques", {
        method: "POST",
        mode: "cors",
        cache: "no-cache",
        credentials: "same-origin",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          "item": item,
          "arr": arr,
        }),
    });

    const { answer } = await response.json()

    const answerLen = 10 - answer.length
    console.log(answerLen);
    if (answerLen <= 5) {
        root.innerHTML = "";

        const divMsg = document.createElement("div");
        divMsg.className = "msg";
    
        const title = document.createElement("h2");
        title.textContent = "للأسف هناك الكثير من الأخطاء";

        divMsg.append(title);

        const divSend = document.createElement("div");
        divSend.className = "send";

        const input = document.createElement("input");
        input.id = "reSend";
        input.type = "submit";
        input.value = "إعادة الامتحان";
        input.addEventListener('click', () => run());
        
        divSend.append(input);
        divMsg.append(divSend);

        root.append(divMsg);
    }else run()
}

const post = async (url, body) => {
    let response = await fetch(url, {
        method: "POST",
        mode: "cors",
        cache: "no-cache",
        credentials: "same-origin",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
    });

    const { answer } = await response.json();

    return answer;
}

const git = async (url) => {
    let response = await fetch(url, {
        method: "GIT",
        mode: "cors",
        cache: "no-cache",
        credentials: "same-origin",
        headers: {
          "Content-Type": "application/json",
        },
    });

    const { answer } = await response.json();

    return answer;
}