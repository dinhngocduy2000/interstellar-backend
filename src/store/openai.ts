import OpenAI from "openai";
import { ResponseCreateParamsNonStreaming } from "openai/resources/responses/responses.js";
import { Stream } from "openai/streaming";

export class OpenAIService {
  constructor(private readonly openai_client: OpenAI) {}

  async chat(input: ResponseCreateParamsNonStreaming): Promise<
    Stream<OpenAI.Responses.ResponseStreamEvent> & {
      _request_id?: string | null;
    }
  > {
    const res = await this.openai_client.responses.create({
      model: input.model,
      input: input.input,
      stream: true,
    });
    return res;
  }
}
