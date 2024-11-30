const express = require("express");
const router = express.Router();

const {
  handlepostdetails,
  handleprofilepage,
  getProblemDetails,
} = require("../controllers/profilecontroller");


router.post("/profile", handlepostdetails);

router.get("/profiledata", handleprofilepage);

router.get("/problem/:id", getProblemDetails);

module.exports = router;
