import {snake} from './snake.js';

let food = randomPosition();

export function update(){
	if(consumed()){
		food = randomPosition();
	}
}

export function draw(gameBoard){
	const foodElement = document.createElement('div');
	foodElement.style.gridRowStart = food.x;
	foodElement.style.gridColumnStart = food.y;
	foodElement.classList.add('food');
	gameBoard.appendChild(foodElement);
}

function randomPosition(){
	return {
		x: Math.random()*21 + 1 | 0,
		y: Math.random()*21 + 1 | 0
	};
};

export function consumed(){
	if(	snake[0].x === food.x && snake[0].y === food.y) {
		return true;
	}
	return false;
}