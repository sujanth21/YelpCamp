
var express     = require('express'),
    app         = express(),
    bodyParser  = require('body-parser'),
    mongoose    = require('mongoose'),
    Campground  = require('./models/campground'),
    Comment     = require('./models/comment'),
    seedDB      = require('./seeds');

seedDB();
mongoose.connect('mongodb://localhost/yelp_camp');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');


//Landing page
app.get('/', function(req, res){
    res.render('landing');
});

//Campground page
app.get('/campgrounds', function(req, res){
    //get all the campgrounds from mongodb
    Campground.find({}, function(err, allCampgrounds){
        if(err){
            console.log(err);
        } else {
            res.render('campgrounds/index', {campgrounds: allCampgrounds});
        }
    });
});

//Create route
app.post('/campgrounds', function(req, res){
    //get data from the form and update the campgrounds array
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var newCampground = {name: name, image: image, description: desc};
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

//New route
app.get('/campgrounds/new', function(req, res){
    res.render('campgrounds/new');
});

//Show route
app.get('/campgrounds/:id', function(req, res){

    Campground.findById(req.params.id).populate('comments').exec( function(err, foundCampground){
        if(err){
            console.log(err);
        } else{
            res.render('campgrounds/show', {campground: foundCampground});
        }
    });
});

//=========================================
//COMMENT ROUTES
//create route
app.get('/campgrounds/:id/comments/new', function(req, res){
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
        } else{
            res.render('comments/new', {campground: campground});
        }
    });
    
});

app.post('/campgrounds/:id/comments', function(req, res){
    //lookup campground using findById
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
        } else{
            //create new comments
            Comment.create(req.body.comment, function(err, comment){
                if (err){
                    console.log(err);
                } else {
                    //connect new comment to campground
                    campground.comments.push(comment);
                    campground.save();
                    res.redirect('/campgrounds/' + campground._id);
                }
            });
            
            //redirect to campground show page
        }
    });
    
});
//=========================================

app.listen(3000, function(){
    console.log('The YelpCamp Server Has Started!!');
});