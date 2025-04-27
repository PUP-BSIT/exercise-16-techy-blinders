let myInput = document.getElementById("my_input_name");
let myMessage = document.getElementById("my_message_input");
let myButton = document.getElementById("form_button");
let myComments = document.getElementById("comment_goals");
let ascendingButton = document.getElementById("ascending_button");
let descendingButton = document.getElementById("descending_button");

function validateForm() {    
    if (myInput.value.length && myMessage.value.length) {
        myButton.disabled = false;
        myButton.style.cursor = "pointer";
    } else {
        myButton.disabled = true;
        myButton.style.cursor = "not-allowed";
    }
}

validateForm();

myInput.addEventListener("input", validateForm);
myMessage.addEventListener("input", validateForm);

myButton.onclick = () =>{
    addComments();
};

function dateGenerator() {
    let date = new Date();
    return date.toLocaleDateString();
}

function timeGenerator() {
    let date = new Date();
    return date.toLocaleTimeString();
}

function addComments() {
    let name = myInput.value.trim();
    let message = myMessage.value.trim();
    let getDate = dateGenerator();
    let getTime = timeGenerator();
    let timestamp = Date.now();

    if (name && message) {
        let newComment = document.createElement("p");
        newComment.innerHTML = `${message} - ${name} ${getDate} | ${getTime}`;
        
        newComment.dataset.timestamp = timestamp;

        myComments.appendChild(newComment);

        myInput.value = "";
        myMessage.value = "";
        validateForm();
    }
}

function parseTimestamp(timestamp) {
    let date = new Date(timestamp);

    if (!isNaN(timestamp))
        return parseInt(timestamp);

    return date.getTime();
}

function sortAndAppendComments(commentsArray, direction) {
    if (!commentsArray.length) return;

    commentsArray.sort((a, b) => {
        let timeA = parseTimestamp(a.dataset.timestamp);
        let timeB = parseTimestamp(b.dataset.timestamp);
        return direction === "asc" ? timeA - timeB : timeB - timeA;
    });

    myComments.innerHTML = "";
    commentsArray.forEach(comment => myComments.appendChild(comment));
}

function sortComments(direction) {
    validateForm();
    let commentsArray = [];
    commentsArray = Array.from(myComments.children);
    sortAndAppendComments(commentsArray, direction);
}

ascendingButton.onclick = () => {
    sortComments("asc");
}

descendingButton.onclick = () => {
    sortComments("desc");
}