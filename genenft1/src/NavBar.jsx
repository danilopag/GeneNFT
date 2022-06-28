import React from 'react'
import { Box, Button, Flex, Image, Link, Spacer } from '@chakra-ui/react';
import Facebook from "./assets/social-media-icons/facebook_32x32.png";
import Twitter from "./assets/social-media-icons/twitter_32x32.png";
import Email from "./assets/social-media-icons/email_32x32.png";
import Logo from "./assets/GeneNFT2.png";

const NavBar = ({ accounts, setAccounts}) => {
    const isConnected = Boolean(accounts[0]);

    //Connessione attraverso Metamask
    async function connectAccount(){
        if(window.ethereum){
          const accounts = await window.ethereum.request({
              method: "eth_requestAccounts",
          });
          setAccounts(accounts);
        }
    }

    return(
        <Flex justify="space-between" align="center" padding="30px">
            {/*Parte sinistra del sito*/}
            <Flex justify="space-between" align="center" padding="30px">
                <Link href=''>
                    <Image src={Facebook} boxSize="42px" margin="0 15px"/>
                </Link>
                <Link href=''>
                    <Image src={Twitter} boxSize="42px" margin="0 15px" />
                </Link>
                <Link href=''>
                    <Image src={Email} boxSize="42px" margin="0 15px" />
                </Link>
            </Flex>
            <Flex justify="space-between" align="center" width="13%"> 
                {/*Parte destra del sito*/}
                <Link href=''>
                    <Image src={Logo} boxSize="200px" margin="0 15px" />
                </Link>
            </Flex>
            {/*Connessione a Metamask*/}
            {isConnected ? (
                <Box margin="0 15px"> Connected </Box>
            ): (
                <Button
                backgroundColor="#D6517D"
                borderRadius="5px"
                boxShadow="0px 2px 2px 1px #0F0F0F"
                color="white"
                cursor="pointer"
                fontFamily="inherit"
                padding="15px"
                margin="0 15px"
                onClick={connectAccount}>
                Connect
                </Button>
            )}
        </Flex>
    );
};

export default NavBar;