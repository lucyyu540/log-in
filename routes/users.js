const express = require('express');
//DB models
const mongoose = require('mongoose');
const User = require('../models/User');

const router = express.Router();
var path = require('path');


router.get('/:username',
     (req, res) => {
        console.log('in endpoint users/username. now rendering home page');
        res.sendFile('home.html', 
            {root: path.join(__dirname+ '/../public/build')},
            err => {
                if (err) {
                    console.log('home page cannot load');
                    res.status(err.status).end();
                }
                console.log('in res.sendFile');
            });
});

//on home page loading, 
router.post('/:username/list', async (req, res, next) => {
    console.log('on home page load, list');
    try {
        const foundUser = await User.findOne({username: res.locals.user.user.username});
        //default by week only
        console.log('user found: ' + foundUser);
        var earnings = foundUser.earnings;
        var spendings = foundUser.spendings;
        var filteredEarnings = []; 
        var filteredSpendings = [];        
        const d = new Date()
        const floor = d.getTime() - 7*(1000*60*60*24); //exactly one week before
        
        for (var i = earnings.length-1 ; i >= 0 ; i --) {
            const temp = earnings[i].date.getTime();
            if (temp > floor) {
                filteredEarnings.push(earnings[i]);
            }
        }
        for (var i = spendings.length-1 ; i >= 0 ; i --) {
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
router.post('/:username/list/30-days', (req, res)=> {

});
router.post('/:username/list/24-hours', (req, res)=> {

});


//enter new earning
router.post('/:username/add-earning',  async (req, res) => {
    //checking for invalid inputs? 
    console.log(req.body);
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
        var user = await User.findOne({username: res.locals.user.user.username});
        user.earnings.push(newEarning);
        if (newTag != '') {
            user.earningTags.push(newTag);
        }
        user.save();
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
        var user = await User.findOne({username: res.locals.user.user.username});
        user.spendings.push(newSpending);
        if (newTag != '') {
            console.log('before adding new tag')
            user.spendingTags.push(newTag);
        }
        user.save();
        return res.json({status: 'success', 
                    message: 'New spending saved!',
                    amount : amount});
    }
    catch (err) {
        console.log(err);
    }

});

module.exports = router;