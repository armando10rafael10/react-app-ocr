import { BrowserRouter,Route,Switch } from 'react-router-dom';
import ImgOcr from './ImgOcr';

export default function rutes() {
    return(
        <BrowserRouter>
            <Switch>
                <Route exact path='/' component={ImgOcr}/>
            </Switch>
        </BrowserRouter>
    )
}