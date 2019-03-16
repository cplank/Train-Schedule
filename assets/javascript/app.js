var config = {
    apiKey: "AIzaSyDTqSbPIrYx4N-E-aeF6wXELbwKNX20pW8",
    authDomain: "doomed-trains-schedule.firebaseapp.com",
    databaseURL: "https://doomed-trains-schedule.firebaseio.com",
    projectId: "doomed-trains-schedule",
    storageBucket: "doomed-trains-schedule.appspot.com",
    messagingSenderId: "292028498123"
};
firebase.initializeApp(config);

let database = firebase.database();

// 2. Button for adding Employees
$("#add-train-btn").on("click", function (event) {
    event.preventDefault();

    // Grabs user input
    var trainName = $("#train-name-input").val().trim();
    var destination = $("#destination-input").val().trim();
    var firstTrain = $("#first-train-input").val().trim();
    var frequency = $("#frequency-input").val().trim();

    // Creates local "temporary" object for holding employee data
    var newTrain = {
        name: trainName,
        role: destination,
        start: firstTrain,
        rate: frequency
    };

    // Uploads employee data to the database
    database.ref().push(newTrain);

    // Logs everything to console
    console.log(newTrain.trainName);
    console.log(newTrain.destination);
    console.log(newTrain.firstTrain);
    console.log(newTrain.frequency);


    // Clears all of the text-boxes
    $("#train-name-input").val("");
    $("#destination-input").val("");
    $("#first-train-input").val("");
    $("#frequency-input").val("");
});

// 3. Create Firebase event for adding employee to the database and a row in the html when a user adds an entry
database.ref().on("child_added", function (childSnapshot) {
    console.log(childSnapshot.val());


    var trainName = childSnapshot.val().name;
    var destination = childSnapshot.val().role;
    var firstTrain = childSnapshot.val().start;
    var frequency = childSnapshot.val().rate;


    console.log(trainName);
    console.log(destination);
    console.log(firstTrain);
    console.log(frequency);

    let minAway = getMinutesAway(frequency, firstTrain);
    let nextTrain = getNextArrival(minAway);


    var newRow = $("<tr>").append(
        $("<td>").text(trainName),
        $("<td>").text(destination),
        $("<td>").text(frequency),
        $("<td>").text(nextTrain),
        $("<td>").text(minAway)
    );


    $("#current-train-table > tbody").append(newRow);
});

function getMinutesAway(frequency, firstTrain) {
    var firstTimeConverted = moment(firstTrain, "HH:mm").subtract(1, "years");

    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    console.log("DIFFERENCE IN TIME: " + diffTime);

    var remainder = diffTime % frequency;
    console.log(remainder);


    var minutesTillTrain = frequency - remainder;
    return minutesTillTrain;
}

function getNextArrival(minAway) {
    var nextTrain = moment().add(minAway, "minutes");
    return nextTrain;
}



