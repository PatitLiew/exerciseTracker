const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var bodyParser = require("body-parser");

app.use(cors())
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

mongoose.connect("mongodb+srv://MongoDB_Backend:voGoFuB_9122110@cluster0.q5x6eti.mongodb.net/", { useNewUrlParser: true, useUnifiedTopology: true });

const userSchema = new Schema({
  username: String
});
const exerciseSchema = new Schema({
  username: String,
  description: { type: String, required: true },
  duration: { type: Number, required: true },
  date: { type: String, required: true },
});

const User = mongoose.model("User", userSchema);
const Exercise = mongoose.model("Exercise", exerciseSchema);

app.use(bodyParser.urlencoded({extended: false}));

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})


app.post('/api/users', async function(req, res) {
  const userUsername = req.body.username;

    // Create a new document and save it to the database
    const user = new User({username: userUsername});
    await user.save();

    res.json({username: user.username, _id: user._id});
});

app.get('/api/users', async function(req, res) {
  const userList = await User.find({});
  console.log("hereeeeeeeeeeee");
  console.log(typeof userList);
  res.send(userList);
});

app.post('/api/users/:_id/exercises', async function(req, res) {
  const inputId = req.body[":_id"];
  console.log(req["body"][":_id"]);

  const inputDescription = req.body.description;
  const inputDuration = req.body.duration;
  const date = req.body.date;
  const inputUser = await User.findOne({_id: inputId});
  console.log(inputUser);
  const inputUsername = inputUser.username;
  var inputDate;

  if (date === undefined || date === ""){
    inputDate = new Date();
  } else {
    inputDate = date;
  }

  const check = await Exercise.find({_id: inputId});
  const exercise = new Exercise({username: inputUsername, _id: inputId, description: inputDescription, duration: inputDuration, date: inputDate});

  if(check === null) {
    await exercise.save();
  } else {
    await Exercise.findOneAndUpdate({_id: inputId}, {description: inputDescription, duration: inputDuration, date: inputDate}, {new: true});
  }

  res.json(exercise);
});