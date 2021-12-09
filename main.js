let nameList = document.querySelector("#nameList");
let schoolContainer = document.querySelector("#schoolContainer");
schoolContainer.style.border = "1px solid black";

//Filter options
let frontend = document.querySelector("#frontendProgramme");
let backend = document.querySelector("#backendProgramme");
let net = document.querySelector("#netProgramme");

let filterBtn = document.querySelector("#filterBtn");

//Function that appends the school names from an array
let schoolNameFunc = (schoolName, classProperty) => {
  schoolName.forEach((school) => {
    let schoolNameText = document.createElement("p");
    schoolNameText.textContent = school;
    schoolNameText.className = classProperty;
    schoolContainer.append(schoolNameText);
  });
};

//Function to render, filter and match students with the school API
let renderNames = (students, schools) => {
  students.forEach((name) => {
    let myHobby = name.hobbies;
    let myProgramme = name.programme;
    let fullName = document.createElement("li");
    let showInfo = document.createElement("button");
    showInfo.textContent = "Show";
    fullName.style.display = "block";
    if (frontend.checked && name.programme === "Frontend") {
      fullName.textContent = `${name.firstName} ${name.lastName}, frontend`;
      nameList.appendChild(fullName);
      console.log(fullName);
    } else if (backend.checked && name.programme === "Backend") {
      fullName.textContent = `${name.firstName} ${name.lastName}, backend`;
      nameList.appendChild(fullName);
    } else if (net.checked && name.programme === ".NET") {
      fullName.textContent = `${name.firstName} ${name.lastName}, .NET`;
      nameList.appendChild(fullName);
    } else if (!frontend.checked && !backend.checked && !net.checked) {
      fullName.textContent = `${name.firstName} ${name.lastName}`;
      nameList.appendChild(fullName);
    }

    showInfo.addEventListener("click", () => {
      schoolContainer.innerHTML = "";
      let twoMatch = [];
      let oneMatch = [];
      let noMatch = [];

      schools.forEach((school) => {
        let schoolActivity = school.activities;
        let schoolProgramme = school.programmes;
        if (schoolProgramme.length === 0) {
          noMatch.push(school.name);
          console.log("WORKS HERE");
        } else {
          schoolProgramme.forEach((match) => {
            if (myProgramme.includes(match)) {
              //console.log("PROGRAMME MATCH");
              myHobby.forEach((match2) => {
                if (schoolActivity.includes(match2)) {
                  //console.log("HOBBY MATCH");
                  twoMatch.push(school.name);
                } else {
                  oneMatch.push(school.name);
                }
              });
            } else if (!myProgramme.includes(match)) {
              noMatch.push(school.name);
            }
          });
        }
      });

      console.log(noMatch);
      console.log("^^^^^^^^");

      //Remove duplicates
      let twoMatchSchool = twoMatch.reduce(function (a, b) {
        if (a.indexOf(b) < 0) a.push(b);
        return a;
      }, []);
      console.log(twoMatchSchool);

      let oneMatchSchool = oneMatch.reduce(function (a, b) {
        if (a.indexOf(b) < 0) a.push(b);
        return a;
      }, []);
      console.log(oneMatchSchool);

      let noMatchSchool = noMatch.reduce(function (a, b) {
        if (a.indexOf(b) < 0) a.push(b);
        return a;
      }, []);

      //Remove school names that already appear in twoMatchSchool (best matching school)
      oneMatchSchool = oneMatchSchool.filter(
        (val) => !twoMatchSchool.includes(val)
      );
      console.log(oneMatchSchool);
      noMatchSchool = noMatchSchool.filter(
        (val) => !twoMatchSchool.includes(val)
      );
      noMatchSchool = noMatchSchool.filter(
        (val) => !oneMatchSchool.includes(val)
      );
      console.log(noMatchSchool);
      console.log("^^^^2222^^^^");

      schoolNameFunc(twoMatchSchool, "twoMatchSchool");

      schoolNameFunc(oneMatchSchool, "oneMatchSchool");

      schoolNameFunc(noMatchSchool, "noMatchSchool");

    });
    fullName.appendChild(showInfo);
  });
};

//Function to sort by age
let sortAge = (arr) => {
  arr.sort(function (youngest, oldest) {
    return youngest.age - oldest.age;
  });
};

//Function to sort by first name (alphabetic order)
let sortFirstName = (arr) => {
  arr.sort(function (a, b) {
    let nameA = a.firstName.toLowerCase();
    let nameB = b.firstName.toLowerCase();
    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    }
    return 0;
  });
};
//Sort by last name (alphabetic order)
let sortLastName = (arr) => {
  arr.sort(function (a, b) {
    let nameA = a.lastName.toLowerCase();
    let nameB = b.lastName.toLowerCase();
    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    }
    return 0;
  });
};

//Function to compare a student's preferred programme and activities -
//with a school's programme/activities.
let compareFunc = (student, school, programme, activity) => {};

let compare = (students, schools) => {
  //let matchingSchool = students.filter((student) => student.hobbies === schools.activities)
  let result1 = students.filter(function (obj) {
    return !schools.some(function (obj2) {
      return obj.value === obj2.value;
    });
  });

  let result2 = schools.filter(function (obj) {
    return !students.some(function (obj2) {
      return obj.value === obj2.value;
    });
  });

  let finalResult = result1.concat(result2);
  console.log(finalResult);
};

//Function to fetch data
let getData = async (URL) => {
  let response = await fetch(URL);
  let data = await response.json();
  return data;
};

async function renderData() {
  let studentData = await getData("https://api.mocki.io/v2/01047e91/students");
  let schoolData = await getData("https://api.mocki.io/v2/01047e91/schools");

  //Append names of the students in a list
  renderNames(studentData, schoolData);

  //Filter and append list based on filter options
  filterBtn.addEventListener("click", () => {
    nameList.innerHTML = "";
    let sortBy = document.querySelector("#sortContainer option:checked");
    if (sortBy.value === "age") {
      sortAge(studentData);
      renderNames(studentData);
    } else if (sortBy.value === "firstName") {
      sortFirstName(studentData);
      renderNames(studentData);
    } else if (sortBy.value === "lastName") {
      sortLastName(studentData);
      renderNames(studentData);
    } else {
      renderNames(studentData);
    }
  });

  //   let resultList = [];

  //   studentData.forEach((foodOne) => {
  //     if (schoolData.includes(foodOne)) {
  //       resultList.push(foodOne);
  //     }
  //   });

  //   if (resultList.length === 0) {
  //     console.log("There are no similar foods");
  //     console.log(resultList)
  //   } else {
  //     console.log("Similar foods", resultList);
  //   }

  // let targetName = (event) => {
  //     let nameTarget = event.target;
  //     schoolContainer.innerHTML = "";
  //     let name = document.createElement("p");
  //     name.textContent = "My name is " + studentData.firstName;
  //     schoolContainer.append(name);

  //     compare(studentData, schoolData);

  //     console.log(name);
  // }

  // nameList.addEventListener("click", (event) => {
  //     targetName(event);
  // })

  // nameList.addEventListener("click", (targetName) => {
  //     let testText = document.createElement("p");
  //     testText.textContent = "This is the school information";
  //     schoolContainer.appendChild(testText);
  //     console.log(targetName.value);

  // })
}

renderData();
