let userNameInput = document.getElementById("username");
let commentInput = document.getElementById("comment");
let button = document.getElementById("comment_button");
let commentSection = document.getElementById("goal_comments");

function toggleButton() {
    let isFilled = userNameInput.value.trim() && commentInput.value.trim();
    button.disabled = !isFilled;
}

userNameInput.addEventListener("input", toggleButton);
commentInput.addEventListener("input", toggleButton);

function comments(event) {
    event.preventDefault();

    let username = userNameInput.value.trim();
    let comment = commentInput.value.trim();

    if (!username || !comment) return;

    let now = new Date();
    let dateString = now.toLocaleDateString();
    let timeString = now.toLocaleTimeString();
    
    let newComment = document.createElement("p");
    newComment.textContent = `${comment} - ${username} `;
    
    let dateSpan = document.createElement("span");
    dateSpan.className = "comment-date";
    dateSpan.textContent = `${dateString} | ${timeString}`;
    
    newComment.appendChild(dateSpan);
    commentSection.appendChild(newComment);

    userNameInput.value = "";
    commentInput.value = "";
    
    toggleButton();
}

let commentForm = document.getElementById("comment_form");
commentForm.addEventListener("submit", comments);

let ascendingButton = document.getElementById("ascending");
let descendingButton = document.getElementById("descending");

ascendingButton.addEventListener("click", sortAscending);
descendingButton.addEventListener("click", sortDescending);

function sortAscending() {
    let container = document.getElementById("goal_comments");
    let commentPairs = [];
    let paragraphs = container.querySelectorAll("p");
    
    for (let i = 0; i < paragraphs.length; i++) {
        let paragraph = paragraphs[i];
        let dateSpan = paragraph.querySelector(".comment-date");

        if (!dateSpan) return;

        let timestamp = convertTimeStamp(dateSpan.textContent);
        commentPairs.push({ paragraph, timestamp });
    }
    
    commentPairs.sort((a, b) => a.timestamp - b.timestamp);
    
    container.innerHTML = "";
    commentPairs.forEach(pair => {
        container.appendChild(pair.paragraph);
    });
}

function sortDescending() {
    let container = document.getElementById("goal_comments");
    let commentPairs = [];
    let paragraphs = container.querySelectorAll("p");
    
    for (let i = 0; i < paragraphs.length; i++) {
        let paragraph = paragraphs[i];
        let dateSpan = paragraph.querySelector(".comment-date");

        if (!dateSpan) return;

        let timestamp = convertTimeStamp(dateSpan.textContent);
        commentPairs.push({ paragraph, timestamp });
    }
    
    commentPairs.sort((a, b) => b.timestamp - a.timestamp);
    
    container.innerHTML = "";
    commentPairs.forEach(pair => {
        container.appendChild(pair.paragraph);
    });
}

function convertTimeStamp(dateString) {
    let parts = dateString.trim().split('|');
    let datePart = parts[0].trim();
    let timePart = parts[1].trim();
    let dateTimeString = datePart + " " + timePart;
    let date = new Date(dateTimeString);
    
    return date.getTime();
}