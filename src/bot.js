const { Client, GatewayIntentBits, Events, Partials } = require('discord.js');
const storage = require('./storage');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.MessageContent
  ],
  partials: [Partials.Channel, Partials.Message, Partials.GuildMember]
});

client.once(Events.ClientReady, (c) => {
  console.log(`✅ Bot is online as ${c.user.tag}`);
  console.log(`📡 Watching servers: ${JSON.stringify(Object.keys(storage.getServers()))}`);
});

client.on(Events.GuildMemberAdd, async (member) => {
  console.log(`👤 Member joined: ${member.user.username} in ${member.guild.name} (${member.guild.id})`);
  
  const guildId = member.guild.id;
  const serverConfig = storage.getServer(guildId);

  console.log(`🔍 Server config found: ${JSON.stringify(serverConfig)}`);

  if (!serverConfig || !serverConfig.active) {
    console.log(`⚠️ No config or inactive for guild ${guildId}`);
    return;
  }

  const username = member.user.username;
  const serverName = member.guild.name;

  try {
    const ownerId = process.env.OWNER_DISCORD_ID;
    console.log(`📨 Sending notification to owner: ${ownerId}`);
    if (ownerId) {
      const owner = await client.users.fetch(ownerId);
      await owner.send(
        `**${username}**\n` +
        `has joined the server: **${serverName}**\n\n` +
        `Click or tap and hold on the username to copy it`
      );
      console.log(`✅ Notification sent successfully!`);
    }
  } catch (err) {
    console.warn('⚠️ Could not notify owner:', err.message);
  }

  storage.addLog({
    type: 'member_joined',
    userId: member.user.id,
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
