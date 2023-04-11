
const root = document.getElementById("root");

const next = document.getElementById("next");
next.addEventListener("click", () => {
    const show = localStorage.getItem("show") || 0;
    
    if (+show < data.length - 1) {
        // if (data[+show].type === "ques") {
            
        // } else {
        //     // root.innerHTML = data[++root.dataset.i].innerHTML
        // }
        localStorage.setItem("show", +show + 1)
        run();
    }
});

const previous = document.getElementById("previous");
previous.addEventListener("click", () => {
    const show = localStorage.getItem("show") || 0;

    if (+show) {
        localStorage.setItem("show", +show - 1)
        run();
    }
});

onload = () => {

    run()
    // if (show) {

    //     // root.innerHTML = data[+show].innerHTML
    //     // root.dataset.i = show
    // } else {
    //     root.innerHTML = data[0].innerHTML
    // }

    // const ques = document.getElementById("ques");

    // ques && ques.addEventListener("submit", (e) => {
    //     e.preventDefault();
    //     const arr = [
    //         e.target.elements["ques-1"].value,
    //         e.target.elements["ques-2"].value,
    //         e.target.elements["ques-3"].value,
    //         e.target.elements["ques-4"].value,
    //         e.target.elements["ques-5"].value,
    //         e.target.elements["ques-6"].value,
    //         e.target.elements["ques-7"].value,
    //         e.target.elements["ques-8"].value,
    //         e.target.elements["ques-9"].value,
    //         e.target.elements["ques-10"].value,
    //     ];
    //     check(root.dataset.i, arr)
    // })

    // const reSend = document.getElementById("reSend");
    
    // reSend && reSend.addEventListener("click", () => {
    //     root.innerHTML = data[+show].innerHTML
    // })
}
