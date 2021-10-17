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
    this.atk = genData.stats[1].base_stat;
    this.def = genData.stats[2].base_stat;
    this.sAtk = genData.stats[3].base_stat;
    this.sDef = genData.stats[4].base_stat;
    this.spd = genData.stats[5].base_stat;
    }}

const button = document.querySelector('button');

button.addEventListener('click',async function() {
    button.remove();
    //Call the function to fetch data
    const genData1 = await generate();
    const genData2 = await generate();

    //Pass data to class to build the object
    const player1 = new Pokemon(genData1);
    const player2 = new Pokemon(genData2);

    console.log(player1);
    console.log(player2);

    //Pass the pokemon name and hp on screen
    p1Name.textContent = player1.pName;
    p2Name.textContent = player2.pName;
    
    let p1CurrHp = player1.hp;
    let p1MaxHp = player1.hp;
    p1HpNumeric.textContent = `${p1CurrHp} / ${p1MaxHp} HP`;

    let p2CurrHp = player2.hp;
    let p2MaxHp = player2.hp;
    p2HpNumeric.textContent = `${p2CurrHp} / ${p2MaxHp} HP`;
    
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
    

})();

