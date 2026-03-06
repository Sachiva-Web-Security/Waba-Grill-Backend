const express = require("express")
const router = express.Router()

const { createFranchise } = require("../controllers/franchiseController")

router.post("/apply", createFranchise)

module.exports = router