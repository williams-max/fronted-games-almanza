
import React, { useState, useEffect } from "react";
import { List, ListItem, ListItemText, Button, Typography, Box } from "@mui/material";
import { useRouter } from 'next/router';
import axios from 'axios'

export default function DiagramaRender() {
  const router = useRouter();
  const [showMore, setShowMore] = useState(false);
  const [listaItems, setlistaIems] = useState<any>([])

  const handleShowMore = (id : any) => {
    console.log('imprimiendo el valor  id ', id)
    // setShowMore(!showMore);
    router.push(`/graficos/${id}`);
  };

  const urlBase = 'https://backend-games-almanza.onrender.com'//'http://localhost:3003'

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {

    try {
      const response = await axios.get(`${urlBase}/componente`)
      console.log('respuesta ', response.data.datos.rows)
      setlistaIems(response.data.datos.rows)
    } catch (error) {
      console.log('error ', error)
    }
  }

  return (
    <div style={{ width: '100%', padding: '16px' }}>
      <Typography variant="h6">Graficos</Typography>

      <Box mt={2}>
        <List>
          {listaItems.map((item:any, index: number) => (
            <ListItem key={index} style={{width:'40%'}}>

              <ListItemText
                primary={item.nombre}
                secondary={item.descripcion}
              />
              <Button variant="contained" color="primary" onClick={() => handleShowMore(item.id)}>
               {showMore ? "Ver menos" : "Ver más"}
              </Button>
            </ListItem>
          ))}
        </List>
        
      </Box>
    </div>
  );
}