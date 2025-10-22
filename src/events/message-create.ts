import { ArgsOf, Client, Discord, On } from "discordx";
import { axios } from "../lib/axios";

@Discord()
export class MessageCreateEvent {
  @On()
  async messageCreate(
    [message]: ArgsOf<"messageCreate">,
    client: Client
  ): Promise<void> {
    if (message.author.bot) return;

    if (!message.guild) return;

    if (message.channelId !== process.env.DISCORD_CHANNEL_ID) return;

    console.log(
      `Nova mensagem de ${message.author.username}: ${message.content}`
    );

    const payload = {
      messageId: message.id,
      content: message.content,
      author: {
        id: message.author.id,
        username: message.author.username,
        tag: message.author.tag,
        avatar: message.author.displayAvatarURL(),
      },
      guild: {
        id: message.guild.id,
        name: message.guild.name,
      },
      timestamp: message.createdAt,
      hasAttachments: message.attachments.size > 0,
      attachments: message.attachments.map((att: any) => ({
        name: att.name,
        url: att.url,
        size: att.size,
      })),
    };

    try {
      const response = await axios.post(
        process.env.N8N_WEBHOOK_URL ?? "",
        payload,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      console.log(`✅ Webhook enviado com sucesso: `, response.data);
    } catch (error) {
      if (error instanceof Error)
        console.error("❌ Erro ao enviar webhook:", error.message);
    }
  }
}
