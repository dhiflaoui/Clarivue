import { HuggingFaceInferenceEmbeddings } from "langchain/embeddings/hf";

const embeddings = new HuggingFaceInferenceEmbeddings({
  apiKey: process.env.HUGGINGFACE_API_KEY,
  model: process.env.HUGGINGFACE_EMBEDDING_MODEL,
});
// "sentence-transformers/all-MiniLM-L6-v2",

export default embeddings;
