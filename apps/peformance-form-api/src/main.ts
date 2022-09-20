/* eslint-disable @typescript-eslint/no-var-requires */
/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

// eslint-disable-next-line @typescript-eslint/no-var-requires
const pg = require('pg');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const cors = require('cors')

require('dotenv').config()
console.log('check', process.env)
const config = {
  host: 'handiar.postgres.database.azure.com',
  // Do not hard code your username and password.
  // Consider using Node environment variables.
  user: 'handiAR@handiar',
  password: 'hanAR@123',
  database: 'hackathon',
  port: 5432,
  ssl: true
};

const client = new pg.Client(config);
console.log('check', client);

import * as express from 'express';

const databaseConnection = (queryDatabase) => {
  console.log('check', client);
  if (client._connected) {
    queryDatabase();
    return;
  }
  client.connect(err => {
    if (err) throw err;
    else {
      queryDatabase();
    }
  });
}


const app = express();
app.use(cors())

app.get('/api', (req, res) => {
  res.send({ message: 'Welcome to peformance-form-api!' });
});

app.get('/createPerformanceTable', (req, res) => {

  databaseConnection(queryDatabase)

  function queryDatabase() {
    const query = `
        DROP TABLE IF EXISTS PerformanceReport;
        CREATE TABLE PerformanceReport (id serial PRIMARY KEY, email VARCHAR(50), 	Week_Number INTEGER, Year INTEGER, Asset_Name VARCHAR(50),Current_Week_Footfall INTEGER, Same_Week_Previous_Year_Footfall INTEGER, Change Integer, Thresold_Breach BOOLEAN, Justification VARCHAR(300));
    `;

    client
      .query(query)
      .then(() => {
        res.send("Table created successfully")
      })
      .catch(err => console.log(err))
      .then(() => {
        console.log('Finished execution, exiting now');
        process.exit();
      });
  }
})

app.get('/generatePeformanceReport', (req, res) => {

  databaseConnection(queryDatabase)

  function queryDatabase() {
    const query = `
        INSERT INTO PerformanceReport (email, Week_Number,Year, Asset_Name,Current_Week_Footfall, Same_Week_Previous_Year_Footfall, Change, Thresold_Breach) VALUES ('abc@gmail.com', 23,2022,'IBN',23,34,44,True);
    `;

    client
      .query(query)
      .then(() => {
        res.send('pushed to table successfully')
      })
      .catch(err => console.log(err))
      .then(() => {
        console.log('Finished execution, exiting now');
        process.exit();
      });
  }

})

app.get('/performanceForm', (req, res) => {
  const id = req.query.id;

  databaseConnection(queryDatabase)

  function queryDatabase() {

    const query = `
          select * from PerformanceReport where id = ${id}
      `;

    client
      .query(query)
      .then((data) => {
        console.log('Table created successfully!');
        res.send(data.rows)
      })
      .catch(err => console.log(err))
      .then(() => {
        console.log('Finished execution, exiting now');
      });
  }
})

app.get('/updateTheReport', (req, res) => {
  const justification = req.query.justification;
  const id = req.query.id;
  console.log('id', id, 'justification', justification)
  databaseConnection(queryDatabase)

  function queryDatabase() {

    const query = `
        UPDATE PerformanceReport  set Justification='${justification}' where id = ${id}
      `;

    client
      .query(query)
      .then((data) => {
        console.log('Table created successfully!');
        res.send(data.rows)
      })
      .catch(err => console.log(err))
      .then(() => {
        console.log('Finished execution, exiting now');
      });
  }


})

const port = process.env.port || 3333;
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/api`);
});
server.on('error', console.error);

process.on('SIGTERM', () => {
  client.end(console.log('Closed client connection'));
  console.info('SIGTERM signal received.');
});