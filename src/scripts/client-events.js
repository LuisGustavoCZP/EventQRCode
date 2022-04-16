const listEl = document.getElementById("list");
const modal = document.getElementById("modal");
modal.remove();

async function getEvents () 
{
    const events = await fetch("/event/all").then(resp=>resp.json()).catch((err)=>{console.log(err);});
    events.forEach((event, index) => 
    {
        listEl.innerHTML = `
            <li onclick="modalConfirm(${index})">
                <span>${event.name}</span>
                <span>. Data ${event.date.replace("T", " ")}</span>
                <span>. ${event.location.street}, ${event.location.number}. ${event.location.district}. ${event.location.city}, ${event.location.state}.</span>
            </li>
        `;
    });
}

function modalConfirm (eventIndex)
{
    modal.remove();
    listEl.children[eventIndex].append(modal);
    modal.innerHTML = `
    <button onclick="confirmEvent(event, ${eventIndex})">Confirmar</button>
    <button onclick="cancelEvent(event)">Desistir</button>
    `;
}

function cancelEvent (e)
{
    e.preventDefault();
    e.stopPropagation();
    /* modal.classList.add("hidden"); */
    modal.remove();
}

async function confirmEvent (e, eventIndex)
{
    console.log(eventIndex);
    e.preventDefault();
    e.stopPropagation();
    modal.remove();
    const response = await fetch("/event/add", 
    {
        method: 'post',
        body: JSON.stringify({eventid:eventIndex}),
        headers: 
        { 
            'Content-Type': 'application/json',
        }
    }).then(resp => resp.json());
    console.log(response);
}

getEvents ();