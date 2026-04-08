//get values for calculation
let expression="";
let operands='';
let numOne;
let numTwo;

//display 
let body=document.querySelector("body");
let display=document.createElement("div");
display.setAttribute("class","display");
body.appendChild(display);
//buttons for the calculator

document.querySelector(".one").addEventListener("click",()=>{
    expression+="1";
    display.innerHTML=(expression);
});
document.querySelector(".two").addEventListener("click",()=>{
    expression+="2";
    display.innerHTML=(expression);
});
document.querySelector(".three").addEventListener("click",()=>{
    expression+="3";
    display.innerHTML=(expression);
});
document.querySelector(".four").addEventListener("click",()=>{
    expression+="4";
    display.innerHTML=(expression);
});
document.querySelector(".five").addEventListener("click",()=>{
    expression+="5";
    display.innerHTML=(expression);
});
document.querySelector(".six").addEventListener("click",()=>{
    expression+="6";
    display.innerHTML=(expression);
});
document.querySelector(".seven").addEventListener("click",()=>{
    expression+="7";
    display.innerHTML=(expression);
});
document.querySelector(".eight").addEventListener("click",()=>{
    expression+="8";
    display.innerHTML=(expression);
});
document.querySelector(".nine").addEventListener("click",()=>{
    expression+="9";
    display.innerHTML=(expression);
});
document.querySelector(".zero").addEventListener("click",()=>{
    expression+="0";
    display.innerHTML=(expression);
});
document.querySelector(".add").addEventListener("click",()=>{
    if (opp===''){
        numOne=Number(expression);
        expression="";
        opp="+";
        console.log(`${numOne} ${opp}`)
        display.innerHTML=(`${numOne} ${opp}`);
    }else{
        numTwo=Number(expression);
        result=operate(numOne,numTwo,opp);
        numOne=result;
        opp="+";
        expression="";
        console.log(`${numOne} ${opp}`)
        display.innerHTML=(`${numOne} ${opp}`);
    }
    
});
document.querySelector(".subtract").addEventListener("click",()=>{
    if (opp===""){
       if (expression===""){
            expression+="-";
            display.innerHTML=expression
        }else{
            numOne=Number(expression); 
            opp="-";
            expression="";
            display.innerHTML=(`${numOne} ${opp}`);
        }
    }else{
        numTwo=Number(expression);
        let result=operate(numOne,numTwo,opp);
        numOne=result;
        opp="-";
        expression="";
        display.innerHTML=(`${numOne} ${opp}`);  
    }
    
});
document.querySelector(".multiply").addEventListener("click",()=>{
    if(opp===""){
        numOne=Number(expression);
        expression="";
        opp="*";
        display.innerHTML=(`${numOne} ${opp}`);
    }else{
        numTwo=Number(expression);
        let result=operate(numOne,numTwo,opp);
        numOne=result;
        opp="*";
        expression="";
        display.innerHTML=(`${numOne} ${opp}`);     
    }    
});
document.querySelector(".divide").addEventListener("click",()=>{
    if (opp===""){
        numOne=Number(expression);
        expression="";
        opp="/";
        display.innerHTML=(`${numOne} ${opp}`);
    }else{
        numTwo=Number(expression);
        let result=operate(numOne,numTwo,opp);
        numOne=result;
        opp="/";
        expression="";
        display.innerHTML=(`${numOne} ${opp}`);
    }
});
document.querySelector(".point").addEventListener("click",()=>{
    expression+=".";
    display.innerHTML=(expression);
});
document.querySelector(".equals").addEventListener("click",()=>{
    let numTwo=Number(expression);
    let result=operate(numOne,numTwo,opp);
    display.innerHTML=`${numOne} ${opp} ${expression} = ${result}`;

});
document.querySelector(".clear").addEventListener("click",()=>{
    clear();
})
//calculate funtion
function operate(numOne,numTwo,opp){
    let result;
    if (opp==="+"){
        result=add(numOne,numTwo).toFixed(2);
    }else if(opp==="-"){
        result=subtract(numOne,numTwo).toFixed(2);
    }else if(opp==="*"){
        result=multiply(numOne,numTwo).toFixed(2);
    }else if(opp==="/"){
        if (numOne===0 || numTwo===0){
            result="Cannot divide number by zero"
        }else{
            result=divide(numOne,numTwo).toFixed(2);
        }
        
    }
    return result;
}


// operation functions


function add(a,b){
    return a+b;
};
function subtract(a,b){
    return a-b;
};
function divide(a,b){
    return a/b;
};
function multiply(a,b){
    return a*b;
};
//turn expression into calculatable expression

let opp='';

//clear function

function clear(){
    numOne=0;
    numTwo=0;
    expression="";
    opp="";
    display.innerHTML="";
}


//when operator is pressed   more than twice it crashes and no longer works none of the operators work
