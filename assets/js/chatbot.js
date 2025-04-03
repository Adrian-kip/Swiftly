// Chatbot functionality
document.addEventListener('DOMContentLoaded', function() {
    const chatbotContainer = document.querySelector('.chatbot-container');
    const chatbotToggle = document.querySelector('.chatbot-toggle');
    const closeChatbot = document.querySelector('.close-chatbot');
    const sendMessageBtn = document.querySelector('.send-message');
    const chatInput = document.querySelector('.chatbot-input input');
    const chatMessages = document.querySelector('.chatbot-messages');
    
    // Toggle chatbot visibility
    chatbotToggle.addEventListener('click', () => {
        chatbotContainer.classList.toggle('active');
    });
    
    closeChatbot.addEventListener('click', () => {
        chatbotContainer.classList.remove('active');
    });
    
    // Send message function
    function sendMessage() {
        const messageText = chatInput.value.trim();
        if (messageText === '') return;
        
        // Add user message
        addMessage(messageText, 'user');
        chatInput.value = '';
        
        // Simulate typing indicator
        const typingIndicator = document.createElement('div');
        typingIndicator.className = 'chatbot-message chatbot-typing';
        typingIndicator.innerHTML = '<p>...</p>';
        chatMessages.appendChild(typingIndicator);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        
        // Simulate bot response after delay
        setTimeout(() => {
            chatMessages.removeChild(typingIndicator);
            const botResponse = generateResponse(messageText);
            addMessage(botResponse, 'bot');
        }, 1000 + Math.random() * 2000);
    }
    
    // Add message to chat
    function addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `chatbot-message chatbot-${sender}`;
        
        const messageContent = document.createElement('p');
        messageContent.textContent = text;
        messageDiv.appendChild(messageContent);
        
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    // Generate bot response
    function generateResponse(userMessage) {
        const lowerMessage = userMessage.toLowerCase();
        
        // Greetings
        if (lowerMessage.includes('hi') || lowerMessage.includes('hello') || lowerMessage.includes('hey')) {
            return "Hello there! How can I assist you with your luxury travel plans today?";
        }
        
        // Booking questions
        if (lowerMessage.includes('book') || lowerMessage.includes('reserve') || lowerMessage.includes('schedule')) {
            return "You can book a flight directly on our website by visiting the 'Book Now' page. Would you like me to guide you through the process?";
        }
        
        // Pricing questions
        if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('how much')) {
            return "Our pricing varies based on aircraft type, distance, and additional services. For an accurate quote, please submit a booking request or contact our team directly.";
        }
        
        // Service questions
        if (lowerMessage.includes('service') || lowerMessage.includes('offer') || lowerMessage.includes('provide')) {
            return "We offer premium helicopter and private jet services for weddings, corporate events, private getaways, and special occasions. You can find detailed information on our Services page.";
        }
        
        // Safety questions
        if (lowerMessage.includes('safe') || lowerMessage.includes('security') || lowerMessage.includes('certified')) {
            return "Safety is our top priority. All our aircraft meet the highest safety standards, undergo regular maintenance, and are operated by experienced pilots with impeccable records.";
        }
        
        // Default response
        const defaultResponses = [
            "I'd be happy to help with that. Could you provide more details about your inquiry?",
            "For more specific information about that, I recommend contacting our concierge team directly at +1 (555) 123-4567.",
            "I'm here to assist you with any questions about our luxury air travel services. What would you like to know?",
            "That's a great question! Our website has detailed information, or I can connect you with a human representative if you'd prefer."
        ];
        
        return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
    }
    
    // Event listeners
    sendMessageBtn.addEventListener('click', sendMessage);
    
    chatInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
    
    // Initial greeting
    setTimeout(() => {
        addMessage("Welcome to Swiftly! I'm your personal travel assistant. How can I help you plan your luxury flight experience today?", 'bot');
    }, 1000);
    
    // Train chatbot with additional responses
    function trainChatbot(newResponses) {
        // This function would be expanded to integrate with a backend
        // for actual chatbot training in a production environment
        console.log('Training chatbot with new responses:', newResponses);
    }
    
    // Example of training (would be connected to admin interface in production)
    const trainingData = {
        "wedding packages": "We offer special wedding packages that include floral decorations, champagne service, and photography coordination. Would you like details?",
        "corporate discounts": "We provide volume discounts for corporate clients with frequent travel needs. Please contact our sales team for customized solutions.",
        "pet policy": "We welcome pets on most flights with prior arrangement. There may be additional requirements depending on the aircraft and destination."
    };
    
    trainChatbot(trainingData);
});