import { Button, Input, InputGroup, InputLeftAddon, InputLeftElement, InputRightElement, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import "../../styles/Home.module.css";
import TokenList from './TokenList';
import { useClickAway } from 'react-use';


import { AiOutlineDown } from "react-icons/ai";
import { MdSwapVerticalCircle } from "react-icons/md";


//Jupiter Imports
import { Connection, Keypair, VersionedTransaction } from '@solana/web3.js';
import fetch from 'cross-fetch';
import { useWallet } from '@solana/wallet-adapter-react';


const SwapTokens = ({ tokenList }: any) => {

    const { isOpen, onOpen, onClose } = useDisclosure()

    const [tokenOneAmount, setTokenOneAmount] = useState<number>(0);
    const [tokenTwoAmount, setTokenTwoAmount] = useState(0);

    const [tokenOne, setTokenOne] = useState(tokenList[0]);
    const [tokenTwo, setTokenTwo] = useState(tokenList[1]);

    const [loading, setLoading] = useState(false);
    const [tokenFocus, setTokenFocus] = useState(false);

    const [changeToken, setChangeToken] = useState(1);

    const wallet = useWallet();
    const connection = new Connection('https://solana-mainnet.g.alchemy.com/v2/SW3uzyu7hPsAhI5878T7jffYghoOuDLk');


    const openTokenModal = () => {
        onOpen();
    }

    const openModal = async (asset: any) => {
        setChangeToken(asset);
        openTokenModal();
    }


    const changeTokenOneAmount = (v: string) => {
        const value = parseInt(v);
        setTokenOneAmount(value);
        fetchTokenPrice(value, tokenOne, tokenTwo);

    }

    const fetchTokenPrice = async (value: number, tokenOne: any, tokenTwo: any) => {
        try {
            if (value <= 0 || Number.isNaN(value)) {
                setTokenTwoAmount(0);
                return;
            }

            const decimalValue = Math.pow(10, tokenOne.decimals);
            const fixAmount = value * decimalValue;

            const tokenURL = `https://quote-api.jup.ag/v6/quote?inputMint=${tokenOne.address}&outputMint=${tokenTwo.address}&amount=${fixAmount}`;

            const res = await fetch(tokenURL);
            const response = await res.json();

            const outputTokenPrice = response.outAmount;
            const decimalOutputTokenValue = Math.pow(10, tokenTwo.decimals);
            const totalOutputTokenValue = (outputTokenPrice / decimalOutputTokenValue);
            setTokenTwoAmount(totalOutputTokenValue);


        } catch (error) {
            setTokenTwoAmount(0);
            console.log("Error", error);
        }

    }



    const swapTokensOneAndTwo = () => {

        const token = tokenOne;
        const firstToken = tokenTwo;
        const secToken = token;

        setTokenOne(tokenTwo);
        setTokenTwo(token);

        setTokenOneAmount(tokenTwoAmount);

        fetchTokenPrice(tokenTwoAmount, firstToken, secToken);
    }


    const swapTokensData = async () => {
        if (tokenOneAmount) {
            setLoading(true);
            try {
                const decimalValue = Math.pow(10, tokenOne.decimals);
                console.log(decimalValue, tokenOne.decimals)
                const fixAmount = tokenOneAmount * decimalValue;

                //fetching data of the tokens
                const tokenURL = `https://quote-api.jup.ag/v6/quote?inputMint=${tokenOne.address}&outputMint=${tokenTwo.address}&amount=${fixAmount}`;

                const res = await fetch(tokenURL);
                const response = await res.json();

                console.log('response', response);

                //swapping tokens
                const alltransactions = await (
                    await fetch('https://quote-api.jup.ag/v6/swap', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            quoteResponse: response,
                            userPublicKey: wallet.publicKey.toString(),
                        })
                    })
                ).json();
                const {
                    swapTransaction,
                } = alltransactions;

                console.log("Swap transactions", swapTransaction);

                const transactionBuf = Buffer.from(swapTransaction, 'base64');
                var transaction = VersionedTransaction.deserialize(transactionBuf);

                // const signed = transaction.sign([signer]);
                await wallet.signTransaction(transaction);

                const rawTransaction = transaction.serialize()
                const txid = await connection.sendRawTransaction(rawTransaction, {
                    skipPreflight: true,
                    maxRetries: 2
                });
                await connection.confirmTransaction(txid);
                console.log(`https://solscan.io/tx/${txid}`);
            } catch (error) {
                console.log("Error", error);
            }

            setLoading(false);

        }

    }

    const handleClick = () => {
        setTokenFocus(true);
    }

    const containerRef = React.useRef(null);
    useClickAway(containerRef, () => setTokenFocus(false));

    return (
        <div ref={containerRef}>

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent bg='#304256' borderRadius='20px' style={{ height: '500px' }}>
                    <ModalHeader color='#FFF'>Select Token</ModalHeader>

                    <ModalCloseButton color='#FFF' fontSize='md' />
                    <ModalBody p={0}>
                        <TokenList
                            tokenList={tokenList}
                            changeToken={changeToken}
                            tokenOne={tokenOne}
                            setTokenOne={setTokenOne}
                            tokenTwo={tokenTwo}
                            setTokenTwo={setTokenTwo}
                            onClose={onClose} />
                    </ModalBody>
                </ModalContent>
            </Modal>


            <div style={
                {
                    boxShadow: tokenFocus ? '1px 0px 15px 3px #5cb9bc' : 'none'
                }
            } className='bg-[#373f4c] rounded-lg px-3 py-4 my-[20px]'>
                <div className='flex '>
                    <div onClick={() => openModal(1)} className='cursor-pointer'>
                        <div className='flex gap-1 items-center text-white rounded-xl bg-slate-500 px-3 py-2'>
                            <img className='rounded-3xl' src={tokenOne.logoURI} alt={tokenOne.name} width={30} height={30} />
                            {tokenOne && tokenOne.symbol}
                            <AiOutlineDown />
                        </div>
                    </div>

                    <span className='flex-1 flex flex-col justify-center items-end'>
                        <div className='text-slate-500 text-[12px] font-bold'>You pay</div>
                        <div className='w-full'>
                            <input
                                onClick={handleClick}
                                className='text-[18px] text-slate-300 focus-visible:shadow-none focus-visible:outline-0 text-end bg-transparent w-full'
                                type='number'
                                height='100%'
                                placeholder='0'
                                value={tokenOneAmount}
                                onChange={(e) => changeTokenOneAmount(e.target.value)}
                            />
                        </div>
                    </span>
                </div>
            </div>

            <div className='  flex justify-center'>
                <div className='rounded-full hover:shadow-lg hover:shadow-cyan-500/50 hover:bg-[#5cb9bc]'>
                    <MdSwapVerticalCircle size='40px' onClick={swapTokensOneAndTwo} />
                </div>
            </div>

            <div className='bg-[#373f4c] cursor-not-allowed rounded-lg px-3 py-4 my-[20px]'>
                <div className='flex '>

                    <div onClick={() => openModal(2)} className='cursor-pointer'>
                        <div className='flex gap-1 items-center text-white rounded-xl bg-slate-500 px-3 py-2'>
                            <img className='rounded-3xl' src={tokenTwo.logoURI} alt={tokenTwo.name} width={30} height={30} />
                            {tokenTwo && tokenTwo.symbol}
                            <AiOutlineDown />
                        </div>
                    </div>

                    <span className='flex-1 flex flex-col justify-center items-end'>
                        <div className='text-slate-500 text-[12px] font-bold'>You get</div>
                        <div className='w-full'>
                            <input
                                className='text-[18px] text-slate-300 focus-visible:shadow-none focus-visible:outline-0 text-end bg-transparent w-full'
                                type='number'
                                height='100%'
                                placeholder='0'
                                value={tokenTwoAmount}
                                disabled={true}
                            />
                        </div>
                    </span>
                </div>
            </div>


            <div className='my-[40px]'>
                {loading ? (
                    <Button
                        height='50px'
                        width='100%'
                        colorScheme='blue'
                        mr={3}
                    >Loading....</Button>
                ) : (
                    <Button
                        height='50px'
                        width='100%'
                        colorScheme='blue'
                        mr={3}
                        onClick={swapTokensData}>
                        Swap
                    </Button>
                )}
            </div>


        </div >
    );
};

export default SwapTokens;