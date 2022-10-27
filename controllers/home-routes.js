const router = require('express').Router();
const { User, Post } = require('../models');
const withAuth = require('../utils/auth');

router.get('/', withAuth, async (req, res) => {
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

router.get('/post/:id', (req, res) => {
  const id = req.params.id
  if(id) {
    Post.findByPk(id, {include : {
      model : User,
      attributes : ['username']
    }})
      .then( raw => {
        const proj = raw.get({plain : true})
        console.log(proj)
        res.render('post', {...proj, logged_in : req.session.logged_in})
      })
      .catch( err => res.status(400).json(err) )
  }
})

router.get('/login', (req, res) => {
  if (req.session.logged_in) {
    res.redirect('/');
    return;
  }

  res.render('login');
});

module.exports = router;