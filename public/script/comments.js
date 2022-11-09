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
        console.log(comment.title);

    }
    return commentListElement;

}


async function fetchCommentForPost() {
    const postId = loadCommentBtnElement.dataset.postid;
    try {
        const response = await fetch(`/posts/${postId}/comments`);
        if(!response.ok){
            alert("Feaching Comments Failed!");
            return;
        }
        const responseData = await response.json();
    
        if (responseData && responseData.length > 0) {
            const commentsListElement = createCommentsList(responseData);
            commentsSectionElement.innerHTML = '';
            commentsSectionElement.appendChild(commentsListElement);
        } else {
            commentsSectionElement.firstElementChild.textContent =
                "We could not find Any comments Maybe You can create one"
        }
    } catch (error) {
        alert("Getting comments Failed!")
    }
   

};

async function saveComment(event) {
    event.preventDefault();
    const postId = commentsFormElements.dataset.postid;
    const enteredTitle = commentTitleElement.value;
    const enteredText = commentTextElement.value;

    const comment = { title: enteredTitle, text: enteredText };

    try {
        const response = await fetch(`/posts/${postId}/comments`, {
            method: 'POST',
            body: JSON.stringify(comment),
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {
            fetchCommentForPost();
        } else {
            alert('Could not send comment!')
        }
    } catch (error) {
        alert('Could not send Request - Maybe try again later!');
    }
}

loadCommentBtnElement.addEventListener('click', fetchCommentForPost);

commentsFormElements.addEventListener('submit', saveComment);