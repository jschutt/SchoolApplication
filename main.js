let nameList = document.querySelector("#nameList");
let schoolContainer = document.querySelector("#schoolContainer");

//Filter options
let frontend = document.querySelector("#frontendProgramme");
let backend = document.querySelector("#backendProgramme");
let net = document.querySelector("#netProgramme");

let filterBtn = document.querySelector("#filterBtn");

//Function to render and filter all the names in the student API
let renderNames = (arr) => {
    arr.forEach((name) => {
        let fullName = document.createElement("li");
        if(frontend.checked && name.programme === "Frontend"){
            fullName.textContent = `${name.firstName} ${name.lastName}, frontend`;
            nameList.appendChild(fullName);
            console.log(fullName)
        } else if(backend.checked && name.programme === "Backend"){
            fullName.textContent = `${name.firstName} ${name.lastName}, backend`;
            nameList.appendChild(fullName);
        } else if(net.checked && name.programme === ".NET"){
            fullName.textContent = `${name.firstName} ${name.lastName}, .NET`;
            nameList.appendChild(fullName);
        } else if(!frontend.checked && !backend.checked && !net.checked) {
            fullName.textContent = `${name.firstName} ${name.lastName}`;
            nameList.appendChild(fullName);
        }
    });
}

//Function to sort by age
let sortAge = (arr) => {
    arr.sort(function(youngest, oldest){
        return youngest.age-oldest.age;
    })
}

//Function to sort by first name (alphabetic order)
let sortFirstName = (arr) => {
    arr.sort(function(a, b){
        let nameA = a.firstName.toLowerCase();
        let nameB = b.firstName.toLowerCase();
        if(nameA < nameB){
            return -1;
        }
        if(nameA > nameB){
            return 1;
        }
        return 0;
    });
}
//Sort by last name (alphabetic order)
let sortLastName = (arr) => {
    arr.sort(function(a, b){
        let nameA = a.lastName.toLowerCase();
        let nameB = b.lastName.toLowerCase();
        if(nameA < nameB){
            return -1;
        }
        if(nameA > nameB){
            return 1;
        }
        return 0;
    });
}

//Function to fetch data
let getData = async (URL) => {
    let response = await fetch(URL);
    let data = await response.json();
    return data;
}

//Function to compare a student's preferred programme and activities -
//with a school's programme/activities.
let compareFunc = (student, school, programme, activity) => {

};

async function renderData() {
    let studentData = await getData("https://api.mocki.io/v2/01047e91/students");
    let schoolData = await getData("https://api.mocki.io/v2/01047e91/schools");

    //Append names of the students in a list
    renderNames(studentData);

    //Filter and append list based on filter options
    filterBtn.addEventListener("click", () => {
        nameList.innerHTML = "";
        let sortBy = document.querySelector("#sortContainer option:checked");
        if(sortBy.value === "age"){
            sortAge(studentData);
            renderNames(studentData);
        } else if(sortBy.value === "firstName"){
            sortFirstName(studentData);
            renderNames(studentData);
        }else if(sortBy.value === "lastName"){
            sortLastName(studentData);
            renderNames(studentData);
        }else {
            renderNames(studentData);
        }
    })

    // let targetName = (event) => {
    //     let name = event.target.tagName;
    //     console.log(name.firstName);
    // }

    // nameList.addEventListener("click", (targetName) => {
    //     let testText = document.createElement("p");
    //     testText.textContent = "This is the school information";
    //     schoolContainer.appendChild(testText);
    //     console.log(targetName);

    // })

}

renderData();