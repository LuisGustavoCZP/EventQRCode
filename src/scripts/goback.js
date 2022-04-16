const buttonback = document.getElementById('b-back');
buttonback.addEventListener("click", goback);

async function goback ()
{
    console.log(document.location.pathname);
    document.location.pathname = "";
}