const router = require("express").Router();

const { loginUser, registerUser } = require("../controller/authController");

router.post("/register", registerUser);
router.post("/login", loginUser);
// router.post('/logout', logoutUser);

module.exports = router;
