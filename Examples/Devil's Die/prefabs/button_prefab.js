var pr_Button = OS.P.Add("Button", 0, 0);
pr_Button.solid = true;

pr_Button.text = "Text";
pr_Button.textColor = "#EFEFEF";
pr_Button.color = "#0000FF";
pr_Button.size = {
    width   : 0,
    height  : 32
}
pr_Button.padding = {
    horizontal  : 20,
    vertical    : 10
}
pr_Button.ClickAction = function () {};

pr_Button.DoFirst = function ()
{
    OS.context.font = "18px Georgia";
    var txt= this.text;
    this.size.width = OS.context.measureText(txt).width;
    
    this.mask.width = this.size.width + this.padding.horizontal;
    this.mask.height = this.size.height + this.padding.horizontal;
    this.xBound = this.mask.width / 2;
    this.yBound = this.mask.height / 2;
}

pr_Button.Do = function ()
{
    if (this.Clicked(OS.mouse.leftDown))
    {
        this.ClickAction();
    }
}

pr_Button.DrawAbove = function ()
{
    OS.context.font = "18px Georgia";
    var txt= this.text;
    this.size.width = OS.context.measureText(txt).width;
    
    this.mask.width = this.size.width + this.padding.horizontal;
    this.mask.height = this.size.height + this.padding.horizontal;
    this.xBound = this.mask.width / 2;
    this.yBound = this.mask.height / 2;
    
    OS.context.fillStyle = this.color;
    roundRect(OS.context, this.x - (this.size.width / 2) - (this.padding.horizontal / 2), this.y - (this.size.height / 2) - (this.padding.vertical / 2), this.size.width + this.padding.horizontal, this.size.height + this.padding.vertical, 5, true, false);
    
    OS.context.fillStyle = this.textColor;
    OS.context.textAlign = "center";
    OS.context.textBaseline = "middle";
    OS.context.fillText(txt, this.x, this.y);
}

function button_prefab () {}