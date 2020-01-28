const express = require('express');
const User = require('../models/User');
const router = express.Router();
var path = require('path');

//register a new user
router.get('/:username',
     (req, res, next) => {
    res.sendFile('home.html', 
    {root: path.join(__dirname+ '/../public/build')},
    function(err) {
        if (err) {
            console.log('home page cannot load');
            res.status(err.status).end();
        }
    });
    
});

router.post('/:username/list', async (req, res, next) => {
    console.log('trying to list stuff out')
    try {
        const foundUser = await User.findOne(req.session.user.username);
        const list = foundUser.list;
        res.json({user: user});

    }
    catch(err) {

    }
});


module.exports = router;