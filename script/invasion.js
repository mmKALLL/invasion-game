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
  var PATH_IMAGE = "img/";
  var FPS = 60;
  
  var canvas = document.getElementById("gameCanvas");
  var ctx = canvas.getContext("2d");
  
  function update() {
    
  }
  
  function draw() {
    ctx.beginPath();
    ctx.rect(0, 0, 2000, 2000);
    ctx.fillStyle = "#FFFFFF";
    ctx.fill();
    ctx.closePath();
    
    ctx.beginPath();
    ctx.rect(20, 40, 50, 50);
    ctx.fillStyle = "#FF0000";
    ctx.fill();
    ctx.closePath();
    
    ctx.beginPath();
    ctx.rect(400, 300, 500, 500);
    ctx.fillStyle = "#FF0000";
    ctx.fill();
    ctx.closePath();
    
    ctx.drawImage(memebig, 10, 10);
    ctx.drawImage(memesmall, 20, 20);
    ctx.drawImage(memesmall_transparent, 30, 30);
  }
  
  var memebig = new Image();
  memebig.ready = false;
  memebig.onload = function () { this.ready = true; };
  memebig.src = PATH_IMAGE + "memebig.jpg";
  var memesmall = new Image();
  memesmall.ready = false;
  memesmall.onload = function () { this.ready = true; };
  memesmall.src = PATH_IMAGE + "memesmall.jpg";
  var memesmall_transparent = new Image();
  memesmall_transparent.ready = false;
  memesmall_transparent.onload = function () { this.ready = true; };
  memesmall_transparent.src = PATH_IMAGE + "memesmall-transparent.jpg";

  setInterval(function() {
    update();
    draw();
  }, 1000/FPS);
  
/*  function resize() {
   	// Our canvas must cover full height of screen
   	// regardless of the resolution
    var canvas = document.getElementById("gameCanvas");
   	var height = window.innerHeight;
   	
   	// So we need to calculate the proper scaled width
   	// that should work well with every resolution
   	var ratio = canvas.width/canvas.height;
   	var width = height * ratio;
   	
    canvas.style.height = height+"px";
   	canvas.style.width = width+"px";
  }
  window.addEventListener("resize", resize, false);*/
  
/*
  var player = {
    forwardSteps: 0,
    backwardSteps: 0,
    get totalSteps() { return this.forwardSteps + this.backwardSteps; },
    get position() { return this.forwardSteps - this.backwardSteps; },

    stepForward: function() {
      player.forwardSteps += 1;
      if (player.totalSteps <= 1)
        messagebox.pushMessage("You have taken your first step!");
      else messagebox.pushMessage("You have taken a step " + player.totalSteps + " times!");
      updateStatus();
    },

    stepBackward: function() {
      player.backwardSteps += 1;
      if (player.backwardSteps <= 1)
        messagebox.pushMessage("You took a step back!");
      else messagebox.pushMessage("You have taken a step back " + player.backwardSteps + " times!");
      updateStatus();
    },

  };


  var messagebox = {
    elem: document.getElementById("messageBox"),
    pushMessage: function(string) { this.elem.innerHTML = string + "<br>" + this.elem.innerHTML; },
  };

  function updateStatus() {
    var elem = document.getElementById("statusArea");
    elem.innerHTML =  "You have taken " + player.totalSteps + " steps.<br>" +
                      "Your current position is " + player.position + ".<br>";

  }

  updateStatus();
  document.getElementById("stepForwardButton").addEventListener("click", player.stepForward);
  document.getElementById("stepBackwardButton").addEventListener("click", player.stepBackward);
*/
})();
