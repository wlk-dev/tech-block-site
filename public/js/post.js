const createPost = async (event) => {
    const title = $("#titleText").val();
    const content = $("#contentText").val();

    if (content) {
        const response = await fetch('/api/posts/create', {
            method: 'POST',
            body: JSON.stringify({ title, content }),
            headers: { 'Content-Type': 'application/json' },
        });

        if (response.ok) {
            await Swal.fire(
                'Success!',
                'Your post has been created.',
                'success'
            )
            document.location.reload();
        } else {
            await Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Something went wrong!',
            })
        }

    }
}

const updatePost = async (event) => {
    const title = $("#titleText").val();
    const content = $("#contentText").val();

    const id = event.target.dataset.pid

    if (content) {
        const response = await fetch(`/api/posts/update/${id}`, {
            method: 'PUT',
            body: JSON.stringify({ title, content }),
            headers: { 'Content-Type': 'application/json' },
        });

        if (response.ok) {
            await Swal.fire(
                'Success!',
                'Your post has been updated.',
                'success'
            )
            document.location.reload();
        } else {
            await Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Something went wrong!',
            })
        }
        
        await backToDash()
    }
}

const deletePost = async (event) => {
    const result = await Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
    })

    const id = event.target.dataset.pid

    if (result.isConfirmed) {
        const response = await fetch(`/api/posts/delete/${id}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
        });
        if (response.ok) {
            await Swal.fire(
                'Deleted!',
                'Your post has been deleted.',
                'success'
            )
            document.location.reload();
        }
    }

};

const gotoUpdatePost = async (event) => {
    const id = event.target.dataset.pid
    document.location.replace(`/dashboard/update/${id}`)
}

const backToDash = async (event) => {
    document.location.replace('/dashboard')
}

$('.goto-update-post').on('click', gotoUpdatePost);
$('.delete-post').on('click', deletePost);
$('#update').on('click', updatePost);
$("#create").on('click', createPost);
$("#back").on('click', backToDash);