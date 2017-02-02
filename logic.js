$(document).ready(function() {
    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyBfr4llvu_evFRiLoGczYB7S0ypwmYD4W4",
        authDomain: "train-sched-6156e.firebaseapp.com",
        databaseURL: "https://train-sched-6156e.firebaseio.com",
        storageBucket: "train-sched-6156e.appspot.com",
        messagingSenderId: "1048884467"
    };
    firebase.initializeApp(config);
    var database = firebase.database();

    //FUNCTIONS=========================================================

    $("#submit").on("click", function() {

        // gets input values
        var name = $('#nameInput').val().trim();
        var dest = $('#destInput').val().trim();
        var time = $('#timeInput').val().trim();
        var freq = $('#freqInput').val().trim();

        // 
        database.ref().push({
            name: name,
            dest: dest,
            time: time,
            freq: freq,
            timeAdded: firebase.database.ServerValue.TIMESTAMP
        });
       
        $("input").val('');
        return false;
    });

    //ON CLICK CHILD FUNCTION
    database.ref().on("child_added", function(childSnapshot) {
            // console.log(childSnapshot.val());
            var name = childSnapshot.val().name;
            var dest = childSnapshot.val().dest;
            var time = childSnapshot.val().time;
            var freq = childSnapshot.val().freq;


            //CONVERT TRAIN TIME================================================
            var freq = parseInt(freq);
            //CURRENT TIME
            var currentTime = moment();
            console.log("CURRENT TIME: " + moment().format('HH:mm'));
            //FIRST TIME: PUSHED BACK ONE YEAR TO COME BEFORE CURRENT TIME
            // var dConverted = moment(time,'hh:mm').subtract(1, 'years');
            var dConverted = moment(childSnapshot.val().time, 'HH:mm').subtract(1, 'years');
            console.log("DATE CONVERTED: " + dConverted);
            var trainTime = moment(dConverted).format('HH:mm');
            console.log("TRAIN TIME : " + trainTime);

            //DIFFERENCE B/T THE TIMES 
            var tConverted = moment(trainTime, 'HH:mm').subtract(1, 'years');
            var tDifference = moment().diff(moment(tConverted), 'minutes');
            console.log("DIFFERENCE IN TIME: " + tDifference);
            //REMAINDER 
            var tRemainder = tDifference % freq;
            console.log("TIME REMAINING: " + tRemainder);
            //MINUTES UNTIL NEXT TRAIN
            var minsAway = freq - tRemainder;
            console.log("MINUTES UNTIL NEXT TRAIN: " + minsAway);
            //NEXT TRAIN
            var nextTrain = moment().add(minsAway, 'minutes');
            console.log("ARRIVAL TIME: " + moment(nextTrain).format('HH:mm A'));
            //console.log(==============================);

            //TABLE DATA=====================================================
            //APPEND TO DISPLAY IN TRAIN TABLE
            $('#trainTable').append(
                "<tr><td id='nameDisplay'>" + childSnapshot.val().name +
                "</td><td id='destDisplay'>" + childSnapshot.val().dest +
                "</td><td id='freqDisplay'>" + childSnapshot.val().freq +
                "</td><td id='nextDisplay'>" + moment(nextTrain).format("HH:mm") +
                "</td><td id='awayDisplay'>" + minsAway + ' minutes until arrival' + "</td></tr>");
        },

        function(errorObject) {
            console.log("Read failed: " + errorObject.code)
        });
});
