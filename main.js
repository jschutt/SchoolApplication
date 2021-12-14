//Function to fetch data
let getData = async (URL) => {
  let response = await fetch(URL);
  let data = await response.json();
  return data;
};

let nameList = document.querySelector("#nameList");
let schoolContainer = document.querySelector("#schoolContainer");
let filterContainer = document.querySelector("#filterContainer");
let topBotContainer = document.querySelector("#topBotContainer");

//Filter options
let frontend = document.querySelector("#frontendProgramme");
let backend = document.querySelector("#backendProgramme");
let net = document.querySelector("#netProgramme");
let filterBtn = document.querySelector("#filterBtn");

let searchBtn = document.querySelector("#searchBtn");

//Used to check which sort order it is (if age is sorted oldest to youngest etc.)
let sortState = true;

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
    let fullName = document.createElement("button");
    fullName.style.display = "block";
    fullName.className = "studentBtn";

    //Student information that will be appended when clicking their name
    let infoCard = document.createElement("div");
    infoCard.className = "infoCard";
    infoCard.innerHTML = `Age: ${name.age}<br>Hobbies: ${name.hobbies}<br>Programme: ${name.programme}`;
    infoCard.style.display = "none";

    //Used for school information
    let showInfo = document.createElement("button");
    showInfo.style.display = "block";
    showInfo.textContent = "Show schools";
    showInfo.className = "showInfoBtn";
    schoolContainer.style.display = "none";

    //Used to check if student information is showing or not
    let infoShowing = true;
    //Same here but for school information
    let schoolShowing = true;

    //Filter options
    if (frontend.checked && name.programme === "Frontend") {
      fullName.textContent = `${name.firstName} ${name.lastName}`;
      nameList.appendChild(fullName);
      nameList.appendChild(infoCard);
    } else if (backend.checked && name.programme === "Backend") {
      fullName.textContent = `${name.firstName} ${name.lastName}`;
      nameList.appendChild(fullName);
      nameList.appendChild(infoCard);
    } else if (net.checked && name.programme === ".NET") {
      fullName.textContent = `${name.firstName} ${name.lastName}`;
      nameList.appendChild(fullName);
      nameList.appendChild(infoCard);
    } else if (!frontend.checked && !backend.checked && !net.checked) {
      fullName.textContent = `${name.firstName} ${name.lastName}`;
      nameList.appendChild(fullName);
      nameList.appendChild(infoCard);
    }

    //Functionality for student name buttons
    fullName.addEventListener("click", () => {
      if (infoShowing === true) {
        fullName.className = "studentBtnToggled";
        infoCard.style.display = "block";
        infoShowing = false;
      } else if (infoShowing === false) {
        fullName.className = "studentBtn";
        infoCard.style.display = "none";
        infoShowing = true;
      }
    });

    //Show which school best suits the student
    showInfo.addEventListener("click", () => {
      if (schoolShowing === true) {
        schoolContainer.style.display = "block";
        schoolShowing = false;
      } else if (schoolShowing === false) {
        schoolContainer.style.display = "none";
        schoolShowing = true;
      }

      schoolContainer.innerHTML = "";
      let twoMatch = [];
      let oneMatch = [];
      let noMatch = [];

      //Loop through each school and add the name to the appropiate array (the ones above)
      schools.forEach((school) => {
        let schoolActivity = school.activities;
        let schoolProgramme = school.programmes;
        if (schoolProgramme.length === 0) {
          noMatch.push(school.name);
        } else {
          schoolProgramme.forEach((match) => {
            if (myProgramme.includes(match)) {
              myHobby.forEach((match2) => {
                if (schoolActivity.includes(match2)) {
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

      //Remove duplicates from array
      let twoMatchSchool = twoMatch.reduce(function (a, b) {
        if (a.indexOf(b) < 0) a.push(b);
        return a;
      }, []);

      let oneMatchSchool = oneMatch.reduce(function (a, b) {
        if (a.indexOf(b) < 0) a.push(b);
        return a;
      }, []);

      let noMatchSchool = noMatch.reduce(function (a, b) {
        if (a.indexOf(b) < 0) a.push(b);
        return a;
      }, []);

      //Remove school names that already appear in twoMatchSchool (best matching school)
      oneMatchSchool = oneMatchSchool.filter(
        (val) => !twoMatchSchool.includes(val)
      );

      noMatchSchool = noMatchSchool.filter(
        (val) => !twoMatchSchool.includes(val)
      );

      noMatchSchool = noMatchSchool.filter(
        (val) => !oneMatchSchool.includes(val)
      );

      //Function to append school names, second argument is assignment of class names
      schoolNameFunc(twoMatchSchool, "twoMatchSchool");

      schoolNameFunc(oneMatchSchool, "oneMatchSchool");

      schoolNameFunc(noMatchSchool, "noMatchSchool");
    });
    infoCard.appendChild(showInfo);
  });
  //End of student loop
};

//Function to sort by age
let sortAge = (arr, btn) => {
  if (sortState === true) {
    sortState = false;
    btn.textContent = "▲";
    arr.sort(function (youngest, oldest) {
      return youngest.age - oldest.age;
    });
  } else if (sortState === false) {
    sortState = true;
    btn.textContent = "▼";
    arr.sort(function (youngest, oldest) {
      return oldest.age - youngest.age;
    });
  }
};

//Function to sort by first name (alphabetic order)
let sortFirstName = (arr, btn) => {
  if (sortState === true) {
    btn.textContent = "▲";
    sortState = false;
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
  } else if (sortState === false) {
    sortState = true;
    btn.textContent = "▼";
    arr.sort(function (a, b) {
      let nameA = a.firstName.toLowerCase();
      let nameB = b.firstName.toLowerCase();
      if (nameA > nameB) {
        return -1;
      }
      if (nameA < nameB) {
        return 1;
      }
      return 0;
    });
  }
};

//Sort by last name (alphabetic order)
let sortLastName = (arr, btn) => {
  if (sortState === true) {
    btn.textContent = "▲";
    sortState = false;
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
  } else if (sortState === false) {
    sortState = true;
    btn.textContent = "▼";
    arr.sort(function (a, b) {
      let nameA = a.lastName.toLowerCase();
      let nameB = b.lastName.toLowerCase();
      if (nameA > nameB) {
        return -1;
      }
      if (nameA < nameB) {
        return 1;
      }
      return 0;
    });
  }
};

async function renderData() {
  let studentData = await getData("https://api.mocki.io/v2/01047e91/students");
  let schoolData = await getData("https://api.mocki.io/v2/01047e91/schools");

  //Append names of the students in a list
  renderNames(studentData, schoolData);

  //Array used to temporarily store objects based on search value
  let searchMatch = [];

  //Search functionality
  searchBtn.addEventListener("click", () => {
    let searchInput = document.querySelector("#searchInput").value;
    let notFound = document.createElement("p");
    notFound.textContent =
      "Your search didn't find anything. Try searching for something else.";
    schoolContainer.innerHTML = "";
    nameList.innerHTML = "";

    searchMatch = [];

    //Find matching search value in object properties.
    studentData.find((input) => {
      if (input.firstName.toLowerCase() === searchInput.toLowerCase()) {
        searchMatch.push(input);
      } else if (input.lastName.toLowerCase() === searchInput.toLowerCase()) {
        searchMatch.push(input);
      } else if (input.programme.toLowerCase() === searchInput.toLowerCase()) {
        searchMatch.push(input);
      } else {
        input.hobbies.forEach((hobby) => {
          if (hobby.toLowerCase() === searchInput.toLowerCase()) {
            searchMatch.push(input);
          }
        });
      }
    });

    if (searchMatch.length > 0) {
      renderNames(searchMatch, schoolData);
    } else if (searchMatch.length === 0) {
      nameList.append(notFound);
    }
  });

  //Filter and append list based on filter/sort options
  filterBtn.addEventListener("click", () => {
    nameList.innerHTML = "";
    topBotContainer.innerHTML = "";
    let sortBy = document.querySelector("#sortContainer option:checked");
    let topBotBtn = document.createElement("button");
    topBotBtn.className = "topBotBtn";
    sortState = true;

    if (sortBy.value === "age" && searchMatch.length > 0) {
      sortAge(searchMatch, topBotBtn);
      renderNames(searchMatch, schoolData);
      topBotContainer.append(topBotBtn);
    } else if (sortBy.value === "age") {
      sortAge(studentData, topBotBtn);
      renderNames(studentData, schoolData);
      topBotContainer.append(topBotBtn);
    } else if (sortBy.value === "firstName" && searchMatch.length > 0) {
      sortFirstName(searchMatch, topBotBtn);
      renderNames(searchMatch, schoolData);
      topBotContainer.append(topBotBtn);
    } else if (sortBy.value === "firstName") {
      sortFirstName(studentData, topBotBtn);
      renderNames(studentData, schoolData);
      topBotContainer.append(topBotBtn);
    } else if (sortBy.value === "lastName" && searchMatch.length > 0) {
      sortLastName(searchMatch, topBotBtn);
      renderNames(searchMatch, schoolData);
      topBotContainer.append(topBotBtn);
    } else if (sortBy.value === "lastName") {
      sortLastName(studentData, topBotBtn);
      renderNames(studentData, schoolData);
      topBotContainer.append(topBotBtn);
    } else if (sortBy.value === "default" && searchMatch.length > 0) {
      renderNames(searchMatch, schoolData);
    } else {
      renderNames(studentData, schoolData);
    }

    topBotBtn.addEventListener("click", () => {
      nameList.innerHTML = "";

      if (sortBy.value === "age" && searchMatch.length > 0) {
        sortAge(searchMatch, topBotBtn);
        renderNames(searchMatch, schoolData);
        topBotContainer.append(topBotBtn);
      } else if (sortBy.value === "age") {
        sortAge(studentData, topBotBtn);
        renderNames(studentData, schoolData);
        topBotContainer.append(topBotBtn);
      } else if (sortBy.value === "firstName" && searchMatch.length > 0) {
        sortFirstName(searchMatch, topBotBtn);
        renderNames(searchMatch, schoolData);
        topBotContainer.append(topBotBtn);
      } else if (sortBy.value === "firstName") {
        sortFirstName(studentData, topBotBtn);
        renderNames(studentData, schoolData);
        topBotContainer.append(topBotBtn);
      } else if (sortBy.value === "lastName" && searchMatch.length > 0) {
        sortLastName(searchMatch, topBotBtn);
        renderNames(searchMatch, schoolData);
        topBotContainer.append(topBotBtn);
      } else if (sortBy.value === "lastName") {
        sortLastName(studentData, topBotBtn);
        renderNames(studentData, schoolData);
        topBotContainer.append(topBotBtn);
      } else if (sortBy.value === "default" && searchMatch.length > 0) {
        renderNames(searchMatch, schoolData);
      } else {
        renderNames(studentData, schoolData);
      }
    });
  });
}

renderData();
