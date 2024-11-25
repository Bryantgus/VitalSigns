import express from 'express';
import cors from "cors";
import txtManagement from './utilidades/manejoDeArchivoTXT.js';  
import pool from './db.js';
const app = express();
const port = process.env.PORT || 3000;


var data = {
  bpm: "off",
  o2: "off",
  temp: "off"
}

app.use(cors()); 

//endopoint para obtener los signos
app.get('/signs', (req, res) => {
 const date = new Date();
 const responseData = {
    bmp: data.bpm,
    o2: data.o2,
    temp: data.temp,
    date: date
 }
 res.json(responseData);
});


//endpoint para obtener la informacion del paciente
app.get('/infopatient', async (req, res) => {
  try {
    // Realizamos una consulta a la base de datos para obtener los datos de la tabla infopatient
    const result = await pool.query('SELECT * FROM infopatient');
    res.json(result.rows);  // Devolvemos los resultados como JSON
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al obtener datos de la base de datos');
  }
});


app.post('/changeinfopatient/:id/:nombre/:sexo/:edad/:sangre', async (req, res) => {
  const { id, nombre, sexo, edad, sangre } = req.params; // Extraemos los parámetros de la URL

  try {
    // Realizamos la consulta SQL para actualizar solo la fila con el ID número 1
    const result = await pool.query(
      'UPDATE infopatient SET nombre = $1, sexo = $2, edad = $3, sangre = $4 WHERE id = $5',
      [nombre, sexo, edad, sangre, id]  // Los valores que se van a actualizar
    );
    
    // Si la fila fue actualizada correctamente, se devuelve el mensaje
    if (result.rowCount > 0) {
      res.json({ message: 'Información actualizada correctamente', result });
    } else {
      res.status(404).send('No se encontró el paciente con ese ID');
    }
  } catch (err) {
    console.error('Error al actualizar la información del paciente:', err);
    res.status(500).send('Error al actualizar la información del paciente');
  }
});


app.get('/emergencianum', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM emergencianum');
    res.json(result.rows);  // Devolvemos los datos de la tabla como JSON
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al obtener datos de la base de datos');
  }
});

app.post('/changeemergencianum/:id/:num1/:num2/:num3/:num4', async (req, res) => {
  const { id, num1, num2, num3, num4 } = req.params; // Extraemos los parámetros de la URL

  try {
    // Realizamos la consulta SQL para actualizar solo la fila con el ID en la tabla 'emergencianum'
    const result = await pool.query(
      'UPDATE emergencianum SET num1 = $1, num2 = $2, num3 = $3, num4 = $4 WHERE id = $5',
      [num1, num2, num3, num4, id]  // Los valores que se van a actualizar
    );
    
    console.log('Resultado de la consulta:', result);

    // Si la fila fue actualizada correctamente, se devuelve el mensaje
    if (result.rowCount > 0) {
      res.json({ message: 'Información de emergencia actualizada correctamente', result });
    } else {
      res.status(404).send('No se encontró el número de emergencia con ese ID');
    }
  } catch (err) {
    console.error('Error al actualizar la información de emergencia:', err);
    res.status(500).send('Error al actualizar la información de emergencia');
  }
});



//endpoint que usara el esp32 para mandar la informacion a la api
app.post('/sendsigns/:bpm/:o2/:temp', (req, res) => {
  const date = new Date();
  data.bpm = req.params.bpm;
  data.o2 = req.params.o2;
  data.temp = req.params.temp;
  res.json(data);
  const datos = req;
  txtManagement(req.params.bpm, req.params.o2, req.params.temp);
  
});

app.listen(port, () => console.log(`Server running on port ${port}`));
