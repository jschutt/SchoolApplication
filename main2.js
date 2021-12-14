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
schoolContainer.style.border = "1px solid black";

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
    let infoCard = document.createElement("div");
    infoCard.className = "infoCard";
    infoCard.innerHTML = `Age: ${name.age}<br>Hobbies: ${name.hobbies}<br>Programme: ${name.programme}`
    infoCard.style.display = "none";
    let showInfo = document.createElement("button");
    showInfo.style.display = "block";
    showInfo.textContent = "Show";
    schoolContainer.style.display = "none";

    let infoShowing = true;
    let schoolShowing = true;


    //Filter options
    if (frontend.checked && name.programme === "Frontend") {
      fullName.textContent = `${name.firstName} ${name.lastName}`;
      nameList.appendChild(fullName);
      nameList.appendChild(infoCard);
    } else if (backend.checked && name.programme === "Backend") {
      fullName.textContent = `${name.firstName} ${name.lastName}`;
      nameList.appendChild(fullName);
    } else if (net.checked && name.programme === ".NET") {
      fullName.textContent = `${name.firstName} ${name.lastName}`;
      nameList.appendChild(fullName);
    } else if (!frontend.checked && !backend.checked && !net.checked) {
      fullName.textContent = `${name.firstName} ${name.lastName}`;
      nameList.appendChild(fullName);
      nameList.appendChild(infoCard);
    }

    fullName.addEventListener("click",() => {
      if(infoShowing === true){
        infoCard.style.display = "block";
        infoShowing = false;
      } else if (infoShowing === false){
        infoCard.style.display = "none";
        infoShowing = true;
      }

    })

    //Show which school best suits the student
    showInfo.addEventListener("click", () => {
      if(schoolShowing === true) {
        schoolContainer.style.display = "block";
        schoolShowing = false;
      } else if(schoolShowing === false){
        schoolContainer.style.display = "none";
        schoolShowing = true;
      }

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
              console.log(match);
              noMatch.push(school.name);
              console.log(noMatch);
            }
          });
        }
      });

      console.log(noMatch);
      console.log("^^^^^^^^");

      //Remove duplicates from array
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
    infoCard.appendChild(showInfo);
  });
  //End of student loop
};

//Function to sort by age
let sortAge = (arr) => {
  if (sortState === true) {
    sortState = false;
    arr.sort(function (youngest, oldest) {
      return youngest.age - oldest.age;
    });
  } else if (sortState === false) {
    sortState = true;
    arr.sort(function (youngest, oldest) {
      return oldest.age - youngest.age;
    });
  }
};

//Function to sort by first name (alphabetic order)
let sortFirstName = (arr) => {
  if (sortState === true) {
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
let sortLastName = (arr) => {
  if (sortState === true) {
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

  //Array used to temporary store objects based on search value
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

    console.log(searchMatch);
  });

  //Filter and append list based on filter/sort options
  filterBtn.addEventListener("click", () => {
    nameList.innerHTML = "";
    topBotContainer.innerHTML = "";
    let sortBy = document.querySelector("#sortContainer option:checked");
    let searchInput = document.querySelector("#searchInput").value;
    let topBotBtn = document.createElement("button");
    topBotBtn.textContent = "^";
    sortState = true;

    if (sortBy.value === "age" && searchMatch.length > 0) {
      console.log("WORKS!!!!");
      sortAge(searchMatch);
      renderNames(searchMatch, schoolData);
      topBotContainer.append(topBotBtn);
    } else if (sortBy.value === "age") {
      sortAge(studentData);
      renderNames(studentData, schoolData);
      topBotContainer.append(topBotBtn);
    } else if (sortBy.value === "firstName" && searchMatch.length > 0) {
      sortFirstName(searchMatch);
      renderNames(searchMatch, schoolData);
      topBotContainer.append(topBotBtn);
    } else if (sortBy.value === "firstName") {
      sortFirstName(studentData);
      renderNames(studentData, schoolData);
      topBotContainer.append(topBotBtn);
    } else if (sortBy.value === "lastName" && searchMatch.length > 0) {
      sortLastName(searchMatch);
      renderNames(searchMatch, schoolData);
      topBotContainer.append(topBotBtn);
    } else if (sortBy.value === "lastName") {
      sortLastName(studentData);
      renderNames(studentData, schoolData);
      topBotContainer.append(topBotBtn);
    } else if(sortBy.value === "default" && searchMatch.length > 0) {
      renderNames(searchMatch, schoolData);
    } else {
      renderNames(studentData, schoolData);
    }

    topBotBtn.addEventListener("click", () => {
      console.log("YOU CLICKED ME");
      nameList.innerHTML = "";

      if (sortBy.value === "age" && searchMatch.length > 0) {
        console.log("WORKS!!!!");
        sortAge(searchMatch);
        renderNames(searchMatch, schoolData);
        topBotContainer.append(topBotBtn);
      } else if (sortBy.value === "age") {
        sortAge(studentData);
        renderNames(studentData, schoolData);
        topBotContainer.append(topBotBtn);
      } else if (sortBy.value === "firstName" && searchMatch.length > 0) {
        sortFirstName(searchMatch);
        renderNames(searchMatch, schoolData);
        topBotContainer.append(topBotBtn);
      } else if (sortBy.value === "firstName") {
        sortFirstName(studentData);
        renderNames(studentData, schoolData);
        topBotContainer.append(topBotBtn);
      } else if (sortBy.value === "lastName" && searchMatch.length > 0) {
        sortLastName(searchMatch);
        renderNames(searchMatch, schoolData);
        topBotContainer.append(topBotBtn);
      } else if (sortBy.value === "lastName") {
        sortLastName(studentData);
        renderNames(studentData, schoolData);
        topBotContainer.append(topBotBtn);
      } else if(sortBy.value === "default" && searchMatch.length > 0) {
        renderNames(searchMatch, schoolData);
      } else {
        renderNames(studentData, schoolData);
      }
    });
  });

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
