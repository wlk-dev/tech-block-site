const postComment = async (event) => {
    const content = $("#commentText").val();

    if (content) {
        const response = await fetch('/api/comments/create', {
            method: 'POST',
            body: JSON.stringify({content}),
            headers: { 'Content-Type': 'application/json' },
        });

        if (response.ok) {
            document.location.reload();
        } else {
            alert('Failed to post comment.');
        }

    }
}

$("#comment-btn").on('click', postComment);