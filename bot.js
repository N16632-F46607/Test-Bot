// Archivo de donde el Token será tomado
const auth = require('./auth.json');
// Importa el modulo discord.js
const Discord = require('discord.js');
// Crea una instancia de un cliente de Discord
const client = new Discord.Client();
// Extrae las clases requeridas del modulo discord.js
const { Client, RichEmbed } = require('discord.js');

// Atributos (Otros)

// Prefijo para los comandos
const prefix = '|';
// Importa el modulo de File System para escribir, leer, abrir, cerrar archivos
const fs = require ('fs');
// Datos/Valores almacenados en el archivo data.json
const value = require('./data.json');
// Contador de baneos
var count = value.banCount;

/**
 * The ready event is vital, it means that only _after_ this will your bot start reacting to information
 * received from Discord
 */
client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    client.user.setActivity("Hello World!");
});

// Crea un event listener para los mensajes
client.on('message', message => {
	// Si no se utiliza el prefijo se ignora el mensaje
	if (!message.content.startsWith(prefix)) return;
	message.content = message.content.substring(prefix.length);

  	if (message.content.toLowerCase() === 'help') {
		const embed = new RichEmbed()
			.setTitle('Lista de Comandos:')
			.setColor(0x1a1c2e)
			.setDescription(prefix + 'dahir: Contador de expulsiones del Dahir \n' +
				prefix + 'sdk #: Establece el contador de expulsiones al número escrito');
		message.channel.send(embed);
	} else

  	if (message.content.toLowerCase() === 'dahir') {
		const embed = new RichEmbed()
			.setTitle('Dahir')
			.setColor(0xe62c44)
			.setDescription('Expulsado: ' + count + ' Veces!');
		message.channel.send(embed);
	} else

	if (message.content.toLowerCase().startsWith('sdk ')) {
		if (isNaN(message.content.substring(4)) || message.content.substring(4) === '' || message.content.substring(4).startsWith('-')) {
			message.channel.send('Error!');
			return;
		} else {
			count = message.content.substring(4);
			let data = { 
				banCount: count
			};
			fs.writeFile('./data.json', JSON.stringify(data, null, 4), (err) => { 
				if (err) throw err;
			});
			message.channel.send('Listo!')
		}
	}
});

// Crea un event listener para las expulsiones
client.on('guildMemberRemove', member => {
	// Si es el Dahir
	if (member.user.discriminator == '4811') {
		// Lo suma al contador
		count += 1;
		let data = { 
			banCount: count
		};
		// Y lo almacena en el archivo data.json
		fs.writeFile('./data.json', JSON.stringify(data, null, 4), (err) => { 
			if (err) throw err;
		});
	}
	// En cualquier caso envía una despedida
	client.channels.get('602945989556305970').send('Al rato @' + member.user.username + '!');
});

// Logea al bot utilizando el token del archivo auth.json de https://discordapp.com/developers/applications/me
client.login(process.env.BOT_TOKEN);
