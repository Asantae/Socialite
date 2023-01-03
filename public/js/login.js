//get data from form

const loginForm = document.querySelector('.login-form');
const usernameInput = document.querySelectorAll(".login-form-items")[0];
const passwordInput = document.querySelectorAll(".login-form-items")[1];
const errorNodes = document.querySelectorAll(".error");
loginForm.addEventListener('submit', login)


//validate data
function validateForm(){
    clearMessages()
    let errorFlag = false;
    if(usernameInput.value.length < 1){
        errorNodes[0].innerText = "Username cannot be blank";
        usernameInput.classList.add("error-border");
        errorFlag = true;
    }
    if(passwordInput.value.length < 1){
        errorNodes[1].innerText = "Password cannot be blank";
        passwordInput.classList.add("error-border");
        errorFlag = true;
    }
}

function clearMessages(){
    for(let i = 0; i < errorNodes.length; i++){
        errorNodes[i].innerText = "";
    }
    usernameInput.classList.remove("error-border");
    passwordInput.classList.remove("error-border");
}

async function login(event){
    event.preventDefault()
    validateForm()
    const username = usernameInput.value
    const password = passwordInput.value

    const result = await fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username,
            password
        })
    }).then((res) => res.json())
    if (result.status === 'ok') {
        window.location.href = 'home'
    } else if (errorNodes[0].innerText === "" && errorNodes[1].innerText === ""){
        console.log(result.status)
        errorNodes[0].innerText = "Invalid username or password";
        errorNodes[1].innerText = "Invalid username or password";
        usernameInput.classList.add("error-border");
        passwordInput.classList.add("error-border");
    }
}