const express = require('express')
const router = express.Router();

router.get('/fetchallnotes', (req, res)=>{
   
    res.json([]);
})
module.exports = router;
