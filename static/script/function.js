const run = () => {
    const show = localStorage.getItem("show") || 0;

    const item = data[+show];

    root.innerHTML = "";

    if (item.type === "lesson") lesson(root, item);
    else ques(root, item);
    
    scrollTo(0,0);
}

const lesson = (root, item) => {
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

const ques = (root, item) => {

    if (item.type === "ques") {
        let arr = [];
    
        const title = document.createElement("h1");
        title.className = "title";
        title.textContent = "الامتحان";
    
        const form = document.createElement("form");
        form.id = "ques"
    
        for (let i = 0; i < 10; i++) {
            arr.push(item.ques[Math.floor((Math.random() * item.ques.length / 10) + (item.ques.length / 10) * i)])
    
            const divTextarea = document.createElement("div");
            divTextarea.className = "textarea";
        
            const label = document.createElement("label");
            label.textContent = arr[i].ques
            
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
            check(arr, e.target)
        }
        
        );
    
        send.append(input)
        form.append(send);
    
        root.append(form);

    } else if (item.type === "full") {
        root.innerHTML = `
        <div class="err">
            <h2>أحسنت لقد تجوزة الامتحان بدون أى أخطاء </h2>
        </div>
        `
    } else {
        root.innerHTML = item.notes
    }

}

const check = (item, arr) => {
    let answer = 0;
    let notes =`
    <div class="err">
        <h2>أحسنت لقد تجوزة الامتحان ولكن هناك بعض الملاحظات </h2>
    `;

    for (let i = 0; i < arr.length - 1; i++) {
        const input = arr[i].value.split(/\s|\n/).filter((i) => i);
        
        let result = false;
        
        for (const key of item[i].key) {
            result = false;
            
            for (let j = 0; j < input.length; j++) {
                if (key === input[j]) {
                    result = true;
                    break;
                }
            }

            if (!result) {
                result = false;
                break;
            }
        }

        if (result) ++answer
        else notes += `<p><b>ملاحظه </b>${item[i].notes}</p>`;
    }

    // for (let i = 3; i < 7; i++) {
    //     if (data[divShow].ques[i] === arr[i]) ++answer
    // }

    // for (let i = 7; i < 10; i++) {
    //     if (data[divShow].ques[i] === arr[i]) ++answer
    // }
    if (answer > 5) {
        data[+localStorage.getItem("show")].type = "";
        
        if (answer == 10) {
            data[+localStorage.getItem("show")].type = "full";
             root.innerHTML = `
            <div class="err">
                <h2>أحسنت لقد تجوزة الامتحان بدون أى أخطاء </h2>
            </div>
            `
        } else {
            data[+localStorage.getItem("show")].type = "notes";
            notes += "</div>";
            root.innerHTML = notes
            data[+localStorage.getItem("show")].notes = notes;
        }
    } else {
        notes = "";
        root.innerHTML = `
        <div class="err">
            <h2>للأسف هناك الكثير من الأخطاء</h2>
            <div class="send">
                <input id="reSend"  onclick="run()" type="submit" value="إعادة الامتحان">
            </div>
        </div>
        `
    }    
}

// const reSend = () => root.innerHTML = data[+show].innerHTML
