const toCapitalize = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase().trim();
};

const capitalizeString = (inputString) => {
    const array = inputString.trim().split(' ');
    const capitalizedArray = array.map(toCapitalize);
    return capitalizedArray.join(' '); 
};

export {
    capitalizeString
}