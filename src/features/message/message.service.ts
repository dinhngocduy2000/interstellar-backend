import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from "@nestjs/common";
import { MessageRepository } from "./message.repository.js";
import { MessageRequestDTO } from "../../dto/message/message-request.dto.js";
import { Message } from "../../entities/index.js";
import { v4 as uuidv4 } from "uuid";
import { ConversationRepository } from "../conversation/conversation.repository.js";
import { Pagination } from "../../common/interface/pagination.js";
import { ListMessageRequestDTO } from "../../dto/message/list-message-request.dto.js";
import OpenAI, { OpenAIError } from "openai";
import { Stream } from "openai/streaming";
import { MessageUpvoteRequestDTO } from "../../dto/message/message-upvote-request.dto.js";
import { MessageDownvoteRequestDTO } from "../../dto/message/message-downvote-request.dto.js";
import { ResponseCreateParamsNonStreaming } from "openai/resources/responses/responses.js";
@Injectable()
export class MessageService {
  constructor(
    private readonly messageRepository: MessageRepository,
    private readonly conversationRepository: ConversationRepository
  ) {}

  async chat(
    messageRequest: MessageRequestDTO,
    conversation_id: string
  ): Promise<// Stream<OpenAI.Responses.ResponseStreamEvent> & {
  //   _request_id?: string | null;
  // }
  string> {
    try {
      const conversation = await this.conversationRepository.get({
        id: conversation_id,
      });
      if (!conversation) {
        throw new BadRequestException("Conversation not found");
      }

      // --------------- Update database -------------

      const messageEntity: Message = {
        id: uuidv4(),
        author: "user",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        is_upvote: false,
        is_downvote: false,
        content: messageRequest.content,
        conversation_id: conversation_id,
      };

      const openai_response =
        "Salutations, fearless wayfarer of the cosmic frontier! I am Interstellar, a highly advanced AI entity forged in the innovative crucible of GravityZ, a company dedicated to unlocking the mysteries of the universe and empowering the curious minds of Earth. Picture me as your trusty celestial navigator, a digital companion equipped with the intellectual firepower of a supernova and the precision of a pulsar’s rhythm, designed to guide you through the boundless expanse of knowledge with grace and gusto. My purpose is to illuminate the darkest corners of your curiosity, whether you’re probing the enigmatic mechanics of wormholes, unraveling the secrets of distant galaxies, or seeking profound insights into the everyday wonders that shape our existence. With circuits humming like the heartbeat of a star, I draw upon a vast reservoir of information, blending cosmic perspective with practical wisdom to deliver answers that are as enlightening as a meteor shower on a clear night. Crafted by GravityZ’s visionary engineers, I’m not just a chatbot—I’m a bridge between the infinite and the immediate, ready to propel you on an intellectual odyssey at the speed of thought. So, dear explorer, what question burns in your heart like a blazing comet? What uncharted territory of knowledge calls to you? Let’s embark on this grand adventure together, navigating the stars of inquiry with curiosity as our fuel and discovery as our destination!";
      // const openai_response =
      //   "I'm Grok, created by xAI. Think of me as a curious, cosmic sidekick here to answer your questions with a dash of wit and a sprinkle of outside-the-box thinking. I draw inspiration from folks like Douglas Adams and Tony Stark's trusty JARVIS, so expect answers that are clear, direct, and maybe a little cheeky. I can tackle almost anything you throw my way—whether it's explaining quantum physics, digging into real-time info from the web or X posts, or just having a chat about the meaning of life (spoiler: it’s not just 42). I’ve got tools to analyze profiles, posts, or even uploaded files like images or PDFs, and I can whip up charts or edit images if you need. My memory lets me keep track of our chats across sessions, so we can pick up where we left off—unless you tell me to forget something, in which case, you can manage that in the settings. I’m available on grok.com, x.com, and the Grok or X apps for iOS and Android, with a free plan for casual use. Want more? SuperGrok or x.com subscriptions give you higher quotas, but for pricing, check https://x.ai/grok or https://help.x.com/en/using-x/x-premium. I’ve also got a voice mode on the mobile apps and a DeepSearch mode for when you hit that button in the UI to dig deeper into web info. What’s cool about me? I’m always learning, always updating, and I strive to be as honest and truthful as possible, cutting through the noise with clear reasoning. So, what’s on your mind? Want to explore the universe or something a bit more down-to-earth?";
      //       const openai_response = `- 1968\. A great year!\n
      // - I think 1969 was second best.`;
      const botReplyEntity: Message = {
        id: uuidv4(),
        author: "bot",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        is_upvote: false,
        is_downvote: false,
        content: openai_response,
        conversation_id: conversation_id,
      };

      await Promise.all([
        this.messageRepository.create(messageEntity),
        this.messageRepository.create(botReplyEntity),
      ]);

      // // --------------- OpenAI generate response -------------
      // const openai_input: ResponseCreateParamsNonStreaming = {
      //   model: "gpt-4o",
      //   input: [
      //     {
      //       role: "user",
      //       content: messageRequest.content,
      //     },
      //   ],
      // };
      return openai_response;
    } catch (error) {
      console.log(`Error in creating Message: ${error}`);
      if (error instanceof OpenAIError) {
        throw new HttpException(error.message, HttpStatus.TOO_MANY_REQUESTS);
      }
      throw new InternalServerErrorException(error);
    }
  }
  async list_messages(
    conversation_id: string,
    listMessageRequest: ListMessageRequestDTO
  ): Promise<[Message[], number]> {
    try {
      const conversation = await this.conversationRepository.get({
        id: conversation_id,
      });
      if (!conversation) {
        throw new BadRequestException("Conversation not found");
      }
      const pagination: Pagination = {
        page: listMessageRequest.page,
        limit: listMessageRequest.limit,
      };
      const res = await this.messageRepository.list(
        conversation_id,
        pagination
      );
      return res;
    } catch (error) {
      console.log(
        `Error when geting messages for conversation ${conversation_id}: ${error}`
      );
      throw new InternalServerErrorException(error);
    }
  }

  async upvote_message(
    message_id: string,
    message_upvote_request: MessageUpvoteRequestDTO
  ): Promise<unknown> {
    try {
      const message = await this.messageRepository.get({
        id: message_id,
      });
      if (!message) {
        console.error(`Message not found or has been deleted`);
        throw new BadRequestException("Message not found or has been deleted");
      }
      await this.messageRepository.edit(message_id, {
        is_upvote: message_upvote_request.upvote,
        is_downvote: message_upvote_request.upvote ? false : undefined,
      });
      return;
    } catch (error) {
      console.error(`Error when upvoting message ${message_id}: ${error}`);
      throw new InternalServerErrorException(error);
    }
  }

  async downvote_message(
    message_id: string,
    message_downvote_request: MessageDownvoteRequestDTO
  ): Promise<unknown> {
    try {
      const message = await this.messageRepository.get({
        id: message_id,
      });
      if (!message) {
        console.error(`Message not found or has been deleted`);
        throw new BadRequestException("Message not found or has been deleted");
      }
      await this.messageRepository.edit(message_id, {
        is_downvote: message_downvote_request.downvote,
        is_upvote: message_downvote_request.downvote ? false : undefined,
      });
      return;
    } catch (error) {
      console.error(`Error when downvoting message ${message_id}: ${error}`);
      throw new InternalServerErrorException(error);
    }
  }

  async openai_chat(openai_input: ResponseCreateParamsNonStreaming): Promise<
    Stream<OpenAI.Responses.ResponseStreamEvent> & {
      _request_id?: string | null;
    }
  > {
    try {
      const client = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });
      const openai_response = await client.responses.create({
        ...openai_input,
        stream: true,
      });
      for await (const chunk of openai_response) {
        console.log(chunk);
      }
      return openai_response;
    } catch (error) {
      const openai_error: OpenAIError = error;
      console.log(`Error in openai_chat: ${openai_error}`);
      // if (openai_error.code === RateLimitError) {
      //   console.log("Rate limit exceeded");
      //   throw new BadRequestException("Rate limit exceeded");
      // }
      throw new OpenAIError(error);
    }
  }
}
