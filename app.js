
var express     = require('express'),
    app         = express(),
    bodyParser  = require('body-parser'),
    mongoose    = require('mongoose');

mongoose.connect('mongodb://localhost/yelp_camp');
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');

//Setup Schema
var campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String
});

var Campground = mongoose.model("Campground", campgroundSchema);

// Campground.create({
//     name: "Cloud's Rest",
//     image: "https://farm3.staticflickr.com/2259/2182093741_164dc44a24.jpg",
//     description: "This is a huge camp site with lots of trees."
// }, function(err, campground){
//     if(err){
//         console.log(err);
//     } else {
//         console.log(campground);
//     }
// });

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
            res.render('index', {campgrounds: allCampgrounds});
        }
    });
});

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

app.get('/campgrounds/new', function(req, res){
    res.render('new.ejs');
});

app.get('/campgrounds/:id', function(req, res){

    Campground.findById(req.params.id, function(err, foundCampground){
        if(err){
            console.log(err);
        } else{
            res.render('show', {campground: foundCampground});
        }
    });
});

app.listen(3000, function(){
    console.log('The YelpCamp Server Has Started!!');
});