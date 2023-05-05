const root = document.getElementById("root");

const next = document.getElementById("next");
next.addEventListener("click", () => {
    const show = localStorage.getItem("show") || 0;

    if (+show < data.length - 1 && !(data[+show].type === "ques")) {
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

onload = () => run()