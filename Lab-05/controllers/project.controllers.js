const Project = require("../dataModels/Project.model");
const User = require("../dataModels/User.model");
const path = require("path");
const bcrypt = require("bcrypt");
const passport = require("passport");

const postProject = async (req, res, next) => {
  const { user_id, name, description } = req.body;

  console.log(user_id);
  console.log(name);
  console.log(description);

  const errors = [];
  if (!name || !user_id || !description) {
    errors.push("All fields are required!");
  }

  if (errors.length > 0) {
    res.status(400).json({ error: errors });
  } else {
    //Create New Project
    const newProject = new Project({
      user_id,
      name,
      description,
    });
    newProject
      .save()
      .then(() => {
        res.redirect("/projects");
      })
      .catch(() => {
        errors.push("Please try again");
        res.status(400).json({ error: errors });
      });
  }
};

const getProjects = async (req, res) => {
  try {
    const projects = await Project.find();
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateProject = async (req, res) => {
  try {
    const { user_id, name, description } = req.body;

    const project = await Project.findOne({ user_id: user_id });
    console.log(project);

    if (!project) {
      return res.status(404).json({ error: "Project information not found" });
    }

    // Update
    if (name) {
      project.name = name;
    }

    if (description) {
      project.description = description;
    }

    await project.save();

    res.json({ message: "Project information updated successfully" });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

const deleteProject = async (req, res) => {
  try {
    const profileID = req.params.id;
    const profileInfo = await Project.findById(profileID);

    if (!profileInfo) {
      return res.status(404).json({ error: "Project information not found" });
    }

    await profileInfo.deleteOne({ _id: profileID });

    res.json({ message: "Project information deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
module.exports = {
  postProject,
  getProjects,
  updateProject,
  deleteProject,
};

const postProfileImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file provided" });
    }
    const photo = req.file.filename;

    const userId = req.user.id;
    const project = await Project.findById(userId);
    console.log(project);

    if (photo) {
      project.profile_image = photo;
    }
    await project.save();

    res.json({ message: "Profile image updated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const postMultipleImages = async (req, res) => {
  try {
    if (!req.files) {
      return res.status(400).json({ message: "No file provided" });
    }

    const photo = req.files.map((file) => file.filename);

    const userId = req.user.id;
    const project = await Project.findById(userId);

    if (photo) {
      project.images = project.images.concat(photo); //Adding new images to the existing ones
    }
    await project.save();

    res.json({ message: "Multiple images updated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getMultipleImages = async (req, res) => {
  try {
    const userId = req.user.id;
    const project = await Project.findById(userId);
    const images = project.images;

    res.json({ images });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const postAudioFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file provided" });
    }
    const audio = req.file.filename;

    const userId = req.user.id;
    const project = await Project.findById(userId);
    console.log(project);

    if (audio) {
      user.audio = audio;
    }
    await project.save();

    res.json({ message: "Audio updated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  postProfileImage,
  postMultipleImages,
  getMultipleImages,
  postAudioFile,
};
