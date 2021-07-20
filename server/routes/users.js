const express = require("express"),
  bodyParser = require("body-parser"),
  { body, validationResult } = require("express-validator"),
  db = require("../function"),
  _ = require("lodash"),
  aws = require("aws-sdk"),
  customValidation = require("../middleware");
const router = express.Router();

router.use(bodyParser.json());

router.post(
  "/",
  [
    body("email").exists().isEmail(),
    body("username").exists(),
    body("password").exists(),
    body("zip").exists()
  ],
  customValidation.validate,
  async (req, res) => {
    let password = await db.hashPassword(req.body.password);
    db.createItem("users", {
      email: { S: req.body.email },
      id: { S: req.body.username },
      password: { S: password },
      zip: { S: req.body.zip}
    });
    res.status(201).send();
  }
);

router.get("/:user_id", async (req, res) => {
  let user = await db.getItem("users", req.params.user_id);
  if (_.isUndefined(user.Item)) {
    return res.status(404).json({ error: "This user doesn't exist" });
  } else {
    user = _.omit(aws.DynamoDB.Converter.unmarshall(user.Item), "password");
    return res.status(200).json(user);
  }
});

router.put(
  "/:user_id",
  [
    body("email").exists().isEmail(),
    body("username").exists(),
    body("password").exists(),
  ],
  customValidation.validate,
  (req, res) => {
    res.status(200).send();
  }
);

router.delete("/:user_id", customValidation.isLoggedIn, (req, res) => {
  db.deleteItem("users", req.params.user_id);
  res.status(204).send();
});

module.exports = router;
