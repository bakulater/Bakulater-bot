// I am from belgium so if i send you this to check if something is wrong because i can't find it this is for a dutch server
const discord = require("discord.js");
const botConfig = require("./botconfig.json")

const bot = new discord.Client();


bot.on("ready", async () => {

    console.log(`${bot.user.username} is single and ready to mingle!`)

    bot.user.setActivity("-help voor commands", { type: "PLAYING" });

});


bot.on("message", async message => {

    //if bot sends the message then do return.
    if (message.author.bot) return;

    if (message.channel.type === "dm") return;

    var prefix = botConfig.prefix;

    var messageArray = message.content.split(" ");

    var command = messageArray[0];

    var arguments = messageArray.slice(1);

    if (command === `${prefix}info`) {

        var botIcon = bot.user.displayAvatarURL;

        var botEmbed = new discord.RichEmbed()
            .setDescription("Discord bot info")
            .setColor("#de0000")
            .setThumbnail(botIcon)
            .addField("Bot naam", bot.user.username)
            .addField("Bot status: Kan niet 24/7 online zijn voorlopig!")
            .addField("Gemaakt op", bot.user.createdAt);

        return message.channel.send(botEmbed);

    }

    if (command === `${prefix}serverinfo`) {

        var serverIcon = message.guild.iconURL;

        var serverEmbed = new discord.RichEmbed()
            .setDescription("Server info")
            .setColor("#de0000")
            .setThumbnail(serverIcon)
            .addField("Server naam", message.guild.name)
            .addField("Je bent gejoined op", message.member.joinedAt)
            .addField("Totaal members", message.guild.memberCount);

        return message.channel.send(serverEmbed);

    }

    if (command === `${prefix}kick`) {

        // ~kick @user reason here.

        message.delete();

        var kickUser = message.guild.member(message.mentions.users.first() || message.guild.members(arguments[0]));

        if (!kickUser) return message.channel.send("Gebruiker is niet gevonden!");

        var reason = arguments.join(" ").slice(22);

        if (!message.member.hasPermission("KICK_MEMBERS")) return message.channel.send("Je hebt geen toestemming!").then(msg => msg.delete(2000));

        if (kickUser.hasPermission("KICK_MEMBERS")) return message.channel.send("Je kan deze gebruiker niet kicken");

        var kick = new discord.RichEmbed()
            .setDescription("Kick")
            .setColor("#de0000")
            .addField("Gekickte gebruiker", kickUser)
            .addField("Gekickt door", message.author)
            .addField("Reden", reason);

        var kickChannel = message.guild.channels.find(`name`, "straffen");
        if (!kickChannel) return message.guild.send("Kan het kanaal niet vinden");

        message.guild.member(kickUser).kick(reason);

        kickChannel.send(kick)

        return;

    }

    if (command === `${prefix}ban`) {

        // ~ban @user reason here.

        message.delete();

        var banUser = message.guild.member(message.mentions.users.first() || message.guild.members(arguments[0]));

        if (!banUser) return message.channel.send("Gebruiker is niet gevonden!");

        var reason = arguments.join(" ").slice(22);

        if (!message.member.hasPermission("BAN_MEMBERS")) return message.channel.send("Je hebt geen toestemming!").then(msg => msg.delete(2000));

        if (banUser.hasPermission("BAN_MEMBERS")) return message.channel.send("Je kan deze gebruiker niet bannen");

        var ban = new discord.RichEmbed()
            .setDescription("ban")
            .setColor("#de0000")
            .addField("Gebande gebruiker", banUser)
            .addField("Geband door", message.author)
            .addField("Reden", reason);

        var banChannel = message.guild.channels.find(`name`, "straffen");
        if (!banChannel) return message.guild.send("Kan het kanaal niet vinden");

        message.guild.member(banUser).ban(reason);

        banChannel.send(ban)

        return;

    }

    if (command === `${prefix}clear`) {

        //if people dont have permission manage messages then return: you do not have permission!
        //if you type the prefix and just randomly type a word it replies with "Geef een aantal op" Dutch for insert an amount

        if (!message.member.hasPermission("MANAGE_MESSAGES")) return message.channel.send(" Je hebt geen toestemming!").then(msg => msg.delete(2000));

        if (!arguments[0]) return message.channel.send("Geef een aantal op.")

        if (Number.isInteger(parseInt(arguments[0]))) {

            var amount = parseInt(arguments[0]) + 1;

            message.channel.bulkDelete(amount).then(() => {

                message.channel.send(`Ik heb ${arguments[0]} bericht(en) verwijderd.`).then(msg => msg.delete(2000));

            });

        } else {
            return message.channel.send("Geef een aantal op.");
        }
    }

    if (command === `${prefix}mededeling`) {

        if (!message.member.hasPermission("ADMINISTRATOR")) return message.channel.send("Je hebt geen toestemming!").then(msg => msg.delete(2000));

        message.delete();

        var splitter = "//";

        if (arguments[0] == null) {

            var useMessage = new discord.RichEmbed()
                .setTitle("Gebruik")
                .setColor("#00ee00")
                .setDescription(`Maak een mededeling door gebruik te maken van: \n ~mededeling Titel ${splitter} Bericht ${splitter} Kleur ${splitter} Kanaal`);

            return message.channel.send(useMessage);

        }

        arguments = arguments.join(" ").split(splitter);

        if (arguments[2] == undefined) arguments[2] = "#de0000";
        if (arguments[3] == undefined) arguments[3] = "algemeen";

        var options = {

            titel: arguments[0] || "Melding",
            bericht: arguments[1] || "Geen inhoud opgegeven!",
            kleur: arguments[2].trim(),
            kanaal: arguments[3].trim()

        }

        var announcer = message.author;

        var announcementEmbed = new discord.RichEmbed()
            .setTitle(options.titel)
            .setColor(options.kleur)
            .setDescription(`Bericht van ${announcer} \n\n ${options.bericht}`)
            .setTimestamp();

        var announcementChannel = message.guild.channels.find(`name`, options.kanaal);
        if (!announcementChannel) return message.channel.send("Kan het kanaal niet vinden");

        announcementChannel.send(announcementEmbed)

    }

    if (command === `${prefix}rapporteer`) {

        if (!arguments[0]) return message.channel.send(`Gebruik commando als volgt: ${prefix}rapporteer gebruikersnaam reden`);

        var user = message.guild.member(message.mentions.users.first());

        if (!user) return message.channel.send(`Speler niet gevonden!`);

        var reason = arguments.join(" ").slice(22);

        if (!reason) return message.channel.send(`Gelieve een reden op te geven`);

        var reportEmbed = new discord.RichEmbed()
            .setDescription("Reports")
            .setColor("ff0000")
            .addField("Reported gebruiker", `${user} met het ID ${user.id}`)
            .addField("Report door", `${message.author} met het ID ${message.author.id}`)
            .addField("Reden", reason)
            .setFooter(message.createdAt);

        var reportChannel = message.guild.channels.find("name", "reports");
        if (!reportChannel) return message.channel.send("Kanaal niet gevonden");

        message.delete();

        return reportChannel.send(reportEmbed);

    }

    if (command === `${prefix}regels`) {

        if (!message.member.hasPermission("ADMINISTRATOR")) return message.channel.send("Je hebt geen toestemming!").then(msg => msg.delete(2000));

        return message.channel.send("**Regels**: \n\n 1. **Praat/typ in de juiste kanalen** \n\n 2. **Heb respect voor een ander** \n (geaardheid, religie, levensovertuiging, politieke gezindheid, burgelijke staat, leeftijd, geslacht, ziekte(s), huidskleur, nationaliteit, afkomst, thuissituatie ect) \n\n 3. **Schelden is niet toegestaan** \n\n 4.**Racisme is niet toegestaan. Dit wordt om geen enkele omstandigheid getolereerd** \n\n 5. **Haat/dreigen is niet toegestaan. Dit wordt om geen enkele omstandigheid getolereerd** \n (Zorg ervoor dat je geen persoonlijk aanvallende berichten/media stuurt) \n\n 6. **Promotie op de server is niet toegestaan** \n\n 7 .**Gebruik #commands    voor commando's** \n\n 8. **Gebruik geen ongepaste gebruikersnamen** \n\n 9. **Het taggen van staffleden is niet toegestaan** \n\n Waarschuwingen + straf \n 3 = Kick \n 5 = ban \n\n ```De regels kunnen altijd veranderd worden```")

    }

    if (command === `${prefix}help`) {

        message.delete();

        return message.channel.send(" ``` -info \n (Met deze command krijg je info over de bot.) \n\n -serverinfo \n (Met deze command krijg je info over de server.) \n\n -kick \n (Met deze command kun je leden kicken als je er de toestemming voor hebt) \n\n -ban \n (Met deze command kun je leden bannen als je er de toestemming voor hebt.) \n\n -clear \n (Met deze command kun je berichten verwijderen als je daar de toestemming voor hebt.) \n\n -mededeling \n (Met deze command kan staff een mededeling maken.) \n\n -rapporteer \n (Met deze command kan je gebruikers rapporteren voor schelden,dreigen etc. doe -rapporteer voor meer info.) \n\n -ping \n (Met deze command kun je zien hoe hoog je ping is.)``` ");

    }

    if (command === `${prefix}informatie`) {

        if (!message.member.hasPermission("ADMINISTRATOR")) return message.channel.send("Je hebt geen toestemming!").then(msg => msg.delete(2000));

        return message.channel.send("《 @everyone 》\n Welkom op onze Gaming/Development Discord. \n Maak kennis met andere developers en maak vrienden!");

    }

    if (command === `${prefix}ping`) {

        message.delete();

        message.channel.send("Pong: " + (Date.now() - message.createdTimestamp) + "ms").then(msg => msg.delete(2000));

    }

});


bot.login(process.env.token);