import kaboom from "kaboom"

// initialize context
kaboom()

// load assets
loadSprite("bean", "sprites/bean.png")
loadSprite("bg", "sprites/bg.jpg")
loadSprite("pipe", "sprites/pipe.png")
loadSound("score", "sounds/score.mp3");
loadSound("wtbb", "sounds/wtbb.mp3");

let highscore = 0

layers([
  "bg",
  "game", 
  "ui",
]);

scene("menu", () => {
  add([
    sprite("bg", {width: width(), height: height()}),
  ]);
  
  play("wtbb")
  
  add([
    text("Welcome to the Backrooms Bean video game. \nSpace to jump!", {size: 50})
  ])
  
  keyPress("space", () => {
    go("game")
  })

})

scene("game", () => {
  const PIPE_GAP = 150;

  let score = 0
  
  add([
    sprite("bg", {width: width(), height: height()}),
  ]);
  
  const scoreText = add([
    text(score, {size: 50}),
    layer("ui"),
  ])
    
  // add a character to screen
  const player = add([
  	// list of components
  	sprite("bean"),
  	pos(80, 40),
    scale(.7),
  	area(),
    body(),
  ]);
  
  
  
  function spawnPipes(){
    const offset = rand(-100, 100)
    add([
      sprite("pipe"),
      scale(.3),
      pos(width(), height()/2 + offset + PIPE_GAP/2),
      layer("game"),
      area(),
      "pipe",
      {"passed": false},
    ])
    
    add([
      sprite("pipe", {flipY: true}),
      scale(.3),
      pos(width(), height()/2 + offset - PIPE_GAP/2),
      origin("botleft"),
      area(),
      "pipe"
    ])

  };

  loop(1.5, () => {
    spawnPipes();
  })
  
  
  
  action("pipe", (pipe) => {
    pipe.move(-160, 0)

    if (pipe.passed === false && pipe.pos.x < player.pos.x) {
      pipe.passed = true
      score += 1
      play("score")
      scoreText.text = score
      
    }
  });
  
  player.collides("pipe", () => {
    go("game over", score)
  });

  player.action(() => {
    if (player.pos.y > (height() + 100) || player.pos.y < -100) {
      go("game over", score)
    }
  });
  
  keyPress("space", () => {
    player.jump(400);
  });
})

scene("game over", (score) => {

  if(score > highscore) {
    highscore = score
  }
  
  add([
    sprite("bg", {width: width(), height: height()}),
  ]);
  add([
    text("Game Over!\nYou passed through " + score + " pipes!\nYour highscore is " + highscore + "!", {size: 35})
  ])

  keyPress("space", () => {
    go("game")
  })
});

go("menu");