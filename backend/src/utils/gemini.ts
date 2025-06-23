import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function generateTasks(topic: string): Promise<string[]> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const prompt = `Generate a list of 5 concise, actionable tasks to learn about ${topic}. Return only the tasks, no numbering or formatting. Each task should be on a new line.`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Split by new lines and filter out empty lines
    const tasks = text
      .split('\n')
      .map(task => task.trim())
      .filter(task => task.length > 0)
      .slice(0, 5); // Ensure we only get 5 tasks
    
    return tasks;
  } catch (error) {
    console.error("Error generating tasks with Gemini:", error);
    throw new Error("Failed to generate tasks");
  }
}
