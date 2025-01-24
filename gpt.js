import express from "express";
import axios from "axios";
import bodyParser from "body-parser";
import dotenv from "dotenv"

dotenv.config();

const app = express()
const port = 4000;
const apiKey = process.env.CAT_API_KEY;

const breedJson = "https://api.thecatapi.com/v1/breeds";
let breeds = []; // Array to store breed data
let imgLink = null; // Default value for imgLink

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

// Fetch all breeds when the server starts
async function fetchBreeds() {
  try {
    const response = await axios.get(breedJson, {
      headers: { "x-api-key": apiKey },
    });
    breeds = response.data; // Save breed data into a global array
    console.log(`Fetched ${breeds.length} breeds`);
  } catch (error) {
    console.error("Error fetching breeds:", error.message);
  }
}

fetchBreeds();

app.get("/", (req, res) => {
  res.render("index", { imgLink });
});

app.post("/submit", (req, res) => {
  const affectionLevel = req.body["affection-level"] === "random" ? null : Number(req.body["affection-level"]);
  const childFriendlyLevel = req.body["child-friendliness"] === "random" ? null : Number(req.body["child-friendliness"]);

  console.log(`Affection Level: ${affectionLevel}, Child Friendliness: ${childFriendlyLevel}`);

  // Filter breeds based on user criteria
  const filteredBreeds = breeds.filter((breed) => {
    const matchesAffection = affectionLevel === null || Number(breed.affection_level) === affectionLevel;
    const matchesChildFriendly = childFriendlyLevel === null || Number(breed.child_friendly) === childFriendlyLevel;
    return matchesAffection && matchesChildFriendly;
  });

  if (filteredBreeds.length === 0) {
    console.log("No cats found matching the criteria.");
    imgLink = "nope"; // Reset imgLink if no matches
  } else {
    const randNum = Math.floor(filteredBreeds.length * Math.random());
    const selectedBreed = filteredBreeds[randNum];
    imgLink = selectedBreed?.image?.url || null; // Use optional chaining to avoid errors
    console.log(`Selected breed image URL: ${imgLink}`);
  }

  res.redirect("/");
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));