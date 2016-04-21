var Game = {};
G = Game;

G.gameStarted = false;
G.savedGameExists = (OS.Load("TradeWindsSave")) ? true : false;
G.player = {};	// Just a reference until G.player is created at rm_Ocean's load time.
G.oceanParticle = {};	// One ocean particle will exist at any time and move around the boat.
G.map = [];	// List of island objects, generated/loaded and saved at game start, loaded on room start.
G.currentScreen = "";	// For pause screen, stats screen, inventory screen
G.inventory = {
    money: 100,
	supplies: 20,	// How much stuff you have to maintain your crew's illness with.
	cargo:	[0, 0, 0, 0,		// Keeps track of how much of each item you have.
			 0, 0, 0, 0,		// Requires a check to make sure you can't buy more different kinds than you can hold.
			 0, 0, 0, 0,
			 0, 0, 0, 0],
	moneyDisplay: function () {
		var moneyString = "";
		if (G.inventory.money >= 1000000) {
			moneyString = G.inventory.money.toString().substr(0, 1);
			if (parseInt(G.inventory.money.toString().substr(1, 1)) > 0) {
				moneyString += "." + G.inventory.money.toString().substr(1, 1);
			}
		}
		if (G.inventory.money >= 1000000000000) {
			moneyString += "T";
		} else if (G.inventory.money >= 1000000000) {
			moneyString += "B";
		} else if (G.inventory.money >= 1000000) {
			moneyString += "M";
		} else {
			moneyString = G.inventory.money.toString();
		}

		return moneyString;
	},
	CheckCargo: function () {	// Returns an array of indices that have cargo
		var indicesWithCargo = [];
		for (var i = 0; i < G.inventory.cargo.length; i++) {
			if (G.inventory.cargo[i] > 0) {
				indicesWithCargo.push(i);
			}
		}
		return indicesWithCargo;
	},
	CargoTotal: function () {
		var cargo = G.inventory.CheckCargo();
		var cargoTotal = 0;
		for (var i = 0; i < cargo.length; i++) {
			cargoTotal += G.inventory.cargo[cargo[i]];
		}
		return cargoTotal;
	},
	CanBuy: function (itemIndex, price) {
		if (G.inventory.cargo[itemIndex] < G.stats.hold && G.inventory.money > price &&
			(G.inventory.cargo[itemIndex] > 0 || G.inventory.CheckCargo().length < G.stats.inventory))
		{
			return true;
		} else {
			return false;
		}
	},
	CanSell: function (itemIndex) {
		return G.inventory.cargo[itemIndex] > 0;
	}
};
G.stats = {
    inventory: 3,   // Maximum number of different things the cargo can hold.
    hold: 20,		// Maximum number of each individual kind of thing in the inventory.
    speed: 1,		// How many pixels you move.
    hull: 3,		// Your HP, pretty much. How many times you can crash without exploding.
    maxHull: 3,		// How much your hull can refill to.
    popularity: 5,	// Haggle success rate in percentage.
    haggling: 10,	// How much you can increase the asking price by.
    crew: 2,		// How many crew members you have. Influences how fast your energy recovers.
    energy: 25,		// Drains rate determined by current speed. When drained, currentSpeed reduces until you have enough energy to continue.
    maxEnergy: 50,	// How much to refill your energy to. Can increase with upgrades.
    illness: 0		// Your crew's overall health. When this is low, your ship slows down.
};

G.economy = {	// Aww yea, supply and demand.
// Items are determined by their index, and their position on the sheet determines their index.
// So the second item on the top row is index 1, and to get its value, you get `G.economy.cargoItemWorth[1]`
	innCost:		50,
	innStays:		0,
	cargoItemWorth: [10, 20, 30, 30,	//Can be adjusted based on sales.
					 40, 20, 50, 80,
					 65, 20, 20, 30,
					 30, 60, 45, 70],
	cargoSold: 		[0, 0, 0, 0,		// The more you sell, the lower the price gets
					 0, 0, 0, 0,
					 0, 0, 0, 0,
					 0, 0, 0, 0],
	cargoBought:	[0, 0, 0, 0,		// The more you buy, the higher the price gets
					 0, 0, 0, 0,
					 0, 0, 0, 0,
					 0, 0, 0, 0],
	UpdateEconomy: function () {
		// console.log(G.economy.cargoItemWorth);
		for (var i = 0; i < G.economy.cargoItemWorth.length; i++) {
			var totalPriceDifference = 0;
			for (var m = 0; m < G.map.length; m++) {
				// console.log("map: " + G.map[m].island);
				totalPriceDifference += G.map[m].island.priceDifferences[i];
				// console.log(G.map[m].island.priceDifferences[i]);
			}
			G.economy.cargoItemWorth[i] += Math.round(totalPriceDifference / G.map.length);	// Apply the average price difference for the item.
		}
		var totalInnCost = 0;
		for (var m = 0; m < G.map.length; m++) {
			totalInnCost += G.map[m].island.innPriceDifference;
		}
		G.economy.innCost += Math.round(totalInnCost / G.map.length);	// Apply the average inn price.
		// console.log(G.economy.cargoItemWorth);
	}
};

G.SaveGame = function () {
	var saveObject = {
		playerX: G.player.x,
		playerY: G.player.y,
		money: G.inventory.money,
		supplies: G.inventory.supplies,
		cargo: G.inventory.cargo.slice(),
		stats: {
			inventory: G.stats.inventory,
			hold: G.stats.hold,
			speed: G.stats.speed,
			hull: G.stats.hull,
			maxHull: G.stats.maxHull,
			popularity: G.stats.popularity,
			haggling: G.stats.haggling,
			crew: G.stats.crew,
			energy: G.stats.energy,
			maxEnergy: G.stats.maxEnergy,
			illness: G.stats.illness
		},
		economy: {
			innCost: G.economy.innCost,
			innStays: G.economy.innStays,
			itemWorth: G.economy.cargoItemWorth.slice(),
			cargoSold: G.economy.cargoSold.slice(),
			cargoBought: G.economy.cargoBought.slice()
		},
		map: []
	};
	for (var i = 0; i < G.map.length; i++) {
		saveObject.map.push({
			drawX: G.map[i].drawX,
			drawY: G.map[i].drawY,
			drawWidth: G.map[i].drawWidth,
			drawHeight: G.map[i].drawHeight,
			inventory: G.map[i].island.inventory.slice(),
			innPriceDifference: G.map[i].island.innPriceDifference,
			innStays: G.map[i].island.innStays,
			priceDifferences: G.map[i].island.priceDifferences.slice(),
			itemsSold: G.map[i].island.itemsSold.slice(),
			itemsBought: G.map[i].island.itemsBought.slice()
		});
	}

	if (OS.Save("TradeWindsSave", JSON.stringify(saveObject))) {
		console.log("Game Saved!");
	}
}

G.LoadGame = function () {
	var loadObject = OS.Load("TradeWindsSave");
	if (loadObject) {
		loadObject = JSON.parse(loadObject);
		G.player.x = loadObject.playerX;
		G.player.y = loadObject.playerY;
		G.inventory.money = loadObject.money;
		G.inventory.supplies = loadObject.supplies;
		G.inventory.cargo = loadObject.cargo.slice();
		G.stats.inventory = loadObject.stats.inventory;
		G.stats.hold = loadObject.stats.hold;
		G.stats.speed = loadObject.stats.speed;
		G.stats.hull = loadObject.stats.hull;
		G.stats.maxHull = loadObject.stats.maxHull;
		G.stats.popularity = loadObject.stats.popularity;
		G.stats.haggling = loadObject.stats.haggling;
		G.stats.crew = loadObject.stats.crew;
		G.stats.energy = loadObject.stats.energy;
		G.stats.maxEnergy = loadObject.stats.maxEnergy;
		G.stats.illness = loadObject.stats.illness;
		G.economy.innCost = loadObject.economy.innCost;
		G.economy.innStays = loadObject.economy.innStays;
		G.economy.cargoItemWorth = loadObject.economy.itemWorth.slice();
		G.economy.cargoSold = loadObject.economy.cargoSold.slice();
		G.economy.cargoBought = loadObject.economy.cargoBought.slice();

		for (var i = 0; i < loadObject.map.length; i++) {
			G.map[i].drawX = loadObject.map[i].drawX;
			G.map[i].drawY = loadObject.map[i].drawY;
			G.map[i].drawWidth = loadObject.map[i].drawWidth;
			G.map[i].drawHeight = loadObject.map[i].drawHeight;
			G.map[i].island.x = rm_Ocean.squareSize * loadObject.map[i].drawX;
			G.map[i].island.y = rm_Ocean.squareSize * loadObject.map[i].drawY;
			G.map[i].island.inventory = loadObject.map[i].inventory.slice();
			G.map[i].island.innPriceDifference = loadObject.map[i].innPriceDifference;
			G.map[i].island.innStays = loadObject.map[i].innStays;
			G.map[i].island.priceDifferences = loadObject.map[i].priceDifferences.slice();
			G.map[i].island.itemsSold = loadObject.map[i].itemsSold.slice();
			G.map[i].island.itemsBought = loadObject.map[i].itemsBought.slice();
		}
		loadObject = null;
		console.log("Game Loaded!");
	} else {
		console.log("Could not load game!");
		return false;
	}
}

function loadGameManager () {
	for (var i = 0; i < G.economy.cargoItemWorth.length; i++) {
		G.economy.cargoItemWorth[i] += Math.round(Math.randomRange(-5, 5));
	}
}
