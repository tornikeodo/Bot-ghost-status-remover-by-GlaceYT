const { Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder, ActivityType, ActionRowBuilder, ButtonBuilder, ButtonStyle, TextChannel, PermissionsBitField } = require('discord.js');
const noblox = require('noblox.js');
require('dotenv').config();
const express = require('express');
const fs = require('fs');
const path = require('path');

const client = new Client({ 
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.DirectMessages] 
});

const token = process.env.TOKEN;
const clientId = '1261242922557247489';
const guildId = '1260910227155325010';
const robloxCookie = '_|WARNING:-DO-NOT-SHARE-THIS.--Sharing-this-will-allow-someone-to-log-in-as-you-and-to-steal-your-ROBUX-and-items.|_0AC6CD4DBDEEDBF0461AACA59D4C2A14CA57144820FF4DFFB8E0B3D16CDF32FAA49EFC0274FAB00436D740F776553E3DF905E1B45F914097233D584623AD7C48CF5660171AA85142BD81328E0E02014AAA1E78E75E27572595552CDABC3B80F82B173C573FA39B1BB7E43AFB3263B7023A53951F90A3FCC1E350257F82C903A8460B6DA5B1F47069278A0645CA83292DF62A080B1A832341DE0CD3D33270DF3172781F3E0018AB73410820CF78BCA6E46C97E6C691E28CD0080CACCEBD7AC00A100B5A161C8D77EEF98BC4DA971F4EA9C0CA2C389EAA1D693A60AEAE788B21A1000E0DCB1EFFA1DF8D70393E53B3A091E21EA2A0FDF0275B59B2A1B0BE9DD2359F7D49C2DBB508D96AB7CCF4BC5F80B1FF30A45AE7081D540F087F48EBBBEADB1D1ACB22805ABC118155929EE2528D3BC1AC5E9F7C23517DC6F0C504FD31CFF2D52C3463A844D5EC75EFC7FC38D5EC956B260A2683529A8D099EC2885D5AE133F0E07E66713DF0FF208B0D9EC6287A3B6BB203A8FB8EE71D604EDD768CBA3528733DEFAD39A6C440665BDC9EA22A462301AED6DD78E0393951D0D3ACE5B8C7D40C6BEE9CFDFF5320540D2EF2FEFC19118FF72E61EC0BC3C31C9B6DF710E3DA847FBAAC0B02709BEFCB5B73452E590AF707A0E4B8676B5A93E36B157598120A854B5419054A767B310C81F74235672A9B8EA2D75BFF1AAB3AA55D68D37B6FAB6B47E03F9728CE1CBACCF400A8A418F5BF690F273B23BBFBFC2BCAC6F17B7A24D45E5F6436D471F4F92CFCC17DEA0DFB183FFFB93F393D5A437B40699B6BF3BDA0663F920F5FB424C640C8A0D730C51BF4C8A7ECCFADDD7F76932154D2949073B4D709F7D7896EBBA55CA6326E0FA19FD3F07CF7412BCC30FC22E081036953C5520D2A86627319FA45F823E9C79AF613EF62AEF0571DE0E8E19E0CF071B95F9AE14FD8E700BF240BDC8E46F4121E309C26AC5C6BBC80EF84332668D09C8D3F276F064856BF2E3767DA07AE30383E8E654AAF5DCAF08AB830E581F51163BFF71F0D411F9CA443F4989A397BAA45ACB124274D973867EA8386A16807DD49C4E30532E6307B04'; // Use an environment variable for security
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
    .addStringOption(option => option.setName('servername').setDescription('the name of the server').setRequired(true))
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

        await interaction.deferReply({ ephemeral: true });

        const embed = {
            color: 0x0000ff,
            title: 'League Request',
            fields: [
                { name: 'Username', value: username },
                { name: 'Past Experiences', value: pastExperiences },
                { name: 'How did you find the league?', value: howDidYouFindTheLeague },
            ],
            timestamp: new Date(),
            footer: {
                text: 'League Request',
            },
        };

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('accept')
                    .setLabel('✅')
                    .setStyle(ButtonStyle.Success),
                new ButtonBuilder()
                    .setCustomId('reject')
                    .setLabel('❌')
                    .setStyle(ButtonStyle.Danger)
            );

        const channel = client.channels.cache.get('1260910227696390192');
        if (channel) {
            const message = await channel.send({ embeds: [embed], components: [row] });
            await interaction.editReply({ content: 'Request sent!', ephemeral: true });

            const filter = i => i.customId === 'accept' || i.customId === 'reject';
            const collector = message.createMessageComponentCollector({ filter, time: 60000 });

            collector.on('collect', async i => {
                if (i.customId === 'accept') {
                    try {
                        const users = await noblox.getJoinRequests(groupId);
                        const userRequest = users.data.find(user => user.requester.username === username);
                        if (userRequest) {
                            await noblox.handleJoinRequest(groupId, userRequest.requester.userId, true);
                            await i.deferUpdate();
                            await interaction.user.send('You have been accepted to the group!');
                        } else {
                            await i.update({ content: 'User not found in join requests.', ephemeral: true });
                        }
                    } catch (error) {
                        console.error(error);
                        await i.update({ content: 'An error occurred while accepting the request.', ephemeral: true });
                    }
                } else if (i.customId === 'reject') {
                    await i.deferUpdate();
                    await interaction.user.send('You have been rejected from the group!');
                }
            });

            collector.on('end', collected => {
                console.log(`Collected ${collected.size} interactions.`);
            });
        } else {
            await interaction.editReply({ content: 'Failed to find the specified channel.', ephemeral: true });
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
    const servername = interaction.options.getString('servername');
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
        { name: 'Server Name', value: servername },
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
  
      // Send a message with the link in the same channel
      const link = 'https://www.roblox.com/games/14824351179/VRS-Hub'; // Replace with your actual link
      await channel.send(`Match Pitch: ${link}`);

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
