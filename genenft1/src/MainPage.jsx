import { useEffect, useState } from 'react';
import {ethers} from 'ethers';
import { Box, Flex, Input, Text} from '@chakra-ui/react';
import { Button } from 'react-bootstrap';
import Install from './components/Install';
import FileUpload from './components/FileUpload';
import GeneNFT from './GeneNFT.json';
import axios from 'axios';

const geneNFTAddress = "0x996456066f737B42fB74394863279af300324373";

const provider = new ethers.providers.Web3Provider(window.ethereum);

//Get End user
const signer = provider.getSigner();

//Get Smart contract
const contract = new ethers.Contract(geneNFTAddress, GeneNFT.abi, signer);

const MainPage = ({accounts, setAccounts}) => {

const isConnected = Boolean(accounts[0]);
const [uploadCompleted, setUploadCompleted] = useState(0);
const [showCollection, setShowCollection] = useState(0);
const [totalMinted, setTotalMinted] = useState(0);
const [totalCollection, setTotalCollection] = useState(5);
const [uriListCollection, setUriListCollection] = useState([]);
const [uriJsonListCollection, setJsonListCollection] = useState([]);

const getCount = async () => {
    const count = await contract.count();
    console.log(parseInt(count));
    setTotalMinted(parseInt(count));
};

async function UriListArray(){
    const uriList = [];
    try{
    const res = await axios.get('/uriImage');
    for (var i = 0; i < res.data.length; i++) {
        let uri = res.data[i].image;
        let uriHash = uri.replace("ipfs://", "")
        uriList.push(uriHash);
    }
    } catch (err) {
        alert("Server Error");
    }
    return uriList;
}

async function UriJsonListArray() {
    const uriJsonList = [];
    try {
    const res = await axios.get('/uriJson');
    for (var i = 0; i < res.data.length; i++) {
        uriJsonList.push(res.data[i].ipfsJsonHash);
    }
    }catch(err){
        alert("Server Error");
    }
    return uriJsonList;
}

//Permette di avere o aggiornare i vari IPFS URI delle opere prodotte
const NFTList = async e =>{
    e.preventDefault();
    const uriList = await UriListArray(); 
    const uriJsonList = await UriJsonListArray(); 
    setShowCollection(1);
    setUriListCollection(uriList);
    setJsonListCollection(uriJsonList);
}

function NFTShow (){
    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh'}}>
            {uriListCollection.map((contentUri, i) => (
                <div key={i}>
                    <NFTImage tokenId={i} contentUri={contentUri} />
                </div>
            ))}
        </div>
        );
}

 function NFTImage({ tokenId, contentUri }) {;

        const metadataURI = uriJsonListCollection[tokenId];
        const imageURI = `https://gateway.pinata.cloud/ipfs/${contentUri}`;
        const imageInternalPath = `/build/${tokenId}.png`;

        const [isMinted, setIsMinted] = useState(false);

        const getMintedStatus = async () => {
            const result = await contract.existContent(metadataURI);
            console.log(result)
            setIsMinted(result);
        };

        const mintToken = async () => {
            const connection = contract.connect(signer);
            const addr = connection.address;
            const result = await contract.safeMint(addr, metadataURI);
            await result.wait();
            getMintedStatus();
            getCount();
        };

        async function getURI() {
            const uri = await contract.tokenURI(tokenId);
        }

        return (
            <div style={{ display: 'inline', justifyContent: 'center', alignItems: 'center', padding: '20px'}}>
                <img src={imageURI}></img>
                <h5 style={{padding: '15px'}}>ID #{tokenId}</h5> 
                {!isMinted ? (
                    <button style={{ padding: '10px'}} onClick={mintToken}>
                        Mint
                    </button>
                ) : (
                    <button onClick={getURI}>
                        Taken! Show URI
                    </button>
                )}
            </div>
        );
}

if (isConnected) {
    if (uploadCompleted) {
        if(showCollection){
            return (<NFTShow />);
        }else{
        return (<><div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
            <Button
                backgroundColor="#D6517D"
                borderRadius="5px"
                boxShadow="0px 2px 2px 1px #0F0F0F"
                color="white"
                cursor="pointer"
                fontFamily="inherit"
                padding="15px"
                margin="0 15px"
                onClick={NFTList}>
                Show Collection
            </Button></div></>);
        }
    } else {
        return (<><div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
            <FileUpload uploadCompleted={uploadCompleted} setUploadCompleted={setUploadCompleted}/></div></>);
    }
} else {
    return (<><div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <Install /></div></>);
}
};

export default MainPage;
