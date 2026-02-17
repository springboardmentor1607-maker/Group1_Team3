// Simple chatbot controller for CleanStreet application
// This provides automated responses for common user queries
import Chat from '../models/chat.model.js';

const chatbotResponses = {
  // Greetings
  'hello': 'Hello! Welcome to CleanStreet. How can I help you today?',
  'hi': 'Hi there! Welcome to CleanStreet. How can I assist you?',
  'hey': 'Hey! Welcome to CleanStreet. What can I help you with?',
  
  // About CleanStreet
  'what is cleanstreet': 'CleanStreet is a civic issue reporting platform that allows citizens to report and track municipal issues like garbage, potholes, streetlights, and more.',
  'about': 'CleanStreet is a civic issue reporting platform that allows citizens to report and track municipal issues like garbage, potholes, streetlights, and more.',
  
  // How to use
  'how to report': 'To report an issue: 1) Sign up or login to your account 2) Go to the dashboard 3) Click on "Report Issue" 4) Fill in the details like issue type, location, description, and upload a photo 5) Submit the report',
  'how to login': 'To login: Enter your email and password on the login page and click the login button. If you don\'t have an account, you can sign up using the signup option.',
  'how to signup': 'To sign up: Click on the signup option, fill in your name, email, mobile number, password, and select your role (user, volunteer, or admin). Then click register.',
  
  // Issue types
  'issue types': 'You can report various issues including: Garbage accumulation, Potholes, Streetlight problems, Water leakage, Drainage issues, Tree fall, Road damage, and more.',
  'what issues can i report': 'You can report various issues including: Garbage accumulation, Potholes, Streetlight problems, Water leakage, Drainage issues, Tree fall, Road damage, and more.',
  
  // Status tracking
  'track my report': 'You can track your reported issues by logging in and visiting your dashboard. All your submitted reports will be displayed with their current status.',
  'report status': 'You can check the status of your report on your dashboard. Statuses include: Pending, In Progress, Resolved, or Rejected.',
  
  // Contact/Support
  'contact': 'For support, you can contact us at support@cleanstreet.com or call our helpline at 1800-XXX-XXXX during business hours.',
  'help': 'I can help you with: reporting issues, tracking reports, login/signup information, and general questions about CleanStreet. What would you like to know?',
  
  // Thank you
  'thank you': 'You\'re welcome! Is there anything else I can help you with?',
  'thanks': 'You\'re welcome! Is there anything else I can help you with?',
  
  // Goodbye
  'bye': 'Goodbye! Thank you for using CleanStreet. Have a great day!',
  'goodbye': 'Goodbye! Thank you for using CleanStreet. Have a great day!',
};

// Default response for unrecognized queries
const defaultResponse = 'I\'m not sure I understand that. You can ask me about: how to report an issue, how to login/signup, what issues can be reported, or how to track your reports. Type "help" for more options.';

export const chat = async (req, res) => {
  try {
    const { message, userId } = req.body;
    
    if (!message) {
      return res.status(400).json({ message: 'Message is required' });
    }

    // Convert message to lowercase for matching
    const lowerMessage = message.toLowerCase().trim();
    
    // Find matching response
    let response = defaultResponse;
    
    for (const [key, value] of Object.entries(chatbotResponses)) {
      if (lowerMessage.includes(key)) {
        response = value;
        break;
      }
    }

    // Save chat to MongoDB
    await Chat.create({
      userId: userId || null,
      message: message,
      botResponse: response
    });

    res.status(200).json({
      message: response,
      userMessage: message
    });

  } catch (error) {
    res.status(500).json({ message: 'Chatbot error', error: error.message });
  }
};

export const getChatbotOptions = async (req, res) => {
  try {
    const options = [
      'How to report an issue?',
      'How to track my report?',
      'What issues can I report?',
      'How to login/signup?',
      'Contact support'
    ];
    
    res.status(200).json({ options });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching options', error: error.message });
  }
};
