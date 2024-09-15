const toCapitalize = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase().trim();
};

const capitalizeString = (inputString) => {
    const array = inputString.trim().split(' ');
    const capitalizedArray = array.map(toCapitalize);
    return capitalizedArray.join(' '); 
};
const months = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre"
  ];

function dateFormatt(dateStr) {
    const [day, month, year] = dateStr.split('/').map(Number);
    return `${day} de ${months[month - 1]} del 20${year}`;
  }
  

export {
    capitalizeString,
    dateFormatt
}