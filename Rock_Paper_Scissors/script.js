//make container for body 
let bod=document.querySelector("body");
//make container for results div
const outerDiv=document.createElement("div");
outerDiv.setAttribute("id","outerDiv");
//make containers for each result that needs to be displayed



console.log("Hello World");
// get the computer's choice randomly
function getComputerChoice(){
    let randomNumber=Math.random().toFixed(2);
    let choice="";
    if (randomNumber>=0 && randomNumber<= 1/3){
        choice="Rock";
    }else if(randomNumber>1/3 && randomNumber<= 2/3){
        choice="Paper";
    }else if(randomNumber>2/3 && randomNumber <=1){
        choice="Scissors";
    }
    return choice;
}

//get the player's choice and save it
 
//rock button click
document.querySelector(".rock").addEventListener("click",()=>{
    let player="Rock";
    let comp=getComputerChoice();
    playRound(player,comp);

});
//paper button click
document.querySelector(".paper").addEventListener("click",()=>{
    let player="Paper";
    let comp=getComputerChoice();
    playRound(player,comp)

});
//scissors button click
document.querySelector(".scissors").addEventListener("click",()=>{
    let player="Scissors";
    let comp=getComputerChoice();
    playRound(player,comp)
});
//initialize score variables
let humanScore=0;
let computerScore=0;
let ties=0;

//display results



//play a round of game
function playRound(player,computer){
    outerDiv.innerHTML="";
    let outcome =document.createElement("div");
    let result=document.createElement("div");
    let scores =document.createElement('div');
    let tally=document.createElement("div");
//if player pick rock
    if (player==="Rock" && computer==="Paper"){
        outcome.textContent="Paper beats Rock.";
        result.textContent="You lose!"
        outerDiv.appendChild(outcome);
        outerDiv.appendChild(result);
        computerScore+=1;
    
    }else if (player==="Rock" && computer==="Scissors"){
        outcome.textContent="Rock beats Scissors.";
        result.textContent="You win!";
        outerDiv.appendChild(outcome);
        outerDiv.appendChild(result);
        
        humanScore+=1;

    } else if (player==="Rock" && computer==="Rock"){
        outcome.textContent="Rock and Rock match.";
        result.textContent="It was a tie.";
        outerDiv.appendChild(outcome);
        outerDiv.appendChild(result);
        
        ties+=1;
//if player picks paper
    }else if (player==="Paper" && computer==="Rock"){
        outcome.textContent="Paper beats Rock.";
        result.textContent="You win!";
        outerDiv.appendChild(outcome);
        outerDiv.appendChild(result);
        
        humanScore+=1;
    
    }else if (player==="Paper" && computer==="Paper"){
        outcome.textContent="Paper and paper match.";
        result.textContent="It was a tie.";
        outerDiv.appendChild(outcome);
        outerDiv.appendChild(result);
        
        ties+=1;

    } else if (player==="Paper" && computer==="Scissors"){
        outcome.textContent="Scissors beats Paper.";
        result.textContent="You lose!";
        outerDiv.appendChild(outcome);
        outerDiv.appendChild(result);
        
        computerScore+=1;
// if player picks Scissors
    }else if (player==="Scissors" && computer==="Rock"){
        outcome.textContent="Rock beats Scissors.";
        result.textContent="You lose!";
        outerDiv.appendChild(outcome);
        outerDiv.appendChild(result);
        
        computerScore+=1;
    }else if (player==="Scissors" && computer==="Paper"){
        outcome.textContent="Scissors beats Paper.";
        result.textContent="You win!";
        outerDiv.appendChild(outcome);
        outerDiv.appendChild(result);

        humanScore+=1;
    }else if(player==="Scissors" && computer==="Scissors"){
        outcome.textContent="Scissors and Scissors match.";
        result.textContent="It was a tie.";
        outerDiv.appendChild(outcome);
        outerDiv.appendChild(result);
        
        ties+=1;

    }
    scores.textContent=`Computer's Score ${computerScore}, Player's Score ${humanScore}, Ties ${ties}`
    outerDiv.appendChild(scores);
    
    if (humanScore===5){
        
        tally.textContent="Congradulations you have won 5 games";
        outerDiv.appendChild(tally);
        humanScore=0;
        computerScore=0;
        ties=0;

    }else if(computerScore===5){
        tally.textContent="You have lost 5 games";
        outerDiv.appendChild(tally);
        humanScore=0;
        computerScore=0;
        ties=0;

    }
    bod.appendChild(outerDiv);

}
//ask how many rounds should be played





