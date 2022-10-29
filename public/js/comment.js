const postComment = async (event) => {
    const content = $("#commentText").val();

    const post_id = document.location.href.split('/').pop()

    if (content) {
        const response = await fetch('/api/comments/create', {
            method: 'POST',
            body: JSON.stringify({ content, post_id }),
            headers: { 'Content-Type': 'application/json' },
        });

        if (response.ok) {
            document.location.reload();
        } else {
            alert('Failed to post comment.');
            console.log(response.json())
        }

    }
}

const updateComment = async (event) => {
    const id = event.target.dataset.cid
    const commentText = $($(event.target).parent().children().get(2)).text()
    // this is fucking witchcraft but it works ^^^^

    if (id) {
        await Swal.fire({
            title: 'New comment.',
            input: 'text',
            inputValue: commentText,
            inputAttributes: {
                autocapitalize: 'off',
            },
            showCancelButton: true,
            confirmButtonText: 'Update',
            showLoaderOnConfirm: true,
            preConfirm: (content) => {
                return fetch(`/api/comments/update/${id}`, {
                    method: 'PUT',
                    body: JSON.stringify({ content }),
                    headers: { 'Content-Type': 'application/json' },
                }).then(resp => {
                    if (!resp) throw new Error(resp.statusText)
                    return resp.json();
                }).catch(err => {
                    Swal.showValidationMessage(
                        `Failed to update comment: ${err}`
                    )
                })
            },
            allowOutsideClick: () => !Swal.isLoading()
        }).then(result => {
            console.log(result)
            if (result.isConfirmed) {
                Swal.fire({
                    title: 'Success!',
                    text : "Comment updated.",
                    icon : "success",
                    timer: 1200,
                    timerProgressBar: true,
                }).then( res => document.location.reload() )
            }
        })
    }
}

const deleteComment = async (event) => {
    const result = await Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
    })

    const id = event.target.dataset.cid

    if (result.isConfirmed) {
        const response = await fetch(`/api/comments/delete/${id}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
        });
        if (response.ok) {
            await Swal.fire(
                'Deleted!',
                'Your comment has been deleted.',
                'success'
            )
            document.location.reload();
        }
    }

}

$('.delete-comment').on('click', deleteComment);
$('.update-comment').on('click', updateComment);
$("#comment-btn").on('click', postComment);