const Discord = require("discord.js");
const fs = require("fs");

let config = fs.readFileSync("./config.json", "utf8");
config = JSON.parse(config);
console.log(config);

const client = new Discord.Client();

const channelId = config.channelId;
const route = config.route;
const interestedList = config.interested;

function choseMove() {
  return "ff";
}

client.on("ready", () => {
  const channel = client.channels.get(channelId);
  channel.send(`.route ${route}`);
});

client.on("message", (message) => {
  if (message.channel.id == channelId) {
    if (message.author.username == "Myuu") {
      let text = "";
      let description = "";
      let footer = "";
      let header;
      message.embeds.forEach((embed) => {
        if (embed.text != undefined) {
          text = embed.text;
        }
        if (embed.description != undefined) {
          description = embed.description;
        }
        if (embed.footer != undefined) {
          footer = embed.footer.text;
        }

        if (embed.author != undefined) {
          if (embed.author.name != undefined) {
            header = embed.author.name;
          }
        }

        // console.log(embed);
      });

      let info = header + text + description + footer;
      let count = 0;
      for (let i = 0; i < info.length; i++) {
        if (info[i] == "*") {
          count += 1;
        }
      }

      for (let i = 0; i < count; i++) {
        info = info.replace("*", "");
      }

      if (
        info.includes("It was so close!") ||
        info.includes("It almost appeared to be caught!")
      ) {
        setTimeout(() => {
          message.channel.send(config.found);
        }, 5000);
      }

      if (info.includes("A wild Lv")) {
        let pokemon = info.split("A wild Lv")[1];
        pokemon = pokemon.split("appeared")[0];
        let lvl = pokemon.split(" ")[0];
        pokemon = pokemon.split(" ")[1];
        console.log(pokemon);
        console.log(lvl);
        let interested = false;
        let shiny = false;
        if (count % 2 != 0) {
          shiny = true;
          intersted = true;
        }
        if (interestedList.includes(pokemon)) {
          interested = true;
        }

        if (interested) {
          if (config.found == "ping") {
            message.channel.send(
              client.user.toString() +
                ` a${shiny ? "Shiny" : " "}lvl ${lvl} ${pokemon} has appeared`
            );
          } else {
            message.channel.send(config.found);
          }
        } else {
          message.channel.send(choseMove());
        }
      } else if (
        info.includes("You've won the") ||
        info.includes(" fled the battle successfully") ||
        info.includes("You have caught a")
      ) {
        setTimeout(() => {
          message.channel.send(".route " + route);
        }, 1500);
      } else if (
        footer.includes("Type a number from 1 - 8 or the text shown")
      ) {
        let pokemon;
        let interested = false;
        if (header != undefined) {
          pokemon = header.split(" ​ ​​")[1];
        }
        if (pokemon != undefined) {
          if (interestedList.includes(pokemon)) {
            interested = true;
          }
          if (count % 2 != 0) {
            interested = true;
          }
        }

        if (interested == false) {
          setTimeout(() => {
            message.channel.send(choseMove());
          }, 1500);
        }
      } else if (footer.includes("Type a Pokémon's name to swap to.")) {
        let pokemonDescription = description;
        pokemonDescription = pokemonDescription.split("\n");
        let pkList = [];
        pokemonDescription.forEach((poke) => {
          if (poke.includes("( FNT )") == false) {
            poke = poke.split(" ")[1];
            poke = poke.split(" ")[0];
            pkList.push(poke);
          }
        });
        let chosenPk = pkList[Math.floor(Math.random() * pkList.length)];
        message.channel.send(chosenPk);
      }
    }
  }
});

client.on("messageUpdate", (oldMessage, newMessage) => {
  if (newMessage.channel.id == config.channelId) {
    newMessage.embeds.forEach((e) => {
      if (e.description != undefined) {
        if (
          e.description.includes("Oh no! The Pokémon broke free!") ||
          e.description.includes("Aargh! Almost had it!") ||
          e.description.includes("Aww! It almost appeared to be caught!")
        ) {
          setTimeout(() => {
            newMessage.channel.send(config.found);
          }, 5000);
        }
      }
    });
  }
});

client.login(config.token);
