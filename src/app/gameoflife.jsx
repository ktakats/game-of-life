'use strict';

//var React=require('react');
//var ReactDOM = require('react-dom');
import React from 'react';
import {render} from 'react-dom';
import $ from 'jquery';
import jQuery from 'jquery';

var board=[];
var width=50;
var height=50;
var cells=width*height;
var generation=0;
var running=0;
var delay=200;
var Cell;
var cellsize="";
var contsize=";"

//event handlers
$('#pause').click(function(){
   if(running==1){
   running=0;}
  $(this).addClass('pushed')
});

$('#start').click(function(){
  if(running==0){
    running=1;
    $('#pause').removeClass('pushed');
    runIt();
  }
});

$('#clear').click(function(){
  if(running==1){running=0}
  generation=0;
  clearBoard();
  Draw();
});

$('.size').click(function(){
  if(running==1){running=0}

  generation=0;

  var pick=$(this).attr('id');
  $(this).addClass('pushed')

  switch(pick){
  case "small":
    width=20;
    height=20;
    cells=width*height;
    cellsize="15px";
    contsize="340px";
    $('#normal').removeClass('pushed');
    $('#large').removeClass('pushed');
    break;
  case "normal":
    width=50;
    height=50;
    cells=width*height;
    cellsize="11px";
    contsize="650px";
    $('#small').removeClass('pushed');
    $('#large').removeClass('pushed');
    break;
  case 'large':
    width=100;
    height=100;
    cells=width*height;
    cellsize="10px";
    contsize="1200px";
    $('#normal').removeClass('pushed');
    $('#small').removeClass('pushed');
    break;
  }
  clearBoard();
  initialSet();
	createBoard();
  activate();
  $('.cell').css({"width": cellsize, "height": cellsize});
  $('#container').css({"width": contsize, "height": contsize});
})

$('.speed').click(function(){
  if(running==1){running=0}
  var pick=$(this).attr('id');
  $(this).addClass('pushed')

  switch(pick) {
    case "slow":
      delay=500;
      $('#medium').removeClass('pushed');
      $('#fast').removeClass('pushed');
      break;
    case "medium":
      delay=200;
      $('#slow').removeClass('pushed');
      $('#fast').removeClass('pushed');
      break;
    case "fast":
      delay=50;
      $('#medium').removeClass('pushed');
      $('#slow').removeClass('pushed');
      break;
  }
  running=1;
  $('#pause').removeClass('pushed');
  runIt();
})

//start

$(document).ready(function() {
	$("#gen").text("0");
	clearBoard();
  initialSet();
	createBoard();
	activate();
	running = 1;
runIt();
});

//functions

function clearBoard() {
  //clears Board
	board = [];
	for (var i = 0; i < (cells); i++) {
		board[i] = {id: i, status: "cell dead"};
	}
	generation = 0;
};

function initialSet() {
	//populates the board with random living cells

	for (var i = 0; i < cells; i++) {
		var randomCell = Math.round(Math.pow(Math.random(),3));
		if (randomCell === 1) {
			board[i] = {id: i, status: "cell alive"};
		} else {
			board[i] = {id: i, status: "cell dead"};
		}
	}
};

function createBoard(){
  //creates the cells of the Board
  Cell=React.createClass({
    getInitialState: function(){
      return {myboard: this.props.board}
    },

    render: function(){
      var out=this.props.board.map(function(cell,i){
          return(<div className={cell.status} key={i} id={i}></div>);});
      return (
      <div>
        {out}
      </div>
      )
    }
  })

  Draw();
};

function activate(){
  //allows to click the cells to create life
$('.cell').click(function(){
  var Num=$(this).attr('id');
  if(board[Num].status!="cell alive"){
    board[Num].status='cell alive';}
  else{
      board[Num].status="cell dead";
    }
  Draw();
});
}

function cellCheck(i){
  //checks how many living neighbors cell i has and determines whether it lives or dies
  var out=''
  var cellStatus=board[i].status;
  var neighbors;
  var a1=i-width-1;
  var a2=i-width;
  var a3=i-width+1;
  var b1=i-1;
  var b2=i+1;
  var c1=i+width-1;
  var c2=i+width;
  var c3=i+width+1;
  if(i % width == 0){a1=i-1; b1=i+width-1, c1=i+2*width-1}
  if((i+1) % width==0){a3=i-2*width+1; b2=i-width+1; c3=i+1}
  if(i==0){a1=cells-width-1}
  if(i==width-1){a3=cells-i-1}
  neighbors=[a1,a2,a3,b1,b2,c1,c2,c3];
  neighbors=neighbors.map(function(item,index){
    return (item<0) ? cells+item : (item>cells-1) ? item-cells : item
  });

  var neighborStatus=neighbors.map(function(id,ix){
    return board[id].status;
  });

  var liveNeighbors=neighborStatus.filter(function(x){return (x!="cell dead")}).length;
  if(cellStatus!="cell dead"){
    if(liveNeighbors==2 || liveNeighbors ==3){
      out="cell alive old";
    }
    else{out="cell dead"}
  }
  if(cellStatus=="cell dead"){
    if(liveNeighbors==3){
      out="cell alive"
    }
    else{
      out="cell dead"
    }
  }
  return out;
}

function newGeneration(){
  //calculates the next generation
  board=board.map(function(item, id){
    var out=cellCheck(id);
    return {id: id, status: out}});

}

function runIt(){
  //runs the next generation
  if(running==1){
  setTimeout(function(){
    generation++;
    newGeneration();
    setTimeout(function(){
      Draw();
      runIt();
    }, delay);
  }, 0);
  }
}

function Draw(){
  //draws the board
 $('#gen').text(generation);
//ReactDOM.render(
render(
  <Cell board={board}/>,
  document.getElementById('container')
);}
