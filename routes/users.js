const express = require('express');
//DB models
const mongoose = require('mongoose');
const User = require('../models/User');
const { check, validationResult } = require("express-validator");//middleware btw frontend request and backend processor

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

//on home page loading, 
router.post('/:username/list', async (req, res, next) => {
    try {
        const foundUser = await User.findOne({username: req.session.user.username});
        res.json({username: foundUser.username, 
            earnings: foundUser.earnings,
            spendings: foundUser.spendings
        });

    }
    catch(err) {
        console.log(err);
    }
});


//enter new earning
router.post('/:username/add-earning',  async (req, res) => {
    console.log('server for inputting new earning');
    console.log(req.session.user);
    //checking for invalid inputs? 
    var amount = parseFloat(req.body.amount);
    if (typeof amount != 'number') {
        return res.json({status: 'error', message: 'Amount must be numerical'})
    }
   var newEarning = {
       amount: amount,
   };

    try {
        var user = await User.updateOne({username: req.session.user.username},
            {$push : {earnings: newEarning}}
            );
        return res.json({status: 'success', 
                    message: 'New earning saved!',
                    amount : amount})
    }
    catch (err) {
        console.log(err);
    }

});

module.exports = router;