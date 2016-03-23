/**
 *Creates an instance of game
 *
 *@constructor
 *@param{DOM element}container Element which contains cells of plaing field
 *@param{Object}scoreBoard Object which contains methods of managing count 
 */
function Game(container, scoreBoard) {
	
	var flag = false;
	var countPass = 0;
	var field = container.querySelectorAll('span');
	var soundLabel = container.querySelector('#soundLabel');
	var soundFlag = true;
	var check = -1;

	//array containts all probable lines win combinations
	var matrix = [                               
	[ field[0], field[1], field[2] ],
	[ field[3], field[4], field[5] ],
	[ field[6], field[7], field[8] ],
	[ field[0], field[3], field[6] ],
	[ field[1], field[4], field[7] ],
	[ field[2], field[5], field[8] ],
	[ field[0], field[4], field[8] ],
	[ field[2], field[4], field[6] ]
];

/**
*Definition is cell occupied
*@param{DOM element}cell Element form plaing field
*@return {boolean} true if element occupied
*/
function cellOccupied(cell) {
	return (cell.classList.contains('zero') || cell.classList.contains('cross')) 
	? true: false;	
	}

/**
*@param{Array}field Array which contains all plaing cells
*@return {number} return random number of empty cell
*/
function getEmptyCell(field){
	var arrEmptyCells = [];
	for(var i=0; i<field.length;i++){
		if(!cellOccupied(field[i])){
			arrEmptyCells.push(i);
		}
	}
	return arrEmptyCells[Math.floor(Math.random()* arrEmptyCells.length)];
}

/**
*Detects does anyone have the completed line
*@return{number} 1 or 0 or -1 
*/
function checkWin(){
	var cross;
	var zero;
	
	for(var i = 0; i<matrix.length; i++) {
		cross = 0;
		zero = 0;
		for(var j = 0; j<matrix[i].length; j++){
			if(cellOccupied(matrix[i][j])){
				(matrix[i][j].classList.contains('zero'))? zero++: cross++;		
			}
		}
		 if(zero == 3) {
		 	return 0;
		 }else if(cross == 3) {
		 	return 1;
		 }
	}
	return -1;
}

/**
*Determines where will be strike from computer side 
*/
function artIntell(){
	var zero, cross;
	var emptycell = 0;
	for(var i = 0; i<matrix.length; i++){
		zero = 0;
		cross = 0;
		emptycell=0;
		for(var j = 0;  j<matrix[i].length; j++){
			if(matrix[i][j].classList.contains('zero')){
				zero++;
				
			}else if(matrix[i][j].classList.contains('cross')) {
				cross++;
				
			}else if(!matrix[i][j].classList.contains('zero') && !matrix[i][j].classList.contains('cross')){
				emptycell++;

			}

			if(zero == 2 && emptycell > 0){
				compPass(matrix[i]);
				return;
			}else if(cross == 2 && emptycell > 0) {
				compPass(matrix[i]);
				return;
			}
		}
	}
	if(!cellOccupied(field[4])) {
		stroke(flag, field[4]);
		return;
	}
	compPass(field);
}

/**
*Makes strike from computer side
*/
function compPass(field){
	stroke(flag,field[getEmptyCell(field)]);
	getResault();	
}

/**
*
*Makes mar on plaing field
*@param{boolean}mark From which player will be stroke
*@param{DOM element}cell Cell where makes stroke.
*/
function stroke(mark, cell){
	if(mark){
		soundDecor('zero', soundFlag);
		cell.classList.add('zero');
		
	}else{
		soundDecor('cross', soundFlag);
		cell.classList.add('cross');
		
	}

	flag = !flag;
	countPass++;
}

 /**
 *Determines is game over
 */  
function getResault() {
    check = checkWin();
  if(check == 0) {
  	soundDecor('failure', soundFlag);

  	setTimeout(function() {
    scoreBoard.updateScorer('zero');
    newRound();
  }, 4000);
      
  }else if(check == 1) {
  	soundDecor('win', soundFlag);
  	setTimeout(function() {
  	scoreBoard.updateScorer('cross');
  	newRound();
  	}, 4000);
  }else if(countPass == 9) {
    soundDecor('nonwin', soundFlag);
    setTimeout(function() {
  	newRound();
  	}, 4000);
  }else if(flag == true){
  	setTimeout(function() {artIntell();}, 1200);
  }
}

/**
* Clears the field
*/
function newRound(){
    countPass = 0;
    flag = false;
    check = -1; 
  	for(var i = 0; i<field.length; i++){
  		field[i].classList.remove('zero','cross');
  	}
}

/**
*@param{string}mark Name of sound effect
*@param{boolean}soundFlag Determinates is run sound in the game 
*/
function soundDecor(mark,soundFlag){
	if(!soundFlag) return;
	var audio = new Audio();
	audio.src = 'sound/'+mark+'.wav';
	audio.autoplay = true;
}	

/**
*Handler passes from user
*/
container.onclick = function(event){
	if(flag || check == 0 || check == 1 || event.target.tagName !="SPAN")
	{
		return;
	}else if(cellOccupied(event.target)){
		soundDecor('incorrect', soundFlag);
		return;
	}else {
		stroke(flag,event.target);
		getResault();
	}
}

/**
*Handler for sound toggle label
*/
soundLabel.onclick = function() {
	console.log("click sound toggle");
	soundFlag ? soundLabel.src = 'img/soundoff.png': soundLabel.src = 'img/soundon.png';
	soundDecor('toggle', true);
	soundFlag =!soundFlag;
}

/**
*Handler for enter user name 
*/
scoreBoard.changUsNam.onclick = function() {
	soundDecor('changeName', soundFlag);
	setTimeout(function() {
	var name;
	scoreBoard.title.textContent = '';
	name = prompt('Enter your name', 'Guest');
 	scoreBoard.changeUserName(name == ''? 'Guest':name);}, 300);
}

 this.soundDecor = soundDecor;
 this.soundFlag = soundFlag;
}


/**
*@constructor
*@param{DOM element} board Element which contains count table
*/
function ScoreBoard(board) {
	var compPoint = 0;
	var userPoint = 0;
	var changUsNam = board.querySelector('#userName');
    var title = board.querySelector('#title');

/**
* increases value
*@param{boolean}flag What value will be increasing 
*/
function counter(flag) {
    flag == 'cross' ? userPoint++: compPoint++;
}

/**
*
*Updates values in scorer board
*/
function updateScorer(flag) {
    counter(flag);
    	if(flag == 'cross') {
    		board.querySelector('#userCount').textContent = userPoint;
    	}else{
    		board.querySelector('#compCount').textContent = compPoint;
    }
}

/**
*Added chanded user name with length control
*/
function changeUserName(name) {
	if(name.length>10) {
		name = name.substring(0,10)+'...';
	}				
		board.querySelector('#userName').textContent = name;
}

	this.updateScorer = updateScorer;
	this.userPoint = userPoint;
	this.compPoint = compPoint;
	this.changUsNam = changUsNam;
	this.title = title;
	this.changeUserName = changeUserName;
}

window.onload = function() {
	var scoreBoard = new ScoreBoard(document.getElementById('scoreBoard'));
	var game = new Game(document.getElementById("container"), scoreBoard);
	game.soundDecor('start', game.soundFlag);
};
