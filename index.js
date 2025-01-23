import express from "express";
import axios from 'axios';
import bodyParser from 'body-parser';

const app = express();
const port = 3000;
const apiKey = 'live_qZMgsSX44nnegzi10xlWfOZxmGdIu00CdqI8p2OoBGiGpjl0pfVWUQi0n8hXVM4E'; // Replace with your Cat API key

const breedJson = "https://api.thecatapi.com/v1/breeds";
let breeds = []; // Array to store breed data

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');


// Fetch all breeds when the server starts
async function fetchBreeds() {
  try {
    const response = await axios.get(breedJson, {
      headers: { 'x-api-key': apiKey }
    });
    breeds = response.data; // Save breed data into a global array
    console.log(`Fetched ${breeds.length} breeds`);
  } catch (error) {
    console.error('Error fetching breeds:', error.message);
  }
}

fetchBreeds();

// Route to log and filter breeds with affection_level >= 4
app.get('/filter', (req, res) => {
  const affectionLevelThreshold = 4;
  const childFriendlyLevel = 2;

  // Filter breeds based on affection_level
  const filteredBreeds = breeds.filter(breed => breed.affection_level === affectionLevelThreshold && breed.child_friendly === childFriendlyLevel);
  console.log(`There are ${filteredBreeds.length} cats that fits your standard.`);

  console.log(`Filtered breeds with affection_level = ${affectionLevelThreshold}:`, filteredBreeds);
  
  // Send the filtered breeds as a response (optional)
  res.json(filteredBreeds);
});

app.post('/filer', (req, res) => {
    const affectionLevelThreshold = 4;
    const childFriendlyLevel = 2;
  
    // Filter breeds based on affection_level
    const filteredBreeds = breeds.filter(breed => breed.affection_level === affectionLevelThreshold && breed.child_friendly === childFriendlyLevel);
    console.log(`There are ${filteredBreeds.length} cats that fits your standard.`);
  
    console.log(`Filtered breeds with affection_level = ${affectionLevelThreshold}:`, filteredBreeds);
    
    // Send the filtered breeds as a response (optional)
    res.json(filteredBreeds);
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`));