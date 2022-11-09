const loadCommentBtnElement = document.getElementById('load-comment-btn');
const commentsSectionElement = document.getElementById('comments');
const commentsFormElements = document.getElementById('comment-form')
const commentTitleElement = document.getElementById('title');
const commentTextElement = document.getElementById('text');


function createCommentsList(comments) {
    const commentListElement = document.createElement('ol');

    for (const comment of comments) {
        const commentElement = document.createElement('li');
        commentElement.innerHTML = `
        <div class="insert-comment">
        <h3>${comment.title}</h3>
        <p>${comment.text}</p>
      </div> 
      `;
        commentListElement.appendChild(commentElement);

    }
    return commentListElement;

}

async function fetchCommentForPost() {
    const postId = loadCommentBtnElement.dataset.postid;
    const response = await fetch(`/posts/${postId}/comments`);

    const responseData = await response.json();
    console.log(postId);

    if (responseData && responseData.length > 0) {
        const commentsListElement = createCommentsList(responseData);
        commentsSectionElement.innerHTML = '';
        commentsSectionElement.appendChild(commentsListElement);
    }else{
        commentsSectionElement.firstElementChild.textContent = 
         "We could not find Any comments Maybe You can create one"
    }
}


async function saveComment(event) {
    event.preventDefault();
    const postId = commentsFormElements.dataset.postid;

    const enteredTitle = commentTitleElement.value;
    const enteredText = commentTextElement.value;

    const comment = { title: enteredTitle, text: enteredText };

    const response = await fetch(`/posts/${postId}/comments`, {
        method: 'POST',
        body: JSON.stringify(comment),
        headers: {
            'Content-Type': 'application/json',
        },
    });
    fetchCommentForPost();

}

loadCommentBtnElement.addEventListener('click', fetchCommentForPost);
commentsFormElements.addEventListener('submit', saveComment);