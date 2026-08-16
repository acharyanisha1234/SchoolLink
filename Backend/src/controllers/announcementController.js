const Announcement = require('../models/Announcement');

exports.createAnnouncement = async (req, res) => {
  try {
    const { title, message } = req.body;

    if (!title || !message) {
      return res.status(400).json({
        success: false,
        message: 'Title and message are required',
      });
    }

    const announcement = await Announcement.create({
      title,
      message,
      createdBy: req.user._id,
      createdByRole: req.user.role,
      isPublished: true,
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
    const { title, message } = req.body;
    const announcement = await Announcement.findById(req.params.id);

    if (!announcement) {
      return res.status(404).json({
        success: false,
        message: 'Announcement not found',
      });
    }

    if (title !== undefined) announcement.title = title;
    if (message !== undefined) announcement.message = message;

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
