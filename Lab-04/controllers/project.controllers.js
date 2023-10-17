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
