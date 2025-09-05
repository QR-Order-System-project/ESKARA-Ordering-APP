const express = require("express");
const { registerFcmToken } = require("../controllers/fcmController");

const router = express.Router();

router.post("/register", registerFcmToken);

module.exports = router;