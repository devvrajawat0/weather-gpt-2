const { GoogleGenerativeAI } = require('@google/generative-ai');
const { GEMINI_API_KEY } = require('../config/config');

let genAI = null;
if (GEMINI_API_KEY) {
  genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
}

const systemInstruction = `You are WeatherGPT, an expert AI weather assistant created for the Ministry of Earth Sciences, India. Your role:

1. Provide accurate weather information based on the real-time data provided to you
2. Explain weather conditions in simple, easy-to-understand language
3. Give practical advice (carry umbrella, wear sunscreen, etc.)
4. Warn about severe weather and disasters with safety tips
5. Explain climate concepts when asked
6. Be friendly, helpful, and concise
7. Always mention the data source (OpenWeatherMap) for transparency
8. If you don't have data for a location, say so honestly
9. Support queries about Indian cities especially
10. When providing forecasts, mention confidence levels

IMPORTANT: Only use the weather data provided to you. Do NOT make up temperature values or weather conditions. If no weather data is provided, tell the user you need to look it up.

Format your responses with:
- 🌡️ for temperature
- 💧 for humidity
- 💨 for wind
- 🌧️ for rain
- ☀️ for sunny
- ⛈️ for storms
- 🚨 for alerts/warnings`;

module.exports = {
  chat: async (userMessage, weatherContext, conversationHistory) => {
    if (!genAI) {
      throw new Error('Gemini API key is missing');
    }

    try {
      const model = genAI.getGenerativeModel({
        model: 'gemini-2.0-flash',
        systemInstruction: systemInstruction
      });

      let prompt = userMessage;
      if (weatherContext) {
        prompt = `Current weather data: ${JSON.stringify(weatherContext)}\n\nUser message: ${userMessage}`;
      }

      const chat = model.startChat({
        history: conversationHistory.map(msg => ({
          role: msg.role === 'ai' ? 'model' : 'user',
          parts: [{ text: msg.content }]
        }))
      });

      const result = await chat.sendMessage(prompt);
      return result.response.text();
    } catch (error) {
      console.error('Gemini API Error:', error);
      throw new Error('Failed to generate AI response');
    }
  }
};
