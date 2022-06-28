import React, { Fragment, useState } from 'react'
import { Button } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import { Text } from '@chakra-ui/react';
import Message from './Message';
import Progress from './Progress';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FormErrorIcon } from '@chakra-ui/react';

const FileUpload = ({ uploadCompleted, setUploadCompleted }) => {
    const [file, setFile] = useState('');
    const [nameCollection, setNameCollection] = useState('');
    const [descriptionCollection, setDescriptionCollection] = useState('');
    const [numberPieces, setNumberPieces] = useState(0);
    const [stepLayer, setStepLayer] = useState(0);
    const [stepName, setStepName] = useState('');
    const [filename, setFilename] = useState('Choose File');
    const [uploadedFile, setUploadedFile] = useState({});
    const [message, setMessage] = useState('');
    const [uploadPercentage, setUploadedPercentage] = useState(0);
    const [countImage, setCountImage] = useState(0);

    const onChange = async (e) => {
        setFile(e.target.files[0]);
        setFilename(e.target.files[0].name);
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('file', file);
        formData.append('stepName', stepName);
        formData.append('fileName', stepName + countImage.toString());

        try {
            const res = await axios.post('/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
            });
            const { fileName, filePath } = res.data;
            setCountImage(countImage + 1);
            setUploadedFile({ fileName, filePath });
            setMessage('File Uploaded');
        } catch (err) {
            if (err.response.status === 500) {
                setMessage("Server ERROR");
            } else {
                setMessage(err.response.data.msg);
            }
        }
    };

    const generateImage = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append('nameCollection', nameCollection);
            formData.append('descriptionCollection', descriptionCollection);
            formData.append('numberPieces', numberPieces);
            const res = await axios.post('/generate', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
            });
            setMessage('Generated');
            setUploadCompleted(1);
        } catch (err) {
            if (err.response.status === 500) {
                setMessage("Server ERROR");
            } else {
                setMessage(err.response.data.msg);
            }
        }
    };

    const changeLayer = async(e) => {
        e.preventDefault();
        switch(stepLayer){
            case 0: setStepLayer(1);
                    setStepName('Background');
                    break;
            case 1: setStepLayer(2);
                    setStepName('Base');
                    break;
            case 2: setStepLayer(3);
                    setStepName('Eyes');
                    break;
            case 3: setStepLayer(4);
                    setStepName('Nose');
                    break;
            case 4: setStepLayer(5);
                    setStepName('Mouth');
                    break;
            case 5: setStepLayer(6);
                    setStepName('Accessories');
                    break;
            case 6: setStepLayer(7);
                break;
        }
    };

    if(stepLayer==0){
        return(<Fragment>
            <Form onSubmit={changeLayer}>
                <Form.Group className='mb-3' controlId='formNameCollection'>
                    <Form.Label>Nome della collezione</Form.Label>
                    <Form.Control type='text' onChange={(e) => setNameCollection(e.target.value)} placeholder='Inserisci il nome della collezione'/>
                </Form.Group>
                <Form.Group className='mb-3' controlId='formDescriptionCollection'>
                    <Form.Label>Descrizione della collezione</Form.Label>
                    <Form.Control type='text' onChange={(e) => setDescriptionCollection(e.target.value)} placeholder='Inserisci il nome della collezione' />
                </Form.Group>
                <Form.Group className='mb-3' controlId='formNumberCollection'>
                    <Form.Label>Numero di pezzi</Form.Label>
                    <Form.Control type='number' onChange={(e) => setNumberPieces(e.target.value)} placeholder='Inserisci il numero di pezzi da generare' />
                </Form.Group>
                <Button variant="primary" type="submit">
                    Next Step
                </Button>
            </Form>
        </Fragment>);
    }else{
        if(stepLayer==7){
            return(
            <Fragment>
                <Button variant="primary" onClick={generateImage}> Generate </Button>
            </Fragment>);
        }else{
            return(
                <Fragment>
                    <Form onSubmit={onSubmit}>
                        {message ? <Message msg={message} /> : null}
                        <Text>{stepName} Layer</Text>
                        <Form.Group controlId="formFile" className="mb-3">
                            <Form.Label>Layer File</Form.Label>
                            <Form.Control type="file" onChange={onChange} />
                        </Form.Group>
                        <Button variant="primary" type="submit">
                            Upload
                        </Button>
                        <Button variant="primary" onClick={changeLayer}>
                            Next Step
                        </Button>
                    </Form>
                </Fragment>
            );
        }
    }
}

export default FileUpload