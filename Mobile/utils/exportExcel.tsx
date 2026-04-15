import * as XLSX from 'xlsx';

interface AsistenteDelDia {
	id: string;
	nombre: string;
	horaRegistro?: string;
	fechaRegistro?: string;
}

export const exportarAsistentesDelDiaExcel = (
	nombreClase: string,
	asistentes: AsistenteDelDia[]
) => {
	const fechaHoy = new Date().toISOString().slice(0, 10);

	const filas = asistentes.map((a, idx) => ({
		N: idx + 1,
		Clase: nombreClase,
		Fecha: a.fechaRegistro || fechaHoy,
		ID_Estudiante: a.id,
		Nombre: a.nombre,
		Hora_Registro: a.horaRegistro || '--:--:--',
	}));

	const hoja = XLSX.utils.json_to_sheet(filas.length ? filas : [{
		N: '',
		Clase: nombreClase,
		Fecha: fechaHoy,
		ID_Estudiante: '',
		Nombre: 'Sin asistentes registrados hoy',
		Hora_Registro: '',
	}]);

	const libro = XLSX.utils.book_new();
	XLSX.utils.book_append_sheet(libro, hoja, 'AsistenciaDia');

	const nombreArchivo = `asistencia_${nombreClase.replace(/\s+/g, '_')}_${fechaHoy}.xlsx`;
	XLSX.writeFile(libro, nombreArchivo);
};
