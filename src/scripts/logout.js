const buttonback = document.getElementById('b-back');
buttonback.addEventListener("click", goback);

async function goback ()
{
    document.cookie = "token=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
    document.location.href = "/logout";
}