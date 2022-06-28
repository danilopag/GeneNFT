require('dotenv').config();

const express = require('express');
const fileUpload = require('express-fileupload');
const req = require('express/lib/request');
const res = require('express/lib/response');
const path = require("path");
const basePath = process.cwd();
const fs = require("fs");
const pinataSDK = require('@pinata/sdk');
const { Console } = require('console');
const pinata = pinataSDK(process.env.REACT_APP_PINATA_KEY, process.env.REACT_APP_PINATA_SECRET);
const { startCreating, buildSetup } = require(`${basePath}/src/main.js`);
const { RateLimit } = require('async-sema');

const app = express();
const countImageGenerated = 0;
const allMetadata = [];
const allJsonHash=[];
const regex = new RegExp("^([0-9]+).png");
const _limit = RateLimit(1);

let writeDir = `${basePath}/build/ipfsMetas`;

app.use(fileUpload());

async function pinFileToIpfs() {
    console.log("Starting upload of images...");
    const files = fs.readdirSync(`${basePath}/build/images`);
    for (const file of files) {
        try {
            if (regex.test(file)) {
                const IpfsHash = '';
                const fileName = path.parse(file).name;
                let jsonFile = fs.readFileSync(`${basePath}/build/json/${fileName}.json`);
                let metaData = JSON.parse(jsonFile);
                await _limit();
                const fileStream = fs.createReadStream(`${basePath}/build/images/${file}`);
                const options = {};
                await pinata.pinFileToIPFS(fileStream, options).then((result) => {
                    //handle results here
                    metaData.image = "ipfs://" + result.IpfsHash;
                    //console.log(metaData.image);
                    fs.writeFileSync(
                        `${basePath}/build/json/${fileName}.json`,
                        JSON.stringify(metaData, null, 2)
                    );
                }).catch((err) => {
                    //handle error here
                    console.log(err);
                });
                const options2 = { pinataMetadata: {
                    name: fileName + ".json",
                }};
                await pinata.pinJSONToIPFS(metaData, options2).then((result) => {
                    //handle results here
                    let jsonMetadata = { name: fileName +".json", ipfsJsonHash: "ipfs://" + result.IpfsHash };
                    allJsonHash.push(jsonMetadata);
                }).catch((err) => {
                    //handle error here
                    console.log(err);
                });

                console.log(`${fileName} uploaded & ${fileName}.json updated!`);

                allMetadata.push(metaData);
            }
        } catch (error) {
            console.log(`Catch: ${error}`);
        }
    }

    fs.writeFileSync(
        `${basePath}/build/json/_metadata.json`,
        JSON.stringify(allMetadata, null, 2)
    );
    fs.writeFileSync(
        `${basePath}/build/json/_hashJson.json`,
        JSON.stringify(allJsonHash, null, 2)
    );
    let rawMetadatiFile = fs.readFileSync(`${basePath}/build/json/_metadata.json`);
    let jsonMetadatiFile = JSON.parse(rawMetadatiFile);
    const options = {
        pinataMetadata: {
            name: "_metadata.json",
        }
    };
    await pinata.pinJSONToIPFS(jsonMetadatiFile, options).then((result) => {
        console.log(result);
        let jsonMetadata = "ipfs://" + result.IpfsHash;
        let jsonResponse = {
            response: "OK", metadata_directory_pinata_ipfs_url: jsonMetadata, error: null};
        fs.writeFileSync(
            `${writeDir}/_ipfsMetasResponse.json`,
            JSON.stringify(jsonResponse, null, 2)
        );
    }).catch((err) => {
        console.log(err);
    });
}
//Retrieve Image Url
app.get('/uriImage', (req,res) => {
    let jsonFile = fs.readFileSync(`${basePath}/build/json/_metadata.json`);
    let metaData = JSON.parse(jsonFile);
    res.send(metaData);
})

app.get('/uriJson', (req, res) => {
    let jsonFile = fs.readFileSync(`${basePath}/build/json/_hashJson.json`);
    let metaData = JSON.parse(jsonFile);
    res.send(metaData);
})

//Generate Endpoint
app.post('/generate', async (req, res) => {
    if (req.nameCollection === '' || req.descriptionCollection === '' || req.numberPieces === 0) {
        return res.status(400).json({ msg: 'Configuration Error' });
    }
    let nameCollection = req.body.nameCollection;
    let descriptionCollection = req.body.descriptionCollection;
    let numberPieces = req.body.numberPieces;
    console.log(process.env.REACT_APP_PINATA_KEY);
    console.log(process.env.REACT_APP_PINATA_SECRET);
    await pinata.testAuthentication().then((result) => {
        console.log(result);
    }).catch((err) => {
        console.log(err);
    });
    await buildSetup();
    console.log("Build Setup completato");
    await startCreating(nameCollection,descriptionCollection,numberPieces);
    console.log("Creazione Completata");
    await pinFileToIpfs();
    console.log("pinFile Completato");
    res.send('Generated!');
})

//Upload Endpoint
app.post('/upload', (req, res) => {
    if (req.files === null) {
        return res.status(400).json({ msg: 'No file uploded' });
    }
    let stepName = req.body.stepName;
    let fileName = req.body.fileName;
    const file = req.files.file;
    let extentionFile = (file.name).split('.').pop();
    console.log(extentionFile);
    fileName = fileName + "." + extentionFile;
    file.mv(`${__dirname}/layers/${stepName}/${fileName}`, err => {
        if (err) {
            console.error(err);
            return res.status(500).send(err);
        }

        res.json({
            fileName: fileName, filePath: `${__dirname} / layers / ${stepName} / ${fileName}`
        });
    });
});

app.listen(5000, () => console.log('Server Started on port 5000...'));