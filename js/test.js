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

        // Fetch and render comments of the first post
        const defaultPostId = defaultUserPosts[0].id;
        const defaultPostComments = await fetchPostComments(defaultPostId);
        renderComments(defaultPostComments, commentsDiv, users);

        // Event listener for changes in the selected option
        selectElement.addEventListener('change', async function () {
            const selectedUserId = parseInt(this.value);
            const selectedUser = users.find(user => user.id === selectedUserId);
            updateUserProfile(selectedUser, profileDiv);

            try {
                const posts = await fetchUserPosts(selectedUserId);
                renderUserPosts(posts, postsDiv, commentsDiv);

                // Fetch and render comments of the first post
                const firstPostId = posts[0].id;
                const comments = await fetchPostComments(firstPostId);
                renderComments(comments, commentsDiv, users);
            } catch (error) {
                handleFetchError(error);
            }
        });
    } catch (error) {
        handleFetchError(error);
    }
}

// !
async function getCommentCount(postId) {
    try {
        const response = await fetch(`/comments/count?postId=${postId}`);
        const data = await response.json();
        return data.count; // Assuming the API returns an object with a 'count' property
    } catch (error) {
        console.error('Error fetching comment count:', error);
        return 0; // Return 0 if there's an error
    }
}

