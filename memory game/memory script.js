document.onload = (function () {
    console.log("app started");
    class AudioContaroller {
        constructor() {
            this.bgMusic = new Audio('https://www.chosic.com/wp-content/uploads/2021/04/Wavecont-Motivate-Full-Length.mp3');
            this.flipSound = new Audio('https://raw.githubusercontent.com/WebDevSimplified/Mix-Or-Match/master/Assets/Audio/flip.wav');
            this.matchSound = new Audio('https://raw.githubusercontent.com/WebDevSimplified/Mix-Or-Match/master/Assets/Audio/match.wav');
            this.victorySound = new Audio('https://raw.githubusercontent.com/WebDevSimplified/Mix-Or-Match/master/Assets/Audio/victory.wav');
            this.bgMusic.volume = 0.2;
            this.bgMusic.loop = true;
        }
        starMusic() {
            this.bgMusic.play();
        }
        stopMusic() {
            this.bgMusic.pause();
            this.bgMusic.currentTime = 0;
        }
        flip() {
            this.flipSound.play();
        }
        match() {
            this.matchSound.play();
        }
        victory() {
            this.victorySound.play();
            this.stopMusic();
        }
    }
    class MemoryGame {
        constructor(cards) {
            this.cardsArray = cards;
            this.ticker = document.querySelector(".score");
            this.audioContaroller = new AudioContaroller();
        }
        startGame() {
            this.cardToCheck = null;
            this.totalClicks = 0;
            this.matchedCards = [];
            this.busy = true;
            setTimeout(() => {
                 this.shuffleCards();
                this.audioContaroller.starMusic();
                this.busy = false;
            }, 500);
            this.ticker.innerText = this.totalClicks;
        }
        victory(){
            this.audioContaroller.victory();
            this.audioContaroller.stopMusic();
            document.querySelector(".victory").classList.add("visible");
            setTimeout(() => {
                this.hiddeCards();
            }, 2000);
        }

        hiddeCards(){
            this.cardsArray.forEach(card=>{
                card.classList.remove("visible");
                card.classList.remove("matched");
            })
        }

        flipCard(card){
            if(this.canFlipCard(card)){
                this.audioContaroller.flip();
                this.totalClicks++;
                this.ticker.innerText=this.totalClicks; 
                card.classList.add("visible");
                if(this.cardToCheck) {
                    this.checkForCardMatch(card);
                } else {
                    this.cardToCheck=card;
                }
            }
        }

        checkForCardMatch(card){
            if (this.getCardType(card)===this.getCardType(this.cardToCheck)) {
                this.cardMatch(card,this.cardToCheck);
            }
            else{
                this.cardMisMatch(card,this.cardToCheck);
                this.cardToCheck=null;
            }

        }
        cardMatch(card1,card2){
            this.matchedCards.push(card1);
            this.matchedCards.push(card2);
            setTimeout(() => {
                card1.classList.add("matched");
                card2.classList.add("matched");
                this.audioContaroller.match();
            }, 500);
            this.cardToCheck=null;
           // console.log(card1,card2);
            if (this.matchedCards.length===this.cardsArray.length) {
                setTimeout(() => {
                    this.victory();
                }, 2000);
                   
            }
        }

        cardMisMatch(card1,card2){
            this.busy=true;
            setTimeout(() => {
                card1.classList.remove("visible");
                card2.classList.remove("visible");
                this.busy=false;
            },1000);
        }

        getCardType(card){
           return card.getElementsByClassName('img')[0].src; 
        }


        shuffleCards(){
            for (let i =this.cardsArray.length-1; i > 0; --i) {
            let randomIndex=Math.floor(Math.random()*(i+1));
            this.cardsArray[randomIndex].style.order=i;
            this.cardsArray[i].style.order=randomIndex;

            }
        }

        canFlipCard(card) {
         return !this.busy && !this.matchedCards.includes(card) && card !== this.cardToCheck;
        }
    }


    let overLay =document.querySelectorAll(".over-lay");
    let cards = document.querySelectorAll(".card");
    let game = new MemoryGame(cards);


    overLay.forEach(overlay => {
        overlay.addEventListener("click", () => {
            overlay.classList.remove("visible");
            console.log("game start");
            game.startGame();
            // console.log(cards);
            // console.log(overLay);
        })
    })
    cards.forEach(card => {
         card.addEventListener("click", (e) => {
            game.flipCard(card);
            // console.log(e.target.parentNode.parentNode);
        })
    })

})();