//rm_GameBoard

function gameboard_room ()
{
	rm_GameBoard.DoFirst = function ()
    {
        var die;
        for (var i = 0; i < 5; i++)
        {
            die = rm_GameBoard.AddObject(pr_Die);
            die.x = Math.round(((i + 1) / 6) * OS.camera.width);
            die.y = Math.round(0.75 * OS.camera.height);
            die.moveBounds = {
                top     : OS.camera.height / 2 + (die.yBound + 10),
                left    : OS.camera.x + OS.camera.hBorder,
                right   : OS.camera.x + OS.camera.width - OS.camera.hBorder,
                bottom  : OS.camera.y + OS.camera.height - OS.camera.vBorder
            }
            G.dice.push(die);
        }
        
        G.devilDie = rm_GameBoard.AddObject(pr_Die);
        G.devilDie.image.src = "images/sheet_devildie_small.png";
        G.devilDie.x = Math.round(OS.camera.width / 2);
        G.devilDie.y = Math.round(0.25 * OS.camera.height);
        G.devilDie.moveBounds = {
            top     : OS.camera.y + OS.camera.vBorder,
            left    : OS.camera.x + OS.camera.hBorder,
            right   : OS.camera.x + OS.camera.width - OS.camera.hBorder,
            bottom  : OS.camera.height / 2 - (G.devilDie.yBound + 10)
        }
        
        var betButton = rm_GameBoard.AddObject(pr_Button);
        betButton.x = Math.round(OS.camera.width / 2);
        betButton.y = OS.camera.height - (betButton.size.height / 2) - (betButton.padding.vertical / 2);
        betButton.text = "Roll!";
        betButton.ClickAction = function () {
            if (G.bet < G.money) {
                if (G.hasBet && !G.hasRolled) {
                    Roll();
                }
                else if (!G.hasBet || G.done) {
                    Reset();
                    Bet();
                }
            }
        }
        betButton.BeforeDo = function () {
            if ((G.hasBet && G.hasRolled && !G.done) || (G.bet > G.money)) {
                this.color = "#797979"
            }
            else {
                this.color = "#0000FF"
            }
            
            if (!G.hasBet || G.done) {
                this.text = "Place Bet"
            }
            else if (G.hasBet && !G.hasRolled) {
                this.text = "Roll!"
            }
        }
        
        G.threshold = GetThreshold();
        Bet();
    }
    
    rm_GameBoard.Do = function ()
    {
        if (G.hasRolled) {
            var rolledDice = 0;
            for (var i = 0; i < G.dice.length; i++)
            {
                if (G.dice[i].side > 0)
                    rolledDice++;
            }
            if (G.devilDie.side > 0)
                rolledDice++;
            
            if (rolledDice == 6)
                G.finishedRolling = true;
        }
        
        if (G.finishedRolling && !G.done) {
            Evaluate();
            
            if (G.pot >= G.threshold) {
                Withdraw();
            }
        }
    }
    
    rm_GameBoard.DrawAbove = function ()
    {
        OS.context.font = "18px Georgia";
        OS.context.fillStyle = "#000000";
        OS.context.textAlign = "center";
        OS.context.textBaseline = "middle";
        OS.context.fillText("Your Money: " + G.money + "    Pot: " + G.pot, Math.round(OS.camera.width * 0.5), Math.round(OS.camera.height * 0.5) - 10);
        
        if (G.done) {
            OS.context.fillText("Next Bet: " + G.bet + "   Next Withdraw: " + (G.threshold - G.pot).toString(), Math.round(OS.camera.width * 0.5), Math.round(OS.camera.height * 0.5) + 10);
            
            if (G.bet < G.money) {
                OS.context.fillStyle = "rgba(255, 255, 255, 0.75)";
                roundRect(OS.context, 20, 20, OS.camera.width - 40, (OS.camera.height / 2) - 40, 5, true, true);
                
                OS.context.fillStyle = "#006000";
                wrapText(OS.context, G.message, Math.round(OS.camera.width * 0.5), Math.round(OS.camera.height * 0.25), OS.camera.width - OS.camera.vBorder, 18)
            }
        }
        if (G.bet > G.money) {
            G.message = "You can't make the next bet! You lose!";
            
            OS.context.fillStyle = "rgba(255, 255, 255, 0.75)";
            roundRect(OS.context, 20, 20, OS.camera.width - 40, (OS.camera.height / 2) - 40, 5, true, true);
            
            OS.context.fillStyle = "#006000";
            wrapText(OS.context, G.message, Math.round(OS.camera.width * 0.5), Math.round(OS.camera.height * 0.25), OS.camera.width - OS.camera.vBorder, 18)
        }
    }
}