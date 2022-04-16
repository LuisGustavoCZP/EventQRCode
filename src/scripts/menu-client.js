const usernameText = document.getElementById('user-name');
const btnevents = document.getElementById('events');
const btntickets = document.getElementById('tickets');

btnevents.addEventListener("click", goevents);
btntickets.addEventListener("click", gotickets);

async function userData () 
{
    fetch("/userdata", 
    {
        method: 'get',
        headers: 
        { 
            'Content-Type': 'application/json',
        }
    })
    //.then((resp) => resp.json())
    .then(resp => resp.json())
    .then(resp => 
    {
        console.log(resp);
        usernameText.innerText = resp.fullname;
        //setTimeout(() => {document.location.reload();}, 1000)
    })//(resp) => resp.json()
    .catch(fail => {console.log(fail);});
}

async function goevents ()
{
    document.location.assign("events");
}

async function gotickets ()
{
    document.location.assign("tickets");
}

userData ();

