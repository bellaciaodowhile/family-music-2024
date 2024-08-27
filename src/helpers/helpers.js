const toCapitalize = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

const capitalizeString = (inputString) => {
    const array = inputString.split(' ');
    const capitalizedArray = array.map(toCapitalize);
    return capitalizedArray.join(' '); 
};

export {
    capitalizeString
}