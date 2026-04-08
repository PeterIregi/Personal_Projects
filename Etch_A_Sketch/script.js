// get size of grid 
let sizeButton=document.querySelector(".gridSize");
let container = document.querySelector("#container");
let size=0;


//grid
//create a row of grid boxes
function getGridRow(row,size){
    
    for (let i=1;i<=size;i++){
        let gridcell=document.createElement("div");
        gridcell.setAttribute("class","gridCell")
        row.appendChild(gridcell);  
    }
}

//create the whole grid
function getGrid(size){

    for (let i=1;i<=size;i++){
        let row =document.createElement("div");
        row.setAttribute("class", "rowContainer");
        getGridRow(row ,size)
        container.appendChild(row);

    }
}

//change color when on top of the grid cell
//change into a random color upon hover

sizeButton.addEventListener("click",()=>{
    container.innerHTML="";
    size=Number(prompt("How may boxes do you want on your grid? "));
    if (size<=100){
        getGrid(size);
        let gridcell=document.querySelectorAll(".gridCell");
        gridcell.forEach((grid)=>{
            grid.addEventListener("mouseenter",()=>{
                grid.classList.add("gridCellHover");
                let color=getRandomColor();
                grid.setAttribute("style",`background-color:${color}`)
            }); 
        })
    }
    
})

function getRandomColor(){
    let red=Math.round(Math.random()*255);
    let green=Math.round(Math.random()*255);
    let blue=Math.round(Math.random()*255);

    let rgb=`rgb(${red}, ${green}, ${blue})`;

    return rgb

}