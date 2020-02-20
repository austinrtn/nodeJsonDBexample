/*/////////////////
    JSON PROCESSOR
/////////////////*/

const FILE = "db.json"
var fs = require('fs');
const readline = require("readline");
var students = [];

function getData(){
    var data = fs.readFileSync(FILE, 'utf8');
    if(data!=""){
        data = JSON.parse(data);
        students = data.students;
    }
}

function writeData(printSaved){
    let studentObj = {"students": students}
    studentObj = JSON.stringify(studentObj);
    fs.writeFile(FILE, (studentObj), function (err) {
        if (err) throw err;
        if(printSaved) console.log('Saved!');
      });
}

function getReadLine(){
    let rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    return rl;
}

/*///////////////////
        MENU
//////////////////*/
function consoleMenu(clear){
    if(clear) console.clear();
    console.log("********\n* MENU *\n********");
    console.log("[0] Show Database");
    console.log("[1] Get Statistics");
    console.log("[2] Add Student");
    console.log("[3] Edit Student");
    console.log("[4] Delete Student");
    console.log("[5] Delete Database");
    console.log("[6] Exit");

    let rl = getReadLine();

    rl.question("", function(input){
        rl.close()
        if(input == 0) logTable();
        if(input == 1) logStats();
        if(input == 2) inputStudent();
        if(input == 3) editStudent();
        if(input == 4) deleteStudent();
        if(input == 5) deleteDatabase();
        if(input == 6){
            console.clear();
            console.log("Have A Good Day!\n\n\n\n\n\n\n\n");
            rl.close();
        }
    });
}

/*///////////
    TABLE
////////*///

function logTable(){
    getData();
    if(students.length <= 0){
        consoleMenu(true);
        console.log("Looks like you don't have any data yet.")
        return null;
    }
    console.clear();
    let keys = Object.keys(students[0]);
    for(var student of students){
        for(var key of keys)
            process.stdout.write(key + ": " + student[key] + " | ");
        console.log("\n__________________________________________________________________________________________________\n");
    }
    
    let rl = getReadLine();
    rl.question("Press Enter to exit\n", function(){
        rl.close();
        consoleMenu(true);
    })
}

/*/////////////////
    STATISTICS
//////////////*///

function logStats(){
    console.clear();
    getData();
    console.log("Average Score: " + average() + "\nWorst Score: " + minMax("min") +"\nBest Score: " + minMax("max"));
    
    let rl = getReadLine();
    rl.question("\n\n\nPress Enter To Exit\n", function(){
        rl.close();
        consoleMenu(true);
    });
}

var average = function(){
    var total = 0;
    for(var student of students) total += parseFloat(student.Score);
    return (total/students.length).toFixed(2);
}

var minMax = function(action){
    let scores = [];
    for(var student of students) scores.push(parseFloat(student.Score));
    if(action == "min") return Math.min(...scores);
    else if(action == "max") return Math.max(...scores);
    else console.log("INVALID 'minMax()' paramenter:  "+ action +"\n" + new Error().stack)
}

/*///////////////////
    ADD STUDENT
//////////////////*/

function inputStudent(){
    console.clear();
    var firstName = "";
    var lastName = "";
    var score = 0;
    let rl = getReadLine();

    rl.question("Enter First Name: ", function(fName){
        firstName = fName;

        rl.question("Enter Last Name: ", function(lName){
            lastName = lName;

            rl.question("Enter Score: ", function(scr){
                score = scr;
                rl.close();
                 getData();

                var student = {"First Name": firstName, "Last Name": lastName, "Score": score, id: getNextId()};
                students.push(student);

                consoleMenu(true);
                writeData(true);
            })
        })
    });
}

function getNextId(){
    console.log(students.length);
    if(students.length <= 0) return 0;

    let ids = [];
    for(var student of students)
        ids.push(student.id);
    console.log(ids);
    return (Math.max(... ids) +1);
}

/*/////////////
    EDIT
//////////*///

function editStudent(){
    console.clear();
    let rl = getReadLine();

    rl.question("Enter ID of student to be edited: ",function(input){
        let index = getStudent(input);
        if(index != null){
            rl.close();
            students.splice(0, 1);
            writeData();
            inputStudent();
        }  else{        
            rl.close();
            consoleMenu(true);
            console.log("Sorry, that's not a valid ID");
        }
    });
}

function getStudent(id){
    getData();
    for(var i = 0; i < students.length; i++)
        if(students[i].id == id) return i;
    
    return null;
}

/*/////////////
DELETE STUDENT
////////*////

function deleteStudent(){
    console.clear();
    let rl = getReadLine();
    rl.question("Enter ID of student to be deleted: ", function(input){
        let index = getStudent(input);
        if(index !== null){
            rl.close();
            students.splice(0, 1);
            writeData();
            consoleMenu();
            console.log("Student has been deleted from database.");
        } else{
            rl.close();
            consoleMenu(true);
            console.log("Sorry, that's not a valid ID");
        }
    })
}

/*///////////// 
DELETE DATABASE
/////////////*/

function deleteDatabase(){
    let rl = getReadLine();
    rl.question("Are you sure you want to delete the database? [y/n]", function(input){
       if(input == 'y'){
          rl.close();
           students = [];
           writeData();
           consoleMenu(true);
           console.log("Database has been deleted.")
       }
       else{
        rl.close();
        consoleMenu(true);
        console.log("Database has not been deleted");
       }
    });
}

getData();
consoleMenu(true);
