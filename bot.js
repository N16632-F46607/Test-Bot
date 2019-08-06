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
var data = require('./data.json');

var messagePurpose = '';
var skdValue = '';

/**
 * El evento ready es vital, sólamente _después_ de este tu bot podrá empezar a reaccionar
 * a la información recibida de Discord
 */
client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    client.user.setActivity("Hello World!");
});

// Crea un event listener para los mensajes
client.on('message', message => {
	if (!(message.channel.type === 'dm')) {
		
		setLastCommandRequested('');
	}
	// Si no se utiliza el prefijo se ignora el mensaje
	if (!message.content.startsWith(prefix)) return;
	message.content = message.content.toLowerCase().substring(prefix.length);

	if (message.channel.type === 'text') {

		if (message.content === 'help') {
			const embed = new RichEmbed()
				.setTitle('📄 Lista de Comandos:')
				.setDescription('`' + prefix + 'dahir`: Contador de expulsiones del Dahir \n'
							  + '`' + prefix + 'sdk #`: Establece el contador de expulsiones al número escrito')
				.setColor(0x1a1c2e)
			message.channel.send(embed);
		} else

	  	if (message.content === 'dahir') {
			const embed = new RichEmbed()
				.setTitle('Dahir')
				.setDescription('Expulsado: ' + getKicksQty() + ' Veces!')
				.setColor(0xe62c44);
			message.channel.send(embed);
		} else

		if (message.content.startsWith('sdk')) {
			if (!(message.content.match(new RegExp('sdk [0-9]+$', 'i')))) return;
			setLastCommandRequested('sdk');
			skdValue = message.content.substring(4);
			const embed = new RichEmbed()
				.setTitle('🔒 Autorización Requerida')
				.setDescription('Para ejecutar el comando: `' + prefix + getLastCommandRequested() + '` '
								+ 'es requerida una contraseña.\n'
								+ '`' + prefix + 'pass`: Comando para la contraseña')
				.setColor(0x1a1c2e);
			message.author.send(embed);
		}
	} else

	if (message.channel.type === 'dm') {
		if (message.content.startsWith('pass')) {
			if (getLastCommandRequested() === 'sdk') {
				if (message.content.substring(5) === 'nimda') {
					message.react('✔');
					setKicksQty(skdValue);
					setLastCommandRequested('');
				} else {
					message.react('✖');
				}
			}
		}
	}
});

// Crea un event listener para las expulsiones
client.on('guildMemberRemove', member => {
	// Si es el Dahir
	if (member.user.id == '307592698385399810') {
		// Lo suma al contador
		setKicksQty(getKicksQty() + 1);
	}
	// En cualquier caso envía un mensaje de despedida
	client.channels.get('470938434500820996').send('Al rato @' + member.user.username + '!');
});

// Logea al bot utilizando el token del archivo auth.json de https://discordapp.com/developers/applications/me
client.login(process.env.BOT_TOKEN);

//Funciones

function getKicksQty() {
	return data.banCount;
}

function setKicksQty(quantity) {
	data = { banCount: quantity };
	fs.writeFile('./data.json', JSON.stringify(data, null, 4), err => { 
		if (err) throw err;
	});
}

function getLastCommandRequested() {
	return messagePurpose;
}

function setLastCommandRequested(command) {
	messagePurpose = command.substring(command.indexOf(prefix) + 1);
}
