"use client";

import axios from "axios";
    import Link from 'next/link';
import CardHeader from '@mui/material/CardHeader';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Avatar from '@mui/material/Avatar';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { red } from '@mui/material/colors';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Button from '@mui/material/Button';
import { useState, useEffect } from 'react';
import { useParams } from "next/navigation";




  interface ProductDetailsProps {
  id: string;
  title: string;
  description: string;
  size:string[];    
  price:number;
  image: string;
  category: string;
}

interface ExpandMoreProps extends IconButtonProps {
  expand: boolean;
}


/////////////////////////////////////////

const DataDisplayPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const {id} =useParams()
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/products/${id}`); // Replace with your API endpoint
       setData(response.data)
        console.log(response.data)
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []); // The empty dependency array ensures this effect runs only once after the initial render

  if (loading) {
    return <div>Loading data...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!data) {
    return <div>No data found.</div>;
  }

  return (
    <div style={{marginTop:"10px" , margin:"auto"}}>
       <Card  style={{marginTop:"10px" ,margin:"auto"}}sx={{ maxWidth: "345"  , minHeight: "80vh",
        backgroundImage:
          "linear-gradient(rgba(110, 255, 134, 0.5), rgba(55, 68, 51, 0.5))"}}>
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
            
          </Avatar>
        }
        action={
          <IconButton aria-label="settings">
            <MoreVertIcon />
          </IconButton>
        }
        title={data.title}
        />
        {/* {data.images.map((e)=>{
          <CardMedia
        component="img"
        height="194"
        image={`/images/${e}`}
        alt={data.images}
      />
        })} */}
       <CardMedia
        component="img"
        height="194"
        image={`/images/${data.images[0]}`}
        alt={data.images[0]}
      />
      <CardContent>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
        ${data.price}
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
<Button  href="http://localhost:3000/favorite">
<FavoriteIcon />
</Button>
        
     
        
      </CardActions>
    
        <CardContent>
          <Typography sx={{ marginBottom: 2 }}>Description:</Typography>
          <Typography sx={{ marginBottom: 2 }}>
           {data.description}
          </Typography>
          <Typography sx={{ marginBottom: 2 }}>
          {data.size}
          </Typography>
        </CardContent>
    
    </Card>
        </div>
  );
};






























//////////////////////////////////////



export default DataDisplayPage;


///////////////////////////////////
interface ProductDetailsProps {
  id: string;
  title: string;
  description: string;
  size:string[];    
  price:number;
  image: string;
  category: string;
}

