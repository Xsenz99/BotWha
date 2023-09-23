const fs = require("fs");
const chalk = require("chalk");
// EDIT DISINI
global.owner = ["6281264116045"]; // no own
global.author = "SENZ OFC"; // nama author
global.packname = "xsenz99"; // nama pack sticker
global.namabot = "JAJAN FOLLOWERS"; // nama bot mu
global.group = "https://chat.whatsapp.com/IJqUorim1oJ4kziHcf7xH5"; // grup mu
global.pic = "https://f.top4top.io/p_2806ayrui0.png"; // logo lu

let file = require.resolve(__filename);
fs.watchFile(file, () => {
  fs.unwatchFile(file);
  console.log(chalk.yellowBright(`Update File Terbaru ${__filename}`));
  delete require.cache[file];
  require(file);
});
