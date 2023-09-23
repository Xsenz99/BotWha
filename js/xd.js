require("../config/settings");
const {
  BufferJSON,
  WA_DEFAULT_EPHEMERAL,
  generateWAMessageFromContent,
  proto,
  generateWAMessageContent,
  generateWAMessage,
  prepareWAMessageMedia,
  areJidsSameUser,
  getContentType,
} = require("@adiwajshing/baileys");
const fs = require("fs");
const cheerio = require("cheerio");
const chalk = require("chalk");
const crypto = require("crypto");
const { exec, spawn, execSync } = require("child_process");
const axios = require("axios");
const moment = require("moment-timezone");
const fetch = require("node-fetch");
const Jimp = require("jimp");
const util = require("util");
const { sizeFormatter } = require("human-readable");
const format = sizeFormatter();
const { color, bgcolor, mycolor } = require("./lib/color");
const anon = require("./lib/menfess");
const {
  imageToWebp,
  videoToWebp,
  writeExifImg,
  writeExifVid,
} = require("./lib/exif");
const { TelegraPh, UploadFileUgu, AnonFiles } = require("./lib/uploader_Media");
const msgFilter = require("./lib/func_Spam");
const {
  smsg,
  makeid,
  formatp,
  tanggal,
  formatDate,
  getTime,
  isUrl,
  sleep,
  clockString,
  runtime,
  fetchJson,
  getBuffer,
  jsonformat,
  parseMention,
  getRandom,
} = require("./lib/functions");
module.exports = xd = async (xd, m, chatUpdate, store) => {
  try {
    const body =
      m.mtype === "conversation"
        ? m.message.conversation
        : m.mtype == "imageMessage"
        ? m.message.imageMessage.caption
        : m.mtype == "videoMessage"
        ? m.message.videoMessage.caption
        : m.mtype == "extendedTextMessage"
        ? m.message.extendedTextMessage.text
        : m.mtype == "buttonsResponseMessage"
        ? m.message.buttonsResponseMessage.selectedButtonId
        : m.mtype == "listResponseMessage"
        ? m.message.listResponseMessage.singleSelectReply.selectedRowId
        : m.mtype == "templateButtonReplyMessage"
        ? m.message.templateButtonReplyMessage.selectedId
        : m.mtype === "messageContextInfo"
        ? m.message.buttonsResponseMessage?.selectedButtonId ||
          m.message.listResponseMessage?.singleSelectReply.selectedRowId ||
          m.text
        : "";
    const budy = typeof m.text == "string" ? m.text : "";
    const prefix = /^[°#*+,.?=''():√%!¢£¥€π¤ΠΦ_&`™©®Δ^βα¦|/\\©^]/.test(body)
      ? body.match(/^[°#*+,.?=''():√%¢£¥€π¤ΠΦ_&!`™©®Δ^βα¦|/\\©^]/gi)
      : ".";
    const chath =
      m.mtype === "conversation" && m.message.conversation
        ? m.message.conversation
        : m.mtype == "imageMessage" && m.message.imageMessage.caption
        ? m.message.imageMessage.caption
        : m.mtype == "documentMessage" && m.message.documentMessage.caption
        ? m.message.documentMessage.caption
        : m.mtype == "videoMessage" && m.message.videoMessage.caption
        ? m.message.videoMessage.caption
        : m.mtype == "extendedTextMessage" && m.message.extendedTextMessage.text
        ? m.message.extendedTextMessage.text
        : m.mtype == "buttonsResponseMessage" &&
          m.message.buttonsResponseMessage.selectedButtonId
        ? m.message.buttonsResponseMessage.selectedButtonId
        : m.mtype == "templateButtonReplyMessage" &&
          m.message.templateButtonReplyMessage.selectedId
        ? m.message.templateButtonReplyMessage.selectedId
        : m.mtype == "listResponseMessage"
        ? m.message.listResponseMessage.singleSelectReply.selectedRowId
        : m.mtype == "messageContextInfo"
        ? m.message.listResponseMessage.singleSelectReply.selectedRowId
        : "";
    const content = JSON.stringify(m.message);
    const { type, quotedMsg, mentioned, now, fromMe } = m;
    const from = m.key.remoteJid;
    const command = body
      .replace(prefix, "")
      .trim()
      .split(/ +/)
      .shift()
      .toLowerCase();
    const args = body.trim().split(/ +/).slice(1);
    const pushname = m.pushName || "No Name";
    const botNumber = await xd.decodeJid(xd.user.id);
    const isCreator = [botNumber, ...global.owner]
      .map((v) => v.replace(/[^0-9]/g, "") + "@s.whatsapp.net")
      .includes(m.sender);
    const itsMe = m.sender == botNumber ? true : false;
    const text = (q = args.join(" "));
    const quoted = m.quoted ? m.quoted : m;
    const mime = (quoted.msg || quoted).mimetype || "";
    const isMedia = /image|video|sticker|audio/.test(mime);
    const { chats } = m;
    // db
    let orang_spam = [];
    const antilink = JSON.parse(fs.readFileSync("./js/db/antilink.json"));
    const owner = JSON.parse(
      fs.readFileSync("./js/db/premium.json").toString()
    );
    const pler = JSON.parse(fs.readFileSync("./js/db/idgrup.json").toString());
    //pisah
    const isAntiLink = m.isGroup ? antilink.includes(m.chat) : false;
    const tanggal = moment.tz("Asia/Jakarta").format("DD/MM/YY");
    const isGroup = m.key.remoteJid.endsWith("@g.us");
    const sender = m.isGroup
      ? m.key.participant
        ? m.key.participant
        : m.participant
      : m.key.remoteJid;
    const groupMetadata = m.isGroup
      ? await xd.groupMetadata(m.chat).catch((e) => {})
      : "";
    const isPremium = [botNumber, ...owner]
      .map((v) => v.replace(/[^0-9]/g, "") + "@s.whatsapp.net")
      .includes(m.sender);
    const groupName = m.isGroup ? groupMetadata.subject : "";
    const participants = m.isGroup ? await groupMetadata.participants : "";
    const groupAdmins = m.isGroup
      ? await participants.filter((v) => v.admin !== null).map((v) => v.id)
      : "";
    const groupOwner = m.isGroup ? groupMetadata.owner : "";
    const groupMembers = m.isGroup ? groupMetadata.participants : "";
    const isBotAdmins = m.isGroup ? groupAdmins.includes(botNumber) : false;
    const isGroupAdmins = m.isGroup ? groupAdmins.includes(m.sender) : false;
    const isAdmins = m.isGroup ? groupAdmins.includes(m.sender) : false;
    const jangan = m.isGroup ? pler.includes(m.chat) : false;
    const isCommand = body.startsWith(prefix);
    const isCmd = isCommand
      ? body.slice(1).trim().split(/ +/).shift().toLowerCase()
      : null;

    if (!xd.public) {
      if (!m.key.fromMe) return;
    }

    // auto read
    xd.readMessages([m.key]);
    // auto ketik
    await xd.sendPresenceUpdate("composing", from);
    if (isCmd && m.isGroup) {
      console.log(
        chalk.bold.rgb(
          255,
          178,
          102
        )("\x1b[1;31m~\x1b[1;37m> [\x1b[1;32mCMD\x1b[1;37m]"),
        chalk.bold.rgb(153, 255, 153)(command),
        chalk.bold.rgb(204, 204, 0)("from"),
        chalk.bold.rgb(153, 255, 204)(pushname),
        chalk.bold.rgb(204, 204, 0)("in"),
        chalk.bold.rgb(255, 178, 102)("Group Chat"),
        chalk.bold("[" + args.length + "]")
      );
    }
    if (isCmd && !m.isGroup) {
      console.log(
        chalk.bold.rgb(
          255,
          178,
          102
        )("\x1b[1;31m~\x1b[1;37m> [\x1b[1;32mCMD\x1b[1;37m]"),
        chalk.bold.rgb(153, 255, 153)(command),
        chalk.bold.rgb(204, 204, 0)("from"),
        chalk.bold.rgb(153, 255, 204)(pushname),
        chalk.bold.rgb(204, 204, 0)("in"),
        chalk.bold.rgb(255, 178, 102)("Private Chat"),
        chalk.bold("[" + args.length + "]")
      );
    }

    try {
      ppuser = await xd.profilePictureUrl(m.sender, "image");
    } catch (err) {
      ppuser =
        "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png?q=60";
    }
    ppnyauser = await getBuffer(ppuser);

    const generateProfilePicture = async (buffer) => {
      const jimp_1 = await Jimp.read(buffer);
      const resz =
        jimp_1.getWidth() > jimp_1.getHeight()
          ? jimp_1.resize(550, Jimp.AUTO)
          : jimp_1.resize(Jimp.AUTO, 650);
      const jimp_2 = await Jimp.read(await resz.getBufferAsync(Jimp.MIME_JPEG));
      return {
        img: await resz.getBufferAsync(Jimp.MIME_JPEG),
      };
    };
    // anti spam

    //api
    var lolnya = await fetchJson(
      "https://apinya.xd-team-botz.repl.co/lol.json"
    );
    var lolkey = lolnya.result;
    // waktu
    var ase = new Date();
    var jamss = ase.getHours();
    switch (jamss) {
      case 0:
        jamss = "Malam";
        break;
      case 1:
        jamss = "Malam";
        break;
      case 2:
        jamss = "Malam";
        break;
      case 3:
        jamss = "Pagi 🌔";
        break;
      case 4:
        jamss = "Pagi🌔";
        break;
      case 5:
        jamss = "Pagi 🌄";
        break;
      case 6:
        jamss = "Pagi 🌄";
        break;
      case 7:
        jamss = "Pagi 🌄";
        break;
      case 8:
        jamss = "Pagi ☀️";
        break;
      case 9:
        jamss = "Pagi ☀️";
        break;
      case 10:
        jamss = "Pagi ☀️";
        break;
      case 11:
        jamss = "Siang 🌞";
        break;
      case 12:
        jamss = "Siang 🌞";
        break;
      case 13:
        jamss = "Siang 🌞";
        break;
      case 14:
        jamss = "Siang 🌞";
        break;
      case 15:
        jamss = "Siang🌞";
        break;
      case 16:
        jamss = "Sore ☀️";
        break;
      case 17:
        jamss = "Sore 🌄";
        break;
      case 18:
        jamss = "Sore 🌄";
        break;
      case 19:
        jamss = "Malam 🌙";
        break;
      case 20:
        jamss = "Malam 🌙";
        break;
      case 21:
        jamss = "Malam 🌙";
        break;
      case 22:
        jamss = "Malam 🌙";
        break;
      case 23:
        jamss = "Malam 🌚";
        break;
    }
    var tampilUcapan = "" + jamss;
    const jmn = moment.tz("Asia/Jakarta").format("HH:mm:ss");
    let d = new Date();
    let locale = "id";
    let gmt = new Date(0).getTime() - new Date("1 januari 2021").getTime();
    const weton = ["Pahing", "Pon", "Wage", "Kliwon", "Legi"][
      Math.floor((d * 1 + gmt) / 84600000) % 5
    ];
    const week = d.toLocaleDateString(locale, { weekday: "long" });
    const calender = d.toLocaleDateString(locale, {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    const time2 = moment().tz("Asia/Jakarta").format("HH:mm:ss");
    if (time2 < "23:59:00") {
      var imageTime = await getBuffer(
        "https://i.pinimg.com/736x/27/ee/27/27ee271709bdb24d555b2dd3de796f93.jpg"
      );
    }
    if (time2 < "19:00:00") {
      var imageTime = await getBuffer(
        "https://i.pinimg.com/736x/27/ee/27/27ee271709bdb24d555b2dd3de796f93.jpg"
      );
    }
    if (time2 < "18:00:00") {
      var imageTime = await getBuffer(
        "https://i.pinimg.com/736x/81/08/7b/81087b2e732dc0e25d8875b135d579b9.jpg"
      );
    }
    if (time2 < "15:00:00") {
      var imageTime = await getBuffer(
        "https://i.pinimg.com/736x/81/98/aa/8198aaf07083fc9939deb0c3c5c3716c.jpg"
      );
    }
    if (time2 < "11:00:00") {
      var imageTime = await getBuffer(
        "https://i.pinimg.com/736x/81/98/aa/8198aaf07083fc9939deb0c3c5c3716c.jpg"
      );
    }
    if (time2 < "06:00:00") {
      var imageTime = await getBuffer(
        "https://i.pinimg.com/736x/15/8e/ea/158eea299c01433aae6744599d2fdc3a.jpg"
      );
    }

    //
    // antilink
    if (isAntiLink)
      if (budy.includes("https://", "http://")) {
        if (!isAdmins) {
          await xd.sendMessage(
            m.chat,
            { text: "Link Detected Anda Akan Terkick Dalam 3detik" },
            { quoted: m }
          );
          await sleep(3000);
          xd.groupParticipantsUpdate(from, [sender], "remove");
        }
      }

    const vcard =
      "BEGIN:VCARD\n" + // metadata of the contact card
      "VERSION:3.0\n" +
      "FN:OWNER\n" +
      "ORG:" +
      global.author +
      "\n" + // the organization of the contact
      "TEL;type=CELL;type=VOICE;waid=" +
      global.owner +
      ":+" +
      global.owner +
      "\n" + // WhatsApp ID + phone number
      "END:VCARD";

    // Function for Anti Spam
    msgFilter.ResetSpam(orang_spam);

    const spampm = () => {
      console.log(
        color("~>[SPAM DETECTED]", "red"),
        color(
          moment(m.messageTimestamp * 1000).format("DD/MM/YY HH:mm:ss"),
          "yellow"
        ),
        color(`${command} [${args.length}]`),
        "from",
        color(pushname)
      );
      msgFilter.addSpam(sender, orang_spam);
      tspm1 = `[SPAM DETECTED]
Tunggu Beberapa Detik...`;
      xd.sendMessage(from, { text: tspm1 }, { quoted: m });
    };
    const spamgr = () => {
      console.log(
        color("~>[SPAM DETECTED]", "red"),
        color(
          moment(m.messageTimestamp * 1000).format("DD/MM/YY HH:mm:ss"),
          "yellow"
        ),
        color(`${command} [${args.length}]`),
        "from",
        color(pushname),
        "in",
        color(groupName)
      );
      msgFilter.addSpam(sender, orang_spam);
      tspm2 = `[SPAM DETECTED]
Tunggu Beberapa Detik...`;
      xd.sendMessage(from, { text: tspm2 }, { quoted: m });
    };

    if (isCmd && msgFilter.isFiltered(sender) && !isGroup) return spampm();
    if (isCmd && msgFilter.isFiltered(sender) && isGroup) return spamgr();
    if (isCmd && args.length < 1 && !isCreator && !isPremium)
      msgFilter.addFilter(sender);

    pritprit = `sepertinya kamu belum daftar premium
silahkan beli premium ke owner harga 3k
keuntungan premium:
1. unlock all fitur
2. pakai bot sesuka hati
3. tanpa jeda


`;
    switch (command) {
      // menu

      case "menu":
      case "p":
      case "halo":
        {
          if (jangan) return;
          if (!isCommand) return;
          ptir = "```";
          picnya = global.pic;
          await sleep(1000);
          menutext = `${ptir}*──────❲ ${global.namabot} ❳──────*

╭─⬣「 USER INFO 」⬣
│• ID : @${sender.split("@")[0]}
│• Nama : ${pushname}
│• Premium Status : ${isPremium ? "👑" : "🆓"}
│• Bot Version : 5
╰─⬣

╭─⬣「 𝗚𝗥𝗢𝗨𝗣 𝗠𝗘𝗡𝗨 」⬣
│➥⬣${prefix}antilink on/off
│➥⬣${prefix}mute on/off
│➥⬣${prefix}linkgc
│➥⬣${prefix}open
│➥⬣${prefix}close
│➥⬣${prefix}kick
│➥⬣${prefix}add
│➥⬣${prefix}promote
│➥⬣${prefix}demote
│➥⬣${prefix}tagall
│➥⬣${prefix}demote
│➥⬣${prefix}allchat
╰─⬣
╭─⬣「 𝗦𝗧𝗜𝗖𝗞𝗘𝗥 𝗠𝗘𝗡𝗨 」⬣
│➥⬣${prefix}stiker
│➥⬣${prefix}stikerwm
│➥⬣${prefix}toimage
│➥⬣${prefix}smeme
╰─⬣

RULES : 

1. Dilarang Spam Bot
2. Dilarang Call/Vc Bot
╰─⬣
${ptir}`;

          xd.sendMessage(m.chat, {
            image: { url: picnya },
            caption: menutext,
          });
        }
        break;
      case "hargaprem":
        {
          m.reply(`Premium Hanya 3k
  keuntungan premium:
1. unlock all fitur
2. pakai bot sesuka hati
3. tanpa jeda

minat chat owner`);
        }
        break;
    
      // group area
      case "add":
        {
          if (jangan) return;
          if (!isCommand) return;
          if (!isCreator) return m.reply(`fitur ini khusus developer bot saja`);
          if (!isGroup) return m.reply(`digrup bang`);
          if (!isBotAdmins) return m.reply(`Adminin dlu bjir`);
          if (!isGroupAdmins) return;
        
            return xd.sendMessage(m.chat, { text: pritprit }, { quoted: m });
          let users = m.quoted
            ? m.quoted.sender
            : text.replace(/[^0-9]/g, "") + "@s.whatsapp.net";
          await xd
            .groupParticipantsUpdate(m.chat, [users], "add")
            .then((res) => m.reply(jsonformat(res)))
            .catch((err) => m.reply(jsonformat(err)));
        }
        break;
      case "kick":
        if (jangan) return;
        if (!isCommand) return;
        if (!q) return m.reply(`Tag Orangnya`);
        {
          if (!isCreator) return m.reply(`fitur ini khusus developer bot saja`);
          if (!isGroup) return m.reply(`digrup bang`);
          if (!isBotAdmins) return m.reply(`Adminin dlu bjir`);
          if (!isGroupAdmins) return;
        
            return xd.sendMessage(m.chat, { text: pritprit }, { quoted: m });
          m.reply(`otw kick`);
          await sleep(2000);
          let users = m.mentionedJid[0]
            ? m.mentionedJid[0]
            : m.quoted
            ? m.quoted.sender
            : text.replace(/[^0-9]/g, "") + "@s.whatsapp.net";
          await xd
            .groupParticipantsUpdate(m.chat, [users], "remove")
            .then((res) => m.reply(`DONE`));
        }
        break;
      case "promote":
        {
          if (jangan) return;
          if (!isCommand) return;
          if (!q) return m.reply(`Tag Orangnya`);
          if (!isGroup) return m.reply(`digrup bang`);
          if (!isBotAdmins) return m.reply(`Adminin dlu bjir`);
          if (!isGroupAdmins) return;
        
            return xd.sendMessage(m.chat, { text: pritprit }, { quoted: m });
          let users = m.mentionedJid[0]
            ? m.mentionedJid[0]
            : m.quoted
            ? m.quoted.sender
            : text.replace(/[^0-9]/g, "") + "@s.whatsapp.net";
          await xd
            .groupParticipantsUpdate(m.chat, [users], "promote")
            .then((res) =>
              m.reply("SUCCES MEMBUAT " + users + " MENJADI ADMIN")
            );
        }
        break;
      case "demote":
        {
          if (jangan) return;
          if (!isCommand) return;
          if (!q) return m.reply(`Tag Orangnya`);
          if (!isGroup) return m.reply(`digrup bang`);
          if (!isBotAdmins) return m.reply(`Adminin dlu bjir`);
          if (!isGroupAdmins) return;
        
            return xd.sendMessage(m.chat, { text: pritprit }, { quoted: m });
          let users = m.mentionedJid[0]
            ? m.mentionedJid[0]
            : m.quoted
            ? m.quoted.sender
            : text.replace(/[^0-9]/g, "") + "@s.whatsapp.net";
          await xd
            .groupParticipantsUpdate(m.chat, [users], "demote")
            .then((res) =>
              m.reply("SUCCES MEMBUAT " + users + " MENJADI NON ADMIN")
            );
        }
        break;
      case "allchat":
        {
          if (jangan) return;
          if (!isCommand) return;
          if (!isCreator) return;
          if (!isGroup) return m.reply(`digrup bang`);
          if (!q) return m.reply(`text?`);
        
            return xd.sendMessage(m.chat, { text: pritprit }, { quoted: m });
          let mem = await participants
            .filter((v) => v.id.endsWith(".net"))
            .map((v) => v.id);
          for (let pler of mem) {
            xd.sendMessage(pler, { text: q });
          }

          m.reply(`succes push`);
        }
        break;
      case "tagall":
        {
          if (jangan) return;
          if (!isCommand) return;
          if (!isGroup) return m.reply(`digrup bang`);
          if (!isBotAdmins) return m.reply(`Adminin dlu bjir`);
          if (!isGroupAdmins) return;
        
            return xd.sendMessage(m.chat, { text: pritprit }, { quoted: m });
          let teks = `Tag all\n`;
          for (let mem of participants) {
            teks += `› @${mem.id.split("@")[0]}\n`;
          }
          xd.sendMessage(
            m.chat,
            { text: teks, mentions: participants.map((a) => a.id) },
            { quoted: m }
          );
        }
        break;
      case "hidetag":
      case "tag":
        {
          if (jangan) return;
          if (!isCommand) return;
          if (!isGroup) return m.reply(`digrup bang`);
          if (!isBotAdmins) return m.reply(`Adminin dlu bjir`);
          if (!isGroupAdmins) return;
        
            return xd.sendMessage(m.chat, { text: pritprit }, { quoted: m });
          xd.sendMessage(
            m.chat,
            { text: q ? q : "", mentions: participants.map((a) => a.id) },
            { quoted: m }
          );
        }
        break;

      case "linkgc":
        if (jangan) return;
        if (!isCommand) return;
        if (!isGroup) return m.reply(`digrup bang`);
        if (!isBotAdmins) return m.reply(`Adminin dlu bjir`);
        if (!isGroupAdmins) return m.reply(`lu siape?`);
      
          return xd.sendMessage(m.chat, { text: pritprit }, { quoted: m });
        var url = await xd
          .groupInviteCode(m.chat)
          .catch(() => m.reply(mess.error.api));
        url = "https://chat.whatsapp.com/" + url;
        m.reply(url);
        break;

      case "close":
        if (!isCommand) return;
        if (!isGroup) return m.reply(`digrup bang`);
        if (!isBotAdmins) return m.reply(`Adminin dlu bjir`);
        if (!isGroupAdmins) return m.reply(`lu siape?`);
      
          return xd.sendMessage(m.chat, { text: pritprit }, { quoted: m });
        xd.groupSettingUpdate(m.chat, "announcement");
        m.reply(`succes`);
        break;
      case "open":
        if (!isCommand) return;
        if (!isGroup) return m.reply(`digrup bang`);
        if (!isBotAdmins) return m.reply(`Adminin dlu bjir`);
        if (!isGroupAdmins) return m.reply(`lu siape?`);
      
          return xd.sendMessage(m.chat, { text: pritprit }, { quoted: m });
        xd.groupSettingUpdate(m.chat, "not_announcement");
        m.reply(`succes`);
        break;
      case "revoke":
        if (jangan) return;
        if (!isCommand) return;
        if (!isGroup) return m.reply(`digrup bang`);
        if (!isBotAdmins) return m.reply(`Adminin dlu bjir`);
        if (!isAdmins) return m.reply(`Khusus Admin`);
      
          return xd.sendMessage(m.chat, { text: pritprit }, { quoted: m });
        await xd
          .groupRevokeInvite(m.chat)
          .then((res) => {
            m.reply(`Sukses menyetel tautan undangan grup ini`);
          })
          .catch(() => m.reply(mess.error.api));
        break;
      case "mute":
        if (!isCommand) return;
        if (!q) return m.reply(`on/off ???`);
        if (!isGroup) return m.reply(`digrup bang`);
        if (!isBotAdmins) return m.reply(`Adminin dlu bjir`);
        if (!isAdmins) return m.reply(`Khusus Admin`);
      
          return xd.sendMessage(m.chat, { text: pritprit }, { quoted: m });
        if (args[0] === "on") {
          if (jangan) return m.reply("Sudah Aktif Kak");
          pler.push(m.chat);
          fs.writeFileSync("./js/db/idgrup.json", JSON.stringify(pler));
          m.reply("Sukses mengaktifkan fitur mute");
        } else if (args[0] === "off") {
          if (!jangan) return m.reply("Sudah Mati Kak");
          var ini = pler.indexOf(m.chat);
          pler.splice(ini, 1);
          fs.writeFileSync("./js/db/idgrup.json", JSON.stringify(pler));
          m.reply("Sukses menonaktifkan fitur mute");
        } else if (!q) {
          m.reply(`Pilih Mute On / Off `);
        }
        break;

      case "antilink":
        if (!isCommand) return;
        if (!q) return m.reply(`on/off ???`);
        if (!isGroup) return m.reply(`digrup bang`);
        if (!isBotAdmins) return m.reply(`Adminin dlu bjir`);
        if (!isAdmins) return m.reply(`Khusus Admin`);
      
          return xd.sendMessage(m.chat, { text: pritprit }, { quoted: m });
        if (args[0] === "on") {
          if (isAntiLink) return m.reply("Sudah Aktif Kak");
          antilink.push(m.chat);
          fs.writeFileSync("./js/db/antilink.json", JSON.stringify(antilink));
          m.reply("Sukses mengaktifkan fitur antilink");
          xd.sendMessage(m.chat, {
            text: `ALLERT!!! Group ini sudah di pasang anti link\nJika Kamu Melanggar Maka Akan Saya Tendang`,
          });
        } else if (args[0] === "off") {
          if (!isAntiLink) return m.reply("Sudah Mati Kak");
          var ini = antilink.indexOf(m.chat);
          antilink.splice(ini, 1);
          fs.writeFileSync("./js/db/antilink.json", JSON.stringify(antilink));
          m.reply("Sukses menonaktifkan fitur antilink");
        } else if (!q) {
          m.reply(`Pilih Antilink On / Off `);
        }
        break;
    
      case "setppbot":
        {
          if (!isCommand) return;
          if (!isCreator) return;
          if (!/image/.test(mime))
            return m.reply(
              `Kirim/Reply Image Dengan Caption ${prefix + command}`
            );
          if (/webp/.test(mime))
            return m.reply(
              `Kirim/Reply Image Dengan Caption ${prefix + command}`
            );
          var medis = await xd.downloadAndSaveMediaMessage(
            quoted,
            "ppbot.jpeg"
          );
          if (args[0] == `/full`) {
            var { img } = await generateProfilePicture(medis);
            await xd.query({
              tag: "iq",
              attrs: {
                to: botNumber,
                type: "set",
                xmlns: "w:profile:picture",
              },
              content: [
                {
                  tag: "picture",
                  attrs: { type: "image" },
                  content: img,
                },
              ],
            });
            fs.unlinkSync(medis);
            m.reply(`Sukses`);
          } else {
            var memeg = await xd.updateProfilePicture(botNumber, {
              url: medis,
            });
            fs.unlinkSync(medis);
            m.reply(`Sukses`);
          }
        }
        break;
      case "owner":
        if (jangan) return;
        if (!isCommand) return;
        xd.sendMessage(from, {
          contacts: {
            displayName: "Ini Adalah Contact Pembuat Bot Kak",
            contacts: [{ vcard }],
          },
        });
        break;

      // tools area

      // stiker area
      case "smeme":
      case "stikermeme":
        {
          if (jangan) return;
          if (!isCommand) return;
        
            return xd.sendMessage(m.chat, { text: pritprit }, { quoted: m });

          var atas = " ";
          var bawah = q.split("|")[0];
          if (!bawah) return m.reply(`text nya?`);
          var media = await xd.downloadAndSaveMediaMessage(
            quoted,
            "image",
            `./sticker/${sender.split("@")[0]}.jpg`
          );
          var media_url = (await UploadFileUgu(media)).url;
          var meme_jadi = `https://api.memegen.link/images/custom/${encodeURIComponent(
            atas
          )}/${encodeURIComponent(bawah)}.png?background=${media_url}`;
          xd.sendImageAsSticker(m.chat, meme_jadi, m, {
            packname: global.packname,
            author: global.author,
          });
        }
        break;
      case "toimg":
      case "toimage":
        {
        
            return xd.sendMessage(m.chat, { text: pritprit }, { quoted: m });
          if (jangan) return;
          if (!isCommand) return;
          if (!/webp/.test(mime))
            throw `balas stiker dengan caption *${prefix + command}*`;
          var media = await xd.downloadAndSaveMediaMessage(
            quoted,
            "webp",
            `./sticker/${sender.split("@")[0]}.webp`
          );
          var media_url = (await UploadFileUgu(media)).url;
          var meme_jadi = `https://api.memegen.link/images/custom/${encodeURIComponent(
            atas
          )}/${encodeURIComponent(bawah)}.png?background=${media_url}`;
          xd.sendMessage(m.chat, { image: { url: media_url } });
        }
        break;
      case "ttp6":
  

   

      case "stiker":
      case "sticker":
      case "s":
      case "stickergif":
      case "sgif":
        {
          {
            if (jangan) return;
            if (!isCommand) return;
            if (!quoted)
              return m.reply(
                `Kirim/Reply Image Dengan Caption ${prefix + command}`
              );
            if (/image/.test(mime)) {
              m.reply(`Tunggu Sebentar Ya...`);
              let media = await quoted.download();
              let encmedia = await xd.sendImageAsSticker(m.chat, media, m, {
                packname: global.packname,
                author: global.author,
              });
              await fs.unlinkSync(encmedia);
            } else if (/video/.test(mime)) {
              m.reply(`Tunggu Sebentar Ya...`);
              if ((quoted.m || quoted).seconds > 11)
                return m.reply("Maksimal 10 detik!");
              let media = await quoted.download();
              let encmedia = await xd.sendVideoAsSticker(m.chat, media, m, {
                packname: global.packname,
                author: global.author,
              });
              await fs.unlinkSync(encmedia);
            } else {
              throw `Kirim Gambar/Video Dengan Caption ${
                prefix + command
              }\nDurasi Video 1-9 Detik`;
            }
          }
        }
        break;
     
      case "stikerwm":
      case "swm":
      case "stickerwm":
        {
        
            return xd.sendMessage(m.chat, { text: pritprit }, { quoted: m });
          if (jangan) return;
          if (!isCommand) return;
          var pname = q.split("|")[0];
          var athor = q.split("|")[1];
          if (!quoted) return;
          if (/image/.test(mime)) {
            m.reply(`Tunggu Sebentar Ya...`);
            let media = await quoted.download();
            let encmedia = await xd.sendImageAsSticker(m.chat, media, m, {
              packname: pname,
              author: athor,
            });
            await fs.unlinkSync(encmedia);
          } else if (/video/.test(mime)) {
            m.reply(`Tunggu Sebentar Ya...`);
            if ((quoted.msg || quoted).seconds > 11)
              return m.reply("Maksimal 10 detik!");
            let media = await quoted.download();
            let encmedia = await xd.sendVideoAsSticker(m.chat, media, m, {
              packname: athor,
              author: athor,
            });
            await fs.unlinkSync(encmedia);
          } else {
            throw `Kirim Gambar/Video Dengan Caption ${
              prefix + command
            }\nDurasi Video 1-9 Detik`;
          }
        }

        break;
      
      

      default:
    }
    if (budy.startsWith(">")) {
      if (!isCreator)
        return m.reply(`Maaf Command Tersebut Khusus Developer Bot WhatsApp`);
      try {
        let evaled = await eval(budy.slice(2));
        if (typeof evaled !== "string")
          evaled = require("util").inspect(evaled);
        await m.reply(evaled);
      } catch (err) {
        m.reply(String(err));
      }
    }
  } catch (err) {
    m.reply(util.format(err));
  }
};

let file = require.resolve(__filename);
fs.watchFile(file, () => {
  fs.unwatchFile(file);
  console.log(chalk.yellowBright(`Update File Terbaru ${__filename}`));
  delete require.cache[file];
  require(file);
});
