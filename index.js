/**
 ██████╗░████████╗██╗░░██╗           
 ██╔══██╗╚══██╔══╝╚██╗██╔╝          
 ██████╔╝░░░██║░░░░╚███╔╝░          
 ██╔══██╗░░░██║░░░░██╔██╗░          
 ██║░░██║░░░██║░░░██╔╝╚██╗          
 ╚═╝░░╚═╝░░░╚═╝░░░╚═╝░░╚═╝          
  GIT : https://github.com/RTX-GAMINGG/Bot-ghost-status-remover-by-RTX
  DISCORD SERVER : https://discord.gg/FUEHs7RCqz
  YOUTUBE : https://www.youtube.com/channel/UCPbAvYWBgnYhliJa1BIrv0A
 * **********************************************
 *   Code by RTX GAMING
 * **********************************************
 */

  const { Client, GatewayIntentBits, ActivityType, TextChannel, EmbedBuilder, Partials, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
  require('dotenv').config();
  const express = require('express');
  const noblox = require('noblox.js');
  
  const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent,
      GatewayIntentBits.GuildMembers,
      GatewayIntentBits.GuildMessageReactions
    ],
    partials: [Partials.Message, Partials.Channel, Partials.Reaction]
  });
  
  const app = express();
  const port = 3000;
  
  app.get('/', (req, res) => {
    res.send('YaY Your Bot Status Changed✨');
  });
  
  app.listen(port, () => {
    console.log(`🔗 Listening to RTX: http://localhost:${port}`);
    console.log(`🔗 Powered By RTX`);
  });
  
  const statusMessages = ["Watching URFL", "Watching URFL"];
  let currentIndex = 0;
  const channelId = ''; // Set your channel ID here
  
  (async () => {
    await noblox.setCookie(process.env.ROBLOX_COOKIE);
    const currentUser = await noblox.getCurrentUser();
    console.log(`Logged into Roblox as ${currentUser.UserName}`);
  })();
  
  async function login() {
    try {
      await client.login(process.env.DISCORD_TOKEN);
      console.log(`\x1b[36m%s\x1b[0m`, `|    🐇 Logged in as ${client.user.tag}`);
    } catch (error) {
      console.error('Failed to log in:', error);
      process.exit(1);
    }
  }
  
  function updateStatusAndSendMessages() {
    const currentStatus = statusMessages[currentIndex];
    const nextStatus = statusMessages[(currentIndex + 1) % statusMessages.length];
  
    client.user.setPresence({
      activities: [{ name: currentStatus, type: ActivityType.Custom }],
      status: 'dnd',
    });
  
    const textChannel = client.channels.cache.get(channelId);
  
    if (textChannel instanceof TextChannel) {
      textChannel.send(`Bot status is: ${currentStatus}`);
    }
  
    currentIndex = (currentIndex + 1) % statusMessages.length;
  }
  
  client.once('ready', () => {
    console.log(`\x1b[36m%s\x1b[0m`, `|    ✅ Bot is ready as ${client.user.tag}`);
    console.log(`\x1b[36m%s\x1b[0m`, `|    ✨HAPPY NEW YEAR MY DEAR FAMILY`);
    console.log(`\x1b[36m%s\x1b[0m`, `|    ❤️WELCOME TO 2024`);
    updateStatusAndSendMessages();
  
    setInterval(() => {
      updateStatusAndSendMessages();
    }, 10000);
  });
  
  client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;
  
    try {
      console.log(`Received command: ${interaction.commandName}`);
      await interaction.deferReply({ ephemeral: true });
  
      const { commandName, options } = interaction;
  
      if (commandName === 'request') {
        const username = options.getString('username');
        const aboutMe = options.getString('aboutme') || 'No description provided';
        const information = options.getString('information') || 'No additional information provided';
        const channel = client.channels.cache.get(process.env.REQUEST_CHANNEL_ID);
  
        if (!channel) throw new Error('Request channel not found');
  
        const embed = new EmbedBuilder()
          .setTitle('Request to Join')
          .setDescription(`Username: ${username}\nAbout Me: ${aboutMe}\nInformation: ${information}`)
          .setColor('#00FF00');
  
        const msg = await channel.send({ embeds: [embed] });
        await msg.react('✅');
  
        const filter = (reaction, user) => reaction.emoji.name === '✅' && !user.bot;
        const collector = msg.createReactionCollector({ filter, max: 1 });
  
        collector.on('collect', async (reaction, user) => {
          try {
            const robloxUserId = await noblox.getIdFromUsername(username);
            await noblox.handleJoinRequest(process.env.ROBLOX_GROUP_ID, robloxUserId, true); // Accept the join request
            await channel.send(`${username} has been accepted into the Roblox group by ${user.tag}`);
          } catch (error) {
            await channel.send(`Failed to accept ${username} into the Roblox group: ${error.message}`);
          }
        });
  
        await interaction.followUp({ content: `Request for ${username} has been posted.`, ephemeral: true });
  
      } else if (commandName === 'freeagent') {
        const username = options.getString('username');
        const position = options.getString('position');
        const information = options.getString('information') || 'No additional information provided';
        const channel = client.channels.cache.get(process.env.FREEAGENCY_CHANNEL_ID);
  
        if (!channel) throw new Error('Free agency channel not found');
  
        const embed = new EmbedBuilder()
          .setTitle('Free Agent Announcement')
          .setDescription(`User: ${username}\nPosition: ${position}\nInformation: ${information}`)
          .setColor('#FFA500');
  
        await channel.send({ embeds: [embed] });
        await interaction.followUp({ content: `Free agent announcement for ${username} has been posted.`, ephemeral: true });
  
      } else if (commandName === 'scouting') {
        if (!interaction.member.roles.cache.has(process.env.SPECIFIC_ROLE_ID)) {
          return interaction.followUp({ content: 'You do not have permission to use this command.', ephemeral: true });
        }
  
        const teamName = options.getString('teamname');
        const positionsNeeded = options.getString('positionsneeded');
        const channel = client.channels.cache.get(process.env.SCOUTING_CHANNEL_ID);
  
        if (!channel) throw new Error('Scouting channel not found');
  
        const embed = new EmbedBuilder()
          .setTitle('Scouting')
          .setDescription(`Team: ${teamName}\nPositions Needed: ${positionsNeeded}`)
          .setColor('#0000FF');
  
        await channel.send({ embeds: [embed] });
        await interaction.followUp({ content: `Scouting request for ${teamName} has been posted.`, ephemeral: true });
  
      } else if (commandName === 'friendly') {
        if (!interaction.member.roles.cache.has(process.env.SPECIFIC_ROLE_ID)) {
          return interaction.followUp({ content: 'You do not have permission to use this command.', ephemeral: true });
        }
  
        const description = options.getString('description');
        const channel = client.channels.cache.get(process.env.FRIENDLY_CHANNEL_ID);
        const managerMention = `<@${interaction.user.id}>`; // Mention the user who used the command
  
        if (!channel) throw new Error('Friendly match channel not found');
  
        const embed = new EmbedBuilder()
          .setTitle('Friendly Match')
          .setDescription(`${managerMention}\n${description}`)
          .setColor('#FF0000');
  
        const role = interaction.guild.roles.cache.get(process.env.SPECIFIC_ROLE_ID);
        await channel.send({ content: `${role}`, embeds: [embed] });
        await interaction.followUp({ content: `Friendly match announcement has been posted.`, ephemeral: true });
  
      } else if (commandName === 'contract') {
        const user = options.getUser('user');
        const role = options.getString('role');
        const team = options.getString('team');
        const channel = client.channels.cache.get(process.env.CONTRACT_CHANNEL_ID);
  
        if (!channel) throw new Error('Contract channel not found');
  
        const embed = new EmbedBuilder()
          .setTitle('Agreement Contract')
          .setDescription(`By signing this agreement, you commit to joining and faithfully supporting the Contractor and their team throughout the entire tournament, while performing to the best of your abilities.\n\nSignee: ${user}\nContractor: ${interaction.user}\nContract ID: ${Date.now()}\nTeam: ${team}\nPosition: ${role}\nRole: rotational`)
          .setColor('#00FFFF');
  
        const row = new ActionRowBuilder()
          .addComponents(
            new ButtonBuilder()
              .setCustomId('accept')
              .setLabel('Accept')
              .setStyle(ButtonStyle.Success),
            new ButtonBuilder()
              .setCustomId('decline')
              .setLabel('Decline')
              .setStyle(ButtonStyle.Danger)
          );
  
        const msg = await channel.send({ embeds: [embed], components: [row] });
  
        const filter = i => i.customId === 'accept' || i.customId === 'decline';
        const collector = msg.createMessageComponentCollector({ filter, time: 60000 });
  
        collector.on('collect', async i => {
          if (i.customId === 'accept') {
            await i.reply(`${user}, your contract has been accepted.`);
          } else {
            await i.reply(`${user}, your contract has been declined.`);
          }
        });
  
        collector.on('end', collected => console.log(`Collected ${collected.size} interactions.`));
        await interaction.followUp({ content: `Contract request for ${user} has been posted.`, ephemeral: true });
      }
    } catch (error) {
      console.error(error);
      await interaction.followUp({ content: 'An error occurred while processing your request.', ephemeral: true });
    }
  });
  
  login();
  
  /**
   ██████╗░████████╗██╗░░██╗           
   ██╔══██╗╚══██╔══╝╚██╗██╔╝          
   ██████╔╝░░░██║░░░░╚███╔╝░          
   ██╔══██╗░░░██║░░░░██╔██╗░          
   ██║░░██║░░░██║░░░██╔╝╚██╗          
   ╚═╝░░╚═╝░░░╚═╝░░░╚═╝░░╚═╝          
  GIT : https://github.com/RTX-GAMINGG/Bot-ghost-status-remover-by-RTX
    DISCORD SERVER : https://discord.gg/FUEHs7RCqz
    YOUTUBE : https://www.youtube.com/channel/UCPbAvYWBgnYhliJa1BIrv0A
   * **********************************************
   *   Code by RTX GAMING
   * **********************************************
   */
  
