/***
 * Author: Shadman Rabbi
 * Date: 2022-05-12
 * Title: Dynamic Vacation Destinations List
 */

//it will keep an array of destinations
let destinations = [];
const defaultImage = "images/signpost.jpg";
//DOM elements
const destinationsForm = document.querySelector("#Destinations_detail_form");
const destinationsListContainer = document.getElementById(
  "destinations_list_container"
);
const destinationsContainer = document.getElementById("destinations_container");

//Add event listener to the form submit button
destinationsForm.addEventListener("submit", handleFormSubmit);

//Function to handle form submission
function handleFormSubmit(evt) {
  evt.preventDefault();

  //Create a new destination object
  const destName = evt.target.elements["name"].value;
  const destLocation = evt.target.elements["location"].value;
  const destPhotoURL = evt.target.elements["photo"].value;
  //console.log(destPhotoURL);
  const destDescription = evt.target.elements["description"].value;
  const destDate = evt.target.elements["travelDate"].value;

  // create a destination object and push it to the array
  const destination_obj = {
    name: destName,
    location: destLocation,
    photoURL: destPhotoURL,
    description: destDescription,
    date: destDate,
  };

  destinations.push(destination_obj);

  // clear the input fields
  for (let i = 0; i < destinationsForm.length; i++) {
    destinationsForm.elements[i].value = "";
  }
  //Create a new article card for the destination

  // change the article title from My favourite Destination to No favorite Destination yet, if no destinations exist
  if (destinationsContainer.children.length === 0) {
    document.getElementById("dest_title").innerHTML = "Your Wishlist";
  }

  const DestinatonArticleCard = createDestinationCard(
    destName,
    destLocation,
    destPhotoURL,
    destDescription,
    destDate
  );

  destinationsContainer.appendChild(DestinatonArticleCard);

  updateDestinationsList();
}

// Create a new article card for the destination
function createDestinationCard(
  destName,
  destLocation,
  destPhotoURL,
  destDescription,
  destDate
) {
  const articleCard = document.createElement("div");
  articleCard.className = "article_card";

  const articleImg = document.createElement("img");
  articleImg.setAttribute("alt", destName);
  articleImg.setAttribute("src", checkPhotoUrl(destPhotoURL));
  articleCard.appendChild(articleImg);

  const articleCardBody = document.createElement("div");
  articleCardBody.className = "article_card_body";

  const articleCardTitle = document.createElement("h3");
  articleCardTitle.innerText = destName;
  articleCardBody.appendChild(articleCardTitle);

  const articleCardText = document.createElement("h4");
  articleCardText.innerText = destLocation;
  articleCardBody.appendChild(articleCardText);

  const articleCardDate = document.createElement("p");
  articleCardDate.innerText = `Travel Date: ${checkDate(destDate)}`;
  articleCardBody.appendChild(articleCardDate);

  const articleCardDescription = document.createElement("p");
  articleCardDescription.innerText = checkDescription(destDescription);
  articleCardBody.appendChild(articleCardDescription);

  const removeButton = document.createElement("button");
  removeButton.innerText = "Remove";
  removeButton.setAttribute("id", "remove_button");
  removeButton.addEventListener("click", removeDestination_Article);
  articleCardBody.appendChild(removeButton);

  articleCard.appendChild(articleCardBody);

  return articleCard;
}

//check photo url validity
function checkPhotoUrl(photoURL) {
  if (!photoURL || photoURL.length === 0) {
    return defaultImage;
  }
  return photoURL;
}

//check date validity

function checkDate(date) {
  if (date.length === 0) {
    return "no date provided";
  } else {
    return new Date(date).toLocaleDateString();
  }
}

//check description validity

function checkDescription(description) {
  if (description.length === 0) {
    return "no description provided";
  } else {
    return description;
  }
}

//remove destination article
function removeDestination_Article(event) {
  var articleToRemove = event.target.parentElement.parentElement;
  articleToRemove.remove();
}

//update destinations list function

function updateDestinationsList() {
  const destinationsListContainer = document.getElementById(
    "destination_list_container"
  );
  destinationsListContainer.innerHTML = "";

  //Add the Remove All button if it doesn't exist and there are destinations
  if (destinations.length > 0 && !document.querySelector(".remove-all-btn")) {
    addRemoveAllButton();
  }

  destinations.forEach((dest) => {
    // Create destination item container
    const destItem = document.createElement("div");
    destItem.className = "destination-item";

    // Create and append destination name
    const destName = document.createElement("h4");
    destName.id = "listDestname";
    destName.textContent = dest.name;

    // Create and append destination location
    const destLocation = document.createElement("p");
    destLocation.id = "listDestLocation";
    destLocation.textContent = dest.location;

    // Append elements to destination item
    destItem.appendChild(destName);
    destItem.appendChild(destLocation);

    destItem.addEventListener("click", () => {
      // First check if destination exists in the destinations array using the array.some() method
      // If the destination exists, scroll to the corresponding article card in the list
      // If the destination doesn't exist, log a message to the console and change the Card Exist value to false

      const ArticleCardExists = destinations.some(
        (destination) =>
          destination.name === dest.name &&
          destination.location === dest.location
      );

      if (!ArticleCardExists) {
        console.log("This destination is not in the list");
        return;
      }
      // Find the corresponding article card
      const articleCards = document.querySelectorAll(".article_card");
      let isCardExist = false;
      let currCard = null;

      articleCards.forEach((card) => {
        const ArticlecardTitle = card.querySelector("h3").textContent;
        if (ArticlecardTitle === dest.name) {
          isCardExist = true;
          currCard = card;
        }
      });

      if (isCardExist && currCard) {
        // Scroll the article card into view
        currCard.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      } else {
        // If card doesn't exist, create it
        const newCard = createDestinationCard(
          dest.name,
          dest.location,
          dest.photoURL,
          dest.description,
          dest.date
        );

        //add the new card to the destination container
        addCardToContainer(newCard, dest.name);

        // Scroll to the new card
        setTimeout(() => {
          newCard.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }, 100);
      }
    });

    // Append the complete item to the container
    destinationsListContainer.appendChild(destItem);
  });
}

// Add the function to add the card to the destination container
function addCardToContainer(newCard, destName) {
  const destinationsContainer = document.getElementById(
    "destinations_container"
  );
  //find the index of the similar card to the new card in the destinations array aka oldCardIndex
  const oldCardIndex = destinations.findIndex((dest) => dest.name === destName);
  let inserted;
  // Check if there are any existing cards in the container
  const existingCards = destinationsContainer.querySelectorAll(".article_card");

  // If there are no existing cards, append the new card directly to the container
  if (existingCards.length === 0) {
    destinationsContainer.appendChild(newCard);
  } else {
    // inserted flag would be false initially
    inserted = false;
    // Check if the new card should be inserted before or after an existing card
    for (let i = 0; i < existingCards.length; i++) {
      // Iterate over the existing cards
      const cardTitle = existingCards[i].querySelector("h3").textContent; // Get the title of the existing card i
      const newCardIndex = destinations.findIndex((d) => d.name === cardTitle); // Get the index of the new card in the destinations array

      // If the new card should be inserted before the existing card, insert it and break the loop
      if (oldCardIndex < newCardIndex) {
        destinationsContainer.insertBefore(newCard, existingCards[i]);
        inserted = true;
        break;
      }
    }
  }
  if (!inserted) {
    // If the new card wasn't inserted before any existing card, append it to the container
    destinationsContainer.appendChild(newCard);
  }
}

// Function to add a Remove All button to the destination list section
function addRemoveAllButton() {
  // Get the destination list section
  const getDestLists = document.getElementById("destination_list_section");

  // Create the Remove All button
  const removeAllBtn = document.createElement("button");
  removeAllBtn.innerText = "Remove All";
  removeAllBtn.className = "remove-all-btn"; // For styling

  // Add click event listener with confirmation
  removeAllBtn.addEventListener("click", () => {
    // Show confirmation dialog
    const confirmRemove = confirm(
      "Are you sure you want to remove all destinations? This action cannot be undone."
    );

    if (confirmRemove) {
      // Clear the destinations array
      destinations = [];

      window.location.reload(); // Refresh the page to remove the destinations list and cards.
    }
  });

  // Add the button to the section
  getDestLists.appendChild(removeAllBtn);
}
