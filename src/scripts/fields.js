function filter(e) 
{
    let t = e.target;
    let badValues = /[^\w\d]/g;//i
    t.value = t.value.replace(badValues, '');
}

function filterInputs (...inputs)
{
    inputs.forEach(input => 
    {
        input.addEventListener('input', filter);
    });
}

export { filterInputs, filter };