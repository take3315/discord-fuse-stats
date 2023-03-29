require('dotenv').config();
const apiKey = process.env.API;
const BOTtoken = process.env.BOTtoken;

const { SlashCommandBuilder } = require('@discordjs/builders'); 
const { REST } = require('@discordjs/rest'); 
const { Routes } = require('discord-api-types/v9'); 
const client_id  = process.env.client_id;
const guild_id = process.env.guild_id;

const commands = [
    new SlashCommandBuilder().setName('fuse').setDescription('Fuse pool 102 stats'), 
]
    .map(command => command.toJSON());

const rest = new REST({ version: '9' }).setToken(BOTtoken);

rest.put(Routes.applicationGuildCommands(client_id, guild_id), { body: commands }) 
    .then(() => console.log('Successfully registered application commands.'))
    .catch(console.error)