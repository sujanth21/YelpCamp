var mongose     = require('mongoose'),
    Campground  = require('./models/campground'),
    Comment     = require('./models/comment');

var data = [
    {
        name: "Cumberland River Holiday Park",
        image: "https://media.timeout.com/images/103028191/225/169/image.jpg",
        description: "When a caravan park offers itself as a location for wedding photos, you know it must have something going for it scenically. No fake sunset backdrops here, but the real thing: a stunning natural setting near the mouth of the Cumberland River. Craggy cliffs tower over the campground, which is backed by great walking tracks and fronted by the Great Ocean Road. Book well ahead for a prime riverfront site."
    },
    {
        name: "Tidal River",
        image: "https://media.timeout.com/images/103028192/225/169/image.jpg",
        description: "It’s the biggest national-park campground in the state, hosting up to 3,000 campers at a time. So where are they all? The expansive beach and the extensive network of hiking trails absorb the crowds and still leave space for privately contemplating the reflections in Tidal River at dusk. Catch a movie at the outdoor cinema or watch the live show in the campground: wombats, wallabies and echidnas doing their thing."
    },
    {
        name: "Johanna Beach",
        image: "https://media.timeout.com/images/103028193/225/169/image.jpg",
        description: "Surf’s up, guaranteed. Johanna Beach is a back-up location for the Rip Curl Pro surfing comp (16-25 April) in case Bells Beach is dead flat. As the tournament’s website says, ‘If there is any swell in the Southern Ocean, Johanna will pick it up. If the sand banks are in great shape, you can get some of the best beachbreak waves in the world out there.’ The open grassy space behind the beach is the Great Ocean Road’s greatest free campground."
    },
    {
        name: "Marengo Holiday Park",
        image: "https://media.timeout.com/images/103028194/225/169/image.jpg",
        description: "One of the whitest, sparkling-est, beaches on the Great Ocean Road is right here at Marengo Holiday Park and you don’t even need to cross the street to get to the water. Enrol in surf school, practise yoga on the beach or rent a sea kayak – the shops and services in Apollo Bay, within walking distance, can sort everything you need."
    }
]

function seedDB() {
    //Remove all campgrounds
    Campground.remove({}, function(err){
        if(err){
            console.log(err);
        } else {
            console.log("Removed all campgrounds!");

            //Add few campgrounds
            data.forEach(function(seed){
                Campground.create(seed, function(err, campground){
                    if(err) {
                        console.log(err);
                    } else {
                        console.log('Created a campground!');

                        //Create a comment
                        Comment.create(
                            {
                                text: "This place is awesome..",
                                author: "Homer"
                            }, function(err, comment){
                                if(err){
                                    console.log(err);
                                } else{
                                    campground.comments.push(comment);
                                    campground.save();
                                    console.log('Created new comment');
                                }
                            });
                    }
                });
            });
        }
    });

}

module.exports = seedDB;