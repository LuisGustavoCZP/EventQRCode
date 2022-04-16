import { filterInputs } from "./fields.js";

const inputuser = document.getElementById('input-user');
const inputpass = document.getElementById('input-pass');
const inputlogin = document.getElementById('login-button');
const userlog = document.getElementById('user-log');

function canLogin (e)
{
    if(inputuser.value.length >= 4 && inputpass.value.length >= 4)
    {
        inputlogin.classList.add('enabled');
        inputlogin.addEventListener('click', userLogin);
    }
    else
    {
        inputlogin.classList.remove('enabled');
        inputlogin.removeEventListener('click', userLogin);
    }
}

function enterLogin (e)
{
    if (e.keyCode === 13) {
        e.preventDefault();
        inputlogin.click();
    }
}

filterInputs(inputuser, inputpass);

inputuser.addEventListener("keyup", enterLogin);
inputpass.addEventListener("keyup", enterLogin);

inputuser.addEventListener('input', canLogin);
inputpass.addEventListener('input', canLogin);

async function userLogin () 
{
    fetch("/login", 
    {
        method: 'post',
        body: JSON.stringify({username:inputuser.value, password:inputpass.value}),
        headers: 
        { 
            'Content-Type': 'application/json',
        }
    })
    //.then((resp) => resp.json())
    .then(resp => resp.json())
    .then(resp => 
    {
        userlog.innerText = resp.text;
        userlog.classList.forEach(clss => {userlog.classList.remove(clss)});
        userlog.classList.add(resp.color);
        console.log(resp)
        if(resp.color == "green") setTimeout(() => {document.location.reload();}, 1000)
    })//(resp) => resp.json()
    .catch(fail => {console.log(fail);});
}