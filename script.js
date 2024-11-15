const commentsList = [
  {
    id: 1,
    userName: 'Priya',
    commentText: 'Has anyone tried the new AI tools for coding?',
    replies: [
      {
        id: 3,
        userName: 'Rohan',
        commentText: 'Yes! GitHub Copilot is amazing.',
        replies:[
          {
            id: 4,
            userName: 'Aman',
            commentText: 'Yes I am Eager to know more',
          },
        ],
      },
    ],
  },
  {
    id: 2,
    userName: 'Neha',
    commentText: 'Let’s plan a team outing this weekend!',
  },
];


document.addEventListener('DOMContentLoaded', () => {
  const commentsContainer = document.querySelector('.comments-container');
  let currentReplyComment = null;
  let currentSubmitReplyBtn = null;
  let lastId = getUniqueID();
  
  function getUniqueID() {
    let maxID = 0;
    commentsList.forEach(comment => {
      if(comment.id > maxID) {
        maxID = comment.id;
      }
      if(comment.replies) {
        comment.replies.forEach(reply => {
          if(reply.id > maxID) {
            maxID = reply.id
          }
        });
      }
    });
    return maxID+1;
  }
  
  function loadUi() {
    commentsContainer.innerHTML = "";
    commentsList.forEach(comment => {
      addComment(commentsContainer, comment);
    });
  }

  function addComment(parentContainer, comment) {
    const commentDiv = document.createElement("div");
    commentDiv.id = comment.id;
    commentDiv.classList.add("comment");

    const parentCommentDiv = document.createElement("div");
    parentCommentDiv.classList.add("parent-comment");
    commentDiv.appendChild(parentCommentDiv);

    const replies = document.createElement("div");
    replies.classList.add("replies");
    commentDiv.appendChild(replies);

    const avatar = document.createElement("img");
    avatar.src = "./Asset/avatar.jpg";
    avatar.alt = "User Avatar";
    avatar.classList.add("avatar");
    parentCommentDiv.appendChild(avatar);

    const commentDetails = document.createElement("div");
    commentDetails.classList.add("comment-details");
    parentCommentDiv.appendChild(commentDetails);

    const nameElement = document.createElement("h4");
    nameElement.classList.add("user-name");
    nameElement.textContent = comment.userName;
    commentDetails.appendChild(nameElement);

    const commentTextNode = document.createElement("p");
    commentTextNode.classList.add("comment-text");
    commentTextNode.textContent = comment.commentText;
    commentDetails.appendChild(commentTextNode);

    const commentActions = document.createElement("div");
    commentActions.classList.add("comment-actions");
    commentDetails.appendChild(commentActions);

    const editBtn = document.createElement("button");
    editBtn.classList.add("edit-btn");
    editBtn.textContent = "Edit";
    editBtn.addEventListener("click", () => {
      // logic for edit
      handleEdit(commentDiv,comment);
    });
    commentActions.appendChild(editBtn);

    const replyBtn = document.createElement("button");
    replyBtn.classList.add("reply-btn");
    replyBtn.textContent = "Reply";
    replyBtn.addEventListener("click", function () {
      // Logic for reply 
      handleReply(commentDiv);
    });
    commentActions.appendChild(replyBtn);

    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("delete-btn");
    deleteBtn.textContent = "Delete";
    deleteBtn.addEventListener("click", function () {
      // Logic for deleting 
      handleDelete(deleteBtn);
    });
    commentActions.appendChild(deleteBtn);

    // Recursively add replies
    if (comment && comment.replies && comment.replies.length > 0) {
      comment.replies.forEach(reply => {
        addComment(replies, reply);
      });
    }
    parentContainer.appendChild(commentDiv);
  }

  function updateCommentsList(commentId, commentText) {
    const processing = (list) => {
      list.forEach(comment => {
        if(comment.id == commentId) {
          if(!comment.replies) comment.replies = [];
          comment.replies.push({
            id:lastId++,
            userName: "New User",
            commentText: commentText,
          })
        }
        if(comment.replies &&  comment.replies.length > 0) {
          processing(comment.replies);
        }
      });
    };

    processing(commentsList);
  };

function handleReply(commentDiv) {
  const MAX_CHARACTERS = 50;

  // Remove any existing reply input or submit button
  if (currentReplyComment) {
    currentReplyComment.remove();
    currentSubmitReplyBtn.remove();
  }
  // Create reply input field
  const replyInput = document.createElement("textarea");
  replyInput.placeholder = "Enter your reply (max 50 characters)...";
  replyInput.classList.add("reply-input");

  // Create character counter
  const charCounter = document.createElement("p");
  charCounter.classList.add("char-counter");
  charCounter.textContent = `Characters remaining: ${MAX_CHARACTERS}`;

  // Track changes to the input and update character counter
  replyInput.addEventListener("input", () => {
    const charCount = replyInput.value.length; // Current character count
    const remainingChars = Math.max(0, MAX_CHARACTERS - charCount);

    if (charCount > MAX_CHARACTERS) {
      charCounter.style.color = "red"; // Highlight limit exceeded
    } else {
      charCounter.style.color = ""; // Reset color when within limit
    }

    charCounter.textContent = `Characters remaining: ${remainingChars}`;
  });

  // Create submit button
  const submitBtn = document.createElement("button");
  submitBtn.classList.add("submit-btn");
  submitBtn.textContent = "Submit";

  submitBtn.addEventListener("click", function () {
    const inputText = replyInput.value.trim();
    const charCount = inputText.length;

    // Validate character count
    if (charCount === 0) {
      alert("Reply cannot be empty!");
      return;
    }

    if (charCount > MAX_CHARACTERS) {
      alert(`Reply exceeds the maximum character limit of ${MAX_CHARACTERS} characters.`);
      return;
    }

    // Update comments list with the reply
    updateCommentsList(commentDiv.id, inputText);

    // Remove input and button
    replyInput.remove();
    submitBtn.remove();
    charCounter.remove();
    currentReplyComment = null;
    currentSubmitReplyBtn = null;
    loadUi();
  });

  // Append elements to the comment
  const commentDetails = commentDiv.querySelector(".comment-details");
  commentDetails.appendChild(replyInput);
  commentDetails.appendChild(charCounter);
  commentDetails.appendChild(submitBtn);

  // Track current input and button for future removal
  currentReplyComment = replyInput;
  currentSubmitReplyBtn = submitBtn;
}



  function removeByCommentId(commentId) {
    const processing = (list) => {
      for (let i = 0; i < list.length; i++) {
        const comment = list[i];
        if (comment.id == commentId) {
          list.splice(i, 1); // Remove the comment with the matching ID
          return true; // Exit recursion once the comment is found and removed
        }
        if (comment.replies && comment.replies.length > 0) {
          const found = processing(comment.replies);
          if (found) return true; // Stop recursion if the comment was found in replies
        }
      }
      return false; // Continue searching
    };
  
    processing(commentsList);
  }
  
  function handleDelete(deleteBtn) {
    const commentDiv = deleteBtn.closest(".comment"); // Get the parent comment div
    const commentId = parseInt(commentDiv.id); // Extract the ID
    removeByCommentId(commentId); // Remove from the comments list
    loadUi(); // Refresh the UI
  }

  function handleEdit(commentDiv, comment) {
    const commentDetails = commentDiv.querySelector(".comment-details");
    const commentTextNode = commentDetails.querySelector(".comment-text");
    const editBtn = commentDiv.querySelector(".edit-btn"); // Assuming there's an "Edit" button
  
    // Check if edit mode is already active
    if (commentDiv.querySelector(".edit-input")) {
      return; // Prevent adding multiple input fields and buttons
    }
  
    // Hide comment text and change "Edit" to "Cancel"
    commentTextNode.style.display = "none";
    editBtn.textContent = "Cancel";
  
    // Create input field and set its value to current comment text
    const editInput = document.createElement("input");
    editInput.type = "text";
    editInput.value = comment.commentText;
    editInput.classList.add("edit-input");
    commentDetails.insertBefore(editInput, commentTextNode);
  
    // Create "Save" button
    const saveBtn = document.createElement("button");
    saveBtn.textContent = "Save";
    saveBtn.classList.add("save-btn");
    commentDetails.appendChild(saveBtn);
  
    // Event listener for saving changes
    saveBtn.addEventListener("click", () => {
      const updatedText = editInput.value.trim();
  
      if (updatedText !== "") {
        // Update the comment text
        comment.commentText = updatedText;
        commentTextNode.textContent = updatedText;
      }
  
      // Restore original state
      commentTextNode.style.display = "block";
      editInput.remove();
      saveBtn.remove();
      editBtn.textContent = "Edit"; // Revert button text to "Edit"
    });
  
    // Event listener for canceling edit
    editBtn.addEventListener("click", () => {
      // If in edit mode, revert to original state without saving
      if (editBtn.textContent === "Cancel") {
        editInput.remove();
        saveBtn.remove();
        commentTextNode.style.display = "block";
        editBtn.textContent = "Edit"; // Revert button text to "Edit"
      }
    }, { once: true }); // Ensures the Cancel event listener is added only once
  }
  
  loadUi();
});

