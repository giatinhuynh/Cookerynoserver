const form = document.querySelector("#recipe-form");
const chatArea = document.querySelector(".chat-area");
const customPrompt = document.querySelector(".custom-prompt");
let lastGeneratedRecipe = "";

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const expertise = document.querySelector('#expertise').value;
  const complexity = document.querySelector('#complexity').value;
  const ingredients = document.querySelector('#ingredients').value;
  const budget = document.querySelector('#budget').value;
  const time = document.querySelector('#time').value;
  const scale = document.querySelector('#scale').value;
  const nutrition = document.querySelector('#nutrition').value;
  const taste = document.querySelector('#taste').value;
  const dietary_restrictions = document.querySelector('#dietary-restrictions').value;

  const prompt = `You are a cooking chatbot that can help me prepare the perfect meal! Given the expertise level of ${expertise}, complexity of ${complexity}, budget of ${budget}, preparation time of ${time} minutes, serving scale of ${scale}, nutrition preference of ${nutrition}, taste preference of ${taste}, dietary restrictions of ${dietary_restrictions}, and available ingredients of ${ingredients}, please provide a suitable grocery list, recipe, and cooking instructions for a meal.`;
  const submitButton = document.querySelector(".submit-button");
  submitButton.textContent = "Please wait...";
  submitButton.disabled = true;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer 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' // Replace with your OpenAI API key
      },
      body: JSON.stringify({
        "model": "gpt-3.5-turbo",
        "messages": [{
          "role": "user",
          "content": prompt
        }],
        "temperature": 1
      })
    });    

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Data received from API:", data);
    displayRecipe(data);
  } catch (error) {
    console.log(error);
  } finally {
    submitButton.textContent = "Get Recipe";
    submitButton.disabled = false;
  }
  form.reset();
});

const sendPromptButton = document.querySelector("#sendPromptButton");
sendPromptButton.addEventListener("click", sendPersonalizationPrompt);

async function sendPersonalizationPrompt() {
  const personalizationInput = document.querySelector("#customPromptInput");
  const personalization = personalizationInput.value.trim();
  if (!personalization) return;

  const fullPrompt = `${lastGeneratedRecipe}<br>${personalization}`;
  sendPromptButton.textContent = "Please wait...";
  sendPromptButton.disabled = true;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer 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' // Replace with your OpenAI API key
      },
      body: JSON.stringify({
        "model": "gpt-3.5-turbo",
        "messages": [{
          "role": "user",
          "content": fullPrompt, 
        }],
        "temperature": 1
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Data received from API:", data);
    displayPersonalizedRecipe(data);
  } catch (error) {
    console.log(error);
  } finally {
    sendPromptButton.textContent = "Send";
    sendPromptButton.disabled = false;
  }

  personalizationInput.value = "";
}

function displayPersonalizedRecipe(data) {
  const recipeElement = document.querySelector("#recipe");
  recipeElement.innerHTML = "";

  const personalizedMessage = data.choices[0].message.content.trim().replace(/\n/g, "<br>");
  recipeElement.innerHTML = `<div class="message"><div class="bot-message">${personalizedMessage}</div></div>`;
}

function displayRecipe(data) {
  const recipeElement = document.querySelector("#recipe");
  recipeElement.innerHTML = "";
  
  lastGeneratedRecipe = data.choices[0].message.content.trim().replace(/\n/g, "<br>");
  recipeElement.innerHTML = `<div class="message"><div class="bot-message">${lastGeneratedRecipe}</div></div>`;
  customPrompt.style.display = "block";
  form.reset();
}
