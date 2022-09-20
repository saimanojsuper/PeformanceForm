import styles from './index.module.css';
import {
  Typography,
  Paper,
  Link,
  Grid,
  Button,
  CssBaseline,
  MenuItem,
  TextField
} from '@material-ui/core';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export function Index() {
  /*
   * Replace the elements below with your own.
   *
   * Note: The corresponding styles are in the ./index.css file.
   */

  const [data, setData] = useState('');
  const [loading, setLoading] = useState(true);
  const [disabled, setDisabled] = useState(false);
  const [justification, setJustification] = useState('');

  const router = useRouter()
  const { id } = router.query

  console.log(id, data);



  const handleReset = () => {
    setDisabled(prev => !prev);
  }

  useEffect(() => {
    console.log('chekcing');
    const fetchData = async () => {
      const performanceData = await fetch(`http://localhost:3333/performanceForm?id=${id}`, {
        mode: 'cors',
        headers: {
          'Access-Control-Allow-Origin': '*'
        }
      });
      const json = await performanceData.json();
      setData(json[0]);
      setJustification(json[0]['justification']);
      setLoading(false);
      if (json[0] && json[0]['justification']) {
        setDisabled(true);
      }
    }
    if (id) fetchData();
  }, [id])

  const handleSubmit = () => {
    const updateTheReport = async () => {
      const performanceData = await fetch(`http://localhost:3333/updateTheReport?id=${id}&justification=${justification}`, {
        mode: 'cors',
        headers: {
          'Access-Control-Allow-Origin': '*'
        }
      })
    }
    updateTheReport();
    handleReset();
    console.log('submitted')
  }

  const handleChange = (e) => {
    setJustification(e.target.value);
    //console.log(e.target.value)
  }

  return (
    !loading && (
      <div className={styles.page} >
        <Paper>
          <h2>Form Demo</h2>

          <TextField
            //readOnly= {true}
            disabled
            className='field'
            value={data['email']}
            label={"email"} //optional
          />
          <TextField
            disabled
            className='field'
            value={data['week_number']}
            label={"Week_Number"} //optional
          />
          <TextField
            disabled
            className='field'
            value={data['year']}
            label={"Year"} //optional
          />
          <TextField
            disabled
            className='field'
            value={data['asset_name']}
            label={"Asset_Name"} //optional
          />
          <TextField
            disabled
            className='field'
            value={data['current_week_footfall']}
            label={"Current_Week_Footfall"} //optional
          />
          <TextField
            disabled
            className='field'
            value={data['same_week_previous_year_footfall']}
            label={"Same_Week_Previous_Year_Footfall"} //optional
          />
          <TextField
            disabled
            className='field'
            value={data['change']}
            label={"Change"} //optional
          />
          <TextField
            disabled
            className='field'
            value={data['thresold_breach']}
            label={"Thresold_Breach"} //optional
          />
          <TextField
            disabled={disabled}
            className='field'
            value={justification}
            label={"Justification"} //optional
            onChange={handleChange}
          />

          <Button onClick={handleSubmit}>Submit</Button>
          <Button onClick={handleReset}>Reset</Button>
        </Paper>
      </div>)
  );
}

export default Index;