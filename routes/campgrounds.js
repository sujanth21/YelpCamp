var express = require('express');
var router  = express.Router();

var Campground = require('../models/campground');

//Show all campgrounds
router.get('/', function(req, res){

    //get all the campgrounds from mongodb
    Campground.find({}, function(err, allCampgrounds){
        if(err){
            console.log(err);
        } else {
            res.render('campgrounds/index', {campgrounds: allCampgrounds});
        }
    });
});

//Campground create
router.post('/', isLoggedIn, function(req, res){
    //get data from the form and update the campgrounds array
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newCampground = {name: name, image: image, description: desc, author: author};
    //create new campground and save to mongodb
    Campground.create(newCampground, function(err, campground){
        if(err){
            console.log(err);
        } else {
            //redirect to the campgrounds
            res.redirect('/campgrounds');
        }
    });

});

//Campground New
router.get('/new', isLoggedIn, function(req, res){
    res.render('campgrounds/new');
});

//Campground show
router.get('/:id', function(req, res){

    Campground.findById(req.params.id).populate('comments').exec( function(err, foundCampground){
        if(err){
            console.log(err);
        } else{
            res.render('campgrounds/show', {campground: foundCampground});
        }
    });
});

//Edit campgrounds
router.get('/:id/edit', checkCampgroundOwnership, function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
        res.render('campgrounds/edit', {campground: foundCampground});
    });
});

//Update campgrounds
router.put('/:id', checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
        if(err){
            res.redirect('/campgrounds');
        } else {
            res.redirect('/campgrounds/' + req.params.id);
        }
    });
});

//Destroy campground router
router.delete('/:id', checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect('/campgrounds');
        } else {
            res.redirect('/campgrounds');
        }
    });
});

//middleware
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/login');
}

function checkCampgroundOwnership(req, res, next) {
     if(req.isAuthenticated()){
        //does user own the campground
        Campground.findById(req.params.id, function(err, foundCampground){
            if(err){
                res.redirect('back');
            } else {
                if(foundCampground.author.id.equals(req.user._id) ){
                    next();
                } else {
                    res.redirect('back');
                } 
            }
        });
    } else {
        res.redirect('back');
    }
}

module.exports = router;