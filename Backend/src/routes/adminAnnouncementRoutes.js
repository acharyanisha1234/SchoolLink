const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const announcementController = require('../controllers/announcementController');

router.use(protect);

router.get('/', announcementController.getAnnouncements);

router.use(authorize('ADMIN'));
router.post('/', announcementController.createAnnouncement);
router.put('/:id', announcementController.updateAnnouncement);
router.delete('/:id', announcementController.deleteAnnouncement);

module.exports = router;
