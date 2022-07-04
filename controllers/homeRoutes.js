const router = require('express').Router();
const { Post, User } = require('../models');

//login handler
router.get('/login', (req, res) => {
    if (req.session.isLoggedIn) {
        res.redirect('/');
    } else {
        res.render('login');
    }
});

//get all posts
router.get('/', async (req, res) => {
    try {
        const postData = await Post.findAll({
            include: [{
                model: User,
                attributes: ["name"]
            }]
        });

        const posts = postData.map((post) =>
            post.get({ plain: true })
        );

        res.render("homepage", {
            posts,
            isLoggedIn: req.session.isLoggedIn
        });
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

//get a specific post
router.get('/post/:id', async (req, res) => {
    //check for login
    if (req.session.isLoggedIn = false) {
        res.redirect('/login')
    } else {

        try {
            const postData = await Post.findByPk(req.params.id, {
                include: [
                    {
                        model: User,
                        attributes: "name"
                    },
                    {
                        model: Comment,
                        attributes: [
                            "id",
                            "content",
                            "date_created",
                            "user_id",
                        ],
                    },
                ],
            });

            if (postData){
                const post = postData.get({ plain: true });
                res.render("full-post", { post });
            } else {
                res.status(404).json({ message: 'No post found with this id' });
            }
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    }
});

module.exports = router;
