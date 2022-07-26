let addbtn = document.querySelector(".add-btn");
let removeBtn = document.querySelector(".remove-btn");
let modalCont = document.querySelector(".modal-cont");
let mainCont = document.querySelector(".main-cont");
let textareaCont = document.querySelector(".textarea-cont");
let colors = ["lightpink" , "lightblue" , "lightgreen" , "black"];
let modalPriorityColor = colors[colors.length-1];
let allPriorityColors = document.querySelectorAll(".priority-color");

let toolBoxColors = document.querySelectorAll(".color");
let ticketsArr = [];

let aflag = false;
let removeflag = false;

let lockclass = "fa-lock"
let unlockclass = "fa-lock-open"

if(localStorage.getItem("jira_tickets")){
    // retrieve and display tickets
    ticketsArr = JSON.parse(localStorage.getItem("jira_tickets"));
    ticketsArr.forEach((ticketObj) => {
        createTicket(ticketObj.ticketColor , ticketObj.ticketTask , ticketObj.ticketID);
    })

}

// distinguish tickets by its color
 for(let i = 0; i<toolBoxColors.length; i++){
    toolBoxColors[i].addEventListener("click", (e) => {
        let currentToolBoxColor = toolBoxColors[i].classList[0];

        let filteredTickets = ticketsArr.filter((ticketObj , idx) => {
            return currentToolBoxColor === ticketObj.ticketColor;
        })
        
        // remove all tickets
        let allTicketsCont = document.querySelectorAll(".ticket-cont");
        for(let i =0; i< allTicketsCont.length; i++){
            allTicketsCont[i].remove();
        }

        // display filtered tickets
        filteredTickets.forEach((ticketObj , idx) => {
            createTicket(ticketObj.ticketColor , ticketObj.ticketTask , ticketObj.ticketID);
        })
    })

    toolBoxColors[i].addEventListener("dblclick" , (e) => {
        // remove previous tickets
        let allTicketsCont = document.querySelectorAll(".ticket-cont");
        for(let i =0; i< allTicketsCont.length; i++){
            allTicketsCont[i].remove();
        }
        ticketsArr.forEach((ticketObj , idx) => {
            createTicket(ticketObj.ticketColor , ticketObj.ticketTask , ticketObj.ticketID);
        })
    })
 }

addbtn.addEventListener("click" , (e) => {
    // aflag -> true Modal display
    //  Display Modal
    // generate ticket

    aflag = !aflag;
    if(aflag) {
        modalCont.style.display = "flex";
    } else {
        modalCont.style.display = "none";
    }
})
// addlistener on remove button
removeBtn.addEventListener("click" , (e) => {
    removeflag = !removeflag;
})

// listener on modal priority color
allPriorityColors.forEach((colorElem , idx) => {
    colorElem.addEventListener("click" , (e) => {
        allPriorityColors.forEach((priorityColorElem , idx) => {
            priorityColorElem.classList.remove("border");
        })
        colorElem.classList.add("border");

        modalPriorityColor = colorElem.classList[0];

    })
})
modalCont.addEventListener("keydown" , (e) => {
    let key = e.key;
    if(key === "Shift") {
        createTicket(modalPriorityColor,textareaCont.value );
        aflag = false;
         setModalToDefault();
    }
})

function createTicket(ticketColor , ticketTask , ticketID) {
    let id = ticketID || shortid();

    let ticketCont  = document.createElement("div");
    ticketCont.setAttribute("class" , "ticket-cont");
    ticketCont.innerHTML = `
    <div class="ticket-color ${ticketColor}"></div>
    <div class="ticket-id">#${id}</div>
    <div class="task-area">${ticketTask}</div>
    <div class="ticket-lock">
                <i class="fa-solid fa-lock"></i>
            </div>
    `;
    mainCont.appendChild(ticketCont); 
    // create object of ticket and add to array
    if(!ticketID) {      
        ticketsArr.push({ticketColor , ticketTask , ticketID : id});
        localStorage.setItem("jira_tickets" , JSON.stringify(ticketsArr));
    }
 

    handleRemoval(ticketCont , id);
    handleLock(ticketCont , id);
    handleColor(ticketCont , id);
    
}

function handleRemoval(ticket , id) {
   ticket.addEventListener("click" , (e) => {
    if(!removeflag) return;
    
        let idx = getTicketIdx(id);
        ticketsArr.splice(idx,1);
        let strTicketsArr = JSON.stringify(ticketsArr);
        localStorage.setItem("jira_tickets" , strTicketsArr);

        ticket.remove();
    
   })
   
    // remove
}

function handleLock(ticket ,id) {
    let ticketLockElem = ticket.querySelector(".ticket-lock");
    let ticketLock = ticketLockElem.children[0];
    let ticketTaskArea = ticket.querySelector(".task-area")
    ticketLock.addEventListener("click" , (e) => {
      let ticketIdx = getTicketIdx(id);

      if(ticketLock.classList.contains(lockclass)){
        ticketLock.classList.remove(lockclass);
        ticketLock.classList.add(unlockclass);
        ticketTaskArea.setAttribute("contenteditable" , "true");
    } else {
        ticketLock.classList.remove(unlockclass);
        ticketLock.classList.add(lockclass);
        ticketTaskArea.setAttribute("contenteditable" , "false");
      }
      // modify data in local storage
      ticketsArr[ticketIdx].ticketTask = ticketTaskArea.innerText;   //modify data in array
      localStorage.setItem("jira_tickets" , JSON.stringify(ticketsArr));  //modify arr in localstorage
    })

}
function handleColor(ticket , id) {
    let ticketColor = ticket.querySelector(".ticket-color");

    ticketColor.addEventListener("click" , (e) => {
        // get ticketIdx friom the ticket arr
        let ticketIdx = getTicketIdx(id);


         
        let currentTicketColor = ticketColor.classList[1];
        let currentTicketColorIdx =  colors.findIndex((color) => {
            return color === currentTicketColor
        })
        let newTicketColorIdx = (currentTicketColorIdx+1)%4;
        let newTicketColor = colors[newTicketColorIdx];
        ticketColor.classList.remove(currentTicketColor);
        ticketColor.classList.add(newTicketColor);
        
        // modify data in local storage
        ticketsArr[ticketIdx].ticketColor = newTicketColor;   //modify data in array
        localStorage.setItem("jira_tickets" , JSON.stringify(ticketsArr));  //modify arr in localstorage
    })



}

function getTicketIdx(id) {
 let ticketIdx  = ticketsArr.findIndex((ticketObj) => {
    return ticketObj.ticketID === id;
 })
 return ticketIdx;

}

function setModalToDefault() {
    modalCont.style.display="none";
    textareaCont.value = "";
    modalPriorityColor = colors[colors.length-1];
    allPriorityColors.forEach((priorityColorElem , idx) => {
        priorityColorElem.classList.remove("border");
    })
    
    allPriorityColors[allPriorityColors.length-1].classList.add("border");

}