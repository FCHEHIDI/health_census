// chatbot.js

const chatbotButton = document.getElementById('chatbot-button');
const chatbotContainer = document.getElementById('chatbot-container');
const chatbotCloseBtn = document.getElementById('chatbot-close-btn');
const chatbotMessages = document.getElementById('chatbot-messages');
const chatbotInput = document.getElementById('chatbot-input');
const chatbotSendBtn = document.getElementById('chatbot-send-btn');

let chatbotPolicies = null; // To store loaded policies

// Function to load chatbot policies from JSON
async function loadChatbotPolicies() {
    try {
        const response = await fetch('./chatbot_policies.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        chatbotPolicies = await response.json();
        console.log('Chatbot policies loaded:', chatbotPolicies);
    } catch (error) {
        console.error('Error loading chatbot policies:', error);
        addBotMessage("I'm sorry, I'm having trouble loading my knowledge base right now. Please try again later.");
    }
}

// Display messages
function addMessage(message, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add(sender === 'user' ? 'user-message' : 'bot-message');
    messageDiv.textContent = message;
    chatbotMessages.appendChild(messageDiv);
    // Scroll to the latest message
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
}

// Get bot response based on user input
function getBotResponse(userInput) {
    const lowerCaseInput = userInput.toLowerCase();

    // Iterate through intents to find a match
    for (const intent of chatbotPolicies.intents) {
        if (intent.tag === "unknown") continue; // Handle unknown separately at the end

        for (const pattern of intent.patterns) {
            if (lowerCaseInput.includes(pattern.toLowerCase())) {
                // Found a match, pick a random response
                const randomIndex = Math.floor(Math.random() * intent.responses.length);
                return intent.responses[randomIndex];
            }
        }
    }

    // If no specific intent matched, use the 'unknown' response
    const unknownIntent = chatbotPolicies.intents.find(i => i.tag === "unknown");
    if (unknownIntent) {
        const randomIndex = Math.floor(Math.random() * unknownIntent.responses.length);
        return unknownIntent.responses[randomIndex];
    }
    return "I'm sorry, I don't know how to respond to that."; // Fallback
}


// Handle sending messages
function sendMessage() {
    const userInput = chatbotInput.value.trim();
    if (userInput === '') return;

    addMessage(userInput, 'user');
    chatbotInput.value = ''; // Clear input

    // Get bot response after a short delay for a more natural feel
    setTimeout(() => {
        const botResponse = getBotResponse(userInput);
        addMessage(botResponse, 'bot');
    }, 500); // 0.5 second delay
}

// Event Listeners
chatbotButton.addEventListener('click', () => {
    chatbotContainer.classList.add('open');
    chatbotButton.style.display = 'none'; // Hide the button when chat is open
});

chatbotCloseBtn.addEventListener('click', () => {
    chatbotContainer.classList.remove('open');
    chatbotButton.style.display = 'block'; // Show the button again
});

chatbotSendBtn.addEventListener('click', sendMessage);

chatbotInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

// Load policies when the script loads
loadChatbotPolicies();

// Initial bot message (already in HTML, but can be added here dynamically if preferred)
// window.onload = () => {
//     addBotMessage("Hello! How can I help you today?");
// };