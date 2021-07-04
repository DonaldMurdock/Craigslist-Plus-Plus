const express = require("express"),
  bodyParser = require("body-parser");
const router = express.Router();

router.use(bodyParser.json());

router.post(
  "/",
  [
    body("email").exists(),
    body("username").exists(),
    body("password").exists(),
  ],
  (req, res) => {
    res.status(201).send();
  }
);

router.get("/:user_id", (req, res) => {
  res.status(200).json();
});

router.put(
  "/:user_id",
  [
    body("email").exists(),
    body("username").exists(),
    body("password").exists(),
  ],
  (req, res) => {
    res.status(200).send();
  }
);

router.delete("/:user_id", (req, res) => {
  res.status(204).send();
});

module.exports = router;
