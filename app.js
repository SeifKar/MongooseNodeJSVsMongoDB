require('dotenv').config();
const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true 
})
.then(() => console.log('Connected to MongoDB...'))
.catch(err => console.error('Could not connect to MongoDB...', err));

// Define Person Schema
const personSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    age: Number,
    favoriteFoods: [String]
});

// Create Person Model
const Person = mongoose.model('Person', personSchema);

// Create and Save a Record of a Model
const createAndSavePerson = (done) => {
    const person = new Person({
        name: "John Doe",
        age: 25,
        favoriteFoods: ["pizza", "pasta"]
    });

    person.save((err, data) => {
        if (err) return console.error(err);
        done(null, data);
    });
};

// Create Many Records with model.create()
const createManyPeople = (arrayOfPeople, done) => {
    Person.create(arrayOfPeople, (err, people) => {
        if (err) return console.error(err);
        done(null, people);
    });
};

// Find all people with a given name
const findPeopleByName = (personName, done) => {
    Person.find({ name: personName }, (err, personFound) => {
        if (err) return console.error(err);
        done(null, personFound);
    });
};

// Find one person with a certain food in favorites
const findOneByFood = (food, done) => {
    Person.findOne({ favoriteFoods: food }, (err, personFound) => {
        if (err) return console.error(err);
        done(null, personFound);
    });
};

// Find person by ID
const findPersonById = (personId, done) => {
    Person.findById(personId, (err, personFound) => {
        if (err) return console.error(err);
        done(null, personFound);
    });
};

// Perform Classic Updates
const findEditThenSave = (personId, done) => {
    Person.findById(personId, (err, person) => {
        if (err) return console.error(err);
        
        person.favoriteFoods.push("hamburger");
        person.save((err, updatedPerson) => {
            if (err) return console.error(err);
            done(null, updatedPerson);
        });
    });
};

// Perform New Updates using findOneAndUpdate()
const findAndUpdate = (personName, done) => {
    Person.findOneAndUpdate(
        { name: personName },
        { age: 20 },
        { new: true },
        (err, updatedDoc) => {
            if (err) return console.error(err);
            done(null, updatedDoc);
        }
    );
};

// Delete One Document
const removeById = (personId, done) => {
    Person.findByIdAndRemove(personId, (err, removedDoc) => {
        if (err) return console.error(err);
        done(null, removedDoc);
    });
};

// Delete Many Documents
const removeManyPeople = (done) => {
    Person.remove({ name: "Mary" }, (err, response) => {
        if (err) return console.error(err);
        done(null, response);
    });
};

// Chain Search Query
const queryChain = (done) => {
    Person.find({ favoriteFoods: "burrito" })
        .sort({ name: 1 })
        .limit(2)
        .select("-age")
        .exec((err, data) => {
            if (err) return console.error(err);
            done(null, data);
        });
};

// Export all methods
module.exports = {
    Person,
    createAndSavePerson,
    createManyPeople,
    findPeopleByName,
    findOneByFood,
    findPersonById,
    findEditThenSave,
    findAndUpdate,
    removeById,
    removeManyPeople,
    queryChain
};
