const screen = document.querySelector('#screen');
const canvas1 = document.querySelector('#p1');
const p1Image = document.createElement('img');
const canvas2 = document.querySelector('#p2');
const p2Image = document.createElement('img');

async function generate(){
    let random = Math.floor(Math.random() * 899) + 1;
    let fetchUrl = `https://pokeapi.co/api/v2/pokemon/${random}/`;
    let imageSrc = `https://raw.githubusercontent.com/PokeApi/sprites/master/sprites/pokemon/${random}.png`;
    let response = await fetch(fetchUrl);
    let {name, stats} = await response.json();
    return {name, stats, imageSrc};
    }

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
    const genData1 = await generate();
    const player1 = new Pokemon(genData1);
    console.log(player1);
    p1Image.src = player1.sprite;
    p1Image.alt = player1.pName;
    canvas1.appendChild(p1Image);

    const genData2 = await generate();
    const player2 = new Pokemon(genData2);
    console.log(player2);
    p2Image.src = player2.sprite;
    p2Image.alt = player2.pName;
    canvas2.appendChild(p2Image);

    const matchName = document.createElement('h1');
    matchName.textContent = `${player1.pName} VS ${player2.pName}`;
    screen.appendChild(matchName);
})();