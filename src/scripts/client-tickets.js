const listEl = document.getElementById("list");
const modal = document.getElementById("modal");
modal.remove();

async function getEvents () 
{
    const response = await fetch("/event/tickets").then(resp=>resp.json()).catch((err)=>{console.log(err);});
    
    if(response.tickets.length)
    {
        response.tickets.forEach((ticket, index) => 
        {
            //console.log(ticket);
            listEl.innerHTML = `
                <li onclick="openModal(${index})" id="${ticket.key}">
                    <span>${ticket.event}</span>
                </li>
            `;
        });
    }
    
}

async function openModal (index)
{
    const target = listEl.children[index];
    console.log(target);
    const qrcode = await getqrcode(target.id);
    modal.remove();
    document.body.append(modal);
    modal.innerHTML = `<img id="qrcode" src='${qrcode.ticket}'/><button onclick="cancelEvent(event)">Voltar</button>`;
}

function cancelEvent (e)
{
    e.preventDefault();
    e.stopPropagation();
    /* modal.classList.add("hidden"); */
    modal.remove();
}

async function getqrcode (ticketID)
{
    console.log(ticketID);
    const response = await fetch("/event/ticket", 
    {
        method: 'post',
        body: JSON.stringify({key:ticketID}),
        headers: 
        { 
            'Content-Type': 'application/json',
        }
    }).then(resp => resp.json());
    console.log(response);
    return response;
}

getEvents ();