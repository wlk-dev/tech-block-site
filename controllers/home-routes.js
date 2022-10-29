const router = require('express').Router();
const { User, Post, Comment } = require('../models');
const withAuth = require('../utils/auth');

router.get('/', async (req, res) => {
    try {
        const dbPostsData = await Post.findAll({
            include: [
                {
                    model: User,
                    attributes: ['username']
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


router.get('/dashboard', withAuth, async (req, res) => {
    try {
        const dbPostsData = await Post.findAll({
            where: {
                author_id: req.session.user_id
            }
        });

        const posts = dbPostsData.map((post) =>
            post.get({ plain: true })
        );
        res.render('dashboard', {
            posts,
            logged_in: req.session.logged_in,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

router.get('/dashboard/update/:id', withAuth, async (req, res) => {
    try {
        const dbPostData = await Post.findByPk(req.params.id);

        const post = dbPostData.get({plain : true})
        
        res.render('dashboard', {
            ...post,
            logged_in: req.session.logged_in,
            update : true
        });

    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

router.get('/post/:id', withAuth, async (req, res) => {
    const id = req.params.id
    if (id) {
        const raw = await Comment.findAll({ where: { post_id: id }, include: { model: User, attributes: ['username'] } })
        let comments = raw.map(c => c.get({ plain: true }))

        comments.forEach( x => {
            x.posted_by_user = x.commenter_id === req.session.user_id ? true : false
            console.log(x)
            return x
        })

        Post.findByPk(id, {
            include: {
                model: User,
                attributes: ['username']
            }
        })
            .then(raw => {
                const post = raw.get({ plain: true })

                res.render('post', { ...post, logged_in: req.session.logged_in, user_id : req.session.user_id, comments })
            })
            .catch(err => res.status(400).json(err))
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