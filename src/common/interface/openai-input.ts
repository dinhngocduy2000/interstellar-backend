export interface OpenAIInput {
  model: string;
  input: string;
  role?: "user" | "assistant" | "system";
}
