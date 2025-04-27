let nameInput = document.getElementById('name_person');
let commentInput = document.getElementById('comment_of_person');
let submitButton = document.getElementById('comment_button');
let commentsSection = document.getElementById('comment_section');
let sortAscendingButton = document.getElementById('sort_ascending');
let sortDescendingButton = document.getElementById('sort_descending');

function checkForm() {
    submitButton.disabled = !(nameInput.value.trim() &&
        commentInput.value.trim());
}

function addComment() {
    let name = nameInput.value.trim();
    let comment = commentInput.value.trim();
    let date = dateGenerator();
    let time = timeGenerator();

    if (!name || !comment) return;

    let newComment = document.createElement('p');
    let timeSpan = document.createElement('span');
    timeSpan.textContent = `${date} - ${time}`;

    newComment.textContent = `${comment} - ${name} `;
    newComment.appendChild(timeSpan);

    let timestamp = new Date().getTime();
    newComment.dataset.timestamp = timestamp;

    commentsSection.appendChild(newComment);

    document.getElementById('comment_form').reset();
    checkForm();
}

function dateGenerator() {
    let date = new Date();
    return date.toLocaleDateString();
}

function timeGenerator() {
    let date = new Date();
    return date.toLocaleTimeString();
}

function sortComments(ascending = true) {
    let comments = Array.from(commentsSection.querySelectorAll('p'));

    comments.sort((a, b) => {
        let timeA = parseInt(a.dataset.timestamp) || 0;
        let timeB = parseInt(b.dataset.timestamp) || 0;

        if (!ascending) {
            return timeB - timeA;
        }

        return timeA - timeB;
    });

    let heading = commentsSection.querySelector('h2');
    let sortButtons = commentsSection.querySelector('.sort-buttons');

    commentsSection.innerHTML = '';

    if (heading) commentsSection.appendChild(heading);
    if (sortButtons) commentsSection.appendChild(sortButtons);

    comments.forEach(comment => {
        commentsSection.appendChild(comment);
    });
}

function addTimestampsToExistingComments() {
    let comments = commentsSection.querySelectorAll('p');
    comments.forEach((comment, index) => {
        let baseTime = new Date('2025-03-19T22:35:09').getTime();
        let timestamp = baseTime + (index * 60000);
        comment.dataset.timestamp = timestamp;
    });
}

nameInput.addEventListener('input', checkForm);
commentInput.addEventListener('input', checkForm);
submitButton.addEventListener('click', addComment);
sortAscendingButton.addEventListener('click', () => sortComments(true));
sortDescendingButton.addEventListener('click', () => sortComments(false));

checkForm();
addTimestampsToExistingComments();