
const router = require('express').Router();

const fileupload=require('../upload');

router.post('/upload', (req, res) => {
    
        fileupload.uploadimage(req,res);
        res.end();
});

module.exports = router;