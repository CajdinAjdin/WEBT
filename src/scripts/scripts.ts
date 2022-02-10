
const canvas: any = document.getElementById('game');
const ctx: CanvasRenderingContext2D = canvas.getContext('2d');

let backgroundImage = new Image();


let playerImage = new Image;
let enemyImage = new Image;
let shotImage = new Image;
let bossImage = new Image;

let worldone = true;
let worldtwo = false;
let worldthree = false;
let worldfour = false;


let startText;
let continuegame = true;
let score;
let scoreText;
let highscore;
let highscoreText;
let scoreforBoss = 10000;
let player;
let gravity;
let enemys = [];
let bossEnemys = [];
let boss;
let gameSpeed;
let keys = {};
let initialSpawnTimer = 150;
let spawnTimer = initialSpawnTimer;
let backx = 0;
let secondbackx = 1300;
let animationCount = 0;
enum Character {
    Naruto,
    Goku,
    Luffy,
    Yoh,
    Ichigo,
    Yugi,
    Jotaro
}

let char = Character.Jotaro;
let gameStarted = false;
let bossSpawned = false;
let bossAttacked = true;

function StartGame(){
    backx = 0;
    secondbackx = 1300;
    enemys = [];
    highscore = score;
    score = 0;
    spawnTimer = initialSpawnTimer;
    gameSpeed = 3;
    //window.localStorage.setItem('highscore', highscore);
}

function StartGameFromBegining(){
    switch(char)
    {
        case Character.Naruto:
        {
            player = new Player(25, 0, 70, 90, '#FF5858' );
        }
        case Character.Goku:
        {
            player = new Player(25, 0, 80, 60, '#FF5858' );
        }
        case Character.Luffy:
        {
            player = new Player(25, 0, 70, 90, '#FF5858' );
        }
        case Character.Yoh:
        {
            player = new Player(25, 0, 80, 90, '#FF5858' );
        }
        case Character.Yugi:
        {
            player = new Player(25, 0, 70, 90, '#FF5858' );
        }
        case Character.Jotaro:
        {
            player = new Player(25, 0, 60, 90, '#FF5858' );
        }
        /*case Character.Ichigo:
        {
            console.log("tesigtjhsd ign");
            player = new Player(25, 0, 90, 50, '#FF5858' );
        }*/
    }

    if(char == Character.Ichigo)
    {
        player = new Player(25, 0, 130, 70, '#FF5858' );
    }
    player.y = 520;
    backx = 0;
    secondbackx = 1300;
    enemys = [];
    score = 0;
    spawnTimer = 150;
    gameSpeed = 3;
    //window.localStorage.setItem('highscore', highscore);
    animationCount = 0;
    boss = 0;
    bossEnemys = [];
    bossSpawned = false;
    bossAttacked = true;
    worldone = true;
    worldtwo = false;
    worldthree = false;
    worldfour = false;
    scoreforBoss = 10000;
}

document.addEventListener('DOMContentLoaded', (event) =>{
    const first = document.getElementById('first');
    const second = document.getElementById('second');
    const third = document.getElementById('third');
    const fourth = document.getElementById('fourth');
    const fifth = document.getElementById('fifth');
    const sixth = document.getElementById('sixth');
    const seventh = document.getElementById('seventh');
    first.addEventListener('click', (event) =>{
        char = Character.Naruto;
        StartGameFromBegining();
    });

    second.addEventListener('click', (event) =>{
        char = Character.Goku;
        StartGameFromBegining();
    });

    third.addEventListener('click', (event) =>{
        char = Character.Luffy;
        StartGameFromBegining();
    });

    fourth.addEventListener('click', (event) =>{
        char = Character.Yoh;
        StartGameFromBegining();
    });

    fifth.addEventListener('click', (event) =>{
        char = Character.Ichigo;
        StartGameFromBegining();
    });

    sixth.addEventListener('click', (event) =>{
        char = Character.Yugi;
        StartGameFromBegining();
    });

    seventh.addEventListener('click', (event) =>{
        char = Character.Jotaro;
        StartGameFromBegining();
    });
})

document.addEventListener('keydown', function(evt){
    keys[evt.code] = true;
})
document.addEventListener('keyup', function(evt){
    keys[evt.code] = false;
})

class Player {
    x;
    y;
    width;
    height;
    color;
    dy;
    jumpForce;
    originalHeight;
    grounded;
    jumpTimer;
    jump;
    falling;
    shooting;
    shot;

    constructor(x, y, width, height, color) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;

        this.dy = 0;
        this.jumpForce = 20;
        this.originalHeight = height;
        this.jumpTimer = 0;
        this.jump = false;
        this.falling = false;
        this.shooting = false;

        console.log(this.height);
        console.log(this.originalHeight);
    }

    Animate(){
        //Jump
        if(keys['Space'] || keys['KeyW'])
        {
            this.Jump();
        }
        else{
            this.jumpTimer = 0;
        }


        //Test if he is falling or if he is still jumping

        if(this.grounded === false)
        {
            if(this.dy < 0)
            {
                this.jump = true;
            }
            else if(this.dy > 0)
            {
                this.jump = false;
            }
        }

        //Shoot
        if(keys['KeyE'] && !this.shooting && bossSpawned)
        {
            this.shooting = true;
            this.shot = new Shot(this.x, this.y);
            bossAttacked = false;
        }

        if(this.shooting)
        {
            this.shot.Update();
        }



        //Crouch
        /*if(keys['ShiftLeft'] || keys['KeyS'])
        {
            if(this.grounded)
            {
                this.height = this.originalHeight/2;
                this.y = canvas.height - this.height;
                this.crouching = true;
            }
        }
        else{
            this.height = this.originalHeight;
            this.crouching = false;
        }*/


        this.y += this.dy;


        //Gravity
        if(this.y + this.originalHeight < canvas.height)
        {
            this.dy += gravity;
            this.grounded = false;

        }
        else{
            this.dy = 0;
            this.grounded = true;
            this.y = canvas.height - this.originalHeight;
        }

        this.Draw();
    }

    Jump()
    {
        if(this.grounded && this.jumpTimer === 0)
        {
            this.jumpTimer = 1;
            this.dy = -this.jumpForce;
        }
        else if(this.jumpTimer > 0 && this.jumpTimer < 10)
        {
            this.jumpTimer++;
            this.dy = -this.jumpForce - (this.jumpTimer / 50);
        }
    }

    Draw()
    {
        //console.log(this.y);
        //console.log(this.dy);
        //console.log(this.width);
        animationCount++;
        //muss man anpassen jenachdem welcher char

        switch (char)
        {
            case Character.Naruto:
                if(animationCount > 24)
                {
                    animationCount = 0;
                }
                if(!this.grounded)
                {
                    if(this.jump)
                    {
                        this.width = 70;
                        this.height = 90;
                        playerImage.src = "../img/Naruto/NarutoJump1.png";
                    }
                    else
                    {
                        this.width = 70;
                        this.height = 100;
                        playerImage.src = "../img/Naruto/NarutoJump2.png";
                    }
                }
                else
                {
                    if(animationCount < 3)
                    {
                        this.width = 70;
                        this.height = 90;
                        playerImage.src = "../img/Naruto/Naruto1.png";
                    }
                    if(animationCount >= 3 && animationCount < 6)
                    {
                        this.width = 70;
                        this.height = 80;
                        playerImage.src = "../img/Naruto/Naruto2.png";
                    }
                    if(animationCount >= 6 && animationCount < 9)
                    {
                        this.width = 70;
                        this.height = 90;
                        playerImage.src = "../img/Naruto/Naruto3.png";
                    }
                    if(animationCount >= 9 && animationCount < 12)
                    {
                        this.width = 70;
                        this.height = 100;
                        playerImage.src = "../img/Naruto/Naruto4.png";
                    }
                    if(animationCount >= 12 && animationCount < 15)
                    {
                        this.width = 70;
                        this.height = 90;
                        playerImage.src = "../img/Naruto/Naruto5.png";
                    }
                    if(animationCount >= 15 && animationCount < 18)
                    {
                        this.width = 70;
                        this.height = 80;
                        playerImage.src = "../img/Naruto/Naruto6.png";
                    }
                    if(animationCount >= 18 && animationCount < 21)
                    {
                        this.width = 70;
                        this.height = 90;
                        playerImage.src = "../img/Naruto/Naruto7.png";
                    }
                    if(animationCount >= 21 && animationCount < 24)
                    {
                        this.width = 70;
                        this.height = 100;
                        playerImage.src = "../img/Naruto/Naruto8.png";
                    }
                }
                break;

            case Character.Goku:
                if(animationCount > 16)
                {
                    animationCount = 0;
                }
                if(!this.grounded)
                {
                    if(this.jump)
                    {
                        this.width = 70;
                        this.height = 100;
                        playerImage.src = "../img/Goku/GokuJump1.png";
                    }
                    else
                    {
                        this.width = 70;
                        this.height = 109;
                        playerImage.src = "../img/Goku/GokuJump2.png";
                    }
                }
                else
                {
                    this.width = 80;
                    this.height = 60;
                    if(animationCount < 4)
                    {
                        playerImage.src = "../img/Goku/Goku1.png";
                        this.y = this.y +1;
                    }
                    if(animationCount >= 4 && animationCount < 8)
                    {
                        playerImage.src = "../img/Goku/Goku2.png";
                    }
                    if(animationCount >= 8 && animationCount < 12)
                    {
                        playerImage.src = "../img/Goku/Goku3.png";
                        this.y = this.y +1;
                    }
                    if(animationCount >= 12 && animationCount < 16)
                    {
                        playerImage.src = "../img/Goku/Goku4.png";
                    }
                }
                break;

            case Character.Luffy:
                if(animationCount > 24)
                {
                    animationCount = 0;
                }
                if(!this.grounded)
                {
                    if(this.jump)
                    {
                        this.width = 60;
                        this.height = 100;
                        playerImage.src = "../img/Luffy/LuffyJump1.png";
                    }
                    else
                    {
                        this.width = 60;
                        this.height = 100;
                        playerImage.src = "../img/Luffy/LuffyJump2.png";
                    }
                }
                else
                {
                    if(animationCount < 3)
                    {
                        this.width = 70;
                        this.height = 90;
                        playerImage.src = "../img/Luffy/Luffy1.png";
                    }
                    if(animationCount >= 3 && animationCount < 6)
                    {
                        this.width = 90;
                        this.height = 70;
                        playerImage.src = "../img/Luffy/Luffy2.png";
                    }
                    if(animationCount >= 6 && animationCount < 9)
                    {
                        this.width = 70;
                        this.height = 75;
                        playerImage.src = "../img/Luffy/Luffy3.png";
                    }
                    if(animationCount >= 9 && animationCount < 12)
                    {
                        this.width = 70;
                        this.height = 90;
                        playerImage.src = "../img/Luffy/Luffy4.png";
                    }
                    if(animationCount >= 12 && animationCount < 15)
                    {
                        this.width = 70;
                        this.height = 90;
                        playerImage.src = "../img/Luffy/Luffy5.png";
                    }
                    if(animationCount >= 15 && animationCount < 18)
                    {
                        this.width = 90;
                        this.height = 70;
                        playerImage.src = "../img/Luffy/Luffy6.png";
                    }
                    if(animationCount >= 18 && animationCount < 21)
                    {
                        this.width = 70;
                        this.height = 90;
                        playerImage.src = "../img/Luffy/Luffy7.png";
                    }
                    if(animationCount >= 21 && animationCount < 24)
                    {
                        this.width = 70;
                        this.height = 90;
                        playerImage.src = "../img/Luffy/Luffy8.png";
                    }
                }
                break;

            case Character.Yoh:
                if(animationCount > 24)
                {
                    animationCount = 0;
                }
                if(!this.grounded)
                {
                    if(this.jump)
                    {
                        this.width = 80;
                        this.height = 90;
                        playerImage.src = "../img/Yoh/YohJump1.png";
                    }
                    else
                    {
                        this.width = 90;
                        this.height = 90;
                        playerImage.src = "../img/Yoh/YohJump2.png";
                    }
                }
                else
                {
                    this.width = 80;
                    this.height = 90;
                    if(animationCount < 3)
                    {
                        playerImage.src = "../img/Yoh/Yoh1.png";
                    }
                    if(animationCount >= 3 && animationCount < 6)
                    {
                        playerImage.src = "../img/Yoh/Yoh2.png";
                    }
                    if(animationCount >= 6 && animationCount < 9)
                    {
                        playerImage.src = "../img/Yoh/Yoh3.png";
                    }
                    if(animationCount >= 9 && animationCount < 12)
                    {
                        playerImage.src = "../img/Yoh/Yoh4.png";
                    }
                    if(animationCount >= 12 && animationCount < 15)
                    {
                        playerImage.src = "../img/Yoh/Yoh5.png";
                    }
                    if(animationCount >= 15 && animationCount < 18)
                    {
                        playerImage.src = "../img/Yoh/Yoh6.png";
                    }
                    if(animationCount >= 18 && animationCount < 21)
                    {
                        playerImage.src = "../img/Yoh/Yoh7.png";
                    }
                    if(animationCount >= 21 && animationCount < 24)
                    {
                        this.width = 90;
                        this.height = 90;
                        playerImage.src = "../img/Yoh/Yoh8.png";
                    }
                }
                break;

            case Character.Ichigo:
                if(animationCount > 24)
                {
                    animationCount = 0;
                }
                if(!this.grounded)
                {
                    if(this.jump)
                    {
                        this.width = 100;
                        this.height = 100;
                        playerImage.src = "../img/Ichigo/IchigoJump1.png";
                    }
                    else
                    {
                        this.width = 90;
                        this.height = 110;
                        playerImage.src = "../img/Ichigo/IchigoJump2.png";
                    }
                }
                else
                {
                    this.width = 130;
                    this.height = 70;
                    if(animationCount < 3)
                    {
                        playerImage.src = "../img/Ichigo/Ichigo1.png";
                    }
                    if(animationCount >= 3 && animationCount < 6)
                    {
                        playerImage.src = "../img/Ichigo/Ichigo2.png";
                    }
                    if(animationCount >= 6 && animationCount < 9)
                    {
                        playerImage.src = "../img/Ichigo/Ichigo3.png";
                    }
                    if(animationCount >= 9 && animationCount < 12)
                    {
                        playerImage.src = "../img/Ichigo/Ichigo4.png";
                    }
                    if(animationCount >= 12 && animationCount < 15)
                    {
                        playerImage.src = "../img/Ichigo/Ichigo5.png";
                    }
                    if(animationCount >= 15 && animationCount < 18)
                    {
                        playerImage.src = "../img/Ichigo/Ichigo6.png";
                    }
                    if(animationCount >= 18 && animationCount < 21)
                    {
                        playerImage.src = "../img/Ichigo/Ichigo7.png";
                    }
                    if(animationCount >= 21 && animationCount < 24)
                    {
                        playerImage.src = "../img/Ichigo/Ichigo8.png";
                    }
                }
                break;

            case Character.Yugi:
                if(animationCount > 24)
                {
                    animationCount = 0;
                }
                if(!this.grounded)
                {
                    if(this.jump)
                    {
                        this.width = 70;
                        this.height = 100;
                        playerImage.src = "../img/Yugi/YugiJump1.png";
                    }
                    else
                    {
                        this.width = 70;
                        this.height = 90;
                        playerImage.src = "../img/Yugi/YugiJump2.png";
                    }
                }
                else
                {
                    if(animationCount < 3)
                    {
                        this.width = 70;
                        this.height = 90;
                        playerImage.src = "../img/Yugi/Yugi1.png";
                    }
                    if(animationCount >= 3 && animationCount < 6)
                    {
                        this.width = 80;
                        this.height = 90;
                        playerImage.src = "../img/Yugi/Yugi2.png";
                    }
                    if(animationCount >= 6 && animationCount < 9)
                    {
                        this.width = 70;
                        this.height = 90;
                        playerImage.src = "../img/Yugi/Yugi3.png";
                    }
                    if(animationCount >= 9 && animationCount < 12)
                    {
                        this.width = 60;
                        this.height = 90;
                        playerImage.src = "../img/Yugi/Yugi4.png";
                    }
                    if(animationCount >= 12 && animationCount < 15)
                    {
                        this.width = 70;
                        this.height = 90;
                        playerImage.src = "../img/Yugi/Yugi5.png";
                    }
                    if(animationCount >= 15 && animationCount < 18)
                    {
                        this.width = 80;
                        this.height = 90;
                        playerImage.src = "../img/Yugi/Yugi6.png";
                    }
                    if(animationCount >= 18 && animationCount < 21)
                    {
                        this.width = 60;
                        this.height = 90;
                        playerImage.src = "../img/Yugi/Yugi7.png";
                    }
                    if(animationCount >= 21 && animationCount < 24)
                    {
                        this.width = 60;
                        this.height = 90;
                        playerImage.src = "../img/Yugi/Yugi8.png";
                    }
                }
                break;

            case Character.Jotaro:
                if(animationCount > 24)
                {
                    animationCount = 0;
                }
                if(!this.grounded)
                {
                    if(this.jump)
                    {
                        this.width = 60;
                        this.height = 90;
                        playerImage.src = "../img/Jotaro/JotaroJump1.png";
                    }
                    else
                    {
                        this.width = 85;
                        this.height = 90;
                        playerImage.src = "../img/Jotaro/JotaroJump2.png";
                    }
                }
                else
                {
                    if(animationCount < 3)
                    {
                        this.width = 60;
                        this.height = 90;
                        playerImage.src = "../img/Jotaro/Jotaro1.png";
                    }
                    if(animationCount >= 3 && animationCount < 6)
                    {
                        this.width = 60;
                        this.height = 90;
                        playerImage.src = "../img/Jotaro/Jotaro2.png";
                    }
                    if(animationCount >= 6 && animationCount < 9)
                    {
                        this.width = 70;
                        this.height = 90;
                        playerImage.src = "../img/Jotaro/Jotaro3.png";
                    }
                    if(animationCount >= 9 && animationCount < 12)
                    {
                        this.width = 60;
                        this.height = 90;
                        playerImage.src = "../img/Jotaro/Jotaro4.png";
                    }
                    if(animationCount >= 12 && animationCount < 15)
                    {
                        this.width = 60;
                        this.height = 90;
                        playerImage.src = "../img/Jotaro/Jotaro5.png";
                    }
                    if(animationCount >= 15 && animationCount < 18)
                    {
                        this.width = 70;
                        this.height = 90;
                        playerImage.src = "../img/Jotaro/Jotaro6.png";
                    }
                    if(animationCount >= 18 && animationCount < 21)
                    {
                        this.width = 70;
                        this.height = 90;
                        playerImage.src = "../img/Jotaro/Jotaro7.png";
                    }
                    if(animationCount >= 21 && animationCount < 24)
                    {
                        this.width = 60;
                        this.height = 90;
                        playerImage.src = "../img/Jotaro/Jotaro8.png";
                    }
                }
                break;
        }
        ctx.drawImage(playerImage, this.x, this.y);
    }
}

class Shot{
    width;
    height;
    x;
    y;

    constructor(x, y)
    {
        this.width = 50;
        this.height = 50;
        this.x = x;
        this.y = y;
    }

    Update()
    {
        if(this.x >= canvas.width)
        {
            player.shooting = false;
        }
        this.x += 20;
        this.Draw();
    }

    Draw()
    {
        switch(char)
        {
            case Character.Naruto:
                shotImage.src = "../img/Projectiles/NarutoRasenShuriken.png"
                break;

            case Character.Goku:
                shotImage.src = "../img/Projectiles/GokuKiBlast.png"
                break;

            case Character.Luffy:
                shotImage.src = "../img/Projectiles/LuffyStone.png"
                break;

            case Character.Yoh:
                this.width = 60;
                this.height = 30;
                shotImage.src = "../img/Projectiles/YohBlackBladeBurst.png"
                break;

            case Character.Ichigo:
                shotImage.src = "../img/Projectiles/IchigoBladeBeam.png"
                break;

            case Character.Yugi:
                shotImage.src = "../img/Projectiles/YugiCard.png"
                break;

            case Character.Jotaro:
                shotImage.src = "../img/Projectiles/JotaroMenacing.png"
                break;
        }

        ctx.drawImage(shotImage, this.x, this.y);
    }
}

class Boss{
    x;
    y;
    width;
    height;
    hp;
    up;
    down;
    hpbar;

    constructor(width, height, x, y, hp) {
        this.width = width;
        this.height = height;
        this.x = x;
        this.y = y;
        this.hp = hp;
        this.up = true;
        this.down = false;
        if(worldone)
        {
            this.hpbar = new BossHPBar(canvas.width/2 - 150, 10, 300, 30, 15, "red");
        }
        if(worldtwo)
        {
            this.hpbar = new BossHPBar(canvas.width/2 - 150, 10, 300, 30, 20, "red");
        }
        if(worldthree)
        {
            this.hpbar = new BossHPBar(canvas.width/2 - 150, 10, 300, 30, 25, "red");
        }
        if(worldfour)
        {
            this.hpbar = new BossHPBar(canvas.width/2 - 150, 10, 300, 30, 40, "red");
        }
    }

    Update()
    {
        if(this.hp <= 0)
        {
            scoreforBoss += 10000;
            bossSpawned = false;
            boss = 0;
            bossEnemys = [];
            score += 2000;
            if(worldone)
            {
                worldone = false;
                worldtwo = true;
                worldthree = false;
                worldfour = false;
            }
            else if(worldtwo)
            {
                worldone = false;
                worldtwo = false;
                worldthree = true;
                worldfour = false;
            }
            else if(worldthree)
            {
                worldone = false;
                worldtwo = false;
                worldthree = false;
                worldfour = true;
            }
            else if(worldfour)
            {
                worldone = true;
                worldtwo = false;
                worldthree = false;
                worldfour = false;
            }
        }
        this.hpbar.Draw();
        this.Draw();
    }

    Shot()
    {
        let shotpos = RandomInt(0, 490);
        let bossenemy;
        if(worldone)
        {
            bossenemy = new Enemy(canvas.width - (60+boss.width), shotpos, 60, 30, '#2484E4');
        }
        else if(worldtwo)
        {
            shotpos = RandomInt(0, 490);
            bossenemy = new Enemy(canvas.width - (60+boss.width), shotpos, 60, 30, '#2484E4');
        }
        else if(worldthree)
        {
            shotpos = RandomInt(0, 470);
            bossenemy = new Enemy(canvas.width - (100+boss.width), shotpos, 100, 50, '#2484E4');
        }
        else if(worldfour)
        {
            shotpos = RandomInt(0, 470);
            bossenemy = new Enemy(canvas.width - (60+boss.width), shotpos, 60, 60, '#2484E4');
        }
        bossenemy = new Enemy(canvas.width - (60+boss.width), shotpos, 60, 30, '#2484E4');
        bossenemy.boss = true;
        bossEnemys.push(bossenemy);
    }

    Draw()
    {
        if(this.up)
        {
            if(this.y <= 0)
            {
                this.up = false;
                this.down = true;
            }
            this.y -= 5;
        }
        else if(this.down)
        {
            if(this.y >= 360 && worldone)
            {
                this.down = false;
                this.up = true;
            }

            else if(this.y >= 400 && worldtwo)
            {
                this.down = false;
                this.up = true;
            }

            else if(this.y >= 350 && worldthree)
            {
                this.down = false;
                this.up = true;
            }

            else if(this.y >= 400 && worldfour)
            {
                this.down = false;
                this.up = true;
            }
            this.y += 5;
        }

        if(worldone)
        {
            bossImage.src = "../img/boss/MommySandLady.png"
        }
        else if(worldtwo)
        {
            bossImage.src = "../img/boss/BlackMage.png"
        }
        else if(worldthree)
        {
            bossImage.src = "../img/boss/FrostMagician.png"
        }
        else if(worldfour)
        {
            bossImage.src = "../img/boss/DemonLord.png"
        }
        ctx.drawImage(bossImage, this.x, this.y);
    }
}

class Enemy{
    x;
    y;
    width;
    height;
    color;
    dx;
    ground;
    flying;
    fly;
    enemyanimation;
    small
    boss;

    constructor(x, y, width, height, color) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
        this.ground = false;
        this.flying = 0;
        this.fly = true;
        this.enemyanimation = 0;
        this.small = false;


        this.dx = -gameSpeed;
    }

    Update(){
        this.x += this.dx;
        this.Draw();
        this.dx = -gameSpeed;
    }

    Draw()
    {
        /*this.enemyanimation ++;
        if(this.enemyanimation > 32) {
            this.enemyanimation = 0;
        }*/
        if(this.boss)
        {
            if(worldone)
            {
                enemyImage.src = "../img/Projectiles/SandMommyBlast.png"
            }
            else if(worldtwo)
            {
                enemyImage.src = "../img/Projectiles/FireBall.png"
            }
            else if(worldthree)
            {
                enemyImage.src = "../img/Projectiles/IceDemolisher.png"
            }
            else if(worldfour)
            {
                enemyImage.src = "../img/Projectiles/BlackHole.png"
            }
        }

        else if(worldone)
        {
            if(this.ground)
            {
                if(this.small)
                {
                    enemyImage.src = "../img/GroundEnemy/Buggy.png";
                }
                if(!this.small)
                {
                    enemyImage.src = "../img/GroundEnemy/SandGirl.png";
                }

            }
            else if(this.ground === false)
            {
                enemyImage.src = "../img/FlyEnemy/Hornet.png";
                /*if (this.enemyanimation < 8) {
                    enemyImage.src = "../img/Pika1.png";

                }
                if (this.enemyanimation >= 8 && this.enemyanimation < 16) {
                    enemyImage.src = "../img/Pika2.png";

                }
                if (this.enemyanimation >= 16 && this.enemyanimation < 24) {
                    enemyImage.src = "../img/Pika3.png";

                }
                if (this.enemyanimation >= 24 && this.enemyanimation <= 32) {
                    enemyImage.src = "../img/Pika4.png";

                }*/
            }
        }

        else if(worldtwo)
        {
            if(this.ground)
            {
                if(this.small)
                {
                    enemyImage.src = "../img/GroundEnemy/SmolTurtle.png";
                }
                if(!this.small)
                {
                    enemyImage.src = "../img/GroundEnemy/BlackMageApprentice.png";
                }

            }
            else if(this.ground === false)
            {
                enemyImage.src = "../img/FlyEnemy/Ghost.png";
            }
        }

        else if(worldthree)
        {
            if(this.ground)
            {
                if(this.small)
                {
                    enemyImage.src = "../img/GroundEnemy/Cookieman.png";
                }
                if(!this.small)
                {
                    enemyImage.src = "../img/GroundEnemy/Gangsta.png";
                }

            }
            else if(this.ground === false)
            {
                enemyImage.src = "../img/FlyEnemy/SnowFairy.png";
            }
        }

        else if(worldfour)
        {
            if(this.ground)
            {
                if(this.small)
                {
                    enemyImage.src = "../img/GroundEnemy/Slime.png";
                }
                if(!this.small)
                {
                    enemyImage.src = "../img/GroundEnemy/Skeleton.png";
                }

            }
            else if(this.ground === false)
            {
                enemyImage.src = "../img/FlyEnemy/Demon.png";
            }
        }
        ctx.drawImage(enemyImage, this.x, this.y);
    }
}

class GameText{
    text;
    x;
    y;
    a;
    color;
    size;
    constructor(text, x, y, a, color, size) {
        this.text = text;
        this.x = x;
        this.y = y;
        this.a = a;
        this.color = color;
        this.size = size;
    }

    Draw(){
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.font = this.size + "px sans-serif";
        ctx.textAlign = this.a;
        ctx.fillText(this.text, this.x, this.y);
        ctx.closePath();
    }

}


class BossHPBar{
    x;
    y;
    width;
    height;
    maxHealth;
    color;
    maxWidth;
    health;

    constructor(x, y, width, height, maxHealth, color) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.maxHealth = maxHealth;
        this.color = color;
        this.maxWidth = width;
        this.health = maxHealth;
    }

    Draw()
    {
        ctx.beginPath();
        ctx.strokeStyle = "#333";
        ctx.lineWidth = 2;
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.strokeRect(this.x, this.y, this.maxWidth, this.height);
        ctx.closePath();
    }

    UpdateHP(health)
    {
        this.health = health;
        this.width = (this.health / this.maxHealth) * this.maxWidth;
    }
}

function SpawnEnemy(){
    let type = RandomInt(0, 2);
    let flyingtype = RandomInt(0, 270);

    if(type === 1)
    {
        let enemy;
        if(worldthree)
        {
            enemy = new Enemy(canvas.width + 90, canvas.height - flyingtype, 90, 100, '#2484E4');
        }
        else if(worldfour)
        {
            enemy = new Enemy(canvas.width + 120, canvas.height - flyingtype, 120, 80, '#2484E4');
        }
        else
        {
            enemy = new Enemy(canvas.width + 50, canvas.height - flyingtype, 50, 50, '#2484E4');
        }
        enemy.y -= player.originalHeight;
        enemys.push(enemy);
    }
    else if (type === 0){
        let enemy;
        if(worldthree)
        {
            enemy = new Enemy(canvas.width + 100, canvas.height - 120, 100, 120, '#2484E4');
        }
        else if(worldfour)
        {
            enemy = new Enemy(canvas.width + 80, canvas.height - 100, 80, 100, '#2484E4');
        }
        else
        {
            enemy = new Enemy(canvas.width + 80, canvas.height - 120, 80, 120, '#2484E4');
        }
        enemy.ground = true;
        enemys.push(enemy);
    }

    else if(type === 2)
    {
        let enemy;
        if(worldone)
        {
            enemy = new Enemy(canvas.width + 60, canvas.height - 30, 60, 30, '#2484E4');
        }
        else if(worldtwo)
        {
            enemy = new Enemy(canvas.width + 60, canvas.height - 50, 60, 50, '#2484E4');
        }
        else if(worldthree)
        {
            enemy = new Enemy(canvas.width + 40, canvas.height - 60, 40, 60, '#2484E4');
        }
        else if(worldfour)
        {
            enemy = new Enemy(canvas.width + 60, canvas.height - 40, 60, 40, '#2484E4');
        }

        enemy.ground = true;
        enemy.small = true;
        enemys.push(enemy);
    }

}

function RandomInt(min, max){
    return Math.round(Math.random() * (max- min) + min)
}


function Start() {
    canvas.width = 1300;
    canvas.height = 520;





    ctx.font = "20px sans-serif";

    gameSpeed = 3;
    gravity = 1;

    score = 0;
    highscore = 0;
    console.log(highscore);

    /*if(window.localStorage.getItem("highscore"))
    {
        highscore = window.localStorage.getItem("highscore");
    }*/

    scoreText = new GameText("Score: " + score, 25, 25, "left", "#212121", "20");
    highscoreText = new GameText("Highscore: " + highscore, canvas.width-50, 25, "right", "#212121", "20");
    StartGameFromBegining();
    requestAnimationFrame(Update);
}



function Update(){
    requestAnimationFrame(Update);
    if(continuegame)
    {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        UpdateBackground();

        if(score >= scoreforBoss)
        {
            enemys = [];
            if(!bossSpawned)
            {
                if(worldone)
                {
                    boss = new Boss(130, 160, canvas.width - 130, canvas.height/2 - 160, 15);
                }
                else if(worldtwo)
                {
                    boss = new Boss(80, 120, canvas.width - 80, canvas.height/2 - 120, 20);
                }
                else if(worldthree)
                {
                    boss = new Boss(100, 170, canvas.width - 100, canvas.height/2 - 170, 25);
                }
                else if(worldfour)
                {
                    boss = new Boss(200, 170, canvas.width - 200, canvas.height/2 - 170, 40);
                }
                bossSpawned = true;
            }

            spawnTimer--;
            if(spawnTimer <= 0)
            {
                boss.Shot();
                spawnTimer = initialSpawnTimer - gameSpeed * 7;

                //spawnTimer < 60 = 60
                if(spawnTimer < 50)
                {
                    spawnTimer = 50;
                }
            }

            for(let i = 0; i < bossEnemys.length; i++)
            {
                let bossEnemy = bossEnemys[i];

                if(bossEnemy.x + bossEnemy.width < 0)
                {
                    bossEnemys.splice(i, 1);
                }

                if(player.x < bossEnemy.x + bossEnemy.width &&
                    player.x + player.width > bossEnemy.x &&
                    player.y < bossEnemy.y + bossEnemy.height &&
                    player.y + player.height > bossEnemy.y)
                {
                    continuegame = false;
                    DeathScreen();
                }

                bossEnemy.Update();
            }

            if(!bossAttacked)
            {
                if(player.shot.x < boss.x + boss.width &&
                    player.shot.x + player.shot.width > boss.x &&
                    player.shot.y < boss.y + boss.height &&
                    player.shot.y + player.shot.height > boss.y)
                {
                    bossAttacked = true;
                    boss.hp--;
                    boss.hpbar.UpdateHP(boss.hp);
                }
            }

            boss.Update();
        }

        else{
            spawnTimer--;
            if(spawnTimer <= 0)
            {
                SpawnEnemy();
                spawnTimer = initialSpawnTimer - gameSpeed * 7;

                //spawnTimer < 60 = 60
                if(spawnTimer < 60)
                {
                    spawnTimer = 60;
                }
            }

            for(let i = 0; i < enemys.length; i++)
            {
                let enemy = enemys[i];

                if(enemy.x + enemy.width < 0)
                {
                    enemys.splice(i, 1);
                }

                if(player.x < enemy.x + enemy.width &&
                    player.x + player.width > enemy.x &&
                    player.y < enemy.y + enemy.height &&
                    player.y + player.height > enemy.y)
                {
                    continuegame = false;
                    DeathScreen();
                }

                enemy.Update();
            }
        }



        player.Animate();

        score++;
        scoreText.text = "Score: " + score;
        scoreText.Draw();

        if(score > highscore)
        {
            highscore = score;
            highscoreText.text = "Highscore: " + highscore;
        }
        highscoreText.Draw();

        if(gameSpeed <= 20)
        {
            gameSpeed += 0.003;
        }
    }
}

function UpdateBackground(){
    backx -= gameSpeed/2;
    secondbackx -= gameSpeed/2;
    if(backx <= -1300)
    {
        backx = 0;
        secondbackx = 1300;
    }
    backgroundImage.width = canvas.width;
    backgroundImage.height = canvas.height;
    if(worldone)
    {
        backgroundImage.src = "../img/Background/gokubackground.png";
        scoreText.color = "black";
        highscoreText.color = "black";
    }
    else if(worldtwo)
    {
        backgroundImage.src = "../img/Background/BackgroundWorldTwo.png";
        scoreText.color = "white";
        highscoreText.color = "white";
    }
    else if(worldthree)
    {
        backgroundImage.src = "../img/Background/SnowLandscape2.png";
        scoreText.color = "black";
        highscoreText.color = "black";
    }
    else if(worldfour)
    {
        backgroundImage.src = "../img/Background/Volcano2.png";
        scoreText.color = "white";
        highscoreText.color = "white";
    }
    ctx.drawImage(backgroundImage, backx, 0);
    ctx.drawImage(backgroundImage, secondbackx, 0);
}

function DeathScreen()
{

    let x = 750;
    let y = 100;

    //height=\"${y}\" width=\"${x}\"

    let output = document.getElementById("deathbutton");

    document.getElementById("deathbutton").style.left = x.toString() + "px";
    document.getElementById("deathbutton").style.top = y.toString() + "px";


    output.innerHTML = `<img src="../img/dead.png">`;
    document.addEventListener('keydown', () =>{
        if(keys['KeyR'] && continuegame === false)
        {
            document.getElementById("deathbutton").style.left = "0px";
            document.getElementById("deathbutton").style.top = "0px";
            output.innerHTML = ``;
            continuegame = true;
            StartGameFromBegining();
        }
    })
}

function StartScreen()
{
    startText = new GameText("Press S to start game", 50, 50, "left", "#212121", "20");
    startText.Draw();
    document.addEventListener('keydown', ()=>{
        if(keys['KeyS'] && !gameStarted)
        {
            gameStarted = true;
            Start();
        }
    })
}

StartScreen();