import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema(
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true,
      },

      name: {
        type: String,
        required: true,
        trim: true,
      },

      email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
      },

      department: {
        type: String,
        required: true,
        trim: true,
      },

      year: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
      },

      preferredTeam: {
        type: String,
        required: true,
        trim: true,
      },

      reason: {
        type: String,
        required: true,
        trim: true,
        maxlength: 1000,
      },

      status: {
        type: String,
        enum: ['Pending', 'Accepted', 'Rejected'],
        default: 'Pending',
      },
    },
    {
      timestamps: true,
    },
);

const Application = mongoose.models.Application ||
    mongoose.model('Application', applicationSchema);

export default Application;
