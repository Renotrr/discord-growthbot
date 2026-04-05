const { Client, GatewayIntentBits, Events } = require('discord.js');
const storage = require('./storage');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.DirectMessages
  ]
});

client.once(Events.ClientReady, (c) => {
  console.log(`✅ Bot is online as ${c.user.tag}`);
});

client.on(Events.GuildMemberAdd, async (member) => {
  const guildId = member.guild.id;
  const serverConfig = storage.getServer(guildId);

  if (!serverConfig || !serverConfig.active) return;

  const username = member.user.username;
  const userId = member.user.id;
  const serverName = member.guild.name;

  console.log(`👤 ${username} joined ${serverName}`);

  try {
    const ownerId = process.env.OWNER_DISCORD_ID;
    if (ownerId) {
      const owner = await client.users.fetch(ownerId);
      await owner.send(
        `**${username}**\n` +
        `has joined the server: **${serverName}**\n\n` +
        `Click or tap and hold on the username to copy it`
      );
    }
  } catch (err) {
    console.warn('⚠️ Could not notify owner:', err.message);
  }

  storage.addLog({
    type: 'member_joined',
    userId,
    username,
    guildId,
    guildName: serverName,
    inviteSent: !!serverConfig.inviteLink
  });
});

async function startBot() {
  await client.login(process.env.DISCORD_TOKEN);
}

module.exports = { client, startBot };
