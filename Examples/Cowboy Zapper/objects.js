// Define animations and assign to easy-access variables.
var ani_ufo = OS.A.Add("UFO", 64, 29, 4, 1, 0.4);
var ani_ball = OS.A.Add("Ball", 12, 12, 3, 1, 0.5);
var ani_cowboy = OS.A.Add("Cowboy", 14, 23, 2, 1, 0.25);
var ani_zap = OS.A.Add("Zap", 32, 24, 2, 1, 0.5);

// Set up PremadeObjects
OS.P.Add("Zap", 0, 0, "zap.png", false, [ani_zap]);
OS.P["Zap"].Do = function () {
    //P["Zap"].DoFirst isn't working for some stupid reason, so here's a workaround!
    if (!this.forward) {
        this.forward = {
            x : -Game.ball.forward.x,
            y : -Game.ball.forward.y
        }
    }
    this.SimpleMove(this.forward.x, this.forward.y);
    if (!this.life) this.life = 1.5;
    this.life -= OS.step;
    
    if (this.life <= 0) {
        this.Destroy();
    }
}

OS.P.Add("UFO", OS.camera.width / 2, 50, "ufo.png", false, [ani_ufo]);
OS.P["UFO"].DoFirst = function () {
    this.depth = 20;
}
OS.P["UFO"].Do = function () {
    this.x = OS.mouse.x;
    
    if (this.x - this.xBound < Game.border) {
        this.x = Game.border + this.xBound;
    }
    if (this.x + this.xBound > rm_arena.width - Game.border) {
        this.x = rm_arena.width - Game.border - this.xBound;
    }
}

OS.P.Add("Ball", OS.camera.width / 2, OS.P["UFO"].y + OS.P["UFO"].yBound, "ball.png", false, [ani_ball]);
OS.P["Ball"].DoFirst = function () {
    this.depth = 10;
    
    this.maxSpeed = 20;
    this.baseSpeed = 5;
    this.currentSpeed = this.baseSpeed;
    this.bounces = 0;
    
    this.angle = Math.clampAngle(Math.random() * 360, 45, 135);
    this.radian = this.angle / (Math.PI / 180);
    this.forward = {
        x: GetCos(this.angle),
        y: GetSin(this.angle)
    }
}
OS.P["Ball"].BeforeDo = function () {
    this.angle = Math.clampAngle(RadToDeg(Math.acos(this.forward.x)));
    
    this.currentSpeed = this.baseSpeed + (this.bounces / 10);
    if (this.currentSpeed > this.maxSpeed) {
        this.currentSpeed = this.maxSpeed;
    }
}
OS.P["Ball"].Do = function () {
    this.CheckBounce();
    
    this.SimpleMove(this.currentSpeed * this.forward.x, this.currentSpeed * this.forward.y);
}
OS.P["Ball"].CheckBounce = function () {
    if (this.x < Game.border || this.x > rm_arena.width - Game.border) {
        this.forward.x *= -1;
        this.bounces++;
        
        //console.log(Math.clampAngle(RadToDeg(Math.acos(this.forward.x))) + "\n" + Math.clampAngle(RadToDeg(Math.asin(this.forward.y))));
    }
    if (this.y > rm_arena.height - Game.border || this.y < Game.border) {
        this.forward.y *= -1;
        this.bounces++;
        
        //console.log(Math.clampAngle(RadToDeg(Math.acos(this.forward.x))) + "\n" + Math.clampAngle(RadToDeg(Math.asin(this.forward.y))));
        //console.log(Math.clampAngle(RadToDeg(Math.acos(this.forward.x) * Math.asin(this.forward.y))));
    }
    
    /* if (this.y < Game.border) {
        this.forward.y *= -1;
        if (Game.cowboys < Game.maxCowboys) {
            rm_arena.AddObject(P["Cowboy"]);
            Game.cowboys++;
        }
        this.bounces--;
    } */
    
    if (this.y < Game.player.y + Game.player.yBound &&
        this.x > Game.player.x - Game.player.xBound &&
        this.x < Game.player.x + Game.player.xBound &&
        this.y > Game.player.y - Game.player.yBound)
    {
        //console.log(this.angle + "\n" + (Game.player.x - this.x));
        this.angle = Math.clampAngle(this.angle + (Game.player.x - this.x));
        
        this.forward = {
            x: GetCos(this.angle),
            y: GetSin(this.angle)
        }
        this.bounces++;
        
        //console.log(this.angle + "\n" + (Game.player.x - this.x));
    }
}

OS.P.Add("Cowboy", OS.camera.width / 2, 0, "cowboy.png", false, [ani_cowboy]);
OS.P["Cowboy"].DoFirst = function () {
    this.ground = rm_arena.height - Game.border - this.yBound;
    this.y = this.ground;
    this.direction = CoinFlip() ? 1 : -1;
    this.maxSpeed = 5;
    this.minSpeed = 1;
    this.currentSpeed = RandomRange(this.minSpeed, this.maxSpeed);
    this.xSpeed = this.currentSpeed * this.direction;
    //this.ySpeed = 0;
    this.ySpeed = 5;
    
    this.maxCountdownTime = 10;     //Seconds
    this.minCountdownTime = 1;      //Seconds
    this.countdown = RandomRange(this.minCountdownTime, this.maxCountdownTime);
}
OS.P["Cowboy"].BeforeDo = function () {
    this.countdown -= OS.step;
    //console.log(this.countdown);
}
OS.P["Cowboy"].Do = function () {
    if (this.countdown <= 0) {
        this.ChooseMovement();
        this.countdown = RandomRange(this.minCountdownTime, this.maxCountdownTime);
    }
    //Gravity
    if (this.y < this.ground) {
        this.ySpeed -= 15 * OS.step;
    }
    if (this.y > this.ground) {
        this.y = this.ground;
        this.ySpeed = 0;
    }
    this.SimpleMove(this.xSpeed, -this.ySpeed);
    
    if (this.x < Game.border || this.x > rm_arena.width - Game.border) {
        this.xSpeed *= -1;
    }
    
    if (this.PointOverlaps(Game.ball.x, Game.ball.y)) {
        this.Destroy();
    }
}
OS.P["Cowboy"].DoLast = function () {
    Game.cowboys--;
    OS.CreateObject(OS.P["Zap"], this.x, this.y);
}
OS.P["Cowboy"].ChooseMovement = function () {
    this.direction = CoinFlip() ? 1 : -1;
    this.currentSpeed = RandomRange(this.minSpeed, this.maxSpeed);
    this.xSpeed = this.currentSpeed * this.direction;
    //console.log(this.xSpeed);
    this.ySpeed = 5;
    // if (RandomRange(0, 10) > 9) {
        // this.ySpeed = 5;
        // console.log("Jump!");
    // }
}

function objects () {
    
}