let commentArr = document.querySelectorAll(".comment-button");
let modalBackground = document.querySelector(".modal-background");
let commentExitButton = document.querySelector("#modal-exit-button");
let modalPostContainer = document.querySelector(".modal-post-container");
let modalForm = document.querySelector(".comment-form");

commentExitButton.addEventListener('click', () => {
    modalBackground.classList.remove('active');
    clearModal();
})

for(let i = 0; i < commentArr.length; i++){
    commentArr[i].addEventListener('click', (event) => {
        let user = event.currentTarget.parentNode.parentNode.childNodes[1];
        let post = event.currentTarget.parentNode.parentNode.childNodes[3];
        let postId = post.childNodes[3].innerText;

        modalPostContainer.appendChild(user.cloneNode(true));
        modalPostContainer.appendChild(post.cloneNode(true));


       modalForm.action = `/comments/comment/${postId}`
        console.log(modalForm.action)

        modalBackground.classList.add('active');


    })
}

function clearModal(){
    modalPostContainer.removeChild(modalPostContainer.childNodes[0])
    modalPostContainer.removeChild(modalPostContainer.childNodes[0])
}