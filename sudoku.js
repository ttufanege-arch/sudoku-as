const board = document.getElementById("sudoku-board");
let grid = [];
let solution = [];
const nums = [1,2,3,4,5,6,7,8,9];
let difficulty = 40;
let seconds = 0;
let timerInterval;
let hataSayisi = 0;
let lostcurrentgame = 0;

function setDifficulty(level) {
    const onay = confirm("Bu oyunu terk edip başka bir oyuna geçmek istiyor musunuz?");
    if (onay) {
        difficulty = level;
        newGame();
        console.log("yeni bir oyun başlattim")
    }
}

function newGame() {
    board.innerHTML = "";
    grid = [];
    hataSayisi = 0;
    lostcurrentgame = 0;

    for (let i = 0; i < 9; i++) {
        const row = document.createElement("tr");
        for (let j = 0; j < 9; j++) {
            const col = document.createElement("td");
            col.dataset.row = i;
            col.dataset.col = j;
            col.addEventListener("click", function() {
                document.querySelectorAll("td").forEach(td => {
                    td.classList.remove("selected");
                    td.classList.remove("highlighted");
                });
                col.classList.add("selected");
                const sayi = col.textContent;
                document.querySelectorAll("td").forEach(td => {
                    if (td.textContent === sayi && sayi !== "") {
                        td.classList.add("highlighted");
                    }
                });
            });
            if (j === 2 || j === 5) col.classList.add("border-right");
            row.appendChild(col);
        }
        if (i === 2 || i === 5) row.classList.add("border-bottom");
        grid.push([0,0,0,0,0,0,0,0,0]);
        board.appendChild(row);
    }

    solve(grid);
    solution = grid.map(row => [...row]);

    const cells = document.querySelectorAll("td");
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            if (grid[i][j] !== null) {
                cells[i * 9 + j].textContent = grid[i][j];
                cells[i * 9 + j].classList.add("given");
            }
        }
    }

    for (let i = 0; i < difficulty; i++) {
        const r = Math.floor(Math.random() * 9);
        const c = Math.floor(Math.random() * 9);
        grid[r][c] = null;
        cells[r * 9 + c].textContent = "";
        cells[r * 9 + c].classList.remove("given");
    }
}

function findEmpty(grid) {
    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            if (grid[r][c] === 0|| grid[r][c]=== null) return [r, c];
        }
    }
    return null;
}

function isValid(grid, row, col, num) {
    if (grid[row].includes(num)) return false;
    for (let r = 0; r < 9; r++) {
        if (grid[r][col] === num) return false;
    }
    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(col / 3) * 3;
    for (let r = startRow; r < startRow + 3; r++) {
        for (let c = startCol; c < startCol + 3; c++) {
            if (grid[r][c] === num) return false;
        }
    }
    return true;
}

function solve(grid) {
    const empty = findEmpty(grid);
    if (empty === null) return true;
    const r = empty[0];
    const c = empty[1];
    const nums = [1,2,3,4,5,6,7,8,9];
    nums.sort(() => Math.random() - 0.5);
    for (let num of nums) {
        if (isValid(grid, r, c, num)) {
            grid[r][c] = num;
            if (solve(grid)) return true;
            grid[r][c] = null;
        }
    }
    return false;
}

document.addEventListener("keydown", function(event) {
    const selected = document.querySelector("td.selected");
    if (selected && !selected.classList.contains("given") && event.key >= "1" && event.key <= "9") {
        const r = parseInt(selected.dataset.row);
        const c = parseInt(selected.dataset.col);
        const num = parseInt(event.key);
        console.log(r,c)
        console.log(solution)
        if (lostcurrentgame === 0){ 
            if (solution[r][c] === num) {
                if(!selected.classList.contains("correct")){
                    selected.classList.add("correct")
                    selected.textContent = event.key;
                    grid[r][c] = num;
                    checkWin()
                    console.log(grid, "grid düz")
                    console.log(difficulty, "zorluk seviyesi")
                    console.log(grid[r][c], "grid r c")
                    playSound()
                    // doğru hamle yapılınca keydown içine ekle
                    document.querySelectorAll("td").forEach(td => {
                        const tdRow = parseInt(td.dataset.row);
                        const tdCol = parseInt(td.dataset.col);
            
                        if (tdRow === r || tdCol === c) {
                            td.classList.add("flash");
                            setTimeout(() => td.classList.remove("flash"), 1400);
                        }            
                });

                document.querySelectorAll("td").forEach(td =>{
                    td.classList.remove("highlighted");
                });
                document.querySelectorAll("td").forEach(td =>{
                    if (td.textContent=== event.key && td!==selected){
                        td.classList.add("highlighted");
                    }
                });  
    }
    }else{
        hataEkle();
    }
    }else{
        console.log("hamle yapamazsin hakkin yok")
        badSound()
    }
    }
});

function playSound() {
    const ctx = new AudioContext();
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();
    
    oscillator.connect(gain);
    gain.connect(ctx.destination);
    
    oscillator.frequency.value = 880;
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
    
    oscillator.start();
    oscillator.stop(ctx.currentTime + 0.3);
}
function badSound() {
    const ctx = new AudioContext();
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();
    
    oscillator.connect(gain);
    gain.connect(ctx.destination);
    
    oscillator.frequency.value = 210;
    gain.gain.setValueAtTime(0.67, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0005, ctx.currentTime + 0.15);
    
    oscillator.start();
    oscillator.stop(ctx.currentTime + 0.3);
}

function startTimer(){
    clearInterval(timerInterval);
    seconds = 0;
    timerInterval = setInterval(() =>{
        seconds++
        const mm = String(Math.floor(seconds/60)).padStart(2,"0");
        const ss = String(seconds % 60).padStart(2, "0");
        document.getElementById("timer").textContent = mm + ":" + ss;
    }, 1000);
}
function checkWin() {
    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            if (grid[r][c] === 0 || grid[r][c] === null) return;
        }
    }
    // tüm hücreler dolu!
    clearInterval(timerInterval);
    document.getElementById("win-time").textContent = "Süren: " + document.getElementById("timer").textContent;
    document.getElementById("win-screen").style.display = "block";
}
function playAgain() {
    document.getElementById("win-screen").style.display = "none";
    newGame();
    startTimer();
    document.getElementById("lost-screen").style.display = "none";
}

function menu() {
    document.getElementById("win-screen").style.display = "none";
    newGame();
    startTimer();
    document.getElementById("lost-screen").style.display = "none";
}
function hataEkle(){
    const kutular = document.querySelectorAll(".hata-kutu");
    if (hataSayisi < 3) {
        kutular[hataSayisi].textContent = "✕";
        badSound()
        hataSayisi++;
    }
    if (hataSayisi === 3) {
        badSound()
        clearInterval(timerInterval);
        document.getElementById("lost-screen").style.display = "block";
        lostcurrentgame = 1;

        // you lost!
    }
}

newGame()
startTimer()