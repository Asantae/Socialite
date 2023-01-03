//get data from form
const loginForm = document.querySelector('.login-form');
const usernameInput = document.querySelector("#username");
const passwordInput = document.querySelector("#password");
const reEnteredPassInput = document.querySelector("#reEnteredPass")
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
    if(passwordInput.value !== reEnteredPassInput.value){
        errorNodes[1].innerText = "Passwords must match";
        passwordInput.classList.add('error-border');
        errorNodes[2].innerText = "Passwords must match";
        reEnteredPassInput.classList.add('error-border');
    }
}

function clearMessages(){
    for(let i = 0; i < errorNodes.length; i++){
        errorNodes[i].innerText = "";
    }
    usernameInput.classList.remove("error-border");
    passwordInput.classList.remove("error-border");
    reEnteredPassInput.classList.remove("error-border");
}

async function login(event){
    event.preventDefault()
    validateForm()
    const username = usernameInput.value
    const password = passwordInput.value
    const reEnteredPass = reEnteredPassInput.value

    const result = await fetch('/signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username,
            password,
            reEnteredPass
        })
    }).then((res) => res.json())
    if (result.status === 'ok') {
        window.location.href = 'home'
    } else if (errorNodes[0].innerText === "" && errorNodes[1].innerText === ""){
        console.log(result.error)
        errorNodes[0].innerText = result.error;
        errorNodes[1].innerText = result.error;
        errorNodes[2].innerText = result.error;
        usernameInput.classList.add("error-border");
        passwordInput.classList.add("error-border");
        reEnteredPassInput.classList.add("error-border");
        
    }
}