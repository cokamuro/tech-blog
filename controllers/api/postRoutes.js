const router = require('express').Router();
const { Post } = require('../../models');

//get all posts
router.get('/', async (req, res) => {
    try {
      const postData = await Post.findAll({});
  
      const posts = postData.map((post) =>
        post.get({ plain: true })
      );
  
      req.session.save(() => {
        // save last action datetime to session?
        //req.session
  
        res.render("handlebarsviewhere", {
          posts 
        });
      });
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  });

//get a specific post
router.get('/post/:id', async (req, res) => {
    try {
      const postData = await Post.findByPk(req.params.id, {
        include: [
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
  
      const post = postData.get({ plain: true });
      res.render("handlebarsviewhere", {
        post,
        // We are not incrementing the 'countVisit' session variable here
        // but simply sending over the current 'countVisit' session variable to be rendered
        countVisit: req.session.countVisit,
      });
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  });


//create a post
router.post('/', async (req, res) => {
  try {
    const newPost = await Post.create({
      ...req.body,
      user_id: req.session.user_id,
    });

    res.status(200).json(newPost);
  } catch (err) {
    res.status(400).json(err);
  }
});

//update a post

//delete a post
router.delete('/:id', async (req, res) => {
  try {
    const postData = await Post.destroy({
      where: {
        id: req.params.id,
        user_id: req.session.user_id,
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
