import express from 'express';
import cors from "cors";
import txtManagement from './utilidades/manejoDeArchivoTXT.js';  
import pool from './db.js';



const app = express();
const port = process.env.PORT || 3000;


//    // Lee desde .env
// const client = twilio(accountSid, authToken);

var bfbpm = 0;
var data = {
  bpm: "off",
  o2: "off",
  temp: "off"
}

app.use(cors()); 

//endopoint para obtener los signos
app.get('/signs', (req, res) => {
  const date = new Date();
  
  if (data.o2 > 50) {
    if (data.o2 < 60){
      data.o2 += 30
  }
    }
  if (data.o2 > 60) {
    if (data.o2 < 70) {
      data.o2 += 20
  }
}
  if (data.o2 > 70) {
    if (data.o2 < 80) {
      data.o2 += 10
    }
  }
  if (data.o2 > 80) {
    if (data.o2 < 90) {
      data.o2 += 5
    }
  }

  if (data.bpm < 60) {
    data.bpm = 61;
  }

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


// app.get('/makeemergencianum', async (req, res) => {
//   try {
//     // Consulta a la base de datos
//     const result = await pool.query('SELECT * FROM emergencianum');
//     const emergencies = result.rows;

//     // Iteramos cada registro y enviamos mensajes
//     for (const emergency of emergencies) {
//       const { num1, num2, num3, num4 } = emergency;

//       // Filtramos números válidos (excluyendo "0" o valores nulos)
//       const phoneNumbers = [num1, num2, num3, num4].filter(num => num && num !== '0');

//       // Enviar mensajes a cada número filtrado
//       for (const number of phoneNumbers) {
//         await client.messages.create({
//           body: 'Mensaje de emergencia desde tu aplicación.',  // Personaliza tu mensaje
//           from: '+12408016639',  // Reemplaza con tu número de Twilio
//           to: number,
//         });
//       }
//     }

//     res.status(200).send('Mensajes enviados correctamente');
//   } catch (err) {
//     console.error('Error al enviar mensajes:', err);
//     res.status(500).send('Error al enviar mensajes');
//   }
// });

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

app.post('/changeemergenciaemail/:id/:email1/:email2/:email3/:email4', async (req, res) => {
  const { id, email1, email2, email3, email4 } = req.params; // Extraemos los parámetros de la URL

  try {
    // Realizamos la consulta SQL para actualizar los correos en la tabla 'correos_emails'
    const result = await pool.query(
      'UPDATE correos_emails SET email1 = $1, email2 = $2, email3 = $3, email4 = $4 WHERE id = $5',
      [email1, email2, email3, email4, id]  // Los valores que se van a actualizar
    );
    
    console.log('Resultado de la consulta:', result);

    // Si la fila fue actualizada correctamente, se devuelve el mensaje
    if (result.rowCount > 0) {
      res.json({ message: 'Correos electrónicos actualizados correctamente', result });
    } else {
      res.status(404).send('No se encontró el registro con ese ID');
    }
  } catch (err) {
    console.error('Error al actualizar los correos electrónicos:', err);
    res.status(500).send('Error al actualizar los correos electrónicos');
  }
});


//endpoint que usara el esp32 para mandar la informacion a la api
app.post('/sendsigns/:bpm/:o2/:temp', (req, res) => {
  const date = new Date();

  bfbpm = data.bpm;
  data.bpm = req.params.bpm;
  data.o2 = req.params.o2;
  data.temp = req.params.temp;
  res.json(data);
  const datos = req;
  txtManagement(req.params.bpm, req.params.o2, req.params.temp);
  
});

// Endpoint GET para obtener los correos electrónicos guardados
app.get('/emergenciaemail/:id', async (req, res) => {
  const { id } = req.params; // Extraemos el parámetro id

  try {
    // Realizamos la consulta SQL para obtener los correos electrónicos del ID dado
    const result = await pool.query('SELECT * FROM correos_emails WHERE id = $1', [id]);

    // Si se encontraron correos electrónicos para ese ID
    if (result.rows.length > 0) {
      res.json({ emails: result.rows });
    } else {
      res.status(404).send('No se encontraron correos para este ID');
    }
  } catch (err) {
    console.error('Error al obtener los correos:', err);
    res.status(500).send('Error al obtener los correos electrónicos');
  }
});

app.listen(port, () => console.log(`Server running on port ${port}`));
