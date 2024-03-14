import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';

const app = express();
const port = 3000;

// CORS setup

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173"); // Change to match your frontend URL
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", true);
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});


app.use(bodyParser.json());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb+srv://raikwartoshika:oEgGvp8yio3tBgXr@cluster0.ynjcwjq.mongodb.net/mydatabase', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log("Connected to DB");
  })
  .catch(err => {
    console.error("Error connecting to database:", err);
  });

// User Schema
const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  name: String,
});

// Create a user model
const User = mongoose.model('User', userSchema);

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

// Handle POST request for signup
app.post("/signup", async (req, res) => {
  var email = req.body.email;
  var password = req.body.password;
  var name = req.body.name;

  // Create a new user object
  var newUser = new User({
    name: name,
    email: email,
    password: password
  });

  try {
    // Save the new user to the database
    await newUser.save();
    console.log("User registered successfully");
    res.status(200).send("User registered successfully");
  } catch (err) {
    console.error("Error saving user to database:", err);
    res.status(500).send("Error saving user to database.");
  }
});

app.post("/login", async (req, res) => {
  var email = req.body.email;
  var password = req.body.password;

  try {
    // Find the user in the database
    const user = await User.findOne({ email: email, password: password });

    if (user) {
      // User found
      console.log("User found:", user);
      res.redirect('http://localhost:5173/dashboard'); // Redirect to the dashboard page
    } else {
      // User not found, handle failed login
      console.log("User not found");
      res.status(401).send("Invalid credentials");
    }
  } catch (err) {
    console.error("Error during login:", err);
    res.status(500).send("Error during login");
  }
});


app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
