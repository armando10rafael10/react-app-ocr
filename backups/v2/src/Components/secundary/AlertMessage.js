import { Alert } from '@mui/material';
import * as React from 'react';

export default function AlertMessage(props){
    return(
        <div>
            {/* <p>{props.value}</p> */}
            <Alert severity="info">{props.value}</Alert>
        </div>
    );
} 