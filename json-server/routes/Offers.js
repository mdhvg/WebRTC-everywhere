const express = require("express");
const { createDoc, getDoc } = require("../functions/docWriter")
const router = express.Router()

router.post("/new", (req, res) => {
    try {
        createDoc(req.body, "Offers");
        res.status(200).json({ success: true })
    } catch (error) {
        res.status(500).json({ success: false })
    }
})

router.post("/get", (req, res) => {
    let read = getDoc(req.body, "Offers")
    if (read.result) {
        res.status(200).json(read)
    } else {
        res.status(404).json(read)
    }
})

module.exports = router;