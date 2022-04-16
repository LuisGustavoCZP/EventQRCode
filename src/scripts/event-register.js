import { filterInputs } from "./fields.js";

const inputname = document.getElementById('input-name');
const inputdate = document.getElementById('input-date');
const inputstreet = document.getElementById('input-street');
const inputnumber = document.getElementById('input-number');
const inputdistrict = document.getElementById('input-district');
const inputcity = document.getElementById('input-city');
const inputstate = document.getElementById('input-state');
const userlog = document.getElementById('user-log');

const eventReg = document.getElementById('register-button');
const inputs = [
    inputname,
    inputstreet,
    inputnumber,
    inputdistrict,
    inputcity,
    inputstate,
    inputdate
];

filterInputs(inputnumber);
//eventReg.classList.add('enabled');

function canLogin (e)
{
    if(inputname.value.length >= 4 && inputnumber.value.length >= 1 && inputstreet.value.length >= 4 && inputdistrict.value.length >= 6 && inputcity.value.length >= 4 && inputstate.value.length >= 4 && inputdate.value)
    {
        eventReg.classList.add('enabled');
        eventReg.addEventListener('click', eventRegister);
    }
    else
    {
        eventReg.classList.remove('enabled');
        eventReg.removeEventListener('click', eventRegister);
    }
}

function enterReg (e)
{
    if (e.keyCode === 13) {
        e.preventDefault();
        eventReg.click();
    }
}

const datenow = new Date().toISOString();
inputdate.value = datenow.substring(0, datenow.lastIndexOf('.'));
inputs.forEach(element => {
    element.addEventListener('input', canLogin);
    element.addEventListener("keyup", enterReg);
});

//eventReg.addEventListener('click', eventRegister);

async function eventRegister () 
{
    fetch("/register/event",
    {
        method: 'post',
        body: JSON.stringify({
            name:inputname.value, 
            date:inputdate.value,
            location:{
                street:inputstreet.value,
                number:inputnumber.value, 
                district:inputdistrict.value,
                city:inputcity.value,
                state:inputstate.value
            }
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