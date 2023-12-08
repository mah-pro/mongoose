const mongoose = require('mongoose');
require('dotenv').config();

const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;



// Connection to the database
mongoose.connect(process.env.MONGO_URI, {
useNewUrlParser: true,
useUnifiedTopology: true,
});

// Checking the database connection
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Database connection error: '));
db.once('open', async () => {
console.log('Connected to the database');

// Schema for the person
const personSchema = new mongoose.Schema({
nom: { type: String, required: true },
age: Number,
favoriteFoods: [String],
});

// Model for the person
const Person = mongoose.model('Person', personSchema);

try {
// Create a person
const newPerson = await Person.create({
    nom: 'John Doe',
    age: 25,
    favoriteFoods: ['Pizza', 'Burger'],
});
console.log('Person successfully created:', newPerson);

// Create multiple people at once
const arrayOfPeople = [
    { nom: 'Alice', age: 30, favoriteFoods: ['Sushi', 'Pasta'] },
    { nom: 'Bob', age: 22, favoriteFoods: ['Burger', 'Ice Cream'] },
    { nom: 'Mary', age: 23, favoriteFoods: ['Burger', 'Ice Cream'] },
];

const createdPeople = await Person.create(arrayOfPeople);
console.log('People successfully created:', createdPeople);

// Find all people with a specific name
const johnDoePeople = await Person.find({ nom: 'John Doe' });
console.log('People found:', johnDoePeople);

// Find a person with a specific favorite food
const foodToFind = 'Pizza';
const personWithFood = await Person.findOne({ favoriteFoods: foodToFind });
console.log(`Person found with ${foodToFind} as a favorite food:`, personWithFood);

// Find a person by _id
const personById = await Person.findById(newPerson._id);
console.log(`Person found by _id (${newPerson._id}):`, personById);

// Find a person by _id for update
const personToUpdate = await Person.findById(newPerson._id);

// Add "Hamburger" to the list of favorite foods
personToUpdate.favoriteFoods.push('Hamburger');
// Save the updated person
const updatedPerson = await personToUpdate.save();
console.log('Person successfully updated:', updatedPerson);

// Find a person by name and set their age to 20
const personNameToUpdate = 'John Doe';
const updatedPersonByName = await Person.findOneAndUpdate(
    { nom: personNameToUpdate },
    { $set: { age: 20 } },
    { new: true }
);
console.log(`Person ${personNameToUpdate} successfully updated:`, updatedPersonByName);

// Remove a person by _id
const removedPerson = await Person.findOneAndDelete({ _id: newPerson._id });
console.log(`Person with _id (${newPerson._id}) successfully removed:`, removedPerson);


// Remove all people with the name "Mary"
const personNameToDelete = 'Mary';
const result = await Person.deleteMany({ nom: personNameToDelete });
console.log(`People with the name "${personNameToDelete}" successfully removed. Result:`, result);

// Find people who like burritos, sort by name, limit to two documents, and hide their age
const foodToSearch = 'Burritos';
const burritoLovers = await Person.find({ favoriteFoods: foodToSearch })
    .sort({ nom: 1 })
    .limit(2)
    .select({ age: 0 });
console.log(`People who like ${foodToSearch} (sorted by name, limited to 2, age hidden):`, burritoLovers);



// Close the database connection
mongoose.connection.close();
} catch (error) {
console.error('Error:', error);
}
});
app.listen(PORT, () => {
    console.log(`Serveur en cours d'exécution sur http://localhost:${PORT}`);
});