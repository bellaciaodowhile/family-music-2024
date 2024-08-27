import { client } from "../supabase/client";

const getData = async (objCondition) => {
    const { data, error } = await client
    .from('personas')
    .select()
    .match(objCondition);
    if (error) return console.log('Ha ocurrido un error al extraer los datos')
    return data;
}


export {
    getData
}