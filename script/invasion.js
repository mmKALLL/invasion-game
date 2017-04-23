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
  var SHOT_ACTIVE_FRAMES = 1;
  var SHOT_VISUAL_FRAMES = 65;
  var SHOT_COOLDOWN = 0;
  var SHOT_DAMAGE = 100;
  var PLANET_MAX_HP = 1000;
  var BG_SPIN_SPEED = 0.03;
  var RANDOM_LASERSHOT_SOUND = true;
  
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
    gameFrame: 0,
    timeSinceLastFire: 0,
    get readyToFire() { return (this.timeSinceLastFire - SHOT_COOLDOWN) >= 0; },
    audioVolume: 0.6,
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
      handleMouseClick({
        clientX: mouseLastX,
        clientY: mouseLastY,
      });
    }
    
  }
  
  function checkShotTargets(shot) {
    // TODO
  }
  
  function draw() {
    
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
    
    // background
    ctx.beginPath();
    ctx.rect(0, 0, 2000, 2000);
    ctx.fillStyle = "#FFFFFF";
    ctx.fill();
    ctx.closePath();

    drawRotated(images.space_big, 325, 325, gameStatus.gameFrame * BG_SPIN_SPEED, -675, -675);
    ctx.drawImage(images.planet, 650 / 2 - 105, 650 / 2 - 105);
    
    
    // objects (characters, enemies, etc)
    ctx.drawImage(images.blob_s1, 650 / 2 - images.blob_s1.width / 2, 650 / 2 - images.blob_s1.height / 2);

    // Center marker
    ctx.beginPath();
    ctx.rect(320, 320, 10, 10);
    ctx.fillStyle = "#FF0000";
    ctx.fill();
    ctx.closePath();
    
    // foreground (particle effects, etc)
    var i;
    for (i = 0; i < activeShots.length; i += 1) {
      console.log(activeShots[i].targetY, activeShots[i].targetX);
      ctx.save();
      if (activeShots[i].animationStyle === "fade") {
        ctx.globalAlpha = 1 - (activeShots[i].activeSince * 1.0 / activeShots[i].visibleUntil);
      }
      drawRotated(activeShots[i].image, activeShots[i].originX, activeShots[i].originY - 10,
          360*Math.atan2(activeShots[i].originY - activeShots[i].targetY, activeShots[i].targetX - activeShots[i].originX)/(2*Math.PI),
          0, -10);
      ctx.restore();
    }
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
      snd.volume = gameStatus.audioVolume;
      sounds[filename.slice(0, -4)] = snd;
      return true;
    } else {
      return false;
    }
  }
  
  function changeAudioVolume(newVolume) {
    gameStatus.audioVolume = newVolume;
    for (key in sounds) {
      sounds[key].volume = newVolume;
    }
  }
  
  // Mouse event handler. Shoot things if ingame, otherwise control menus.
  function handleMouseClick(event) {
    if (gameStatus.state === "ingame" && gameStatus.readyToFire) {
      var canvasPosition = canvas.getBoundingClientRect();
      activeShots.push({
        originX: 325,
        originY: 325,
        targetX: event.clientX - canvasPosition.left,
        targetY: event.clientY - canvasPosition.top,
        activeSince: 0,
        activeFrames: SHOT_ACTIVE_FRAMES,
        damage: SHOT_DAMAGE,
        visibleUntil: SHOT_VISUAL_FRAMES,
        animationStyle: "fade",
        image: images.beam1,
      });
      
      if (RANDOM_LASERSHOT_SOUND) {
        console.log("lasershot" + (Math.floor(Math.random() * 4) + 1));
        sounds["lasershot" + (Math.floor(Math.random() * 4) + 1)].cloneNode(true).play();
      } else {
        sounds.lasershot1.cloneNode(true).play();
      }
      gameStatus.timeSinceLastFire = 0;
    }
  }
  
  function handleMouseMove(event) {
    mouseLastX = event.clientX;
    mouseLastY = event.clientY;
  }
  
  function startGame() {
    // First some preparations:
    
    // Load assets
    loadImage("planet.png");
    loadImage("space_big.png");
    loadImage("blob_s1.png");
    loadImage("blob_s2.png");
    loadImage("beam1.png");
    
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
    gameStatus.player = {}; // TODO
    gameStatus.timeSinceLastFire = 0;
    gameStatus.state = "ingame";
    
    window.addEventListener("click", handleMouseClick);
    window.addEventListener("mousemove", handleMouseMove);
    
    gameStatus.ready = true;
    
    // Check that the assets are ready and launch the game
    var intervalID = window.setInterval(function () {
      checkAssets();
    }, 200);

    
  }
  
})();
