const mongoose = require("mongoose");

const ProjectSchema = new mongoose.Schema({
  user_id: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  profile_image: {
    type: String,
    default: "",
  },
  images: {
    type: [String],
    default: [],
  },
  audio: {
    type: String,
    default: "",
  },
});

const Project = mongoose.model("Project", ProjectSchema);
module.exports = Project;
