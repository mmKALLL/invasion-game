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
  var IMAGE_PATH = "img/";
  var FPS = 60;
  
  var gameStatus = {
    ready: false,
    get isReady() { return this.ready; },
    
  };
  
  var canvas = document.getElementById("gameCanvas");
  var ctx = canvas.getContext("2d");
  var images = {};
  
  startGame();
  
  function update() {
    
  }
  
  function draw() {
    
    function drawRotated(img, x, y, degrees) {
      ctx.translate(x, y);
      ctx.rotate(-(1+degrees)/360 * 2 * Math.PI); // FIXME: TODO: Remove 1+
      ctx.drawImage(img, 0, 0);
      ctx.rotate(degrees/360 * 2 * Math.PI);
      ctx.translate(-x, -y);
    }
    
    // background
    ctx.beginPath();
    ctx.rect(0, 0, 2000, 2000);
    ctx.fillStyle = "#FFFFFF";
    ctx.fill();
    ctx.closePath();

    ctx.drawImage(images.space_big, 0, 0);
    ctx.drawImage(images.planet, 650 / 2 - 65, 650 / 2 - 65);
    
    
    // objects (characters, enemies, etc)
    ctx.drawImage(images.blob_s1, 650 / 2 - 65, 650 / 2 - 65 - images.blob_s1.height);
    
    ctx.beginPath();
    ctx.rect(20, 40, 50, 50);
    ctx.fillStyle = "#FF0000";
    ctx.fill();
    ctx.closePath();
    
    ctx.beginPath();
    ctx.rect(500, 600, 500, 500);
    ctx.fillStyle = "#FF0000";
    ctx.fill();
    ctx.closePath();
    
    // foreground (particle effects, etc)
    drawRotated(images.beam1, 300, 100, -30);
  }
  
  // Returns true if adding to images object was a success, false otherwise.
  function loadImage(filename) {
    if (!images.filename) {
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
  
  function startGame() {
    // First some preparations:
    
    // Load images
    (function () {
      loadImage("planet.png");
      loadImage("space_big.png");
      loadImage("blob_s1.png");
      loadImage("blob_s2.png");
      loadImage("beam1.png");
    })();

    
    function checkAssets() {
      console.log("hi" + images);
      if (gameStatus.ready) {
        var key;
        for (key in images) {
          if (!images[key].ready) {
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
    
    gameStatus.ready = true;
    
    // Check that the assets are ready and launch the game
    var intervalID = window.setInterval(function () {
      checkAssets();
    }, 200);

    
  }
  
})();
