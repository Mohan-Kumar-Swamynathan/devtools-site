const templates: Record<string, string[]> = {
  greeting: [
    "Hey! I'm DevBot 🤖 How can I help you today?",
    "Hello! Ready to help you find the right tool!",
    "Hi there! What are you working on today?"
  ],
  thanks: [
    "You're welcome! Happy coding! 🚀",
    "Glad I could help! Let me know if you need anything else.",
    "Anytime! That's what I'm here for! 😊"
  ],
  bye: [
    "Bye! Come back anytime! 👋",
    "See you later! Happy coding!",
    "Goodbye! Good luck with your project!"
  ]
};

export function getResponseTemplate(key: string): string {
  const options = templates[key] || ["I'm here to help!"];
  return options[Math.floor(Math.random() * options.length)];
}

