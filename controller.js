/*
Create by: Liuben López Aparicio
https://www.linkedin.com/in/liuben-lopez-aparicio/
Date: 03/10/2023
*/

var rowSize = 20;
var columnSize = 10;
const posibleMovement = {Down : 1, Left : 2, Right : 3, Rotate : 4};
var pieceTipe = ["L", "LInv", "I", "IInv", "T", "Z", "ZInv", "O"];
var pieceColors = ["#008000", "#008000", "#0000FF", "#0000FF", "#E6E60a", "#800080", "#800080", "#E20928"];
const posiblePieces = {L : [[0,(Math.round(columnSize/2))-2],[1,(Math.round(columnSize/2))-2],[1,(Math.round(columnSize/2))-1],[1,(Math.round(columnSize/2))]], LInv : [[0,(Math.round(columnSize/2))],[1,(Math.round(columnSize/2))-2],[1,(Math.round(columnSize/2))-1],[1,(Math.round(columnSize/2))]], I : [[0,(Math.round(columnSize/2))-2],[0,(Math.round(columnSize/2))-1],[0,(Math.round(columnSize/2))],[0,(Math.round(columnSize/2)+1)],[0,(Math.round(columnSize/2)+2)]], IInv : [[0,(Math.round(columnSize/2))],[1,(Math.round(columnSize/2))],[2,(Math.round(columnSize/2))],[3,(Math.round(columnSize/2))],[4,(Math.round(columnSize/2))]], T : [[0,(Math.round(columnSize/2))-1],[1,(Math.round(columnSize/2))-2],[1,(Math.round(columnSize/2)-1)],[1,(Math.round(columnSize/2))]], Z : [[0,(Math.round(columnSize/2))-2],[0,(Math.round(columnSize/2))-1],[1,(Math.round(columnSize/2))-1],[1,(Math.round(columnSize/2))]], ZInv : [[0,(Math.round(columnSize/2))-1],[0,(Math.round(columnSize/2))],[1,(Math.round(columnSize/2)-2)],[1,(Math.round(columnSize/2)-1)]], O : [[0,(Math.round(columnSize/2))-1],[0,(Math.round(columnSize/2))],[1,(Math.round(columnSize/2))-1],[1,(Math.round(columnSize/2))]]};
const posibleCoodenates = {Length3 : [[0,0],[1,0],[2,0],[2,1],[2,2],[1,2],[0,2],[0,1]], Length5 : [[0,0],[0,1],[0,2],[0,3],[0,4]], Length5Inv : [[0,0],[1,0],[2,0],[3,0],[4,0]]};
var piece = [];
var pieceColor = "#FFFFFF";
var grid = [];
var TimerHandler;
var TimerInterval = 1000;
var deletedRows = 0;
var gameOver = false;
			
function modifyGrid(){
	stopExecution();
	document.getElementById("TableGrid").innerHTML  = "<tbody></tbody>";
	rowSize = document.getElementById("rowSize").value;
	columnSize = document.getElementById("columnSize").value;
	createGrid();
	diplayGrid();
	movePieceDown();
	showStartPanel();
}

function createGrid(){
	grid = [];
	for(let i=0; i<rowSize; i++){
		let colum = [];
		for(let j=0; j<columnSize; j++){
			colum.push(0);
		}
		grid.push(colum);
	}
}

function createPiece(){
	let value =  Math.floor(Math.random() * (pieceTipe.length - 0) + 0);
	piece = posiblePieces[pieceTipe[value]];
	pieceColor = pieceColors[value];
	for(let i=0; i<piece.length; i++){
		grid[piece[i][0]][piece[i][1]] = pieceColor;
	}
}

function updatePiecePosiotion(){
	for(let i=0; i<piece.length; i++){
		grid[piece[i][0]][piece[i][1]] = pieceColor;
	}
}
			
function diplayGrid(){
	document.getElementById("TableGrid").innerHTML  = "<tbody></tbody>";
	for(let i=0; i<rowSize; i++){
		let row = "<tr>";
		for(let j=0; j<columnSize; j++){
			if(grid[i][j] != 0){
				row += "<td style='border: 1px solid black; background-color:"+grid[i][j]+"; color:"+grid[i][j]+"; padding: 5px; font-size: 0px; text-align: center;' id='"+i+"-"+j+"'><div>1</div></td>";
			}else{
				row += "<td style='border: 1px solid black; background-color:white; color:white; padding: 5px; font-size: 0px; text-align: center;' id='"+i+"-"+j+"'><div>0</div></td>";
			}
		}
		row += "</tr>";
		let tbodyRef = document.getElementById("TableGrid").getElementsByTagName('tbody')[0];
		let newRow = tbodyRef.insertRow(tbodyRef.rows.length);
		newRow.innerHTML = row;
	}	
}

function checkDeleteableRows(){
	for(let i = grid.length-1; i > 0; i--){
		let pixelsOccupiedCounter = 0;
		grid[i].forEach(function(colum) {
			if(colum != 0){
				pixelsOccupiedCounter++;
			}
		});
		if(pixelsOccupiedCounter == grid[i].length){
			for(let j = i; j > 0; j--){
				for(let x = 0; x < grid[j].length; x++){
					grid[j][x] = grid[j-1][x];
				}				
				if(j == 0){
					grid[j].forEach(function(colum) {
						colum = 0;
					});
				}
			}
			i++;
			deletedRows++;
			document.getElementById("deletedRows").innerHTML  = deletedRows;
			TimerInterval = TimerInterval - 10;
			stopExecution();
			movePieceDown();
		}
	}
}

function movePiece(movement){
	switch(movement) {
		case posibleMovement.Down: 
			moveDown(); 
			break;
		case posibleMovement.Left:
			moveLeft();
			break;
		case posibleMovement.Right:
			moveRight();
			break;
		case posibleMovement.Rotate:
			moveRotate();
			break;
	}		
	diplayGrid();
}

function moveDown(){
	let pieceCopy = [];
	piece.forEach(function(pixelPosition) {
		pieceCopy.push([pixelPosition[0]+1,pixelPosition[1]])
	});	
	let movementIsPossible = checkIllegalMovements(pieceCopy);
	if(movementIsPossible){
		removePieceFromGrid();
		piece = pieceCopy;	
		updatePiecePosiotion();
		gameOver = false;
	}else{
		if(gameOver){
			alert("Game Over");
			stopExecution();
		}else{
			checkDeleteableRows();
			createPiece();
		}	
		gameOver = true;
	}
}

function moveLeft(){
	let pieceCopy = [];
	piece.forEach(function(pixelPosition) {
		pieceCopy.push([pixelPosition[0],pixelPosition[1]-1])
	});	
	let movementIsPossible = checkIllegalMovements(pieceCopy);
	if(movementIsPossible){
		removePieceFromGrid();
		piece = pieceCopy;	
		updatePiecePosiotion();
	}
}

function moveRight(){
	let pieceCopy = [];
	piece.forEach(function(pixelPosition) {
		pieceCopy.push([pixelPosition[0],pixelPosition[1]+1])
	});	
	let movementIsPossible = checkIllegalMovements(pieceCopy);
	if(movementIsPossible){
		removePieceFromGrid();
		piece = pieceCopy;	
		updatePiecePosiotion();
	}
}

function moveRotate(){
	let pieceCopy = [];
	piece.forEach(function(pixelPosition) {
		pieceCopy.push([pixelPosition[0],pixelPosition[1]])
	});
	let [minRowValue, minColumValue] = getMinCoordenateOfThePiece(pieceCopy);
	pieceCopy = putCopiedPieceAtZeroZero(pieceCopy, minRowValue, minColumValue);
	let maxLength = getPieceMaxLength(pieceCopy);
	
	if(maxLength == 3){
		let pieceCopyNewPosition = [[1,1]];
		pieceCopy = checkPieceCenter(pieceCopy, maxLength);
		pieceCopyNewPosition = rotatePieceLength3(pieceCopy, pieceCopyNewPosition);
		pieceCopyNewPosition = correctPrintingPositionLength3(pieceCopyNewPosition, minRowValue, minColumValue);
		let movementIsPossible = checkIllegalMovements(pieceCopyNewPosition);
		if(movementIsPossible){
			removePieceFromGrid();
			piece = pieceCopyNewPosition;	
		}
	}
	
	if(maxLength == 5){
		pieceCopy.forEach(function(pixelPosition) {	
			if((pixelPosition[0] == 0 && pixelPosition[1] == 4) || (pixelPosition[0] == 2 && pixelPosition[1] == 4)){
				pieceCopy = [];
				posibleCoodenates.Length5Inv.forEach(function(pixelPosition) {	
					pieceCopy.push([pixelPosition[0], pixelPosition[1]]);				
				});
			}
			if((pixelPosition[0] == 4 && pixelPosition[1] == 0) || (pixelPosition[0] == 4 && pixelPosition[1] == 2)){
				pieceCopy = [];
				posibleCoodenates.Length5.forEach(function(pixelPosition) {	
					pieceCopy.push([pixelPosition[0], pixelPosition[1]]);				
				});
			}
		});
		pieceCopy.forEach(function(pixelPosition) {	
			pixelPosition[0] = pixelPosition[0] + minRowValue;	
			pixelPosition[1] = pixelPosition[1] + minColumValue;				
		});
		let movementIsPossible = checkIllegalMovements(pieceCopy);
		if(movementIsPossible){
			removePieceFromGrid();
			piece = pieceCopy;	
		}	
	}
	
	updatePiecePosiotion();
}

function getMinCoordenateOfThePiece(pieceCopy){
	let minRowValue = rowSize;
	let minColumValue = columnSize;
	pieceCopy.forEach(function(pixelPosition) {
		if(pixelPosition[0] < minRowValue){
			minRowValue = pixelPosition[0];
		}if(pixelPosition[1] < minColumValue){
			minColumValue = pixelPosition[1];
		}
	});
	return [minRowValue, minColumValue];
}

function putCopiedPieceAtZeroZero(pieceCopy, minRowValue, minColumValue){
	pieceCopy.forEach(function(pixelPosition) {	
		pixelPosition[0] = pixelPosition[0] - minRowValue;				
		pixelPosition[1] = pixelPosition[1] - minColumValue;				
	});
	return pieceCopy;
}

function getPieceMaxLength(pieceCopy){
	let maxLength = 0;
	pieceCopy.forEach(function(pixelPosition) {	
		if(pixelPosition[0] > maxLength){
			maxLength = pixelPosition[0];
		}
		if(pixelPosition[1] > maxLength){
			maxLength = pixelPosition[1];
		}			
	});
	return ++maxLength;
}

function checkPieceCenter(pieceCopy, maxLength){
	let moveToCenter = true;
	if(maxLength == 3){
		pieceCopy.forEach(function(pixelPosition) {	
			if(pixelPosition[0] == 1 && pixelPosition[1] == 1){
				moveToCenter = false;
			}
		});
		if(moveToCenter){
			let countByRow = 0;
			let countByColumn = 0;				
			pieceCopy.forEach(function(pixelPosition) {	
				if((pixelPosition[0] == 0 && pixelPosition[1] == 0) || (pixelPosition[0] == 1 && pixelPosition[1] == 0) || (pixelPosition[0] == 2 && pixelPosition[1] == 0))
					countByRow++;
				if((pixelPosition[0] == 0 && pixelPosition[1] == 0) || (pixelPosition[0] == 0 && pixelPosition[1] == 1) || (pixelPosition[0] == 0 && pixelPosition[1] == 2))
					countByColumn++;			
			});
			if(countByColumn < countByRow){
				pieceCopy.forEach(function(pixelPosition) {	
					pixelPosition[1] = pixelPosition[1] + 1;
				});
			}else{
				pieceCopy.forEach(function(pixelPosition) {	
					pixelPosition[0] = pixelPosition[0] + 1;
				});
			}	
		}	
	}
	return pieceCopy;
}

function rotatePieceLength3(pieceCopy, pieceCopyNewPosition){
	pieceCopy.forEach(function(pixelPosition) {	
		posibleCoodenates.Length3.forEach(function(posibleCoodenate, index) {	
			if(pixelPosition[0] == posibleCoodenate[0] && pixelPosition[1] == posibleCoodenate[1]){
				let newIndex = -1;
				if(index + 2 >= posibleCoodenates.Length3.length){
					newIndex = parseInt((index + 2) - posibleCoodenates.Length3.length);
				}else{
					newIndex = index + 2;
				}
				pieceCopyNewPosition.push([posibleCoodenates.Length3[newIndex][0],posibleCoodenates.Length3[newIndex][1]]);
			}		
		});
	});
	return pieceCopyNewPosition;
}

function correctPrintingPositionLength3(pieceCopyNewPosition, minRowValue, minColumValue){
	let [minRowValueAux, minColumValueAux] = getMinCoordenateOfThePiece(pieceCopyNewPosition);
	pieceCopyNewPosition = putCopiedPieceAtZeroZero(pieceCopyNewPosition, minRowValueAux, minColumValueAux);
	pieceCopyNewPosition.forEach(function(pixelPosition) {	
		pixelPosition[0] = pixelPosition[0] + minRowValue;
		pixelPosition[1] = pixelPosition[1] + minColumValue;				
	});
	return pieceCopyNewPosition;
}

function checkIllegalMovements(pieceCopy){
	let movementIsPossible = true;
	pieceCopy.every(pixelPosition => {
		if(pixelPosition[0] >= rowSize){
			movementIsPossible = false;
			return false;
		}
		else if(pixelPosition[1] < 0){
			movementIsPossible = false;
			return false;
		}
		else if(pixelPosition[1] >= columnSize){
			movementIsPossible = false;
			return false;
		}
		if(movementIsPossible){
			if(grid[pixelPosition[0]][pixelPosition[1]] != 0){
				movementIsPossible = false;
				piece.forEach(function(piecePixel) {
					if(piecePixel[0] == pixelPosition[0] && piecePixel[1] == pixelPosition[1]){
						movementIsPossible = true;
					}
				});			
			}
		}	  
		return true;
	});	
	return movementIsPossible;
}

function removePieceFromGrid(){
	piece.forEach(function(pixelPosition) {			
		grid[pixelPosition[0]][pixelPosition[1]] = 0;				
	});
}

function stopExecution(){
	document.getElementById("movePieceDown").style.display = "block";
	document.getElementById("stopExecution").style.display = "none";
	clearInterval(TimerHandler);
}

function movePieceDown(){
	document.getElementById("movePieceDown").style.display = "none";
	document.getElementById("stopExecution").style.display = "block";
	TimerHandler = setInterval(function(){movePiece(posibleMovement.Down);}, TimerInterval);
}

function showModifyGridPanel(){
	document.getElementById("startPanel").style.display = "none";
	document.getElementById("modifyGridPanel").style.display = "block";
}

function showStartPanel(){
	document.getElementById("modifyGridPanel").style.display = "none";
	document.getElementById("startPanel").style.display = "block";
}

document.addEventListener("DOMContentLoaded", function(event) {
	document.getElementById("rowSize").value = rowSize;
	document.getElementById("columnSize").value = columnSize;
    createGrid();
	createPiece();
	diplayGrid();
	movePieceDown();	
});

document.addEventListener("keydown", function(event) {
	if (event.key === "Escape" || event.keyCode == 32 || event.keyCode == 38) {
		movePiece(posibleMovement.Rotate);
	}
	if (event.key === "ArrowRight" || event.keyCode == 39) {
		movePiece(posibleMovement.Right);
	}
	if (event.key === "ArrowLeft" || event.keyCode == 37) {
		movePiece(posibleMovement.Left);
	}
	if (event.key === "ArrowDown" || event.keyCode == 40) {
		movePiece(posibleMovement.Down);
	}
});

/*
Create by: Liuben López Aparicio
https://www.linkedin.com/in/liuben-lopez-aparicio/
Date: 03/10/2023
*/
