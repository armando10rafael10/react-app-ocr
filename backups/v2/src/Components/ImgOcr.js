import { useState } from 'react';
import * as React from 'react';
import Tesseract from 'tesseract.js';
import { Button } from '@mui/material';
import Switch from '@mui/material/Switch';
import CircularProgressWithLabel from './secundary/CircularProgressWithLabel';
import {toast} from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css'; 
import './ImgOcr.css';

toast.configure();
export default function ImgOcr() { 
  const [textImageOrc, setTextImageOrc] = useState([]);
  const [imagePath, setImagePath] = useState("https://i.ibb.co/4Rxyrc6/default.png");
  const [fileActive, setFileActive] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressActive, setProgressActive] = useState(false);
  const [languageSwitch, setLanguageSwitch] = useState("spa");
  const [checkedSwitchLanguage, setCheckedSwitchLanguage] = useState(false);
  const [textFormatSwitch, setTextFormatSwitch] = useState("paragraphs");
  const [checkedSwitchTextFormat, setCheckedSwitchTextFormat] = useState(false);
  const [stylesDefined, setStylesDefined] = useState({
    fontStyle: 'Normal',
    fontSize: 12,
    fontFamily: 'Arial',
    color: '#000000',
    backgroundColor: '#FFFFFF',
    wordSpacing: 0,
    textTransform: 'None',
    fontWeight: 'Normal',
    textDecoration: 'None'
  }
  );

  const setAlerta = (valor, type) =>{ 
    if(type === "success"){
      toast.success(valor, {
        position: toast.POSITION.TOP_LEFT,
        theme: "light",
        hideProgressBar: true,
        closeOnClick: true,
      });
    }else if(type === "warn"){
      toast.warn(valor, {
        position: toast.POSITION.TOP_LEFT,
        theme: "light",
        hideProgressBar: true,
        closeOnClick: true,
      });
    }else if(type === "info"){
      toast.info(valor, {
        position: toast.POSITION.TOP_LEFT,
        theme: "light",
        hideProgressBar: true,
        closeOnClick: true,
      });
    }else if(type === "error"){
      toast.error(valor, {
        position: toast.POSITION.TOP_LEFT,
        theme: "light",
        hideProgressBar: true,
        closeOnClick: true,
      });
    }else{
      toast(valor);
    }
  }

  const handleChangeFile = (event) => {
    if (document.getElementById('textBox_message').textContent) {//hay contenido texto
      document.getElementById('textBox_message').textContent = "";//delete text
    }
    try {
      var selectedFile = event.target.files[0];
      setImagePath(URL.createObjectURL(selectedFile));
      setAlerta("Imagen seleccionada", 'info');
      setFileActive(true);
    } catch (e) {
      document.getElementById('textBox_message').textContent = "";//delete text
      setAlerta("No selecciono ninguna imagen", 'warn');
      setImagePath("https://i.ibb.co/4Rxyrc6/default.png");
      setFileActive(false);
    }
  }

  const handleConvertClick = () => {
    if (fileActive === true) {
      setProgressActive(true);
      setAlerta("Procesando imagen.....!!", 'info');
      Tesseract.recognize(
        imagePath, languageSwitch, {
        logger: m => {
          setProgress(m.progress * 100);
        }
      }).catch(err => {
        console.error(err);
      }).then(result => {
        if(textFormatSwitch === "paragraphs"){
          setTextImageOrc(result.data.paragraphs);
        }else{
          setTextImageOrc(result.data.lines);
        }
        setAlerta("finalizo el procesamiento de la imagen", 'success');
      });
    } else {
      setProgressActive(false);
      setAlerta("No hay una imagen para procesar..!!", 'warn');
    }
  }

  const handleChangeSwitchLanguage = (event) => {
    setCheckedSwitchLanguage(event.target.checked);
    if (event.target.checked) {
      setLanguageSwitch("eng");
    } else {
      setLanguageSwitch("spa");
    }
  };

  const handleChangeSwitchTextFormat = (event) => {
    setCheckedSwitchTextFormat(event.target.checked);
    if (event.target.checked) {
      setTextFormatSwitch("lines");
    } else {
      setTextFormatSwitch("paragraphs");
    }
  };

  const handleCopyClick = () => {
    var textValue = document.getElementById("textBox_message");
    var seleccion = document.createRange();
    seleccion.selectNodeContents(textValue);
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(seleccion);
    try {
      var res = document.execCommand('copy');
      if (res)
        setAlerta('¡¡Código copiado al portapapeles!!','success');
      else
        setAlerta('¡¡Ha fallado el copiado al portapapeles!!', 'warn');
    } catch (ex) {
      setAlerta("Se ha producido un error al copiar al portapaples..", 'error');
    }
    window.getSelection().removeRange(seleccion);
  }

  const showTextImage = ( <div style={stylesDefined} id="textBox_message">
    {textImageOrc.map((line, i) =>
      <p key={i.toString()}> {line.text} </p>
    )}
  </div>
  );

  return (
    <div>
      {/* <AlertMessage value={alerta} /> */}
      <div className="Main">
          <div className="Main-lateral">
              <div className="Main-element">
                <h1>font size :</h1>
                <input type="number" min="12" max="40" step="2" defaultValue={stylesDefined.fontSize}
                  onChange={(e) => setStylesDefined({ ...stylesDefined, fontSize: `${e.target.value}px` })} />
              </div>
              <div className="Main-element">
                <h1>spacing :</h1>
                <input type="number" min="0" max="10" defaultValue={stylesDefined.wordSpacing}
                  onChange={(e) => setStylesDefined({ ...stylesDefined, wordSpacing: `${e.target.value}px` })} />
              </div>
              <div className="Main-element">
                <h1>color :</h1>
                <input type="color" value={stylesDefined.color} onChange={
                  (e) => setStylesDefined({ ...stylesDefined, color: `${e.target.value}` })
                } />
              </div>
              <div className="Main-element">
                <h1>background :</h1>
                <input type="color" value={stylesDefined.backgroundColor} onChange={
                  (e) => setStylesDefined({ ...stylesDefined, backgroundColor: `${e.target.value}` })
                } />
              </div>
              <div className="Main-element">
                <h1>font transform :</h1>
                <select id="font_style" defaultValue={stylesDefined.textTransform} onChange={
                  (e) => {
                    if (e.target.value === 'Underline') {
                      setStylesDefined({ ...stylesDefined, textDecoration: `${e.target.value}` });
                    } else if (e.target.value === 'Line-through') {
                      setStylesDefined({ ...stylesDefined, textDecoration: `${e.target.value}` });
                    } else if (e.target.value === 'None') {
                      setStylesDefined({ ...stylesDefined, textDecoration: `${e.target.value}`, textTransform: `${e.target.value}` });
                    } else {
                      setStylesDefined({ ...stylesDefined, textTransform: `${e.target.value}` });
                    }
                  }
                }>
                  <option>Lowercase</option>
                  <option>Capitalize</option>
                  <option>None</option>
                  <option>Underline</option>
                  <option>Line-through</option>
                </select>
              </div>
              <div className="Main-element">
                <h1>font style :</h1>
                <select id="font_style" defaultValue={stylesDefined.fontStyle} onChange={
                  (e) => {
                    if (e.target.value === 'Bold') {
                      setStylesDefined({ ...stylesDefined, fontWeight: `${e.target.value}` });
                    } else if (e.target.value === 'Bolder') {
                      setStylesDefined({ ...stylesDefined, fontWeight: `${e.target.value}` });
                    } else if (e.target.value === 'Lighter') {
                      setStylesDefined({ ...stylesDefined, fontWeight: `${e.target.value}` });
                    } else if (e.target.value === 'Normal') {
                      setStylesDefined({ ...stylesDefined, fontWeight: 'Normal', fontStyle: 'Normal' });
                    } else {
                      setStylesDefined({ ...stylesDefined, fontStyle: `${e.target.value}` });
                    }
                  }
                }>
                  <option>Italic</option>
                  <option>Oblique</option>
                  <option>Normal</option>
                  <option>Bold</option>
                  <option>Bolder</option>
                  <option>Lighter</option>
                </select>
              </div>
              <div className="Main-element">
                <h1>Text Align :</h1>
                <select id="font_style" defaultValue={stylesDefined.textTransform} onChange={
                  (e) => {
                      setStylesDefined({ ...stylesDefined, textAlign: `${e.target.value}` });
                  }
                }>
                  <option>Left</option>
                  <option>Center</option>
                  <option>Right</option>
                  <option>Justify</option>
                </select>
              </div>
              <div className="Main-element">
                <h1>font type:</h1>
                <select id="font_family" defaultValue={stylesDefined.fontFamily} onChange={
                  (e) => setStylesDefined({ ...stylesDefined, fontFamily: `${e.target.value}` })
                }>
                  <option>Arial</option>
                  <option>Bodoni</option>
                  <option>Courier</option>
                  <option>Cursive</option>
                  <option>Fantasy</option>
                  <option>Garamond</option>
                  <option>Georgia</option>
                  <option>Helvetica</option>
                  <option>Lucida Sans</option>
                  <option>Monospace</option>
                  <option>Sans-serif</option>
                  <option>Segoe UI</option>
                  <option>Serif</option>
                  <option>Tahoma</option>
                  <option>Trajan</option>
                  <option>Verdana</option>
                </select>
              </div>
          </div>
          <div className="Main-Contain">
            <div className="view-uploaded">
              <h1>Actual imagePath uploaded</h1>
              <img src={imagePath} className="App-image" alt="logo" />
              <br />
              <div className="selectionFile">
                | <input type="file" onChange={handleChangeFile} />
              </div>
              <div className="switch">
                  <Switch checked={checkedSwitchLanguage} onChange={handleChangeSwitchLanguage} color="primary" />
                  <label htmlFor="language-Switch">{languageSwitch}</label>

                  <Switch checked={checkedSwitchTextFormat} onChange={handleChangeSwitchTextFormat} color="primary" />
                  <label>{textFormatSwitch}</label>
              </div>
              <br />
              <Button onClick={handleConvertClick} variant="contained" size='medium'
                color="primary">convert to text</Button><br />
              {progressActive ? <CircularProgressWithLabel className="Cprogress"
                value={progress} color={"primary"} /> : null}
            </div>
            <div className="view-downloaded">
              <h1>Extracted text</h1>
              {showTextImage}<br />
              <Button variant="contained" size='medium' color="primary" onClick={handleCopyClick}>copy</Button>
            </div>
          </div>
      </div>
    </div>
  );
}