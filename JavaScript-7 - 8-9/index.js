let addBtn = document.querySelector('.add-btn');
let modalCont = document.querySelector('.modal-cont')
// 3rsd step
let allPriorityColors = document.querySelectorAll('.pririty-color')

// 5th
let textAreaCont = document.querySelector('.textArea-cont')
// 6th
let mainCont = document.querySelector('.main-cont')
let removeBtn = document.querySelector('.remove-btn')
let toolboxColors = document.querySelectorAll('.color')


let addTaskFlag=false

// 4.5
// 8th
let removeTaskFlag = false
let modalPriorityColor = 'lightpink'
let lockIconClass = 'fa-lock'
let unlockIconClass = 'fa-lock-open'
let colors = ['lightpink', 'lightgreen', 'lightblue', 'black']
let ticketArray = []



addBtn.addEventListener('click', (event) =>{
    addTaskFlag = !addTaskFlag;

    if (addTaskFlag == true) {
        //show
        modalCont.style.display = 'flex'
    } else {
        //hide
        modalCont.style.display = 'none'
    }
}) 
// 4th Step selecting ticket color
allPriorityColors.forEach(colorEle => {
    colorEle.addEventListener('click', event => {
        // remove active class from all divs
        allPriorityColors.forEach(priorityColor => {
            priorityColor.classList.remove('active')
        })
           // add active clas on div that is clicked
           colorEle.classList.add('active')

           modalPriorityColor = colorEle.classList[0]
    })
})

//5 th step Ticket creation

modalCont.addEventListener('keydown', event => {
    let keyPressed = event.key

    if (keyPressed === 'Shift') {
        // ticket create
        let ticketDesc = textAreaCont.value
        // let ticketId = shortid()
        createTicket(modalPriorityColor, ticketDesc)
        // close modal
        modalCont.style.display = 'none'
        addTaskFlag = !addTaskFlag
        // clear textarea
        textAreaCont.value = ''
    }
})
// 5.5 step
function createTicket (ticketColor, ticketDesc, ticketId) {
    let id = ticketId || shortid()

    let ticketCont = document.createElement('div')

    ticketCont.classList.add('ticket-cont');

    ticketCont.innerHTML = `<div class="ticket-color ${ticketColor}"></div><div class="ticket-id">${id}</div><div class="task-area">${ticketDesc}</div><div class="ticket-lock"><i class="fa-solid fa-lock"></i></div>`

    mainCont.appendChild(ticketCont)

    let ticketMetadata = {
        ticketColor,
        ticketId: id,
        ticketDesc
    }

    // let ticketMetadata = {
    //     "ticketColor": ticketColor,
    //     "ticketId": ticketId,
    //     "ticketDesc": ticketDesc
    // }

    
    // if freshly created ticket
    // then only push to ticketArray
    // otherwise, dont push (case of ticket recreation)
    if (!ticketId) {
        ticketArray.push(ticketMetadata)
        localStorage.setItem('tickets', JSON.stringify(ticketArray))
    }
    
    handleRemove(ticketCont)

    handleLock(ticketCont)

    handleColor(ticketCont)
}
// 7th step
// Selecting remove button
removeBtn.addEventListener('click', (event) => {
    removeTaskFlag = !removeTaskFlag

    if (removeTaskFlag == true) {
        // show alert
        alert("Delete mode is activated")
        // change icon color to red
        removeBtn.style.color = 'red'
    } else {
        // change icon color to white
        removeBtn.style.color = 'white'
    }
})

function handleRemove(ticket) {
    ticket.addEventListener('click', event => {
        if (removeTaskFlag) {
            // remove ticket - ticketArray
            let ticketId = ticket.children[1].innerText
            let ticketIndex = ticketArray.findIndex(t => {
                return t.ticketId == ticketId
            })
            ticketArray.splice(ticketIndex, 1)

            // update local storage
            localStorage.setItem('tickets', JSON.stringify(ticketArray))

            // remove ticket - ui removal
            ticket.remove()
        }
    })
}



// handling lock mechanism
function handleLock(ticket) {
    let ticketLockEle = ticket.querySelector('.ticket-lock')

    let ticketLockIcon = ticketLockEle.children[0]

    let taskArea = ticket.querySelector('.task-area')

    ticketLockIcon.addEventListener('click', () => {
        
        if (ticketLockIcon.classList.contains(lockIconClass)) {
            // remove locked class
            ticketLockIcon.classList.remove(lockIconClass)
            // add unlocked class
            ticketLockIcon.classList.add(unlockIconClass)
            // make the ticket editable
            taskArea.setAttribute('contenteditable', 'true')
        } else {
            // remove unlocked class
            ticketLockIcon.classList.remove(unlockIconClass)
            // add locked class
            ticketLockIcon.classList.add(lockIconClass)
            // make ticket uneditable
            taskArea.setAttribute('contenteditable', 'false')

            // updating ticketArray state with new text
            let ticketId = ticket.children[1].innerText

            ticketArray.forEach(t => {
                if (t.ticketId == ticketId) {
                    t.ticketDesc = taskArea.innerText
                }
            })
              // update local storage
              localStorage.setItem('tickets', JSON.stringify(ticketArray))
            }       
        })
    }

    // change ticket priority
function handleColor(ticket) {
    let ticketColorBand = ticket.querySelector('.ticket-color')

    ticketColorBand.addEventListener('click', () => {
        let currentColor = ticketColorBand.classList[1]

        let currentColorIndex = colors.findIndex(color => {
            return color == currentColor
        })

        currentColorIndex++

        let newColorIndex = currentColorIndex % colors.length
        let newColor = colors[newColorIndex]

        // remove current color
        ticketColorBand.classList.remove(currentColor)

        // add new color
        ticketColorBand.classList.add(newColor)

        // updating ticketArray state with new color
        let ticketId = ticket.children[1].innerText

        ticketArray.forEach(t => {
            if (t.ticketId == ticketId){
                t.ticketColor = newColor
            }
        })

        // update local storage
        localStorage.setItem('tickets', JSON.stringify(ticketArray))
    })
}

// implementing filters
toolboxColors.forEach(toolboxColor => {
    toolboxColor.addEventListener('click', () => {
        console.log('Single click')
        let selectedToolBoxColor = toolboxColor.classList[0]

        let filteredTickets = ticketArray.filter(ticket => {
            return selectedToolBoxColor == ticket.ticketColor
        })

        let allTickets = document.querySelectorAll('.ticket-cont')

        // remove all tickets
        allTickets.forEach(ticket => {
            ticket.remove();
        })

        // recreate tickets within filtered array
        filteredTickets.forEach(filteredTicket => {
            createTicket(filteredTicket.ticketColor, filteredTicket.ticketDesc, filteredTicket.ticketId)
        })
    })

    toolboxColor.addEventListener('dblclick', () => {
        console.log('Double click')
        // remove all the tickets from the DOM
        let allTickets = document.querySelectorAll('.ticket-cont')

        allTickets.forEach(ticket => {
            ticket.remove()
        })

        // create all tickets from ticket array
        ticketArray.forEach(ticket => {
            createTicket(ticket.ticketColor, ticket.ticketDesc, ticket.ticketId)
        })
    })
})
// local storage
let ticketsLocalStorage = localStorage.getItem('tickets')
if (ticketsLocalStorage) {
    ticketArray = JSON.parse(ticketsLocalStorage)
    ticketArray.forEach(ticket => {
        createTicket(ticket.ticketColor, ticket.ticketDesc, ticket.ticketId)
    })
}







