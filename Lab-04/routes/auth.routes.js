const express = require("express");
const router = express.Router();
const {
  getLogin,
  getRegister,
  postLogin,
  postRegister,
  updateProfile,
  getProfileInfos,
  deleteProfile,
} = require("../controllers/auth.controllers");

const {
  postProject,
  getProjects,
  updateProject,
  deleteProject,
} = require("../controllers/project.controllers");

router.get("/login", getLogin);
router.post("/login", postLogin);
router.get("/register", getRegister);
router.post("/register", postRegister);

router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      res.json({ error: err });
    } else res.redirect("/");
  });
});

router.get("/profiles", getProfileInfos);
router.patch("/update-profile", updateProfile);
router.delete("/delete-profile/:id", deleteProfile);

router.post("/projects", postProject);
router.get("/projects", getProjects);
router.patch("/update-project", updateProject);
router.delete("/delete-project/:id", deleteProject);

module.exports = router;
