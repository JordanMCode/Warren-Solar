// =========================================================================//
// <=========== Variables ===========>
// =========================================================================//

// =========================================================================//
// Table - User Inputs // 
// =========================================================================//
const carRegInput = document.querySelector('.reg-input');
const currentRange = document.querySelector('.current-range');
const rangeNeeded = document.querySelector('.range-needed');
const leavingTime = document.getElementById('end-time');
const submit = document.querySelector('.submit');
const reset1 = document.getElementById("reset-1");
const reset2 = document.getElementById("reset-2");
const reset3 = document.getElementById("reset-3");
const reset4 = document.getElementById("reset-4");
const reset5 = document.getElementById("reset-5");
const reset6 = document.getElementById("reset-6");
const clearBtn = document.getElementById("clear-btn");
const genBtn = document.getElementById("generate-schedule-btn");
// var dateValid = /^\d+\.\d{2}$/;

let carNum = 0;
let hoursOnSite = "";
let formattedEndTime = "";
let formattedStartTime = "";
let myTable = document.querySelector('.fl-table');
let myTableWrapper = document.querySelector('.table-wrapper');
let chargePriority = [];
let colPower = [
    {},
    { colNum: 1, power: 40, powerUsed: 0 }, // 7-8am    
    { colNum: 2, power: 50, powerUsed: 0 }, // 8-9am
    { colNum: 3, power: 60, powerUsed: 0 }, // 9-10am
    { colNum: 4, power: 70, powerUsed: 0 }, // 10-11am
    { colNum: 5, power: 80, powerUsed: 0 }, // 11-12pm
    { colNum: 6, power: 70, powerUsed: 0 }, // 12-1pm
    { colNum: 7, power: 70, powerUsed: 0 }, // 1-2pm
    { colNum: 8, power: 60, powerUsed: 0 }, // 2-3pm
    { colNum: 9, power: 50, powerUsed: 0 }, // 3-4pm
    { colNum: 10, power: 40, powerUsed: 0 }, // 4-5pm
]

let leaveTimeCell = 0;
let startTimeCell = 0;
var genTable = document.getElementById("genTable");
let keyDisplay = document.getElementById("key");
let rowNum = 1;

// =========================================================================//
// User Input Data Arrays //
// =========================================================================//

carInfo = [];
carInfoCopy = [];

let table = document.querySelector("table");
let headers = ['Registration', 'Current Range', 'Range Needed', 'Leaving Time', 'Remove']
// =========================================================================//
// <=========== Functions ===========>
// =========================================================================//


// =========================================================================//
// User Info Submit Function
// =========================================================================//


// Function to calculate amount of hours on site available to charge // 


function calculateTime() {
    //get values
    var valuestart = document.getElementById('start-time').value;
    var valuestop = document.getElementById('end-time').value;

    //create date format          
    var timeStart = new Date("01/01/2007 " + valuestart).getHours();
    var timeEnd = new Date("01/01/2007 " + valuestop).getHours();

    hoursOnSite = timeEnd - timeStart;

    return hoursOnSite;
}

function formatTime() {
    var valuestop = document.getElementById('end-time').value;
    let dateFormat = new Date("01/01/2007 " + valuestop);
    formattedEndTime = dateFormat.toLocaleTimeString([], { timeStyle: 'short' });

    return formattedEndTime;
}

function formatStartTime() {
    var valuestart = document.getElementById('start-time').value;
    let dateFormat = new Date("01/01/2007 " + valuestart);
    formattedStartTime = dateFormat.toLocaleTimeString([], { timeStyle: 'short' });

    return formattedStartTime;
}


// This function makes sure all fields are filled, then providing they are, each piece of user data is added to an array which is used to generate the table. // 



submit.addEventListener("click", () => {
    myTable.innerHTML = "";
    if (carNum < 6) {
        calculateTime();
        formatTime();
        formatStartTime();
        if (carRegInput.value === "" || currentRange.value === "" || rangeNeeded.value === "" || hoursOnSite.value === "") {
            alert("All fields are required");
            return;
        } else if (rangeNeeded.value > 250) {
            alert("Maximum car range is 250, please enter 250 range needed or less.");
            generateTable();
        } else {
            carInfo.push({ "Registration": carRegInput.value, "Current Range": currentRange.value, "Range Required": rangeNeeded.value, "Leaving Time": formattedEndTime, "Start Time": formattedStartTime, "hoursOnSite": hoursOnSite, "Exit Range": 0 });
            carInfoCopy.push({ "Registration": carRegInput.value, "Current Range": currentRange.value, "Range Required": rangeNeeded.value, "Leaving Time": formattedEndTime, "Start Time": formattedStartTime, "hoursOnSite": hoursOnSite, "Exit Range": 0 });
            carNum++;
            generateTable();
            myTableWrapper.classList.add("visible");

        }
    } else {
        alert("Maximum number of cars on entered. Please remove one to generate a new schedule");
        generateTable();
    }
})



// Car charing priority function - determines which cars need charing the most urgently, by amount of charge needed per hour. If 2 cars match, car leaving soonest will be prio. //

function priorityCalcs(car) {
    milesRequired = Math.ceil((car['Range Required'] - car['Current Range']) * 1.10);
    car.milesRequired = milesRequired;
    car.chargePerHourNeeded = Math.ceil(parseInt(milesRequired) / parseInt(car.hoursOnSite));
    car.chargeHours = Math.ceil(parseInt(car.milesRequired) / 44);
};

// put in 'if greater than 44 per hour "no can do" message'


// Table generator function // 


function generateTable() {
    let table = document.createElement('table');
    let headerRow = document.createElement('tr');

    headers.forEach(headerText => {
        let header = document.createElement('th');
        let textNode = document.createTextNode(headerText);
        header.appendChild(textNode);
        headerRow.appendChild(header);
    });
    table.appendChild(headerRow);

    carInfo.forEach((car, index) => {
        let row = document.createElement('tr');
        let remove = document.createElement('td');
        car.carIndex = index;
        priorityCalcs(car);
        Object.values(car).forEach((text) => {
            let cell = document.createElement('td');
            let textNode = document.createTextNode(text);
            cell.appendChild(textNode);
            row.appendChild(cell);
            row.appendChild(remove);
            remove.setAttribute("class", "removeBtn");
            remove.setAttribute("type", "button");
            remove.setAttribute("value", "Delete");
            remove.setAttribute('onclick', 'deleteRow(this, ' + text[4] + ')');
        })
        table.appendChild(row);
        for (i = 0; i < 7; i++) {
            row.deleteCell(4);
        }

    });
    myTable.appendChild(table);
    carInfoCopy.forEach((car, index) => {
        car.carIndex = index;
        priorityCalcs(car);
    })
};


// Delete row function // - Deletes row and associated data object. 


function deleteRow(el) {
    var tbl = el.parentNode.parentNode;
    var row = el.parentNode.rowIndex;
    let deleteRowIndex = row - 1;

    carInfoCopy.splice(deleteRowIndex, 1);
    carInfo.splice(deleteRowIndex, 1);
    tbl.deleteRow(row);
    carNum--;
    rowNum--;
    let i = 0;
    carInfoCopy.forEach(car => {
        car.carIndex = i;
        i++;
    })
    carInfo.forEach(car => {
        car.carIndex = i;
        i++;
    })
}


// Schedule generator refresh function - on each new generation of the schedule this will clear the cells and other variables to avoid duplicating info //

function genRefresh(genTable) {
    for (let i = 1; i < 7; i++) {
        genTable.rows[i].cells[0].innerHTML = "";
        for (let x = 0; x < 12; x++) {
            genTable.rows[i].cells[x].classList.remove("charge");
            genTable.rows[i].cells[x].classList.remove("mainsCharge");
        }
    }
}


function resetPower(colPower) {
    colPower.forEach(col => {
        col.powerUsed = 0;
    })
}


// Schedule Generator functions //


function addExitRange(prioArray) {
    prioArray.forEach((car, index) => {
        index = car.priorityIndex;
        genTable.rows[index].cells[11].innerHTML = car['Exit Range'];
    })
}

function addRegistration(prioArray) {
    prioArray.forEach((car, index) => {
        index = car.priorityIndex;
        genTable.rows[index].cells[0].innerHTML = car.Registration;
    })
}

function clearRegistration() {
    for (let i = 1; i < 7; i++) {
        genTable.rows[i].cells[0].innerHTML = "";
    }

}

function clearExitRange() {
    for (let i = 1; i < 7; i++) {
        genTable.rows[i].cells[11].innerHTML = "";
    }

}

function chargePrio(carInfoCopy) {
    chargePriority = carInfoCopy.sort((a, b) => (carInfoCopy.indexOf(a.chargePerHourNeeded) - carInfoCopy.indexOf(b.chargePerHourNeeded)) || (b.chargePerHourNeeded - a.chargePerHourNeeded));
    return chargePriority;
}

function addChargeIndex(chargePriority) {
    let chargeIndex = 1;
    chargePriority.forEach(car => {
        car['Exit Range'] = parseFloat(car['Current Range']);
        car.priorityIndex = chargeIndex;
        chargeIndex++;
    })
}

function leaveTime(car) {
    let leaveHour = 8;
    for (let i = 1; i < 11; i++) {
        if (parseInt(car['Leaving Time']) === leaveHour) {
            leaveTimeCell = i;
            return leaveTimeCell;
        } else {
            leaveHour++
        }
    }
}

function startTime(car) {
    let startHour = 7;
    for (let i = 1; i < 11; i++) {
        if (parseInt(car['Start Time']) === startHour) {
            startTimeCell = i;
            return startTimeCell;
        } else {
            startHour++
        }
    }
}

function scheduleRefresh() {
    keyDisplay.classList.remove("hidden");
    genTable.classList.remove("hidden");
    chargePriority = [];
    clearExitRange();
    clearRegistration();
    resetPower(colPower);
}


genBtn.addEventListener("click", () => {
    scheduleRefresh();
    carInfoCopy.forEach(car => {
        priorityCalcs(car);
    })
    chargePrio(carInfoCopy);
    addChargeIndex(chargePriority);
    genRefresh(genTable);
    rowNum = 1;
    chargePriority.forEach(car => {
        startTime(car);
        leaveTime(car);
        if (leaveTimeCell >= startTimeCell) {
            let availableHours = leaveTimeCell - startTimeCell + 1;
            if (availableHours === 0) {
                availableHours += 1;
            }
            if (car.chargeHours >= 1) {
                if (car.chargeHours <= availableHours) {
                    for (car.chargeHours; car.chargeHours > 0; car.chargeHours--) {
                        if (car.milesRequired > 0) {
                            if (startTimeCell <= leaveTimeCell) {
                                if (colPower[leaveTimeCell].powerUsed < colPower[leaveTimeCell].power - 11) {
                                    genTable.rows[rowNum].cells[leaveTimeCell].classList.add('charge');
                                    colPower[leaveTimeCell].powerUsed += 11;
                                    leaveTimeCell--;
                                    car.milesRequired = car.milesRequired - 44;
                                    if (car['Exit Range'] > 206) {
                                        car['Exit Range'] = 250;
                                    } else {
                                        car['Exit Range'] += 44;
                                    }
                                } else {
                                    car.chargeHours++;
                                    leaveTimeCell--;
                                }
                            } else {
                                startTime(car);
                                leaveTime(car);
                                for (car.chargeHours; car.chargeHours > 0; car.chargeHours--) {
                                    if (genTable.rows[rowNum].cells[leaveTimeCell].classList.contains('charge')) {
                                        car.chargeHours++;
                                        leaveTimeCell--;
                                    } else {
                                        if (car['Exit Range'] > 206) {
                                            car['Exit Range'] = 250;
                                            genTable.rows[rowNum].cells[leaveTimeCell].classList.add('mainsCharge');
                                            leaveTimeCell--;
                                        } else {
                                            car['Exit Range'] += 44;
                                            genTable.rows[rowNum].cells[leaveTimeCell].classList.add('mainsCharge');
                                            leaveTimeCell--;
                                        }
                                    }
                                }
                            }
                        }
                    }
                } else {
                    alert('It is not possible to charge ' + car.Registration + ' in this timeframe. Please re-enter with a new timeframe or less miles need for next trip.')
                    return;
                }
            } else {
                return;
            }
            rowNum++
        } else {
            alert('' + car.Registration + ' must be on site for at least one hour. Please re-enter this vehicles with at least one hour after start time selected.')
        }
    })
    addRegistration(chargePriority);
    addExitRange(chargePriority);
    rowNum++;

})



clearBtn.addEventListener("click", () => {
    scheduleRefresh();
    genRefresh(genTable);
})