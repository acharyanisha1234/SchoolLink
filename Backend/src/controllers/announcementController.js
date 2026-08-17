const Announcement = require('../models/Announcement');

const normalizeAnnouncementText = (reqBody = {}) => {
  const text = typeof reqBody.message === 'string'
    ? reqBody.message
    : (typeof reqBody.content === 'string' ? reqBody.content : '');

  return text.trim();
};

exports.createAnnouncement = async (req, res) => {
  try {
    const { title } = req.body;
    const content = normalizeAnnouncementText(req.body);

    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: 'Title and message are required',
      });
    }

    const creatorRole = String(req.user.role || 'ADMIN').toUpperCase();

    const announcement = await Announcement.create({
      title,
      message: content,
      content,
      createdBy: req.user._id,
      createdByRole: creatorRole,
      teacherId: creatorRole === 'TEACHER' ? req.user._id : undefined,
      isPublished: true,
      published: true,
    });

    const populated = await Announcement.findById(announcement._id).populate('createdBy', 'fullName email role');

    res.status(201).json({
      success: true,
      message: 'Announcement created successfully',
      data: populated,
    });
  } catch (error) {
    console.error('Create announcement error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error creating announcement',
    });
  }
};

exports.getAnnouncements = async (req, res) => {
  try {
    const announcements = await Announcement.find({})
      .populate('createdBy', 'fullName email role')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: announcements.length,
      data: announcements,
    });
  } catch (error) {
    console.error('Get announcements error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching announcements',
    });
  }
};

exports.updateAnnouncement = async (req, res) => {
  try {
    const { title } = req.body;
    const message = normalizeAnnouncementText(req.body);
    const announcement = await Announcement.findById(req.params.id);

    if (!announcement) {
      return res.status(404).json({
        success: false,
        message: 'Announcement not found',
      });
    }

    if (req.user.role === 'TEACHER' && announcement.createdBy && announcement.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You are not allowed to edit this announcement',
      });
    }

    if (title !== undefined) announcement.title = title;
    if (message) {
      announcement.message = message;
      announcement.content = message;
    }

    await announcement.save();

    const populated = await Announcement.findById(announcement._id).populate('createdBy', 'fullName email role');

    res.status(200).json({
      success: true,
      message: 'Announcement updated successfully',
      data: populated,
    });
  } catch (error) {
    console.error('Update announcement error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error updating announcement',
    });
  }
};

exports.deleteAnnouncement = async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id);

    if (!announcement) {
      return res.status(404).json({
        success: false,
        message: 'Announcement not found',
      });
    }

    if (req.user.role === 'TEACHER' && announcement.createdBy && announcement.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You are not allowed to delete this announcement',
      });
    }

    await announcement.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Announcement deleted successfully',
    });
  } catch (error) {
    console.error('Delete announcement error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error deleting announcement',
    });
  }
};
