const express = require("express");
const { getDoc, createDoc } = require("../functions/docWriter");
const router = express.Router()
const { v4: uuidv4 } = require('uuid');

router.post("/new", (req, res) => {
    // JSON FORMAT:
    // {id:meep, content:{key:uuid-uuu-idd-diidu}}
    let key = uuidv4()
    let body = { id: req.body.id, content: { key: key } }
    try {
        if (!getDoc(body, "Users").result) {
            createDoc(body, "Users");
            res.status(200).json({ success: true, key: key })
        }
        else { throw new Error("Already Exists") }
    } catch (error) {
        res.status(500).json({ success: false, error: error })
    }
})

exports = router;