const Discord = require('discord.js');
const client = new Discord.Client({partials: ["MESSAGE", "USER", "REACTION"]});
const enmap = require('enmap');
const {token, prefix} = require('./config.json')

client.login("Nzg0MDgwMDI0MTM4Njc4MzI0.X8kFbQ.7TzU8Tdm99RruB7aSIIqio_Ttds");

const settings = new enmap({
    name: "settings",
    autoFetch: true,
    cloneLevel: "deep",
    fetchAll: true
});

const StatusList = [
    `Vrijdag Opening!! 19:00 `, 
    `Checking Tickets 🎫 | GezeikNetwork✔`,
    `Gezeik| https://discord.gg/aVHue988`,
    `GezeikNetwork Loading... `
    ];

client.on('ready', async () => {
    console.log('Ticket-Star is online')
setInterval(() => {
    const index = Math.floor(Math.random() * (StatusList.length - 1) + 1); 
    client.user.setActivity(StatusList[index]);
}, 30000); // Runs this every 60 seconds.
});

client.on('message', async message => {
    if(message.author.bot) return;
    if(message.content.indexOf(prefix) !== 0) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    if(command == "ticket-setup") {
        // ticket-setup #channel

        let channel = message.mentions.channels.first();
        if(!channel) return message.reply("Usage: `!ticket-setup #channel`");

        let sent = await channel.send(new Discord.MessageEmbed()
            .setTitle("Klik op een Emoji om een Ticket te Openen!")
            .setDescription("👥 | Partners \n ❓ | Vragen \n 🛒 | Shopping \n 📰 | Sollicitatie's \n 🎫 | Andere")
            .setFooter("GezeikNetwork")
            .setColor("00ff00")

        );
                sent.react('👥')
                sent.react('❓')
                sent.react('🛒')
                sent.react('📰')
                sent.react('🎫')

            settings.set(`${message.guild.id}-ticket`, sent.id);
        
            message.channel.send("Ticket Setup Done ✅ \n```GezeikNetwork``` ");

    }

    if (command == "close") {
        if(!message.channel.name.includes("ticket-")) return message.channel.send("You can't use that here!")
        message.channel.delete();
    }
});
        client.on('messageReactionAdd', async (reaction, user) => {
            if (user.partial)
                await user.fetch();
            if (reaction.partial)
                await reaction.fetch();
            if (reaction.message.partial)
                await reaction.message.fetch();

            if (user.bot)
                return;

            let ticketid = await settings.get(`${reaction.message.guild.id}-ticket`);

            if (!ticketid) 
                return;

            if (reaction.message.id == ticketid && reaction.emoji.name == '👥') {
                reaction.users.remove(user);

                reaction.message.guild.channels.create(`ticket-partner-${user.username}`, {
                    permissionOverwrites: [
                        {
                            id: user.id,
                            allow: ["SEND_MESSAGES", "VIEW_CHANNEL"]
                        },
                        {
                            id: reaction.message.guild.roles.everyone,
                            deny: ["VIEW_CHANNEL"]
                        },
                    ],
                    type: 'text'
                }).then(async (channel) => {
                    channel.send(`<@${user.id}>`, new Discord.MessageEmbed().setTitle("Welcome in your Ticket!").setDescription("We will come to you as soon as possible. \n Find out which partner you can!").setColor("00ff00"));
                });
            }
            else if (reaction.message.id == ticketid && reaction.emoji.name == '❓') {
                reaction.users.remove(user);

                reaction.message.guild.channels.create(`ticket-question-${user.username}`, {
                    permissionOverwrites: [
                        {
                            id: user.id,
                            allow: ["SEND_MESSAGES", "VIEW_CHANNEL"]
                        },
                        {
                            id: reaction.message.guild.roles.everyone,
                            deny: ["VIEW_CHANNEL"]
                        }
                    ],
                    type: 'text'
                }).then(async (channel) => {
                    channel.send(`<@${user.id}>`, new Discord.MessageEmbed().setTitle("Welcome in your Ticket!").setDescription("We will come to you as soon as possible. \n Ask your question here!").setColor("00ff00"));
                });
            }
            else if (reaction.message.id == ticketid && reaction.emoji.name == '🛒') {
                reaction.users.remove(user);

                reaction.message.guild.channels.create(`ticket-shopping-${user.username}`, {
                    permissionOverwrites: [
                        {
                            id: user.id,
                            allow: ["SEND_MESSAGES", "VIEW_CHANNEL"]
                        },
                        {
                            id: reaction.message.guild.roles.everyone,
                            deny: ["VIEW_CHANNEL"]
                        },
                    ],
                    type: 'text'
                }).then(async (channel) => {
                    channel.send(`<@${user.id}>`, new Discord.MessageEmbed().setTitle("Welkom in je Ticket!").setDescription("Welcome in your Ticket!").setDescription("We will come to you as soon as possible. \n Say what you want to buy here!").setColor("00ff00"));
                });
            }
            else if (reaction.message.id == ticketid && reaction.emoji.name == '📰') {
                reaction.users.remove(user);

                reaction.message.guild.channels.create(`ticket-solli-${user.username}`, {
                    permissionOverwrites: [
                        {
                            id: user.id,
                            allow: ["SEND_MESSAGES", "VIEW_CHANNEL"]
                        },
                        {
                            id: reaction.message.guild.roles.everyone,
                            deny: ["VIEW_CHANNEL"]
                        },
                    ],
                    type: 'text'
                }).then(async (channel) => {
                    channel.send(`<@${user.id}>`, new Discord.MessageEmbed().setTitle("Welcome in your Ticket!").setDescription("We will come to you as soon as possible. \n State here what you want to apply for and write your application here!").setColor("00ff00"));
                });
            }
            else if (reaction.message.id == ticketid && reaction.emoji.name == '🎫') {
                reaction.users.remove(user);

                reaction.message.guild.channels.create(`ticket-andere-${user.username}`, {
                    permissionOverwrites: [
                        {
                            id: user.id,
                            allow: ["SEND_MESSAGES", "VIEW_CHANNEL"]
                        },
                        {
                            id: reaction.message.guild.roles.everyone,
                            deny: ["VIEW_CHANNEL"]
                        },
                    ],
                    type: 'text'
                }).then (async channel => {
                    channel.send(`<@${user.id}>`, new Discord.MessageEmbed().setTitle("Welcome in your Ticket!").setDescription("We will come to you as soon as possible. \n Specify here how we can help you!").setColor("00ff00"));
                })
            }
        });
        
        client.login(token);
