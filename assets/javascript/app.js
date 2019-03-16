//Setting up Firebase

var config = {
    apiKey: "AIzaSyDTqSbPIrYx4N-E-aeF6wXELbwKNX20pW8",
    authDomain: "doomed-trains-schedule.firebaseapp.com",
    databaseURL: "https://doomed-trains-schedule.firebaseio.com",
    projectId: "doomed-trains-schedule",
    storageBucket: "doomed-trains-schedule.appspot.com",
    messagingSenderId: "292028498123"
};

firebase.initializeApp(config);

//storing Firebase in an easyily accessible 
let database = firebase.database();

//Making the onclick work for the add train button
$("#add-train-btn").on("click", function (event) {
    //Don't forget to clear default because submit buttons are dumb
    event.preventDefault();

    // Let's make some variables!
    var trainName = $("#train-name-input").val().trim();
    var destination = $("#destination-input").val().trim();
    var firstTrain = $("#first-train-input").val().trim();
    var frequency = $("#frequency-input").val().trim();

    // Storing all those variables in an object for easy access later
    var newTrain = {
        name: trainName,
        role: destination,
        start: firstTrain,
        rate: frequency
    };

    // Pushes that object to Firebase so it knows wtf is going on
    database.ref().push(newTrain);

    // Reset the input boxes
    $("#train-name-input").val("");
    $("#destination-input").val("");
    $("#first-train-input").val("");
    $("#frequency-input").val("");
});

// Grabbing our object from Firebase when something new is added so we can reference it later for the HTML and 
//reference it now for figuring out time
database.ref().on("child_added", function (childSnapshot) {

    var trainName = childSnapshot.val().name;
    var destination = childSnapshot.val().role;
    var firstTrain = childSnapshot.val().start;
    var frequency = childSnapshot.val().rate;

    //Passing the arguments of frequeny and firstTrain (created above) these variables will store the next train's
    //arrival and and how many minutes away it is. We have to call this function inside the database.ref().on function
    //because that's where we declare these variables. They only exist here. 
    let minAway = getMinutesAway(frequency, firstTrain);
    let nextTrain = getNextArrival(minAway);


    //Add the information a new HTML row
    var newRow = $("<tr>").append(
        $("<td>").text(trainName),
        $("<td>").text(destination),
        $("<td>").text(frequency),
        $("<td>").text(nextTrain),
        $("<td>").text(minAway)
    );

    //append our new row to the table body
    $("#current-train-table > tbody").append(newRow);
});


//TIME THINGS

//This function takes parameters (I called them frequency and firstTrain for easy of understanding) and uses moment.js
//to take firstTrain's date, make sure it's in military time, and then subtracts a year so our predictions are never negative
function getMinutesAway(frequency, firstTrain) {
    var firstTimeConverted = moment(firstTrain, "HH:mm").subtract(1, "years");


    //This variable stores the difference between today's time and firstTimeConverted in minutes
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");

    //This stores the remainder of diffTime and frequency
    var remainder = diffTime % frequency;

    //And subtracts that remainder from frequency for a result of minutesTillTrain
    var minutesTillTrain = frequency - remainder;

    //Returns minutesTillTrain so we can reference it when we call this function
    return minutesTillTrain;
}

//This function takes the parameter of minAway, which was created above
function getNextArrival(minAway) {

    //nextTrain stores the current time and adds minAway and formats that to minutes

    let nextTrain = moment().add(minAway, 'minutes').format('HH:mm')

    //The result is that we return how many minutes until the next train
    return nextTrain;
}



