import { filterInputs } from "./fields.js";

const inputuser = document.getElementById('input-user');
const inputpass = document.getElementById('input-pass');
const inputname = document.getElementById('input-name');
const inputpriv = document.getElementById('input-priv');
const userlog = document.getElementById('user-log');

const userReg = document.getElementById('register-button');

filterInputs(inputuser, inputpass);

function canLogin (e)
{
    if(inputuser.value.length >= 4 && inputpass.value.length >= 4 && inputname.value.length >= 6)
    {
        userReg.classList.add('enabled');
        userReg.addEventListener('click', userReg);
    }
    else
    {
        userReg.classList.remove('enabled');
        userReg.removeEventListener('click', userReg);
    }
}

function enterLogin (e)
{
    if (e.keyCode === 13) {
        e.preventDefault();
        userReg.click();
    }
}

inputuser.addEventListener("keyup", enterLogin);
inputpass.addEventListener("keyup", enterLogin);
inputname.addEventListener("keyup", enterLogin);

inputuser.addEventListener('input', canLogin);
inputpass.addEventListener('input', canLogin);
inputname.addEventListener('input', canLogin);


userReg.addEventListener('click', userRegister);

async function userRegister () 
{
    fetch("/register/user", 
    {
        method: 'post',
        body: JSON.stringify({
            username:inputuser.value, 
            password:inputpass.value,
            fullname:inputname.value, 
            privilege:inputpriv.value,
        }),
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
        console.log(resp);
        if(resp.color == "purple") document.location.pathname = "";
        else if(resp.color == "green") 
        {
            setTimeout(() => {document.location.pathname = "";}, 1000)
        }
        //
    })//(resp) => resp.json()
    .catch(fail => {console.log(fail);});
}