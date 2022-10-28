const router = require('express').Router();
const { User, Post, Comment } = require('../models');
const withAuth = require('../utils/auth');

router.get('/', async (req, res) => {
    try {
      const dbPostsData = await Post.findAll({
        include: [
          {
            model: User,
            attributes : ['username']
          },
        ],
      });
  
      const posts = dbPostsData.map((post) =>
        post.get({ plain: true })
      );
      
      res.render('homepage', {
        posts,
        logged_in: req.session.logged_in,
      });
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
});


router.get('/profile', withAuth, (req, res) => {
    
})

router.get('/post/:id', withAuth, async (req, res) => {
  const id = req.params.id
  if(id) {
    const raw = await Comment.findAll({ where : { post_id : id }, include : { model : User, attributes : ['username'] } })
    const comments = raw.map( c => c.get({plain : true}) )

    console.log(comments)

    Post.findByPk(id, {include : {
      model : User,
      attributes : ['username']
    }})
      .then( raw => {
        const post = raw.get({plain : true})
        res.render('post', {...post, logged_in : req.session.logged_in, comments})
      })
      .catch( err => res.status(400).json(err) )
  }
})

router.get('/signup', (req, res) => {
  if (req.session.logged_in) {
    res.redirect('/');
    return;
  }

  res.render('signup');
});

router.get('/login', (req, res) => {
  if (req.session.logged_in) {
    res.redirect('/');
    return;
  }

  res.render('login');
});

module.exports = router;