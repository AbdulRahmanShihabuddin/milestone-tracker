import mongoose from 'mongoose';

const milestoneSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'completed'],
    default: 'pending'
  },
  category: {
    type: String,
    default: 'general'
  },
  dueDate: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

const Milestone = mongoose.model('Milestone', milestoneSchema);
export default Milestone;
