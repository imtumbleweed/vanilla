// Return day of year counting January 1 as 1
// And the last day of the year 365
// (ranging from 1-365)
// January 1 = 1
// January 2 = 2
// ...
// February 1 = 32
// February 2 = 33
// February 3 = 34
// ...
function day_of_year_today() {
    let now = new Date();
    let start = new Date(now.getFullYear(), 0, 0);
    let diff = (now - start) + ((start.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000);
    let one_day = 1000 * 60 * 60 * 24;
    let day_of_year = Math.floor(diff / one_day);
    return day_of_year;
}

// Convert string "16:30:00" to "3:30 PM"
function military_to_standard(time) {
    time = time.split(':'); // convert to array
    let hours = Number(time[0]);
    let minutes = Number(time[1]);
    let seconds = Number(time[2]);
    let timeValue;
    if (hours > 0 && hours <= 12) { timeValue= "" + hours; } else if (hours > 12) { timeValue= "" + (hours - 12); } else if (hours == 0) { timeValue= "12"; }
    timeValue += (minutes < 10) ? ":0" + minutes : ":" + minutes;  // get minutes
    timeValue += (seconds < 10) ? ":0" + seconds : ":" + seconds;  // get seconds
    timeValue += (hours >= 12) ? " PM" : " AM";  // get AM/PM
    return timeValue;
}