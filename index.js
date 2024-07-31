const { 
  Client, 
  GatewayIntentBits, 
  REST, 
  Routes, 
  SlashCommandBuilder, 
  ActivityType, 
  ActionRowBuilder, 
  ButtonBuilder, 
  ButtonStyle, 
  TextChannel, 
  PermissionsBitField 
} = require('discord.js');
const noblox = require('noblox.js');
require('dotenv').config();
const express = require('express');
const fs = require('fs');
const path = require('path');

const client = new Client({ 
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.DirectMessages, GatewayIntentBits.MessageReactions] 
});

const token = process.env.TOKEN;
const clientId = '1261242922557247489';
const guildId = '1260910227155325010';
const robloxCookie = process.env.ROBLOX_COOKIE; // Use an environment variable for security
const groupId = 32304173; // PRL Professional Roblox League group ID

const usedFriendlyCommand = new Set();

const statusMessages = ["Over VRS", "Over VRS"];
let currentIndex = 0;
const port = 3000;
const app = express();

// Express server setup
app.get('/', (req, res) => {
  res.send('YaY Your Bot Status Changed✨');
});

app.listen(port, () => {
  console.log(`🔗 Listening to RTX: http://localhost:${port}`);
  console.log(`🔗 Powered By RTX`);
});

// Noblox setup
async function startApp() {
  await noblox.setCookie(robloxCookie);
  console.log('Logged into Roblox!');
}

startApp();

// Discord bot setup
client.once('ready', () => {
  console.log('Ready!');
  client.user.setActivity('Over VRS', { type: ActivityType.Watching });
  updateStatusAndSendMessages();
  setInterval(updateStatusAndSendMessages, 10000);
});

const commands = [
  new SlashCommandBuilder().setName('ping').setDescription('Replies with Pong!'),
  new SlashCommandBuilder().setName('freeagent')
    .setDescription('Submit a free agent application.')
    .addStringOption(option => option.setName('username').setDescription('Your username').setRequired(true))
    .addStringOption(option => option.setName('position').setDescription('Position you are applying for').setRequired(true))
    .addStringOption(option => option.setName('about').setDescription('About you').setRequired(true)),
  new SlashCommandBuilder().setName('sign')
    .setDescription('Sign a user to a team.')
    .addUserOption(option => option.setName('user').setDescription('The user to sign').setRequired(true))
    .addStringOption(option => option.setName('teamname').setDescription('The team name').setRequired(true)),
  new SlashCommandBuilder().setName('request')
    .setDescription('Request to join the league.')
    .addStringOption(option => option.setName('username').setDescription('Your username').setRequired(true))
    .addStringOption(option => option.setName('past_experiences').setDescription('Your past experiences').setRequired(true))
    .addStringOption(option => option.setName('how_did_you_find_the_league').setDescription('How did you find the league').setRequired(true)),
  new SlashCommandBuilder().setName('friendly')
    .setDescription('Post a friendly request.')
    .addStringOption(option => option.setName('team_name').setDescription('The team name').setRequired(true))
    .addStringOption(option => option.setName('information').setDescription('Information about the request').setRequired(true)),
  new SlashCommandBuilder().setName('scrim')
    .setDescription('Post a scrim request.')
    .addStringOption(option => option.setName('hoster').setDescription('The hoster').setRequired(true))
    .addStringOption(option => option.setName('details').setDescription('Details of the scrim').setRequired(true))
].map(command => command.toJSON());

const rest = new REST({ version: '10' }).setToken(token);

(async () => {
  try {
    console.log('Started refreshing application (/) commands.');
    await rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands });
    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error(error);
  }
})();

client.on('interactionCreate', async interaction => {
  if (!interaction.isCommand()) return;

  const { commandName } = interaction;

  if (commandName === 'ping') {
    await interaction.reply('Pong!');
  } else if (commandName === 'freeagent') {
    const username = interaction.options.getString('username');
    const position = interaction.options.getString('position');
    const about = interaction.options.getString('about');

    const embed = {
      color: 0x0099ff,
      title: 'Free Agent Application',
      fields: [
        { name: 'Username', value: username },
        { name: 'Position', value: position },
        { name: 'About Me', value: about },
      ],
      timestamp: new Date(),
      footer: {
        text: 'Free Agent Application',
      },
    };

    const channel = client.channels.cache.get('1260910228031930455');
    if (channel) {
      await channel.send({ embeds: [embed] });
      await interaction.reply('Your free agent application has been submitted.');
    } else {
      await interaction.reply('Failed to find the channel.');
    }
  } else if (commandName === 'sign') {
    const user = interaction.options.getUser('user');
    const teamName = interaction.options.getString('teamname');

    const embed = {
      color: 0x0099ff,
      title: 'New Sign',
      fields: [
        { name: 'User', value: user.tag },
        { name: 'Team Name', value: teamName },
      ],
      timestamp: new Date(),
      footer: {
        text: 'New Sign',
      },
    };

    const channel = client.channels.cache.get('1260910228031930455');
    if (channel) {
      await channel.send({ embeds: [embed] });
      await interaction.reply(`Signed ${user.tag} to ${teamName}.`);
    } else {
      await interaction.reply('Failed to find the channel.');
    }
  } else if (commandName === 'request') {
    const username = interaction.options.getString('username');
    const pastExperiences = interaction.options.getString('past_experiences');
    const howDidYouFindTheLeague = interaction.options.getString('how_did_you_find_the_league');

    const embed = {
      color: 0x0099ff,
      title: 'Request to Join League',
      fields: [
        { name: 'Username', value: username },
        { name: 'Past Experiences', value: pastExperiences },
        { name: 'How did you find the league?', value: howDidYouFindTheLeague },
      ],
      timestamp: new Date(),
      footer: {
        text: 'Request to Join League',
      },
    };

    const channel = client.channels.cache.get('1260910228031930455');
    if (channel) {
      await channel.send({ embeds: [embed] });
      await interaction.reply('Your request to join the league has been submitted.');
    } else {
      await interaction.reply('Failed to find the channel.');
    }
  } else if (commandName === 'friendly') {
    const teamName = interaction.options.getString('team_name');
    const information = interaction.options.getString('information');

    if (usedFriendlyCommand.has(interaction.user.id)) {
      await interaction.reply('You can only use this command once per 24 hours.');
    } else {
      usedFriendlyCommand.add(interaction.user.id);
      setTimeout(() => usedFriendlyCommand.delete(interaction.user.id), 24 * 60 * 60 * 1000);

      const embed = {
        color: 0x0099ff,
        title: 'Friendly Request',
        fields: [
          { name: 'Team Name', value: teamName },
          { name: 'Information', value: information },
        ],
        timestamp: new Date(),
        footer: {
          text: 'Friendly Request',
        },
      };

      const channel = client.channels.cache.get('1260910228031930458');
      if (channel) {
        await channel.send({ embeds: [embed] });
        await interaction.reply('Your friendly request has been submitted.');
      } else {
        await interaction.reply('Failed to find the channel.');
      }
    }
  } else if (commandName === 'scrim') {
    const hoster = interaction.options.getString('hoster');
    const details = interaction.options.getString('details');

    const specificRole = '1262465654317908060'; // Replace with the role ID
    const pingRole = '1260910227155325018'; // Replace with the role ID

    if (!interaction.member.roles.cache.has(specificRole)) {
      await interaction.reply({ content: 'You do not have the required role to use this command.', ephemeral: true });
      return;
    }

    const embed = {
      color: 0x0099ff,
      title: 'Scrim Request',
      fields: [
        { name: 'Hoster', value: hoster },
        { name: 'Details', value: details },
      ],
      timestamp: new Date(),
      footer: {
        text: 'Scrim Request',
      },
    };

    const channel = client.channels.cache.get('1260910228199968901'); // Replace with your specific channel ID
    if (channel) {
      const message = await channel.send({ content: `<@&${pingRole}>`, embeds: [embed] });
      await interaction.reply('Your scrim request has been submitted.');

      await message.react('✅');
      await message.react('❌');

      const filter = (reaction, user) => ['✅', '❌'].includes(reaction.emoji.name) && !user.bot;

      const collector = message.createReactionCollector({ filter, time: 60000 });

      collector.on('collect', async (reaction, user) => {
        if (reaction.emoji.name === '✅') {
          await channel.send(`Scrim request accepted by ${user.tag}`);
        } else if (reaction.emoji.name === '❌') {
          await channel.send(`Scrim request rejected by ${user.tag}`);
        }
      });

      collector.on('end', collected => {
        console.log(`Collected ${collected.size} reactions.`);
      });
    } else {
      await interaction.reply('Failed to find the channel.');
    }
  }
});

function updateStatusAndSendMessages() {
  client.user.setActivity(statusMessages[currentIndex], { type: ActivityType.Watching });
  console.log(`Bot status changed to: ${statusMessages[currentIndex]}`);
  currentIndex = (currentIndex + 1) % statusMessages.length;
}

client.login(token);
