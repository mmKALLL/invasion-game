"use strict";

/* *****************************************************************************
 * Invasion - A game about defending your planet and escaping solitude.
 * Author: Esa Koskinen (mmKALLL)
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Copyright (c) 2017 Esa Koskinen
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 * *****************************************************************************/



(function () {
  
  /* CONSTANTS */
  var CONSOLE_DEBUG = true;
  var IMAGE_PATH = "img/";
  var SOUND_PATH = "sound/";
  var FPS = 60;
  var BG_SPIN_SPEED = 0.03;
  var RANDOM_LASERSHOT_SOUND = true;
  var HARD_MODE = false;
  
  var mouseButtonDown = 0;
  var mouseLastX = 0, mouseLastY = 0;
  document.body.onmousedown = function() {
    ++mouseButtonDown;
  };
  document.body.onmouseup = function() {
    --mouseButtonDown;
  };
  
  var gameStatus = {
    ready: false,
    get isReady() { return this.ready; },
    sfxVolume: 0.35,
    gameFrame: 0,
    state: "mainmenu",
  };
  
  var activeShots = [];
  var activeEnemies = [];
  
  var canvas = document.getElementById("gameCanvas");
  var ctx = canvas.getContext("2d");
  var images = {};
  var sounds = {};
  
  startGame();
  
  function update() {
    gameStatus.timeSinceLastFire += 1;
    gameStatus.gameFrame += 1;
    if (gameStatus.energy <= gameStatus.maxEnergy) {
      gameStatus.energy += gameStatus.energyChargeRate;
    }
    var i;
    for (i = 0; i < activeShots.length; i += 1) {
      activeShots[i].activeSince += 1;
      // remove if old shot
      if (activeShots[i].activeSince - activeShots[i].visibleUntil > 0 && activeShots[i].activeSince - activeShots[i].activeFrames > 0) {
        activeShots = activeShots.slice(0, i).concat(activeShots.slice(i + 1, activeShots.length));
      } else {
        if (activeShots[i].activeSince - activeShots[i].activeFrames < 0) {
          checkShotTargets(activeShots[i]);
        }
      }
    }
    
    if (mouseButtonDown) {
      handleMouseHold({
        clientX: mouseLastX,
        clientY: mouseLastY,
      });
    }
    
  }
  
  function checkShotTargets(shot) {
    // TODO
  }
  
  function draw() {
    if (gameStatus.state === "ingame") {
      drawIngame();
    } else if (gameStatus.state === "mainmenu") {
      drawMainMenu();
    } else if (gameStatus.state === "paused") {
      drawPauseScreen();
    } else if (gameStatus.state === "levelup") {
      drawLevelup();
    }
  }
  
  function drawMainMenu() {
    drawBackground();
    drawTitle();
  }
  
  function drawPauseScreen() {
    // TODO
  }
  
  function drawLevelup() {
    
  }
  
  function drawTitle() {
    ctx.drawImage(images.titleimage, 650 / 2 - images.titleimage.width / 2, 100);
    ctx.drawImage(images.playbutton, 650 / 2 - images.playbutton.width / 2, 500);
  }
  
  function drawBackground() {
    // background
    ctx.beginPath();
    ctx.rect(0, 0, 2000, 2000);
    ctx.fillStyle = "#FFFFFF";
    ctx.fill();
    ctx.closePath();

    drawRotated(images.space_big, 325, 325, gameStatus.gameFrame * BG_SPIN_SPEED, -675, -675);
    ctx.drawImage(images.planet, 650 / 2 - 105, 650 / 2 - 105);
  }
  
  function drawBlobIdle() {
    // idle animated blob_s
    if (gameStatus.gameFrame % 60 < 30) {
      ctx.drawImage(images.blob_s1, 650 / 2 - images.blob_s1.width / 2, 650 / 2 - 65 - images.blob_s1.height / 2);
    } else {
      ctx.drawImage(images.blob_s2, 650 / 2 - images.blob_s2.width / 2, 650 / 2 - 65 - images.blob_s2.height / 2);
    }
  }
  
  function drawActiveShots() {
    
  }
  
  function drawActiveEnemies() {
    var i;
    for (i = 0; i < activeEnemies.length; i += 1) {
      //console.log(activeShots[i].targetY, activeShots[i].targetX);
      ctx.save();
      if (activeEnemies[i].animationStyle === "rotate") {
        drawRotated(activeEnemies[i].image,
            activeEnemies[i].x - activeEnemies[i].image.width / 2,
            activeEnemies[i].y - activeEnemies[i].image.height / 2,
            gameStatus.gameFrame % 360);
      } else {
        drawImage(activeEnemies[i].image,
            activeEnemies[i].x - activeEnemies[i].image.width / 2,
            activeEnemies[i].y - activeEnemies[i].image.height / 2);
      }

      ctx.restore();
    }
  }
  
  function drawActiveShots() {
    var i;
    for (i = 0; i < activeShots.length; i += 1) {
      //console.log(activeShots[i].targetY, activeShots[i].targetX);
      ctx.save();
      if (activeShots[i].animationStyle === "fade") {
        ctx.globalAlpha = 1 - (activeShots[i].activeSince * 1.0 / activeShots[i].visibleUntil);
      }
      var angle = Math.atan2(activeShots[i].originY - activeShots[i].targetY, activeShots[i].targetX - activeShots[i].originX);
      drawRotated(activeShots[i].image, activeShots[i].originX - (13 * Math.sin(angle)), activeShots[i].originY - (13 * Math.cos(angle)),
          360*angle/(2*Math.PI),
          0, 0);
      ctx.restore();
    }
  }
  
  // Helper function for drawing things rotated by some amount of degrees
  function drawRotated(img, x, y, degrees, dx, dy) {
    if (!dx || !dy) {
      dx = 0; dy = 0;
    }
    ctx.translate(x, y);
    ctx.rotate(-(degrees)/360 * 2 * Math.PI);
    ctx.drawImage(img, dx, dy);
    ctx.rotate(degrees/360 * 2 * Math.PI);
    ctx.translate(-x, -y);
  }
    
  function drawIngame() {
    
    drawBackground();
    
    // objects (characters, enemies, etc)
    drawBlobIdle();

    // Center marker
    //ctx.beginPath();
    //ctx.rect(320, 320, 10, 10);
    //ctx.fillStyle = "#FF0000";
    //ctx.fill();
    //ctx.closePath();
    
    // foreground (particle effects, etc)
    drawActiveShots();
    drawActiveEnemies();
  }
  
  // Returns true if adding to images object was a success, false otherwise.
  function loadImage(filename) {
    if (!images[filename.slice(0, -4)]) {
      var img = new Image();
      img.ready = false;
      img.onload = function () { img.ready = true; };
      img.src = IMAGE_PATH + filename;
      images[filename.slice(0, -4)] = img;
      return true;
    } else {
      return false;
    }
  }
  
  // Returns true if adding to sounds object was a success, false otherwise.
  function loadSound(filename) {
    if (!sounds[filename.slice(0, -4)]) {
      var snd = new Audio(SOUND_PATH + filename);
      snd.ready = false;
      snd.addEventListener("canplaythrough", function () { snd.ready = true; });
      snd.volume = gameStatus.sfxVolume;
      sounds[filename.slice(0, -4)] = snd;
      return true;
    } else {
      return false;
    }
  }
  
  function changeSfxVolume(newVolume) {
    gameStatus.sfxVolume = newVolume;
    for (key in sounds) {
      sounds[key].volume = newVolume;
    }
  }
  
  // Mouse event handler. Shoot things if ingame, otherwise control menus.
  function handleMouseClick(event) {
    if (gameStatus.state === "mainmenu") {
      gameStatus.state = "ingame";
    }
    else if (gameStatus.state === "ingame" && gameStatus.readyToFire) {
      var canvasPosition = canvas.getBoundingClientRect();
      activeShots.push({
        originX: 325,
        originY: 325 - 66,
        targetX: event.clientX - canvasPosition.left,
        targetY: event.clientY - canvasPosition.top,
        activeSince: 0,
        activeFrames: gameStatus.shotActiveFrames,
        damage: gameStatus.shotDamage,
        visibleUntil: gameStatus.shotVisualFrames,
        animationStyle: "fade",
        image: images.beam1,
      });
      
      if (RANDOM_LASERSHOT_SOUND) {
        var name = "lasershot" + (Math.floor(Math.random() * 4) + 1);
        var snd = sounds[name].cloneNode(true);
        snd.volume = sounds[name].volume; // JS attributes not copied on cloneNode; need to set manually
        snd.play();
      } else {
        sounds.lasershot1.cloneNode(true).play();
      }
      gameStatus.timeSinceLastFire = 0;
      gameStatus.energy = 0;
    }
  }
  
  function handleMouseMove(event) {
    mouseLastX = event.clientX;
    mouseLastY = event.clientY;
  }
  
  function handleMouseHold(event) {
    if (gameStatus.state === "ingame") {
      handleMouseClick(event);
    }
  }
  
  function startGame() {
    // First some preparations:
    
    // Load assets
    loadImage("planet.png");
    loadImage("space_big.png");
    loadImage("blob_s1.png");
    loadImage("blob_s2.png");
    loadImage("beam1.png");
    loadImage("titleimage.png");
    loadImage("playbutton.png");
    
    loadSound("lasershot1.wav");
    loadSound("lasershot2.wav");
    loadSound("lasershot3.wav");
    loadSound("lasershot4.wav");
    loadSound("lasershot5.wav");
    loadSound("lasershot6.wav");

    function checkAssets() {
      if (gameStatus.ready) {
        var key;
        for (key in images) {
          if (!images[key].ready) {
            return 0;
          }
        }
        for (key in sounds) {
          if (!sounds[key].ready) {
            return 0;
          }
        }

        window.setInterval(function() {
          update();
          draw();
        }, 1000/FPS);
        window.clearInterval(intervalID);
      }
    }
    
    // Set up the game logic
    gameStatus = {
      ready: false,
      get isReady() { return this.ready; },
      sfxVolume: 0.35,
      
      gameFrame: 0,
      timeSinceLastFire: 999,
      get readyToFire() { return (this.timeSinceLastFire - this.shotCooldown) >= 0 && this.energy === this.maxEnergy; },
      
      // player stats and shot properties
      energy: 100,
      maxEnergy: 100,
      get energyChargeRate() { return 0.5 + this.energyChargeRatePerLevel * this.energyChargeRateLevel; },
      shotActiveFrames: 1,
      shotVisualFrames: 65,
      shotCooldown: 5,
      shotDamage: 100,
      planetMaxHP: 1000,
      
      // game progression and level up increases
      wave: 1,
      waveEnemiesLeft: 8,
      newWaveEnemies: function() {},
      enemySpawnSpeed: HARD_MODE ? 0.002 : 0.001,
      
      energyChargeRateLevel: 1,
      shotDamageLevel: 1,
      planetMaxHPLevel: 1,
      energyChargeRatePerLevel: HARD_MODE ? 0.05 : 0.10,
      shotDamagePerLevel: HARD_MODE ? 5 : 10,
      planetMaxHPPerLevel: HARD_MODE ? 80 : 150,
    };
    
    gameStatus.state = "mainmenu";
    
    window.addEventListener("click", handleMouseClick);
    window.addEventListener("mousemove", handleMouseMove);
    
    gameStatus.ready = true;
    
    // Check that the assets are ready and launch the game
    var intervalID = window.setInterval(function () {
      checkAssets();
    }, 200);

    
  }
  
})();
