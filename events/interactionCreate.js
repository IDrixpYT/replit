const { EmbedBuilder, Collection, PermissionsBitField } = require('discord.js');
const ms = require('ms');
const client = require('..');
const config = require('../config.json');
const chalk = require('chalk');
const { channel } = require('diagnostics_channel');

const cooldown = new Collection();

client.on('interactionCreate', async interaction => {
	const slashCommand = client.slashCommands.get(interaction.commandName);
		if (interaction.type == 4) {
			if(slashCommand.autocomplete) {
				const choices = [];
				await slashCommand.autocomplete(interaction, choices)
			}
		}
		if (!interaction.type == 2) return;
	
		if(!slashCommand) return client.slashCommands.delete(interaction.commandName);
		try {
			if (slashCommand.ownerOnly === true && interaction.user.id != "659117023502270474") {
				return interaction.reply({content: `Owner only command.`, ephemeral: true}).then(console.log(`${interaction.user.tag} tried using a ownerOnly Command!\nCMD:${slashCommand.name}`))
			}
			if(slashCommand.cooldown) {
				if(cooldown.has(`slash-${slashCommand.name}${interaction.user.id}`)) return interaction.reply({ content: config.messages["COOLDOWN_MESSAGE"].replace('<duration>', ms(cooldown.get(`slash-${slashCommand.name}${interaction.user.id}`) - Date.now(), {long : true}) ) })
				if(slashCommand.userPerms || slashCommand.botPerms) {
					if(!interaction.memberPermissions.has(PermissionsBitField.resolve(slashCommand.userPerms || []))) {
						const userPerms = new EmbedBuilder()
						.setDescription(`${interaction.user}, You don't have \`${slashCommand.userPerms}\` permissions to use this command!`)
						.setColor('Red')
						return interaction.reply({ embeds: [userPerms], ephemeral: true })
					}
					if(!interaction.guild.members.cache.get(client.user.id).permissions.has(PermissionsBitField.resolve(slashCommand.botPerms || []))) {
						const botPerms = new EmbedBuilder()
						.setDescription(`${interaction.user}, I don't have \`${slashCommand.botPerms}\` permissions to use this command!`)
						.setColor('Red')
						return interaction.reply({ embeds: [botPerms] })
					}

				}

					await slashCommand.run(client, interaction, channel);
					const logs = client.channels.cache.get("1026979134448091256")
					const newSlashCmd = new EmbedBuilder() 
					.setTitle(`Slash Command Used`)
					.setDescription(`Command: ${slashCommand.name}\nUser: **${interaction.user.tag}** | **${interaction.user.id}**\nChannel: **${interaction.channel.name}** | **${interaction.channel.id}**\nGuild: **${interaction.guild.name}** | **${interaction.guild.id}**`)
					.setColor(`Blue`)
					.setThumbnail(interaction.user.displayAvatarURL({dynamic: true}))
					.setTimestamp();
					logs.send({embeds: [newSlashCmd]});
					console.log(chalk.blue(`USER: ${interaction.user.tag}`))
					console.log(chalk.yellow(`Command: ${slashCommand.name}`))
					console.log(chalk.greenBright(`Channel: #${interaction.channel.name} | ${interaction.channel.id}\nGUILD: ${interaction.guild.name} | ${interaction.guild.id}`))
					cooldown.set(`slash-${slashCommand.name}${interaction.user.id}`, Date.now() + slashCommand.cooldown)
					setTimeout(() => {
							cooldown.delete(`slash-${slashCommand.name}${interaction.user.id}`)
					}, slashCommand.cooldown)
			} else {
				if(slashCommand.userPerms || slashCommand.botPerms) {
					if(!interaction.memberPermissions.has(PermissionsBitField.resolve(slashCommand.userPerms || []))) {
						const userPerms = new EmbedBuilder()
						.setDescription(`${interaction.user}, You don't have \`${slashCommand.userPerms}\` permissions to use this command!`)
						.setColor('Red')
						return interaction.reply({ embeds: [userPerms], ephemeral: true })
					}
					if(!interaction.guild.members.cache.get(client.user.id).permissions.has(PermissionsBitField.resolve(slashCommand.botPerms || []))) {
						const botPerms = new EmbedBuilder()
						.setDescription(`${interaction.user}, I don't have \`${slashCommand.botPerms}\` permissions to use this command!`)
						.setColor('Red')
						return interaction.reply({ embeds: [botPerms] })
					}

				}
					await slashCommand.run(client, interaction);
			}
		} catch (error) {
			const log = client.channels.cache.get("1026979134448091256")
			var contentMsg = "Error has occured! <@659117023502270474>";
			if (interaction.user.id === "659117023502270474") {
				contentMsg = "Error but its just drip who executed the cmd"
			}
				const errorEmbed = new EmbedBuilder()
				.setTitle(`404 Error!`)
				.setDescription(`${error}\nCommand: **${slashCommand.name}**\nExecuted by: **${interaction.user.tag}** | **${interaction.user.id}**`)
				.setColor(`Red`)
				log.send({content: contentMsg, embeds: [errorEmbed]})
				console.log(error);
		}
});