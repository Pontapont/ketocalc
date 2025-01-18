import database from "./database.js"

const showAvailableIngredients = document.querySelector('.available-ingredients')
const resultTemplate = document.querySelector("[data-result-template]")

const ingredientInformation = database

// Elementen uit de .ingredient-list container
const ingredientListContainer = document.querySelector(".ingredient-list-container")
const selectedIngredientsContainer = document.getElementById("selectedIngredients")

/* PROTOTYPE CODE BEGIN*/
// Referenties naar elementen



const searchBar = document.getElementById('searchBar');
const suggestionsContainer = document.getElementById('suggestions');
let userAddedIngredients = {}

// Luister naar input in het zoekveld
searchBar.addEventListener('input', function() {
  const query = this.value.toLowerCase(); // Klein lettertype voor case-insensitiviteit
  suggestionsContainer.innerHTML = ''; // Maak huidige aanbevelingen leeg
  suggestionsContainer.style.display = 'none'; // Verberg standaard
  
  if (query.length === 0) {
    ingredientListContainer.classList.add("show")
    selectedIngredientsContainer.classList.remove("show")
    const ingredientItems = Array.from(selectedIngredientsContainer.querySelectorAll(".selected-list-item"))
    ingredientItems.forEach(item => {
      item.remove()
    })
    return; // Stop als het zoekveld leeg is
  } 

  // Filter ingrediënten op basis van zoekopdracht
  // Object.keys stopt alle keys in een array
  const matches = Object.keys(ingredientInformation).filter(item => {
    // Maak een regex van de user input
    // [!] Example
    // Strings die beginnen met waarde van gebruiker zijn een match.
    // St === Strawberry, Lem === Lemon etc.
    let queryRegex = new RegExp("^" + query);
    
    // Kijk of de user input aanwezig is als ingredient in het ingredientInformation object database
    // Als de huidige user input geen match is met een waarde in database maar wel is toegevoegd als DOM element betekend het dat de waarde bij een vorige zoekopdracht wel een match was maar nu niet meer. De waarde mag dus uit de DOM worden verwijderd.
    // [!] Example: 
    // [!] pe === peach && pear
    // [!] pea === peach
    if (queryRegex.test(item) === false && document.querySelector(`#${item.split(" ").join("-")}`) !== null){
      document.querySelector(`#${item.split(" ").join("-")}`).remove()
    } else {
      return queryRegex.test(item)
    }
  });
  // Als er geen matches zijn, niets tonen
  if (matches.length === 0) {
    return
  }

  // Laat de container met alle voorkeur elementen zien
  ingredientListContainer.classList.remove("show")
  selectedIngredientsContainer.classList.add("show")
  // Handmatig zoek venster event activeren wanneer user op een van de aanbevelingen heeft geklikt OF een ingredient heeft toegevoegd aan de lijst.
  const event = new Event('input', { bubbles: true });

  // Voeg matches toe aan de suggesties container
  matches.forEach(item => {
    const suggestionItem = document.createElement('div');
    suggestionItem.className = 'suggestion-item';
    suggestionItem.textContent = item;
    let itemFormatted = item.split(" ").join("-")
    if (document.querySelector(`#${itemFormatted}`) === null){
      const template = document.getElementById('ingredient-template');

      // Clone de inhoud van het template
      const clone = template.content.cloneNode(true);
      clone.querySelector(".selected-list-item").id = itemFormatted
      clone.querySelector("#gramBar").classList.add(`grambar-${itemFormatted}`)
  
      // Vul de gegevens in
      console.log(ingredientInformation[item].img)
      clone.querySelector('img').src = ingredientInformation[item].img
      clone.querySelector('img').alt =  itemFormatted
      clone.querySelector('.selected-ingredient-name').textContent = item

      // Voeg Event Listener toe die gram invoer venster zichtbaar maakt
      clone.querySelector(".selected-list-item").addEventListener("click", e => {
        const ingredientDOM = document.querySelector(`#${itemFormatted}`) 
        const ingredientAmountBar = ingredientDOM.querySelector(".add-grams")

        ingredientAmountBar.classList.toggle("active")
        ingredientDOM.classList.toggle("selected")
      })

      // Wanneer je op het .add-grams element klikt wordt het klik event van zijn parent niet geactiveerd. 
      clone.querySelector(".add-grams").addEventListener('click', (event) => {
        event.stopPropagation()
      })

      clone.querySelector("#addIngredient").addEventListener("click", e => {
          // Input element van gram hoeveelheid user
          let userGram = document.querySelector(`.grambar-${itemFormatted}`)

          // Maakt een clone van kaart die wordt toegevoegd aan ingredienten overzicht in de calc-ingredients container.
          // Selecteer de template via zijn attribute [data-ingredient-template]
          const ingredientCardTemplate = document.querySelector('[data-ingredient-template]')
          const ingredientCardClone = ingredientCardTemplate.content.cloneNode(true)
          
          ingredientCardClone.querySelector("[card-image]").src = ingredientInformation[item].img
          ingredientCardClone.querySelector("[ingredient-name]").textContent = item
          ingredientCardClone.querySelector("[total-grams]").textContent = userGram.value
          // Voegt de clone toe aan de ingredient-list container waar hij zichtbaar wordt voor de user. In deze container worden alle ingredienten + hoeveelheid bijgehouden die de gebruiker gezamelijk wilt berekenen
          document.querySelector(".calc-ingredients").append(ingredientCardClone)

          // Wanneer user op add button heeft geklikt wordt de inhoud van het zoekvenster gewist en het input event geactiveerd zodat het toegevoegde ingredient verdwijnt uit de zoeklijst
          searchBar.value = ""
          searchBar.dispatchEvent(event)

          // userAddedIngredients is een leeg object dat bijhoudt hoeveel gram er van elk object is toegevoegd aan de ingredienten lijst
          userAddedIngredients[item] = (userAddedIngredients[item] || 0) + Number(userGram.value)
          
      })

      // Voeg de clone toe aan de gewenste parent
      selectedIngredientsContainer.appendChild(clone);
    }

    // Wanneer er op een suggestie wordt geklikt
    suggestionItem.addEventListener('click', function() {
      searchBar.value = item; // Vul het zoekveld met het geselecteerde item
      suggestionsContainer.style.display = 'none'; // Verberg de suggesties

      // Trigger handmatig het input-event
      searchBar.dispatchEvent(event);
    });

    suggestionsContainer.appendChild(suggestionItem);
  });
  suggestionsContainer.style.display = 'block'; // Toon de suggesties
});

// Verberg de suggesties wanneer buiten het venster wordt geklikt
document.addEventListener('click', function(e) {
  if (!searchBar.contains(e.target) && !suggestionsContainer.contains(e.target)) {
    suggestionsContainer.style.display = 'none';
  }
});



// BUTTON EVENT LISTENERS

// addButton.addEventListener("click", () => {
//   const cart = userCardTemplate.content.cloneNode(true).children[0]
//   const key = cart.querySelector("[ingredient-name]")
//   const totalGrams = cart.querySelector("[total-grams]")
//   const image = cart.querySelector("[card-image]")

//   const userIngredient = searchBar.value
//   const userGrams = Number(gramBar.value)


//   key.textContent = userIngredient
//   key.textContent = key.textContent.charAt(0).toUpperCase() + key.textContent.slice(1)
//   totalGrams.textContent = userGrams
//   image.setAttribute("src", ingredientInformation[userIngredient].img)

//   ingredientBasket.push([userIngredient, userGrams])
//   cardContainer.append(cart)
//   clearSearch()
// })



let resultContainer = document.querySelector(".results")
const calcButton = document.querySelector("#calcButton")
let carbTotal = 0
let fatsTotal = 0
let proteinTotal = 0
let kcalTotal = 0

calcButton.addEventListener("click", () => {
  clearResults()
  Object.keys(userAddedIngredients).map(key => {
    let ingredientAmount = userAddedIngredients[key]
    let ingredientName = key.toLowerCase()
    let carbs = ingredientInformation[key].carb / 100 * ingredientAmount
    let fats = ingredientInformation[key].fats / 100 * ingredientAmount
    let protein = ingredientInformation[key].protein / 100 * ingredientAmount
    let kcal = ingredientInformation[key].kcal / 100 * ingredientAmount

    carbTotal += carbs
    fatsTotal += fats
    proteinTotal += protein
    kcalTotal += kcal

    let resultElement = null

    for (let i = 0; i < 6; i++){
      switch(i){
        case 0:
          resultElement = document.createElement("p")
          resultElement.textContent = ingredientName
          resultContainer.append(resultElement)
          resultElement = null
          break
        case 1:
          resultElement = document.createElement("p")
          resultElement.textContent = ingredientAmount.toFixed(2)
          resultContainer.append(resultElement)
          resultElement = null
          break
        case 2:
          resultElement = document.createElement("p")
          resultElement.textContent = carbs.toFixed(2)
          resultContainer.append(resultElement)
          resultElement = null
          break
        case 3:
          resultElement = document.createElement("p")
          resultElement.textContent = fats.toFixed(2)
          resultContainer.append(resultElement)
          resultElement = null
          break
        case 4:
          resultElement = document.createElement("p")
          resultElement.textContent = protein.toFixed(2)
          resultContainer.append(resultElement)
          resultElement = null
          break
        case 5:
          resultElement = document.createElement("p")
          resultElement.textContent = kcal.toFixed(2)
          resultContainer.append(resultElement)
          resultElement = null
          break
      }
    }

  })

  document.querySelector("#carb-result").textContent = carbTotal.toFixed(2)
  document.querySelector("#fats-result").textContent = fatsTotal.toFixed(2)
  document.querySelector("#protein-result").textContent = proteinTotal.toFixed(2)
  document.querySelector("#kcal-result").textContent = kcalTotal.toFixed(2)

  // Show results
  resultContainer.parentElement.classList.add("show")

  // Changes opacity of main-content to 0.1 for clear contrast
  document.querySelector(".main-content").classList.add("inactive")
})

// EXIT BUTTON CODE
const exitButton = document.querySelector("#exitButton")

exitButton.addEventListener("click", () => {
  document.querySelector(".main-content").classList.remove("inactive")
  resultContainer.parentElement.classList.remove("show")
})


const clearButton = document.querySelector("#clearButton")

clearButton.addEventListener("click", () => {
  clearCards()
})



function clearCards(){
  userAddedIngredients = {}
  // Empty ingredient cards
  let ingredientCards = Array.from(document.querySelectorAll(".calc-ingredients .card"))
  ingredientCards.forEach(card => {
    card.remove()
  })

  // Remove values from .results
  let resultsP = resultContainer.querySelectorAll("p")
  for (let resultP of resultsP){
    if (!resultP.classList.contains("safe")){
      resultP.remove()
    }
  }

  // removing values from .total-results
  document.querySelector("#carb-result").textContent = 0
  document.querySelector("#fats-result").textContent = 0
  document.querySelector("#protein-result").textContent = 0
  document.querySelector("#kcal-result").textContent = 0

  // Removing total values for reset
  carbTotal = 0
  fatsTotal = 0
  proteinTotal = 0
  kcalTotal = 0
}

function clearResults(){
  // Remove values from .results
  let resultsP = resultContainer.querySelectorAll("p")
  for (let resultP of resultsP){
    if (!resultP.classList.contains("safe")){
      resultP.remove()
    }
  }

  // removing values from .total-results
  document.querySelector("#carb-result").textContent = 0
  document.querySelector("#fats-result").textContent = 0
  document.querySelector("#protein-result").textContent = 0
  document.querySelector("#kcal-result").textContent = 0

  // Removing total values for reset
  carbTotal = 0
  fatsTotal = 0
  proteinTotal = 0
  kcalTotal = 0
}
