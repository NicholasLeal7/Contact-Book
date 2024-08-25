const btnLogin = document.querySelectorAll(".btn-login");
const btnRegister = document.querySelectorAll(".btn-register");
const btnAbout = document.querySelector(".btn-about");
const formLogin = document.querySelector("#form_login");
const formRegister = document.querySelector("#form_register");

function notify(title, icon, body, timeout) {
    //debugger;
    document.querySelector(".alert-header span").innerHTML = title;
    document.querySelector(".alert-header i").className = "";
    document.querySelector(".alert-header i").classList.add("fa-solid");
    document.querySelector(".alert-header i").classList.add(icon);
    document.querySelector(".alert-body").innerHTML = body;
    document.querySelector(".alert-message").style.right = "20px";

    setTimeout(() => {
        document.querySelector(".alert-message").style.right = "-500px";
    }, timeout);
};

btnRegister.forEach((value) => {
    value.addEventListener("click", () => {
        document.querySelector(".wrapper").classList.add("visible");
        document.querySelector(".about").classList.remove("visible");
        document.querySelector(".wrapper").classList.add("active");
    });
});

btnLogin.forEach((value) => {
    value.addEventListener("click", () => {
        document.querySelector(".wrapper").classList.add("visible");
        document.querySelector(".about").classList.remove("visible");
        document.querySelector(".wrapper").classList.remove("active");
    });
});

btnAbout.addEventListener("click", () => {
    document.querySelector(".wrapper").classList.remove("visible");
    document.querySelector(".about").classList.add("visible");
});

formLogin.addEventListener("submit", async (evt) => {
    evt.preventDefault();
    const form = new FormData(formLogin);
    const data = {};

    form.forEach((value, key) => {
        data[key] = value;
    });

    await fetch('../login', {
        method: 'POST',
        headers: {
            'Content-type': 'application/json',
        },
        body: JSON.stringify(data)
    })
        .then(response => response.json())
        .then(response => {
            console.log(response);
            if (response.token) {
                localStorage.setItem("authentication-token", response.token);
                window.location.href = "../index.html";
                return;
            }
            notify("Login Failed", "fa-circle-info", "Email or password are invalid! Please, try again.", 5000);
        })
});

formRegister.addEventListener("submit", async (evt) => {
    evt.preventDefault();
    const form = new FormData(formRegister);
    const data = {};

    form.forEach((value, key) => {
        data[key] = value;
    });

    await fetch('../register', {
        method: 'POST',
        headers: {
            'Content-type': 'application/json',
        },
        body: JSON.stringify(data)
    })
        .then(response => response.json())
        .then(response => {
            console.log(response);
            if (response.token) {
                localStorage.setItem("authentication-token", response.token);
                window.location.href = "../index.html";
                return;
            }
            notify("Register Failed", "fa-circle-info", "Please, try again later.", 5000);
        })
});
