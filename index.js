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
const User = mongoose.model("User", userSchema);

const exerciseSchema = new Schema({
  description: { type: String, required: true, default: 'empty'},
  duration: { type: Number, required: true ,default: 10},
  date: { type: String, required: true ,default: 'empty'},
  }, { _id: false });
const Exercise = mongoose.model("Exercise", exerciseSchema);

const logsListSchema = new Schema({
  username: String,
  count: { type: Number, required: true ,default: 0},
  log: {type: [exerciseSchema], required: true ,default: []}
}, {versionKey: false });
const LogsList = mongoose.model("LogsList", logsListSchema);

app.use(bodyParser.urlencoded({extended: false}));

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})


app.post('/api/users', async function(req, res) {
  const userUsername = req.body.username;

    // Create a new document and save it to the database
    console.log("error hereeeeeeeeeeee");
    const user = new User({username: userUsername});
    const logsList = new LogsList({username: user.username, _id: user._id})
      console.log(user);
        console.log(typeof user);
    await user.save();
    await logsList.save();

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

  const inputDescription = req.body.description;
  const inputDuration = parseInt(req.body.duration);
  const date = req.body.date;
  var inputDate;
  const inputUser = await User.findOne({_id: inputId});
  const inputUsername = inputUser.username;

  if (date === undefined || date === ""){
    inputDate = new Date(); // Create a new Date object with the current date and time in the local time zone
  } else {
    inputDate = new Date(date);
  }
  inputDate = inputDate.toDateString();

  const exercise = new Exercise({description: inputDescription, duration: inputDuration, date: inputDate});

  const logsList = await LogsList.find({_id: inputId});

  if(logsList === null) {
    logsList = new LogsList({username: "empty"});
  }
  logsList[0].count += 1;
  logsList[0].log.push(exercise);
  await logsList[0].save();

  res.json({_id: logsList[0]._id, username: logsList[0].username, date: inputDate, duration: inputDuration, description: inputDescription});
});

app.get('/api/users/:_id/logs', async function(req, res) {

  const inputId = req.params._id;
  console.log(req.params._id);

    const logsList = await LogsList.findOne({ _id: inputId });
    res.json(logsList);
});
