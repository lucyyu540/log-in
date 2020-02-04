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
        //default by week only
        var earnings = foundUser.earnings;
        var spendings = foundUser.spendings;
        var filteredEarnings = []; 
        var filteredSpendings = [];        
        const d = new Date()
        const floor = d.getTime() - 7*(1000*60*60*24); //exactly one week before
        
        for (var i = 0 ; i < earnings.length ; i ++) {
            const temp = earnings[i].date.getTime();
            if (temp > floor) {
                filteredEarnings.push(earnings[i]);
            }
        }
        for (var i = 0 ; i < spendings.length ; i ++) {
            const temp = spendings[i].date.getTime();
            if (temp > floor) {
                filteredSpendings.push(spendings[i]);
            }
        }
        //passing data to frontend
        res.json({username: foundUser.username, 
            earnings: filteredEarnings,
            spendings: filteredSpendings,
            spendingTags: foundUser.spendingTags,
            earningTags: foundUser.earningTags
        });

    }
    catch(err) {
        console.log(err);
    }
});
router.post('/:username/list/by-month', (req, res)=> {

});


//enter new earning
router.post('/:username/add-earning',  async (req, res) => {
    //checking for invalid inputs? 
    var amount = parseFloat(req.body.amount);
    var newTag = req.body.newTag;
    var tag = req.body.tag;
    console.log(newTag);
    console.log(tag);
    if (typeof amount != 'number') {
        return res.json({status: 'error', message: 'Amount must be numerical'})
    }
   var newEarning = {
       amount: amount,
       tag: tag
   };

    try {
        var user;
        if (newTag == '') {
            user = await User.updateOne({username: req.session.user.username},
                {$push : {earnings: newEarning}}
            );
        }
        else {
            user = await User.updateOne({username: req.session.user.username},
                {$push : {earnings: newEarning}}
            );
            user = await User.updateOne({username: req.session.user.username},
                {$push : {earningTags: newTag}}
            );

        }
        return res.json({status: 'success', 
                    message: 'New earning saved!',
                    amount : amount})
    }
    catch (err) {
        console.log(err);
    }

});
//adding new spending
router.post('/:username/add-spending',  async (req, res) => {
    console.log('server for inputting new spending');
    //checking for invalid inputs? 
    var amount = parseFloat(req.body.amount);
    var newTag = req.body.newTag;
    var tag = req.body.tag;
    if (typeof amount != 'number') {
        return res.json({status: 'error', message: 'Amount must be numerical'})
    }
   var newSpending = {
       amount: amount,
       tag: tag
   };

    try {
        var user;
        if (newTag == '') {
            user = await User.updateOne({username: req.session.user.username},
                {$push : {spendings: newSpending}}
                );
        }
        else {
            console.log('before adding new tag')
            user = await User.updateMany(
                {username: req.session.user.username},
                {$push : {spendingTags: newTag}}
            );
            user = await User.updateMany(
                {username: req.session.user.username},
                {$push : {spendings: newSpending}}
            );

            console.log(user);
        }
        return res.json({status: 'success', 
                    message: 'New spending saved!',
                    amount : amount});
    }
    catch (err) {
        console.log(err);
    }

});

module.exports = router;