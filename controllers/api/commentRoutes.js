const router = require('express').Router();
const { Comment } = require('../../models');
const withAuth = require('../../utils/auth')

// router.get('/:id', withAuth, (req, res) => {
//   const id = req.params.id
//   if(id) {
//     Comment.findByPk( id )
//       .then( comment => res.status(200).json(comment) )
//       .catch( err => res.status(400).json(err) )
//   }
// });

router.get('/:post_id', withAuth, (req, res) => { // add a where clause inside here
  const post_id = req.params.post_id
  if (post_id) {
    Comment.findAll({ where: { post_id } })
      .then(comments => comments.map(comment => comment.get({ plain: true })))
      .then(comments => res.status(200).json(comments))
      .catch(err => res.status(400).json(err))
  } else {
    res.status(400).json({ msg: "missing post_id" })
  }
})

router.post('/create', withAuth, async (req, res) => {
  console.log("here", req.body, req.session.current_post_id)
  try {
    const newComment = await Comment.create({
      ...req.body,
      commenter_id: req.session.user_id
    });

    res.status(200).json(newComment);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.put('/update/:id', withAuth, (req, res) => {
  const id = req.params.id
  Comment.update({
    ...req.body,
  },
  {
    where : {
      id,
    }
  }).then( updatedPost => res.status(200).json(updatedPost) )
    .catch( err => res.status(400).json(err) )
})


router.delete('/delete/:id', withAuth, async (req, res) => {
  try {
    const commentData = await Comment.destroy({
      where: {
        id: req.params.id,
      },
    });

    if (!commentData) {
      res.status(404).json({ message: 'No comment found with this id!' });
      return;
    }

    res.status(200).json(commentData);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
