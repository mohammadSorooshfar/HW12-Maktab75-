const BASE_URL = "https://62a22360cc8c0118ef5dabd4.mockapi.io";

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}
function generateName() {
  let first_name = [
    "mohammad",
    "ali",
    "hossein",
    "morteza",
    "amirreza",
    "milad",
    "amir",
    "pooya",
    "mehran",
    "reza",
  ];
  let last_name = [
    "mohammadi",
    "akbari",
    "hosseini",
    "karimi",
    "abdi",
    "tamaskani",
    "node",
    "ziaei",
    "mortazavi",
  ];
  let firstName = first_name[getRandomInt(0, first_name.length)];
  let lastName = last_name[getRandomInt(0, last_name.length)];
  return {
    firstName,
    lastName,
  };
}
function generateBirthDay() {
  return new Date(
    getRandomInt(1990, 2015),
    getRandomInt(0, 11),
    getRandomInt(1, 30)
  ).toLocaleDateString();
}
function generateGrade() {
  return getRandomInt(0, 20);
}
function makeData(count) {
  let dataArray = [];
  for (let i = 0; i < count; i++) {
    let obj = {
      name: generateName().firstName,
      family: generateName().lastName,
      birthday: generateBirthDay(),
      mathgrade: generateGrade(),
      socialstudiesgrade: generateGrade(),
      persiangrade: generateGrade(),
    };
    dataArray.push(obj);
  }
  console.log(dataArray);
  return dataArray;
}
makeData(3);
async function postToApi(count) {
  let data = makeData(count);
  data.forEach(async (element) => {
    await fetch(`${BASE_URL}/students`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(element),
    });
  });
}
async function getFromApi() {
  const apiData = await fetch(`${BASE_URL}/students`);
  return apiData.json();
}
async function deleteFromApi(id) {
  await fetch(`${BASE_URL}/students/${id}`, {
    method: "DELETE",
  });
}
async function tableCreate(array) {
  let tbl = document.createElement("table");
  tbl.classList.add(
    "table",
    "table-bordered",
    "border-dark",
    "text-center",
    "mt-3"
  );
  const head = [
    "Id",
    "Name",
    "Family",
    "Birthday",
    "Math Grade",
    "Social Studies Grade",
    "Persian Grade",
    "Edit",
    "Delete",
  ];
  for (let i = 0; i < array.length + 1; i++) {
    let tr = tbl.insertRow();
    let rowData;
    if (i != 0) {
      rowData = Object.values(array[i - 1]);
      tr.id = rowData[rowData.length - 1];
    }
    for (let j = 0; j < 9; j++) {
      let td = tr.insertCell();
      if (i == 0) {
        let header = document.createElement("p");
        header.textContent = `${head[j]}`;
        header.classList.add("ascending");
        header.addEventListener("click", async (e) => {
          const headerText = `${head[j]}`.toLowerCase().replace(/\s/g, "");

          if (headerText != "birthday") {
            if (e.target.classList.contains("ascending")) {
              array.sort((a, b) => {
                return config.numberOrStringsAscending(a, b, headerText);
              });
            } else {
              array.sort((a, b) => {
                return config.numberOrStringsDescending(a, b, headerText);
              });
            }
          } else {
            if (e.target.classList.contains("ascending")) {
              array.sort((a, b) => {
                return config.dateAscending(a, b);
              });
            } else {
              array.sort((a, b) => {
                return config.dateDescending(a, b);
              });
            }
          }
          e.target.classList.toggle("ascending");
          console.log(e.target.classList);
          tableSort(array, tbl);
        });
        td.appendChild(header);
      } else {
        if (j == 0) {
          td.appendChild(
            document.createTextNode(`${rowData[rowData.length - 1]}`)
          );
        }
        if ((j < 7) & (j > 0)) {
          td.appendChild(document.createTextNode(`${rowData[j - 1]}`));
        } else if (j == 7) {
          let btnEdit = document.createElement("button");
          btnEdit.classList.add("btn", "btn-warning");
          btnEdit.textContent = "Edit";
          td.appendChild(btnEdit);
        } else if (j == 8) {
          let btnDelete = document.createElement("button");
          btnDelete.classList.add("btn", "btn-danger");
          btnDelete.textContent = "Delete";
          btnDelete.addEventListener("click", (e) => {
            deleteEvent(e);
          });
          td.appendChild(btnDelete);
        }
      }
    }
  }
  document.body.appendChild(tbl);
}
async function deleteEvent(e) {
  await deleteFromApi(e.target.closest("tr").id);
  e.target.closest("tr").remove();
  let trs = document.getElementsByTagName("tr");
  if (trs.length == 5) {
    await postToApi(15);
  }
  if (trs.length < 2) {
    document.getElementsByTagName("table")[0].remove();
    let arr = await getFromApi();
    await tableCreate(arr);
  }
}
let config = {
  numberOrStringsAscending(a, b, sortBy) {
    if (a[sortBy] < b[sortBy]) {
      return -1;
    } else if (a[sortBy] > b[sortBy]) {
      return 1;
    } else {
      return 0;
    }
  },
  numberOrStringsDescending(a, b, sortBy) {
    if (b[sortBy] < a[sortBy]) {
      return -1;
    } else if (b[sortBy] > a[sortBy]) {
      return 1;
    } else {
      return 0;
    }
  },
  dateAscending(a, b) {
    let arrA = a.birthday.split("/");
    let arrB = b.birthday.split("/");
    const yearA = Number(arrA[2]);
    const yearB = Number(arrB[2]);
    const monthA = Number(arrA[0]);
    const monthB = Number(arrB[0]);
    const dayA = Number(arrA[1]);
    const dayB = Number(arrB[1]);

    if (yearA - yearB == 0) {
      if (monthA - monthB == 0) {
        return dayA - dayB;
      } else {
        return monthA - monthB;
      }
    } else {
      return yearA - yearB;
    }
  },
  dateDescending(a, b) {
    let arrA = a.birthday.split("/");
    let arrB = b.birthday.split("/");
    const yearA = Number(arrA[2]);
    const yearB = Number(arrB[2]);
    const monthA = Number(arrA[0]);
    const monthB = Number(arrB[0]);
    const dayA = Number(arrA[1]);
    const dayB = Number(arrB[1]);

    if (yearB - yearA == 0) {
      if (monthB - monthA == 0) {
        return dayB - dayA;
      } else {
        return monthB - monthA;
      }
    } else {
      return yearB - yearA;
    }
  },
};
async function start() {
  let data = await getFromApi();
  await tableCreate(data);
}
start();
function tableSort(array, table) {
  let allTrs = document.getElementsByTagName("tr");
  let lengthOfTrs = allTrs.length;
  for (let i = 1; i < lengthOfTrs; i++) {
    allTrs[1].remove();
  }
  for (let i = 0; i < array.length; i++) {
    let tr = table.insertRow();
    let rowData = Object.values(array[i]);

    tr.id = rowData[rowData.length - 1];
    for (let j = 0; j < 9; j++) {
      let td = tr.insertCell();
      if (j == 0) {
        td.appendChild(
          document.createTextNode(`${rowData[rowData.length - 1]}`)
        );
      }
      if ((j < 7) & (j > 0)) {
        td.appendChild(document.createTextNode(`${rowData[j - 1]}`));
      } else if (j == 7) {
        let btnEdit = document.createElement("button");
        btnEdit.classList.add("btn", "btn-warning");
        btnEdit.textContent = "Edit";
        td.appendChild(btnEdit);
      } else if (j == 8) {
        let btnDelete = document.createElement("button");
        btnDelete.classList.add("btn", "btn-danger");
        btnDelete.textContent = "Delete";
        btnDelete.addEventListener("click", (e) => {
          deleteEvent(e);
        });
        td.appendChild(btnDelete);
      }
    }
  }
}
