import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
dotenv.config();

const ai = new GoogleGenAI({});

async function generateAIResponse(content) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: content,
    });
    return response.text;
  } catch (err) {
    console.error("Error generating AI response:", err);
  }
}

async function generateVector(content){
  const response=await ai.models.embedContent({
    model:"gemini-embedding-001",
    contents: content,
    config:{
      outputDimensionality:768
    }
  })
  return response.embeddings[0].values;
}


export {generateAIResponse,generateVector}; 