const fs = require('fs').promises;
require('dotenv').config();
const BOTtoken = process.env.BOTtoken;
const apiKey = process.env.API;
const { Client, GatewayIntentBits } = require('discord.js')
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
    ]
});
const ABI = require("./abi/abi.json");
const ABIcomptroller = require("./abi/abicomptroller.json");
const ADDRESS = ["0x6d8260fff752ba01bcf76c919e9e3d328971152e", "0x35036a4b7b012331f23f2945c08a5274ced38ac2"];
const Web3 = require("web3");
const web3 = new Web3("https://mainnet.infura.io/v3/" + apiKey);

async function getdata() {
    const fETHcontract = new web3.eth.Contract(ABI, ADDRESS[0]);
    const fUSDCcontract = new web3.eth.Contract(ABI, ADDRESS[1]);
    const comptroller = new web3.eth.Contract(ABIcomptroller, "0xADE98A1a7cA184E886Ab4968e96DbCBEe48D9596");
    
    const symbolETH = await fETHcontract.methods.symbol().call();
    const decimalsETH = await fETHcontract.methods.decimals().call();
    const exchangeRateCurrentETH = await fETHcontract.methods.exchangeRateCurrent().call();
    const totalBorrowsCurrentETH = await fETHcontract.methods.totalBorrowsCurrent().call();
    const totalSupplyETH = await fETHcontract.methods.totalSupply().call();
    const borrowcapETH = await comptroller.methods.borrowCaps(ADDRESS[0]).call();
    const borrowcapUSDC = await comptroller.methods.borrowCaps(ADDRESS[1]).call();

    const symbolUSDC = await fUSDCcontract.methods.symbol().call();
    const decimalsUSDC = await fUSDCcontract.methods.decimals().call();
    const exchangeRateCurrentUSDC = await fUSDCcontract.methods.exchangeRateCurrent().call();
    const totalBorrowsCurrentUSDC = await fUSDCcontract.methods.totalBorrowsCurrent().call();
    const totalSupplyUSDC = await fUSDCcontract.methods.totalSupply().call();

    const oneCTETH = exchangeRateCurrentETH / 10 ** 18;
    const supplyETH = totalSupplyETH / 10 ** decimalsETH * oneCTETH;
    const borrowETH = totalBorrowsCurrentETH / 10 ** decimalsETH;
    const utilETH = borrowETH / supplyETH * 100
    const oldcapETH = borrowcapETH / 10 ** decimalsETH;
    const capETH = supplyETH * 0.8;

    const oneCTUSDC = exchangeRateCurrentUSDC / 10 ** 18;
    const supplyUSDC = totalSupplyUSDC / 10 ** decimalsUSDC * oneCTUSDC;
    const borrowUSDC = totalBorrowsCurrentUSDC / 10 ** decimalsUSDC;
    const utilUSDC = borrowUSDC / supplyUSDC * 100;
    const oldcapUSDC = borrowcapUSDC / 10 ** decimalsUSDC;
    const capUSDC = supplyUSDC * 0.8;

    var output = 
    symbolETH + "  " + 
    "utilization:" + " " + utilETH.toLocaleString('en-US') + "%" + "  " +  
    "Supply:" + " " + "ETH" + supplyETH.toLocaleString('en-US') + "  " + 
    "Borrow:" + " " + "ETH" + borrowETH.toLocaleString('en-US') + "  " + 
    "Old Cap:" + " " + "ETH" + oldcapETH.toLocaleString('en-US') + "  " + 
    "New Cap:" + " " + "ETH" + capETH.toLocaleString('en-US') + "\n" +
    symbolUSDC + "  " +
    "utilization:" + " " + utilUSDC.toLocaleString('en-US') + "%" + "  " +  
    "Supply:" + " " + supplyUSDC.toLocaleString('en-US',{style: 'currency', currency: 'USD'}) + "  " + 
    "Borrow:" + " " + borrowUSDC.toLocaleString('en-US',{style: 'currency', currency: 'USD'}) + "  " + 
    "Old Cap:" + " " + oldcapUSDC.toLocaleString('en-US',{style: 'currency', currency: 'USD'}) + "  " + 
    "New Cap:" + " " + capUSDC.toLocaleString('en-US',{style: 'currency', currency: 'USD'})

    return output;
};

async function writeResultToFile() {
    const result = await getdata();
    await fs.writeFile('result.txt', result.toString());
  }
  
  module.exports = {
    writeResultToFile
  };

client.once('ready', () => { 
	console.log('ready'); 
});

client.on('interactionCreate', async interaction => { 
    if (!interaction.isCommand()) return; 

    const { commandName } = interaction;

    if (commandName === 'fuse') { 
        await interaction.reply("計算中.....");
        var value = await getdata();
        await interaction.followUp(value);
    }
});

client.login(BOTtoken); 


