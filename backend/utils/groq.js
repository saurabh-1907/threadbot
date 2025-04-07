
const Groq = require("groq-sdk");
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const getThreadBotReply = async (userPrompt) => {
	try {
		const chatCompletion = await groq.chat.completions.create({
			model: "qwen-2.5-32b",
			temperature: 0.6,
			top_p: 0.95,
			stream: true,
			stop: null,
			max_tokens: 4096,
			messages: [
				{ role: "system", content: "You are ThreadBot, a helpful assistant on a social media platform." },
				{ role: "user", content: userPrompt }
			]
		});

		let fullResponse = "";

		for await (const chunk of chatCompletion) {
			fullResponse += chunk.choices[0]?.delta?.content || "";
		}

		return fullResponse.trim();
	} catch (error) {
		console.error("Groq ThreadBot error:", error);
		return "ThreadBot couldn't reply due to an error.";
	}
};

module.exports = { getThreadBotReply };
