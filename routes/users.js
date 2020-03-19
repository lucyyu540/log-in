const express = require('express');
//DB models
const mongoose = require('mongoose');
const User = require('../models/User');

const router = express.Router();
var path = require('path');

router.use(express.static(path.join(__dirname+ '/../public'))); 
/** 
router.use("/css",  express.static(__dirname + '/../public/css'));
router.use("/js", express.static(__dirname + '/../public/js'));
router.use("/img",  express.static(__dirname + '/../public/img')); 
*/

router.get('/:username', (req, res) => {
        console.log('in endpoint users/username. now rendering home page');
        res.sendFile('home.html', 
            {root: path.join(__dirname+ '/../public/build')},
            err => {
                if (err) {
                    console.log('home page cannot load');
                    res.status(err.status).end();
                }
            });
});

//on home page loading, 
router.post('/:username/list', async (req, res, next) => {
    console.log('on home page load, list');
    try {
        var user = await User.findOne({username: res.locals.user.user.username});
        var days = user.days;
        var earnings = 0;
        var spendings = 0;

        //filter time
        const d = new Date()
        const floor = d.getTime() - days*(1000*60*60*24);//window
        //map
        var earningMap = new Map();
        for (var i = 0 ; i < user.earningTags.length ; i ++) {
            earningMap.set(user.earningTags[i], 0);
        }
        var spendingMap = new Map();
        for (var i = 0 ; i < user.spendingTags.length ; i ++) {
            spendingMap.set(user.spendingTags[i], 0);
        }
        //calculating and sorting into maps
        for (var i = user.earnings.length-1 ; i >= 0 ; i --) {
            const time = user.earnings[i].date.getTime();
            if (time >= floor) {
                var amount = user.earnings[i].amount;
                var tag = user.earnings[i].tag;
                earnings += amount;
                earningMap.set(tag, earningMap.get(tag) + amount)
            }
            else break;
        }
        for (var i = user.spendings.length-1 ; i >= 0 ; i --) {
            const time = user.spendings[i].date.getTime();
            if (time >= floor) {
                var amount = user.spendings[i].amount;
                var tag = user.spendings[i].tag;
                spendings += amount;
                spendingMap.set(tag, spendingMap.get(tag) + amount);
            }
            else break;
        }
        //changing maps into array
        var earningSorted = [];
        var spendingSorted = [];
        earningMap.forEach((value, key, map) => {
            earningSorted.push(value);
        })
        spendingMap.forEach((value, key, map) => {
            spendingSorted.push(value);
        })

        //return to client
        const result = {
            username: user.username, 
            earnings: earnings,
            spendings: spendings,
            spendingTags: user.spendingTags,
            earningTags: user.earningTags,
            earningSorted: earningSorted,
            spendingSorted: spendingSorted,
            days: days
        }
        return res.json(result);

    }
    catch (err) {
        console.log(err);
    }
});

router.post('/:username/list/7-days', async (req, res)=> {
    console.log('7days');
    var user = await User.findOne({username: res.locals.user.user.username});
    user.days = 7;
    user.save();
});

router.post('/:username/list/30-days', async (req, res)=> {
    console.log('30days');
    var user = await User.findOne({username: res.locals.user.user.username});
    user.days = 30;
    user.save();
});

router.post('/:username/list/24-hours', async (req, res)=> {
    console.log('24hours');
    var user = await User.findOne({username: res.locals.user.user.username});
    user.days = 24;
    user.save();
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
       tag: tag,
   };

    try {
        var user = await User.findOne({username: res.locals.user.user.username});
        if (newTag != '') {
            //check if tag already exists
            var exists = false;
            for (var i = 0 ; i < user.earningTags.length; i ++) {
                if (user.earningTags[i].toLowerCase() == newTag.toLowerCase()) {
                    exists = true;
                    newEarning.tag = user.earningTags[i];
                    break;
                }
            }
            if (!exists) user.earningTags.push(newTag);
        }
        user.earnings.push(newEarning);
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
       tag: tag,
   };

    try {
        var user = await User.findOne({username: res.locals.user.user.username});
        if (newTag != '') {
             //check if tag already exists
             var exists = false;
             for (var i = 0 ; i < user.spendingTags.length; i ++) {
                 if (user.spendingTags[i].toLowerCase() == newTag.toLowerCase()) {
                     exists = true;
                     newSpending.tag = user.spendingTags[i];//use existing tag value
                     break;
                 }
             }
             if (!exists) user.spendingTags.push(newTag);
        }
        user.spendings.push(newSpending);
        user.save();
        return res.json({status: 'success', 
                    message: 'New spending saved!',
                    amount : amount});
    }
    catch (err) {
        console.log(err);
    }

});

router.get('/:username/profile', (req, res) => {
    console.log('sending the profile.html file');
    res.sendFile('profile.html', 
        {root: path.join(__dirname+ '/../public/build')},
        err => {
            if (err) {
                console.log('profile page cannot load');
                res.status(err.status).end();
            } 
        }
    );
});

router.get('/:username/profile/load', async (req, res)=> {
    console.log('load profile called');
    try {
        var user = await User.findOne({username: res.locals.user.user.username});
        result = {
            username: user.username,
            firstName: user.firstName,
            middleName: user.middleName,
            lastName: user.lastName
        }
        res.json(result);
    }
    catch (err) {
        console.log('error in loading profile');
    }
});

router.put('/:username/profile/enter', async (req, res) => {
    console.log(req.body);
    try {
        var user = await User.findOne({username: res.locals.user.user.username});
        if (req.body.change == 'first'){
            user.firstName = req.body.name;
            res.locals.user.user.firstName = req.body.name;
        }
        else if (req.body.change == 'middle'){
            user.middleName = req.body.name;
            res.locals.user.user.middleName = req.body.name;
        }
        else if (req.body.change == 'last'){
            user.lastName = req.body.name;
            res.locals.user.user.lastName = req.body.name;
        }
        user.save();
        return;
    }
    catch (err) {
        console.log('error');
    }
   
});

module.exports = router;