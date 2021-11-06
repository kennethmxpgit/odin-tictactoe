// Player Object constructor.
const Player=(name,char,isAI=false)=>{
    return{name,char,isAI}
}




//The gameboard module. handles buttons. checks for wins, and who won.
const gameBoard = (()=>{
    
    const panel = (panelDOM, panelData) => {
        return { panelDOM, panelData };
      };
    let gB=[
        panel(document.querySelector('#tl'),null),
        panel(document.querySelector('#t'),null),
        panel(document.querySelector('#tr'),null),
        panel(document.querySelector('#l'),null),
        panel(document.querySelector('#m'),null),
        panel(document.querySelector('#r'),null),
        panel(document.querySelector('#bl'),null),
        panel(document.querySelector('#b'),null),
        panel(document.querySelector('#br'),null),
    ]
    const boardEnabler=(a)=>{ // Enabler and disabler combo
        function sendToHandler(){
            //console.log('send to GH : '+this.panelDOM.id)
            gameHandler.play(this);
        }
        if(a==true) {
            //console.log("Board Activating");
            gB.forEach((element)=>element.panelDOM.addEventListener('click',sendToHandler.bind(element)));}
        // if(a==false) {
        //     console.log("game board deactivating");
        //     gB.forEach((element)=>element.panelDOM.removeEventListener('click',sendToHandler.bind(element)));}
    }


    const changePanel=(panel,player)=>{ //Changes the Panel
        panel.panelData=player.name;
        panel.panelDOM.textContent=player.char;
        //console.log(`${player.name} put an (${player.char}) on ${panel.panelDOM.id}`); //for Debugging
    }

    const boardReset=()=>{
        gB.forEach((element)=>{
            element.panelDOM.textContent="";
            element.panelData=undefined;
        })

    }

    const winChecker=()=>{
        g=gB.map((e,idx)=>e.panelData);
        if (((g[0]==g[1])&&(g[1]==g[2])&&(g[2]!=null)) || 
        ((g[3]==g[4])&&(g[4]==g[5])&&(g[5]!=null)) ||
        ((g[6]==g[7])&&(g[7]==g[8])&&(g[8]!=null)) ||

        ((g[0]==g[3])&&(g[3]==g[6])&&(g[6]!=null)) ||
        ((g[1]==g[4])&&(g[4]==g[7])&&(g[7]!=null)) ||
        ((g[2]==g[5])&&(g[5]==g[8])&&(g[8]!=null)) ||

        ((g[0]==g[4])&&(g[4]==g[8])&&(g[8]!=null)) ||
        ((g[2]==g[4])&&(g[4]==g[6])&&(g[6]!=null))
        ) {return true}
        }
    boardEnabler(true);
    return { changePanel, winChecker, boardReset,gB}
})();



gameHandler=(()=>{
    let gameCounter=0;
    let gameOverFlag=false;
    const jeff=Player('P1','X');
    const misha=Player('P2','O');
    const dumbAI=Player('AI','O',true);
    let playerOne=jeff;
    let playerTwo=misha;
    let currentPlayer;
    let aiMode=false;
    const btnHuman= document.querySelector('#vsHuman');
    const btnAI= document.querySelector('#vsAI');

    const btnAIFunc=()=>{
        playerTwo=dumbAI;
        aiMode=true;
        gameReset();

    }
    const btnHumanFunc=()=>{
        playerTwo=misha;
        playerTwo.name='P2';
        aiMode=false;
        gameReset();

    }


    const toggleChar=()=>{
        if(playerOne.char=='X') {
            playerOne.char='O';
            playerTwo.char='X';
        } else{
            playerOne.char='X';
            playerTwo.char='O';
        }
    }


    const changeText=(text)=>{
        statText=document.querySelector('#statText');
        statText.textContent=`${playerOne.name}(${playerOne.char})|${playerTwo.name}(${playerTwo.char})| `+text;
    }


    function whosTurn(){
        changeText(`It's ${currentPlayer.name}'s (${currentPlayer.char}) turn`);
    }

    aiTrigger=()=>{
        //changeText('AI is Thinking...');
        if(gameOverFlag==false){
            changeText('AI is thinking...');
            for(i=0;i<10000;i++){
                rand=Math.floor(Math.random() * 9);
                //onsole.log('random number : '+rand);
                if(gameBoard.gB[rand].panelData==null) break;
                
            }
            // while(true){
            //     rand=Math.floor(Math.random() * 9);
            //     console.log('random number : '+rand);
            //     if(gameBoard.gB[rand].panelData==null) break;
            // }
            setTimeout(()=>{play(gameBoard.gB[rand])},500);
        }

    }



    const playerSwitch=()=>{
         if(currentPlayer==playerOne) {
            currentPlayer=playerTwo;
            whosTurn();
            if(playerTwo.isAI) aiTrigger();
         }
         else {
             currentPlayer=playerOne;
             whosTurn();
         }
    }

    const play=(panel)=>{
        if(panel.panelData==undefined && gameOverFlag==false){
            gameBoard.changePanel(panel,currentPlayer);
            gameCounter++;
            console.log(`Clock : ${gameCounter} | ${currentPlayer.name} (${currentPlayer.char}) at ${panel.panelDOM.id}`);
            playerSwitch();
            if(gameBoard.winChecker()) {
                playerSwitch();
                gameEnd(currentPlayer.name);  
            } 
            if(gameCounter>8) {
                if(gameBoard.winChecker()) {
                    playerSwitch();
                    gameEnd(currentPlayer.name);  
                } else gameEnd();

            }
            return true;
        }
        else return false;
        //gameBoard.winChecker();

        
    };

    const gameStart=()=>{
        toggleChar();
        console.log('----Game Start----');
        currentPlayer=playerOne;
        changeText(`P1's (${currentPlayer.char}) turn. Press Button to toggle X/O`);
        gameCounter=0;
        gameOverFlag=false;
        //gameBoard.boardEnabler(true);
    }
    const gameEnd=(name)=>{
        gameOverFlag=true;
        console.log('Game Over!')
        if(name) {
            console.log(name+' won!');
            changeText(`${currentPlayer.name} wins! Press any button to reset`)
           
        }
        else {
            changeText("It's a draw!  Press any button to reset");
            console.log('its a draw');
        }
        toggleChar();
        //gameBoard.boardEnabler(false);
        //gameBoard.gB.forEach((element)=>element.panelDOM.removeEventListener('click',()=>{}));
        //alert('reset');
    }
    const gameReset=()=>{
        changeText('');
        gameCounter=0;
        console.log('Game reset');
        gameBoard.boardReset();
        gameStart();
    }
    gameStart();
    btnHuman.addEventListener('click',btnHumanFunc);
    btnAI.addEventListener('click',btnAIFunc);
    return {play, gameEnd,gameReset,currentPlayer}
})()



