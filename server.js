const express = require('express'), // require the express package
  bodyParser = require('body-parser'), // require the body-parser package 
  uuid = require('uuid'); // require the uuid package to generate unique ids using uuid.v4()

const app = express(); // create an instance of express which will be used to create the server


app.use(bodyParser.json()); // use the body-parser middleware that will parse the body of the incoming request- makes it so anytime u access the body of a req using req.body, it will be expected to be in JSON format

let students = [  // create an array of students
  {
    id: 1,
    name: 'Jessica Drake',
    classes: {
      biology: 95,
      algebra: 92
    }
  },
  {
    id: 2,
    name: 'Ben Cohen',
    classes: {
      biology: 95,
      algebra: 92
    }
  },
  {
    id: 3,
    name: 'Lisa Downing',
    classes: {
      biology: 95,
      algebra: 92
    }
  }
];

// Gets the list of data about ALL students from the server

app.get('/students', (req, res) => {  //routes req to the server and res to the client
  res.json(students); // send the array list of students back to the client formatted at JSON using express .json functionality
});
// Gets the data about a single student, by name

app.get('/students/:name', (req, res) => { // create a route that sends back the data of a single student. req param is :name
  res.json(students.find((student) => // res.json is callback function, students.find() is a method that searches for an object (student.name) that matches the name in req.params.name & send that object back as a res 
    { return student.name === req.params.name })); // send the data of a single student back to the client
});

// Adds data for a new student to our list of students.
app.post('/students', (req, res) => {  
  let newStudent = req.body; // create a new student object with the data that was sent along with the request
  if (!newStudent.name) { // if the new student object does not have a name
    const message = 'Missing name in request body'; // create a message that says "Missing name in request body"
    res.status(400).send(message); // res.status fn sends a status code of 400 and the message to the client
  } else { // if the new student object does have a name
    newStudent.id = uuid.v4();  // assign a new id to the new student object
    students.push(newStudent); // add the new student object to the array of students - takes data from the request and adds it to the array of students already on the server
    res.status(201).send(newStudent); // send a status of 201 to inform user about status of req and the new student object to the client
  }
});

// Deletes a student from our list by ID
app.delete('/students/:id', (req, res) => { // create a route that deletes a single student. req param is :id
  let student = students.find((student) => { return student.id === req.params.id }); //checks if an object with the id in req URL (req.params.id) exists in the students array

  if (student) { 
    students = students.filter((obj) => { return obj.id !== req.params.id }); // if student is found, the students array is filtered to remove the student with the id in req URL (req.params.id)
    res.status(201).send('Student ' + req.params.id + ' was deleted.'); // a message is sent to the client to inform them that the student was deleted
  }
}); 

// Update the "grade" of a student by student name/class name
app.put('/students/:name/:class/:grade', (req, res) => { // create a route that updates the grade of a single student. req params are :name, :class, and :grade
  let student = students.find((student) => { return student.name === req.params.name }); // checks if an object with the name in  req URL (req.params.name) exists in the students array

  if (student) {
    student.classes[req.params.class] = parseInt(req.params.grade);
    res.status(201).send('Student ' + req.params.name + ' was assigned a grade of ' + req.params.grade + ' in ' + req.params.class); // if student is found, students array is updated with the new grade and a message is sent to the client
  } else {
    res.status(404).send('Student with the name ' + req.params.name + ' was not found.'); // if student is not found, a 404 status code is sent to the client
  }
});

// Gets the GPA of a student
app.get('/students/:name/gpa', (req, res) => { // create a route that sends back the GPA of a single student. req param is :name 
  let student = students.find((student) => { return student.name === req.params.name });  // checks if an object with the name in  req URL (req.params.name) exists in the students array so that we can calculate the GPA

  if (student) {
    let classesGrades = Object.values(student.classes); // Object.values() filters out object's keys and keeps the values that are returned as a new array
    let sumOfGrades = 0; // create a variable that will store the sum of all the grades in the classesGrades array
    classesGrades.forEach(grade => { 
      sumOfGrades = sumOfGrades + grade; // loop through the classesGrades array and add each grade to the sumOfGrades variable
    }); // sumOfGrades is the sum of all the grades in the classesGrades array
    
    let gpa = sumOfGrades / classesGrades.length; // calculate the GPA by dividing the sum of all the grades by the number of grades in the classesGrades array
    console.log(sumOfGrades);
    console.log(classesGrades.length);
    console.log(gpa);
    res.status(201).send('' + gpa); 
    //res.status(201).send(gpa);
  } else { 
    res.status(404).send('Student with the name ' + req.params.name + ' was not found.');
  } 
});

app.listen(8080, () => {
  console.log('Your app is listening on port 8080');
}); 