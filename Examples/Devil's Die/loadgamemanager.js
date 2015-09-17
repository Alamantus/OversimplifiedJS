var Game = {};
G = Game;

G.money = 1000;
G.pot = 0;
G.bet = 1;
G.threshold = GetThreshold();
G.increment = 1;
G.devilDie = {};
G.dice = [];
G.hasBet = false;
G.hasRolled = false;
G.finishedRolling = false;
G.done = false;

G.message = "";

G.rules = "It's your five dice versus the Devil's one. ";
G.rules += "You start with one bet and every roll, the bet amount increases by the specified Increment. ";
G.rules += "Every time you bet, the Devil matches your bet, and both bets go into the Pot. ";
G.rules += "When the Pot reaches the Threshold, you get to take what's in the pot, but if you lose to the Devil's Die, he takes the pot instead! ";
G.rules += "To make sure the Devil never takes the pot, be sure that ";
G.rules += "1) your roll's total is always higher than the Devil's roll, ";
G.rules += "2) you never roll the Devil's number with more than one die, and ";
G.rules += "3) the Devil never rolls a 6! ";
G.rules += "Follow these simple rules, and all the wealth in the world could be yours!";

function GetThreshold () {
    return (G.bet * 10) + (G.increment * 5);
}
function Bet () {
    G.pot += G.bet * 2;
    
    G.money -= G.bet;
    
    G.bet += G.increment;
    
    G.done = false;
    G.hasBet = true;
}
function Roll () {
    for (var i = 0; i < G.dice.length; i++)
    {
        if (!G.dice[i].hasRolled)
            G.dice[i].DoRoll();
    }
    
    if (!G.devilDie.hasRolled)
        G.devilDie.DoRoll();
    
    G.done = false;
    G.hasRolled = true;
}
function Reset () {
    for (var i = 0; i < G.dice.length; i++)
    {
        G.dice[i].ResetRoll();
        G.dice[i].x = Math.round(((i + 1) / 6) * OS.camera.width);
        G.dice[i].y = Math.round(0.75 * OS.camera.height);
    }
    
    G.devilDie.ResetRoll();
    G.devilDie.x = Math.round(OS.camera.width / 2);
    G.devilDie.y = Math.round(0.25 * OS.camera.height);
    
    G.done = false;
    G.hasBet = false;
    G.hasRolled = false;
    G.finishedRolling = false;
    G.message = "";
}
function Evaluate () {
    var total = 0,
        ones = twos = threes = fours = fives = sixes = 0;
    
    var totalLoss = sideLoss = devilSix = false;
    var message = "";
    
    for (var i = 0; i < G.dice.length; i++)
    {
        total += G.dice[i].side;
        switch (G.dice[i].side) {
            case 1:
                ones++;
                break;
            case 2:
                twos++;
                break;
            case 3:
                threes++;
                break;
            case 4:
                fours++;
                break;
            case 5:
                fives++;
                break;
            case 6:
                sixes++;
                break;
        }
    }
    
    if (G.devilDie.side == 6) {
        devilSix = true;
    }
    
    if (total <= G.devilDie.side) {
        totalLoss = true;
    }
    
    switch (G.devilDie.side) {
        case 1:
            if (ones > 1) sideLoss = true;
            break;
        case 2:
            if (twos > 1) sideLoss = true;
            break;
        case 3:
            if (threes > 1) sideLoss = true;
            break;
        case 4:
            if (fours > 1) sideLoss = true;
            break;
        case 5:
            if (fives > 1) sideLoss = true;
            break;
        case 6:
            if (sixes > 1) sideLoss = true;
            break;
    }
    
    if (totalLoss || sideLoss || devilSix) {
        G.message = "The Devil takes the pot because ";
        if (totalLoss) {
            G.message += "you rolled " + total.toString() + " and he rolled " + G.devilDie.side.toString();
        }
        if (sideLoss) {
            if (totalLoss) G.message += "\nand "
            G.message += "more than one of your dice rolled the his die's number";
        }
        if (devilSix) {
            if (totalLoss || sideLoss) G.message += "\nand "
            G.message += "he rolled 6";
        }
        
        G.message += ".";
        G.pot = 0;
        
        // G.message += " Your withdrawal threshold resets as well.";
        // G.threshold = GetThreshold();
    }
    else if (!totalLoss && !sideLoss && !devilSix) {
        G.message = "You win the roll!";
    }
    
    G.done = true;
}
function Withdraw () {
    if (G.pot >= G.threshold) {
        G.money += G.pot;
        G.pot = 0;
        G.threshold = GetThreshold();
        G.message += " And you take the pot. The next time you can take the pot is when the pot is more than " + G.threshold.toString();
    }
}

function loadgamemanager () {}