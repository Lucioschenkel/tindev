const express = require('express');
const devController = require('./controllers/DevController');
const LikeController = require('./controllers/LikeController');
const DislikeController = require('./controllers/DislikeController');

const router = express.Router();

router.get('/devs', devController.index);
router.post('/devs', devController.store);
router.post('/devs/:devId/likes', LikeController.store);
router.post('/devs/:devId/dislikes', DislikeController.store);

module.exports = router;
