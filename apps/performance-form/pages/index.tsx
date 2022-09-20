import styles from './index.module.css';
import {
  Paper,
  Button,
  TextField,
  TableHead,
  TableRow,
  TableCell,
  TableContainer,
  Table,
  TableBody,
  Typography
} from '@material-ui/core';
import { useState } from 'react';
import { useRouter } from 'next/router';

export function Index({ json }) {
  /*
   * Replace the elements below with your own.
   *
   * Note: The corresponding styles are in the ./index.css file.
   */

  const data = json[0];
  //const [loading, setLoading] = useState(true);
  const [disabled, setDisabled] = useState(data['justification'] ? true : false);
  const [justification, setJustification] = useState(data['justification']);

  const router = useRouter()
  const { id } = router.query

  console.log(id, json);



  const handleEdit = () => {
    setDisabled(prev => !prev);
  }

  // useEffect(() => {
  //   console.log('chekcing');
  //   const fetchData = async () => {
  //     const performanceData = await fetch(`http://localhost:3333/performanceForm?id=${id}`, {
  //       mode: 'cors',
  //       headers: {
  //         'Access-Control-Allow-Origin': '*'
  //       }
  //     });
  //     const json = await performanceData.json();
  //     setData(json[0]);
  //     setJustification(json[0]['justification']);
  //     setLoading(false);
  //     if (json[0] && json[0]['justification']) {
  //       setDisabled(true);
  //     }
  //   }
  //   if (id) fetchData();
  // }, [id])

  const handleSubmit = async () => {

    const performanceData = await fetch(`http://localhost:3333/updateTheReport?id=${id}&justification=${justification}`, {
      mode: 'cors',
      headers: {
        'Access-Control-Allow-Origin': '*'
      }
    })
    handleEdit();
    alert('justification has been changed succesfully click on edit justification to modify it')
  }

  const handleChange = (e) => {
    setJustification(e.target.value);
    //console.log(e.target.value)
  }

  return (
    <div className={styles.page} >
      <Paper>
        <header className='heading'>
        <Typography variant="h4" gutterBottom >
          Peformance Form 
        </Typography>
        </header>

       <div className='peformance-data' >
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Field Name</TableCell>
                <TableCell align="right">Value</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Object.keys(data).map((key) => {
                //if (key === 'justification') return;
                if (key === 'thresold_breach') {
                  return (
                    <TableRow
                      key={key}
                    >
                      <TableCell component="th" scope="row">
                        {key}
                      </TableCell>
                      <TableCell align="right">{data[key] ? 'true' : 'false'}</TableCell>

                    </TableRow>);
                }
                return (
                  <TableRow
                    key={key}
                  >
                    <TableCell component="th" scope="row">
                      {key}
                    </TableCell>
                    <TableCell align="right">{key === 'justification' ? justification : data[key]}</TableCell>

                  </TableRow>)
              })}
            </TableBody>
          </Table>
        </TableContainer>


       {
        !disabled &&(
        <TextField
          disabled={disabled}
          className='field'
          id="standard-multiline-flexible"
          label={"Justification"}
          multiline
          rows={5}
          maxRows={15}
          value={justification}
          onChange={handleChange}
          variant="standard"
        />)
       }
        </div>

        <div className='button-wrap'>
          {!disabled ? (<Button className='button' onClick={handleSubmit}>Submit</Button>) :
            (<Button className='button' onClick={handleEdit}>Edit the Justification</Button>)
          }
        </div>
      </Paper>
    </div>
  );
}

export async function getServerSideProps(context) {

  let json;
  if (context.query) {
    const id = context.query.id;
    const performanceData = await fetch(`http://localhost:3333/performanceForm?id=${id}`, {
      mode: 'cors',
      headers: {
        'Access-Control-Allow-Origin': '*'
      }
    });
    json = await performanceData.json();
  }

  console.log('context', context.query, 'cjel', json);

  return {
    props: {
      json
    }
  }

}

export default Index;