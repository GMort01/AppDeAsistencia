export interface Profesor{
    id:string;
    correo:string;
    password:string;
}

//bd simuladfa
export const listaProfesores:Profesor[]=[
    {id:'admin1',correo:'juan@ejemplo.com',password:'123'}
];

//funcion paravalidar credenciales del profesor
export const validarProfesor=(
    //id:string,
    correo:string,
    password:string
):Profesor|null=>{

    return(listaProfesores.find(
        p=> p.correo === correo && p.password === password
    )||null);
};