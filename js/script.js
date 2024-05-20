// Function to fetch user data from the API
async function fetchUserData() {
    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/users');
        const data = await response.json();
        return data;
    } catch (error) {
        throw new Error('Error fetching data:', error);
    }
}

// Function to render options in the select element
function renderUserOptions(users, selectElement) {
    users.forEach(user => {
        const option = document.createElement('option');
        option.text = user.name;
        option.value = user.id;
        selectElement.appendChild(option);
    });
}

// Function to update the user profile in the profile div
function updateUserProfile(user, profileDiv) {
    profileDiv.innerHTML = `
      <h3>${user.name}</h3>
      <p>@${user.username}</p>
      <p><i class="fa-solid fa-link"></i> <a href="#" target="_blank">${user.website}</a></p>
      <p><i class="fa-solid fa-location-dot"></i> ${user.address.city}</p>
      <p><i class="fa-solid fa-building"></i> ${user.company.name}</p>
      <p>${user.company.catchPhrase}</p>
      <p>${user.company.bs}</p>
    `;
}

// Function to handle errors during fetching
function handleFetchError(error) {
    console.error('Error fetching data:', error);
}

// Function to fetch user posts based on userId
async function fetchUserPosts(userId) {
    try {
        const response = await fetch(`https://jsonplaceholder.typicode.com/posts?userId=${userId}`);
        const data = await response.json();
        return data;
    } catch (error) {
        throw new Error('Error fetching posts:', error);
    }
}

// Function to get comments count
async function getPostsCount(userId) {
    try {
        const response = await fetch(`https://jsonplaceholder.typicode.com/posts?userId=${userId}`);
        const data = await response.json();
        return data.length;
    } catch (error) {
        throw new Error('Error fetching posts count:', error);
    }
}

// Function to render user posts in a specified div
function renderUserPosts(posts, postsDiv) {
    postsDiv.innerHTML = ''; // Clear previous posts
    posts.forEach(post => {
        const postElement = document.createElement('div');
        postElement.classList.add('post');
        postElement.dataset.postId = post.id;
        postElement.innerHTML = `
        <h3>${post.title}</h3>
        <p>${post.body}</p>
      `;
        postsDiv.appendChild(postElement);
    });
}

// Function to render comments count
async function renderPostsCount(noOfPosts) {
    document.getElementById('posts-count').textContent = '';
    document.getElementById('posts-count').textContent = noOfPosts;
}

// Function to fetch comments based on postId
async function fetchPostComments(postId) {
    try {
        const response = await fetch(`https://jsonplaceholder.typicode.com/comments?postId=${postId}`);
        const data = await response.json();
        return data;
    } catch (error) {
        throw new Error('Error fetching comments:', error);
    }
}

// Function to get comments count
async function getCommentsCount(postId) {
    try {
        const response = await fetch(`https://jsonplaceholder.typicode.com/comments?postId=${postId}`);
        const data = await response.json();
        return data.length;
    } catch (error) {
        throw new Error('Error fetching comments count:', error);
    }
}

// Function to render comments in a specified div
function renderComments(comments, commentsDiv) {
    commentsDiv.innerHTML = ''; // Clear previous comments
    comments.forEach(comment => {
        const commentElement = document.createElement('div');
        commentElement.classList.add('comment');
        commentElement.innerHTML = `
        <h4>${comment.name}</h4>
        <p>${comment.body}</p>
        <p><em>${comment.email}</em></p>
      `;
        commentsDiv.appendChild(commentElement);
    });
}

// Function to render comments count
async function renderCommentsCount(noOfComments) {
    document.getElementById('comments-count').textContent = '';
    document.getElementById('comments-count').textContent = noOfComments;
}

// Main function to initialize the application
async function initApp() {
    const selectElement = document.getElementById('users');
    const profileDiv = document.getElementById('profile');
    const postsDiv = document.getElementById('posts');
    const commentsDiv = document.getElementById('comments');

    try {
        const users = await fetchUserData();
        renderUserOptions(users, selectElement);

        // Select the first user by default
        const defaultUserId = users[0].id;
        selectElement.value = defaultUserId;

        // Render the profile of the first user
        const defaultUser = users.find(user => user.id === defaultUserId);
        updateUserProfile(defaultUser, profileDiv);

        // Fetch and render posts of the first user
        const defaultUserPosts = await fetchUserPosts(defaultUserId);
        renderUserPosts(defaultUserPosts, postsDiv, commentsDiv);

        renderPostsCount(await getPostsCount(defaultUserId));

        // Fetch and render comments of the first post
        const defaultPostId = defaultUserPosts[0].id;
        const defaultPostComments = await fetchPostComments(defaultPostId);
        renderComments(defaultPostComments, commentsDiv);

        renderCommentsCount(await getCommentsCount(defaultPostId));

        // Event listener for changes in the selected option
        selectElement.addEventListener('change', async function () {
            const selectedUserId = parseInt(this.value);
            const selectedUser = users.find(user => user.id === selectedUserId);
            updateUserProfile(selectedUser, profileDiv);

            try {
                const posts = await fetchUserPosts(selectedUserId);
                renderUserPosts(posts, postsDiv);

                renderPostsCount(await getPostsCount(defaultUserId));

                // Fetch and render comments of the first post
                const firstPostId = posts[0].id;
                const comments = await fetchPostComments(firstPostId);
                renderComments(comments, commentsDiv);
                renderCommentsCount(await getCommentsCount(firstPostId));
                
                // Add event listeners to each post
                postsDiv.querySelectorAll('div').forEach(postElement => {
                    postElement.addEventListener('click', async function () {
                        const postId = parseInt(this.dataset.postId);
                        const comments = await fetchPostComments(postId);
                        renderComments(comments, commentsDiv);
                        renderCommentsCount(await getCommentsCount(postId));
                    });
                });
            } catch (error) {
                handleFetchError(error);
            }
        });
    } catch (error) {
        handleFetchError(error);
    }
}

// Call the initApp function to start the application
initApp();
