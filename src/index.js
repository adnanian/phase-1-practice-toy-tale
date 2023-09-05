let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  // Display all toys upon loading the web page
  console.log(displayAllToys());

  // Code not written by me
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");

  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });

  //add New Toy
  document.querySelector('.add-toy-form').addEventListener('submit', (event) => {
    event.preventDefault();
    console.log(addNewToy());
  });
});

// Creates cards from all toys stored from the json, then displays them to the user.
function displayAllToys() {
  fetch('http://localhost:3000/toys')
  .then((response) => response.json())
  .then((data) => {
    const toyCollection = document.querySelector('#toy-collection');
    for (const toy of data) {
      toyCollection.appendChild(createCard(toy));
    }
  });
}

function likesTextContent(likes) {
  return `${likes} Like${likes != 1 ? "s" : ""}`
}

function incrementLikes(likeCountText) {
  console.log(likeCountText.indexOf(' Like'));
  let likeCount = Number.parseInt(likeCountText.slice(0, likeCountText.indexOf(' Like')));
  likeCount++;
  return likeCount;
  
}

// Create a card for a toy
// Adds an event listener for the like button
function createCard(toy) {
  const card = document.createElement('div');
  card.setAttribute('class', 'card');
  card.innerHTML =
    `
      <h2>${toy.name}</h2>
      <img src="${toy.image}" class="toy-avatar" />
      <p>${likesTextContent(toy.likes)}</p>
      <button class="like-btn" id="${toy.id}">Like &#10084</button>
    `;
  card.querySelector('.like-btn').addEventListener('click', (event) => {
    const promise =
      fetch(`http://localhost:3000/toys/${toy.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({
          "likes": incrementLikes(event.target.parentNode.querySelector('p').textContent)
        })
      })
        .then((response) => response.json())
        .then((data) => card.querySelector('p').textContent = likesTextContent(data.likes));
    console.log(promise);
  });
  return card;
}

// Adds a new toy.
// Creates a new card for the toy
// Displays the toy card to the user.
function addNewToy() {
  return fetch('http://localhost:3000/toys', {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
    body: JSON.stringify(
      {
        "name": document.getElementsByName("name")[0].value,
        "image": document.getElementsByName("image")[0].value,
        "likes": 0
      }
    ),
  })
    .then((response) => response.json())
    .then((data) => document.querySelector('#toy-collection').appendChild(createCard(data)));
}