const router = require("express").Router();

const { handleRefreshToken } = require("../controller/refreshTokenController");

router.get("/", handleRefreshToken);

module.exports = router;
