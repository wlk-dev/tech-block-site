const router = require('express').Router();
const { Post } = require('../../models');
const withAuth = require('../../utils/auth')

router.get('/:id', withAuth, (req, res) => {
  const id = req.params.id
  if(id) {
    Post.findByPk( id )
      .then( post => res.status(200).json(post) )
      .catch( err => res.status(400).json(err) )
  }
});

router.get('/', withAuth, (req, res) => { // add a where clause inside here
  Post.findAll()
    .then( posts => posts.map(post => post.get({plain : true})) )
    .then( posts => res.status(200).json(posts) )
    .catch( err => res.status(400).json(err) )
})

router.post('/', withAuth, async (req, res) => {
  try {
    const newPost = await Post.create({
      ...req.body,
      author_id: req.session.user_id,
    });

    res.status(200).json(newPost);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.delete('/:id', withAuth, async (req, res) => {
  try {
    const postData = await Post.destroy({
      where: {
        id: req.params.id,
        author_id: req.session.user_id,
      },
    });

    if (!postData) {
      res.status(404).json({ message: 'No post found with this id!' });
      return;
    }

    res.status(200).json(postData);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
