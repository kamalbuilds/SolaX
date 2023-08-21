import React, { useState } from 'react';

import {

    Modal,

    ModalOverlay,

    ModalContent,

    ModalHeader,

    ModalFooter,

    ModalBody,

    ModalCloseButton,

    useDisclosure,

    Button,

} from '@chakra-ui/react'

import SwapTokens from './SwapTokens';




const TokenModal = () => {




    const { isOpen, onOpen, onClose } = useDisclosure();




    const [tokenList, setTokenList] = useState();







    /**API to call Token Modal and also Jupiter TokenAPI */

    const handleOpenModal = async () => {

        const response = await fetch('https://token.jup.ag/strict');

        const result = await response.json();

        setTokenList(result);

        onOpen();

    }




    return (

        <div>

            <Button onClick={handleOpenModal}>Swap with Jupiter</Button>




            <Modal isOpen={isOpen} onClose={onClose}>

                <ModalOverlay />

                <ModalContent bg='#494f5a' p='27px 10px' borderRadius='20px'>

                    <ModalHeader color='#F7FAFC'>Efficiently Swap</ModalHeader>

                    <ModalCloseButton color='#EDF2F7' fontSize='md' />

                    <ModalBody>

                        <SwapTokens tokenList={tokenList} />

                    </ModalBody>

                </ModalContent>

            </Modal>




        </div>

    );

};




export default TokenModal;