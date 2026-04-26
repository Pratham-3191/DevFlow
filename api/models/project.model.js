const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: '',
    },

    // Owner of the project
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    //  Users who can access the project
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  { timestamps: true }
);

// Ensure creator is always part of members
projectSchema.pre('save', async function () {
  if (
    this.createdBy &&
    !this.members.some(
      member => member.toString() === this.createdBy.toString()
    )
  ) {
    this.members.push(this.createdBy);
  }
});

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;