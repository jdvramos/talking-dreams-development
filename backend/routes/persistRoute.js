const router = require("express").Router();

const { handlePersistLogin } = require("../controller/persistLoginController");

router.get("/", handlePersistLogin);

module.exports = router;
