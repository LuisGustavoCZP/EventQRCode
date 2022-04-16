const usernameText = document.getElementById('user-name');
const adduser = document.getElementById('adduser');
const addevent = document.getElementById('addevent');
const readqr = document.getElementById('readqr');


adduser.addEventListener("click", goadduser);
addevent.addEventListener("click", goaddevent);
readqr.addEventListener("click", goreadqr);

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

async function goadduser ()
{
    document.location.assign("newuser");
}

async function goaddevent ()
{
    document.location.assign("newevent");
}

async function goreadqr ()
{
    document.location.assign("readqr");
}

userData ();

