// rm_TitleScreen

function default_room () {
	var startButton = rm_TitleScreen.AddObject(pr_Button);
    startButton.x = Math.round(OS.camera.width / 2);
    startButton.y = Math.round(OS.camera.height * 0.8);
    startButton.text = "Challenge the Devil's Die";
    startButton.ClickAction = function () {
        if (!rm_TitleScreen.showHelp) {
            if (G.bet > 0) {
                OS.SetRoom(rm_GameBoard);
            }
        }
    }
    startButton.BeforeDo = function () {
        if (G.bet <= 0) {
            this.color = "#797979"
        }
        else {
            this.color = "#0000FF"
        }
    }
    
    var helpButton = rm_TitleScreen.AddObject(pr_Button);
    helpButton.x = Math.round(OS.camera.width / 2);
    helpButton.y = OS.camera.height - (helpButton.size.height / 2);
    helpButton.text = "Learn the Rules";
    helpButton.ClickAction = function () {
        rm_TitleScreen.showHelp = !rm_TitleScreen.showHelp;
        if (rm_TitleScreen.showHelp) {
            this.text = "Hide the Rules";
        }
        else {
            this.text = "Learn the Rules"
        }
    }
    
    var betAdd = rm_TitleScreen.AddObject(pr_Button);
    betAdd.size.height = 18;
    betAdd.color = "#ADADAD";
    betAdd.textColor = "#121212"
    betAdd.x = Math.round(OS.camera.width * 0.8) + (betAdd.size.width + 40);
    betAdd.y = Math.round(OS.camera.height * 0.4) + (betAdd.size.height / 2);
    betAdd.text = "+";
    betAdd.ClickAction = function () {
        if (!rm_TitleScreen.showHelp) {
            if (G.bet < G.money / 2)
                G.bet++;
        }
    }
    var betSubtract = rm_TitleScreen.AddObject(pr_Button);
    betSubtract.size.height = 18;
    betSubtract.color = "#ADADAD";
    betSubtract.textColor = "#121212"
    betSubtract.x = Math.round(OS.camera.width * 0.8) - (betSubtract.size.width + 40);
    betSubtract.y = Math.round(OS.camera.height * 0.4) + (betSubtract.size.height / 2);
    betSubtract.text = "-";
    betSubtract.ClickAction = function () {
        if (!rm_TitleScreen.showHelp) {
            if (G.bet > 1)
                G.bet--;
        }
    }
    
    var incrementAdd = rm_TitleScreen.AddObject(pr_Button);
    incrementAdd.size.height = 18;
    incrementAdd.color = "#ADADAD";
    incrementAdd.textColor = "#121212"
    incrementAdd.x = Math.round(OS.camera.width * 0.8) + (incrementAdd.size.width + 40);
    incrementAdd.y = Math.round(OS.camera.height * 0.4) + 30 + (incrementAdd.size.height / 2);
    incrementAdd.text = "+";
    incrementAdd.ClickAction = function () {
        if (!rm_TitleScreen.showHelp) {
            if (G.increment < G.money / 4)
                G.increment++;
        }
    }
    var incrementSubtract = rm_TitleScreen.AddObject(pr_Button);
    incrementSubtract.size.height = 18;
    incrementSubtract.color = "#ADADAD";
    incrementSubtract.textColor = "#121212"
    incrementSubtract.x = Math.round(OS.camera.width * 0.8) - (incrementSubtract.size.width + 40);
    incrementSubtract.y = Math.round(OS.camera.height * 0.4) + 30 + (incrementSubtract.size.height / 2);
    incrementSubtract.text = "-";
    incrementSubtract.ClickAction = function () {
        if (!rm_TitleScreen.showHelp) {
            if (G.increment > 1)
                G.increment--;
        }
    }
    
    rm_TitleScreen.showHelp = false;
    
    rm_TitleScreen.DrawAbove = function ()
    {
        OS.context.font = "18px Georgia";
        OS.context.fillStyle = "#000000";
        OS.context.textAlign = "left";
        OS.context.textBaseline = "top";
        OS.context.fillText("Your Money:", Math.round(OS.camera.width * 0.1), Math.round(OS.camera.height * 0.15));
        OS.context.fillText("Your First Bet:", Math.round(OS.camera.width * 0.1), Math.round(OS.camera.height * 0.4));
        OS.context.fillText("Increase Each Roll:", Math.round(OS.camera.width * 0.1), Math.round(OS.camera.height * 0.4) + 30);
        OS.context.fillText("Pot Threshold:", Math.round(OS.camera.width * 0.1), Math.round(OS.camera.height * 0.4) + 60);
        
        OS.context.textAlign = "center";
        OS.context.textBaseline = "top";
        OS.context.fillText(G.money, Math.round(OS.camera.width * 0.8), Math.round(OS.camera.height * 0.15));
        OS.context.fillText(G.bet, Math.round(OS.camera.width * 0.8), Math.round(OS.camera.height * 0.4));
        OS.context.fillText(G.increment, Math.round(OS.camera.width * 0.8), Math.round(OS.camera.height * 0.4) + 30);
        OS.context.fillText(GetThreshold(), Math.round(OS.camera.width * 0.8), Math.round(OS.camera.height * 0.4) + 60);
        
        if (this.showHelp) {
            OS.context.fillStyle = "rgba(255, 255, 255, 0.9)";
            roundRect(OS.context, 20, 20, OS.camera.width - 40, OS.camera.height - 70, 5, true, true);
            
            OS.context.fillStyle = "#006000";
            wrapText(OS.context, G.rules, Math.round(OS.camera.width * 0.5), Math.round(OS.camera.height * 0.1), OS.camera.width - OS.camera.vBorder, 20)
        }
    }
    
    OS.SetRoom(rm_TitleScreen);
}