import { Pinecone } from '@pinecone-database/pinecone'

const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });

const index = pc.Index('chatgpt-clone');

async function createMemory ({vectors, metadata, messageId}) {
  await index.upsert([{
    id:messageId,
    values: vectors,
    metadata: metadata  
  }]);
}

async function queryMemory ({queryVector, limit = 5, metadata}) {
    const data= await index.query({
        vector: queryVector,
        topK: limit,
        filter:metadata?{metadata}:undefined,
        includeMetadata:true
    })
    return data.matches;
}

export {createMemory, queryMemory};