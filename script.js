const screen = document.querySelector('#screen');
const canvas1 = document.querySelector('#p1');
const p1Image = document.createElement('img');
const canvas2 = document.querySelector('#p2');
const p2Image = document.createElement('img');
const p1Name = document.querySelector('#p1Name');
const p2Name = document.querySelector('#p2Name');
let p1HpNumeric = document.querySelector('#p1HpNumeric');
let p2HpNumeric = document.querySelector('#p2HpNumeric');

// Function to fetch the needed data
async function generate(){
// Randomize fetched pokemon
    let random = Math.floor(Math.random() * 898) + 1;
    let fetchUrl = `https://pokeapi.co/api/v2/pokemon/${random}/`;
    let imageSrc = `https://raw.githubusercontent.com/PokeApi/sprites/master/sprites/pokemon/${random}.png`;
    let response = await fetch(fetchUrl);
    let {name, stats} = await response.json();
    return {name, stats, imageSrc};
    }

// Class to define the pokemon object
class Pokemon{
    constructor(genData){
    this.pName = genData.name.toUpperCase();
    this.sprite = genData.imageSrc;
    this.hp = genData.stats[0].base_stat;
    this.atk = remodulate(genData.stats[1].base_stat);
    this.def = remodulate(genData.stats[2].base_stat);
    this.sAtk = remodulate(genData.stats[3].base_stat);
    this.sDef = remodulate(genData.stats[4].base_stat);
    this.spd = genData.stats[5].base_stat;
    }}

//Function to scale the stats to make them usable in battle system
function remodulate(stat){
    switch(true){
        case stat <= 30:
            return 1;
        case stat <= 60:
            return 2;
        case stat <= 90:
            return 3;
        case stat <= 120:
            return 4;
        case stat <= 150:
            return 5;
        case stat <= 180:
            return 6;
        case stat <= 210:
            return 7;
        default:
            return 8;
    }}

//Function to calculate the damage inflicted
function fight(attack, defense){
    const critical = critProbability();
    console.log(`critical: ${critical}`)
    const damage = Math.floor(((Math.random()*6)+1 + (Math.random()*4)+1)+ attack) - (Math.floor(Math.random()*4) + defense) + critical;
    console.log(damage);
    if(damage < 0){
        return 0
    } else{
        return damage;
    }
}
//Function to make critical hits with 10% probability
function critProbability(){
    let result = Math.floor(Math.random()*10)+1;
    if(result === 10){
        return 10;
    } else {
        return 0;
    }
}

//Function to apply damage inflicted and prevent HP < 0
function applyDamage(hp, damage){
    hp -= damage;
    if(hp<=0){
        return 0
    } else {
        return hp
    }
}

//Function to reduce the hpLine proportionally to player HP
function percentageHp(hp, maxHp){
    const percentage = Math.floor((100*hp)/maxHp);
    return percentage + "%"
}

//Function to print combat log on screen
function damageMessage(name,damage){
    let message = document.createElement('p');
    if(damage == 0){
        message.textContent = `${name} attacca ma fallisce`;
    } else if(damage > 0 && damage < 8){
        message.textContent = `${name} attacca ed infligge ${damage} danni`;
    } else if(damage > 7 && damage < 12){
        message.textContent = `${name} attacca ed infligge ${damage} danni, che brutto colpo!`;
    } else if(damage >= 12){
        message.textContent = `${name} attacca ed infligge ${damage} danni, AMMAZZA CHE PEZZA`;
    }
    screen.prepend(message)
}

//Functions to animate attacks
function playerAttack1(player1, player2){
    player1.style.transition = ".2s";
    player1.style.transform = "scaleX(-1) translateX(-90px)";
    setTimeout(() => {
    player1.style.transform = "scaleX(-1) translateX(0px)";    
    }, 300);
    
    player2.style.transition = ".5s";   
    player2.style.transform = "translateX(10px)";
    setTimeout(() => {
    player2.style.transition = ".1s";   
    player2.style.transform = "translateX(0px)";    
    }, 700);
    
}

function playerAttack2(player2, player1){
    player2.style.transition = ".2s";
    player2.style.transform = "translateX(-90px)";
    setTimeout(() => {
    player2.style.transform = "translateX(0px)";    
    }, 300);
    
    player1.style.transition = ".5s";   
    player1.style.transform = "scaleX(-1) translateX(10px)";
    setTimeout(() => {
    player1.style.transition = ".1s";   
    player1.style.transform = "scaleX(-1) translateX(0px)";    
    }, 700);
    
}
//Script starter!
const button = document.querySelector('button');

button.addEventListener('click',async function() {
    button.remove();
//Call the function to fetch data
    const genData1 = await generate();
    const genData2 = await generate();

//Pass data to class to build the object
    const player1 = new Pokemon(genData1);
    const player2 = new Pokemon(genData2);

//Pass the pokemon name and hp on screen
    p1Name.textContent = player1.pName;
    p2Name.textContent = player2.pName;
    
    let p1MaxHp = player1.hp;
    p1HpNumeric.textContent = `${player1.hp} / ${p1MaxHp} HP`;

    let p2MaxHp = player2.hp;
    p2HpNumeric.textContent = `${player2.hp} / ${p2MaxHp} HP`;
    
//Show status bars:
    const p1StatusBar = document.querySelector("#p1Bar");
    const p2StatusBar = document.querySelector("#p2Bar");
    p1StatusBar.classList.toggle('hiddenLeft');
    p2StatusBar.classList.toggle('hiddenRight');
    
//Pass the pokemon images on screen after status bars are showed
    setTimeout(() => {

    p1Image.src = player1.sprite;
    p2Image.src = player2.sprite;

    p1Image.alt = player1.pName;
    p2Image.alt = player2.pName;

    canvas1.appendChild(p1Image);
    canvas2.appendChild(p2Image);

    }, 1000);

//Combat system base    
    let firstAttack = 0; 
    let counter = 0;
    let damage = 0;

//Control who attack first in the first turn based on pokemon speed
        if(player1.spd >= player2.spd){
            firstAttack = 1;
        } else {
            firstAttack = 2;
        }

let battle = setInterval(battleTurn, 3000);

function battleTurn(){

//Control if players hp are > 0 before starting the first attack of the turn
    if(player1.hp > 0 && player2.hp > 0){
        if(firstAttack == 1 && counter%2 == 0){
            playerAttack1(p1Image,p2Image);
            damage = fight(player1.atk, player2.def);
            player2.hp = applyDamage(player2.hp, damage);
            damageMessage(player1.pName, damage);
            p2HpNumeric.textContent = `${player2.hp} / ${p2MaxHp} HP`;
            p2HpLine.style.width = percentageHp(player2.hp, p2MaxHp);
            
        
//Control if the defender's hp from the previous attack are still > 0 (repeated on every conditional linked to firstAttack and counter variables)
            if(player2.hp > 0){
                setTimeout(() => {
                playerAttack2(p2Image, p1Image);
                damage = fight(player2.atk, player1.def);
                player1.hp = applyDamage(player1.hp, damage);
                damageMessage(player2.pName, damage);
                p1HpNumeric.textContent = `${player1.hp} / ${p1MaxHp} HP`;
                p1HpLine.style.width = percentageHp(player1.hp, p1MaxHp);
                }, 1500);    
            } else {
            clearInterval(battle);
            battle = null;
        }

        } else if (firstAttack == 2 && counter%2 == 0){
            playerAttack2(p2Image, p1Image);
            damage = fight(player2.atk, player1.def);
            player1.hp = applyDamage(player1.hp, damage);
            damageMessage(player2.pName, damage);
            p1HpNumeric.textContent = `${player1.hp} / ${p1MaxHp} HP`;
            p1HpLine.style.width = percentageHp(player1.hp, p1MaxHp);
            
            if(player1.hp > 0){
                setTimeout(() => {
                playerAttack1(p1Image,p2Image);
                damage = fight(player1.atk, player2.def);
                player2.hp = applyDamage(player2.hp, damage);
                damageMessage(player1.pName, damage);
                p2HpNumeric.textContent = `${player2.hp} / ${p2MaxHp} HP`;
                p2HpLine.style.width = percentageHp(player2.hp, p2MaxHp);
                }, 1500);
            } else {
                clearInterval(battle);
                battle = null;
            }
    
        } else if (firstAttack == 1 && counter%2 == 1){
            playerAttack1(p1Image,p2Image);
            damage = fight(player1.sAtk, player2.sDef);
            player2.hp = applyDamage(player2.hp, damage);
            damageMessage(player1.pName, damage);
            p2HpNumeric.textContent = `${player2.hp} / ${p2MaxHp} HP`;
            p2HpLine.style.width = percentageHp(player2.hp, p2MaxHp);

    
            if(player2.hp > 0){
                setTimeout(() => {
                playerAttack2(p2Image, p1Image);
                damage = fight(player2.sAtk, player1.sDef);
                player1.hp = applyDamage(player1.hp, damage);
                damageMessage(player2.pName, damage);
                p1HpNumeric.textContent = `${player1.hp} / ${p1MaxHp} HP`;
                p1HpLine.style.width = percentageHp(player1.hp, p1MaxHp);
                }, 1500);
            } else {
                clearInterval(battle);
                battle = null;
            }
    
        } else if (firstAttack == 2 && counter%2 == 1){
            playerAttack2(p2Image, p1Image);
            damage = fight(player2.sAtk, player1.sDef);
            player1.hp = applyDamage(player1.hp, damage);
            damageMessage(player2.pName, damage);
            p1HpNumeric.textContent = `${player1.hp} / ${p1MaxHp} HP`;
            p1HpLine.style.width = percentageHp(player1.hp, p1MaxHp);
    
            if(player1.hp > 0){
                setTimeout(() => {
                playerAttack1(p1Image,p2Image);
                damage = fight(player1.sAtk, player2.sDef);
                player2.hp = applyDamage(player2.hp, damage);
                damageMessage(player1.pName, damage);
                p2HpNumeric.textContent = `${player2.hp} / ${p2MaxHp} HP`;
                p2HpLine.style.width = percentageHp(player2.hp, p2MaxHp);
                }, 1500);
            } else {
                clearInterval(battle);
                battle = null;
            }}    
        counter++;
    } else {
        clearInterval(battle);
        battle = null;
    }
//Announce the winner on screen and make the loser disappear
    if(battle == null){
    let winner = document.createElement('h1');
        
        if(player1.hp > 0){
            winner.textContent = `${player1.pName} vince lo scontro!`;
            p2Image.style.transition = '3s'
            p2Image.style.opacity = 0;
        } else {
            winner.textContent = `${player2.pName} vince lo scontro!`;
            p1Image.style.transition = '3s'
            p1Image.style.opacity = 0;
        }
    
        screen.innerHTML = " ";
        screen.appendChild(winner);
    
        let restart = document.createElement('button');
        let body = document.querySelector('body')
        restart.textContent = 'Combatti ancora!'
        body.appendChild(restart);
        restart.addEventListener('click', function(){
            window.location.reload();
        });
    }

}});
    
    