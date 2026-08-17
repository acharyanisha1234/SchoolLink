const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const announcementController = require('../controllers/announcementController');

router.use(protect);

router.get('/', announcementController.getAnnouncements);

router.post('/', authorize('ADMIN', 'TEACHER'), announcementController.createAnnouncement);
router.put('/:id', authorize('ADMIN', 'TEACHER'), announcementController.updateAnnouncement);
router.delete('/:id', authorize('ADMIN', 'TEACHER'), announcementController.deleteAnnouncement);

module.exports = router;
