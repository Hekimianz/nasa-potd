const fullScreenCont = document.querySelector(".fullScreenCont");
const fullScreenImg = fullScreenCont.querySelector("img");
const dateInput = document.querySelector(".dateInput");
const form = document.querySelector("form");
const spinner = document.querySelector(".loader");
const dateTitle = document.querySelector("h1");
const title = document.querySelector("h2");
const potd = document.querySelector(".potd");
const copyright = document.querySelector(".copyright");
const explanation = document.querySelector("p");
const API_KEY = "dB9UUna3zEUZ8hq1v8HqFeBWmEPu6rF72n2myOw9";
const potdData = {};
const allProps = [dateTitle, title, potd, copyright, explanation];

dateInput.setAttribute("max", new Date().toISOString().split("T")[0]);

fullScreenCont.addEventListener("click", () => {
  fullScreenCont.classList.add("hidden");
});

potd.addEventListener("click", () => {
  fullScreenCont.classList.remove("hidden");
});

form.addEventListener("submit", (e) => {
  e.preventDefault();
  getPic();
});

function getPic() {
  spinner.classList.remove("hidden");
  allProps.forEach((item) => item.classList.add("hidden"));
  const [year, month, day] = dateInput?.value.split("-");
  const formattedDate = !dateInput.value
    ? new Date().toISOString().split("T")[0]
    : `${year}-${month}-${day}`;

  fetch(
    `https://api.nasa.gov/planetary/apod?date=${formattedDate}&api_key=${API_KEY}`
  )
    .then((res) => res.json())
    .then((data) => {
      potdData.copyright = data.copyright;
      potdData.date = formatDateString(data.date);
      potdData.explanation = data.explanation;
      potdData.title = data.title;
      potdData.url = data.url;
      potdData.type = data.media_type;
      renderData();
    });
}

function renderData() {
  console.log(potdData);
  explanation.innerText = potdData.explanation;
  title.innerText = potdData.title;
  spinner.classList.add("hidden");
  dateTitle.innerText = potdData.date;
  allProps.forEach((item) => item.classList.remove("hidden"));
  potd.src = potdData.url;
  fullScreenImg.src = potdData.url;
  copyright.innerText = potdData.copyright
    ? `© ${potdData.copyright.slice(1, potdData.copyright.length - 1)}`
    : "";
}

// turn yyyy-mm-dd into "ddth of mm, yyyy"
function formatDateString(dateString) {
  const [year, month, day] = dateString.split("-");
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const monthName = months[parseInt(month) - 1];

  function getDayWithSuffix(day) {
    const dayInt = parseInt(day);
    if (dayInt > 3 && dayInt < 21) return dayInt + "th";
    switch (dayInt % 10) {
      case 1:
        return dayInt + "st";
      case 2:
        return dayInt + "nd";
      case 3:
        return dayInt + "rd";
      default:
        return dayInt + "th";
    }
  }

  const dayWithSuffix = getDayWithSuffix(day);
  return `${dayWithSuffix} of ${monthName}, ${year}`;
}

getPic();
