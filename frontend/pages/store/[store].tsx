import { Button } from "../../components/Button2/index";
import { Card } from "../../components/Card2/index";
import { Container } from "../../components/Container/index";
import { LoadingPage } from "../../components/LoadingPage/index";
import { Header } from "../../components/MediaObject/Header/index";
import { PublicKeyLink } from "../../components/PublicKeyLink/index";
import { useProject } from "../../hooks/useProject";
import { NetworkEnum } from "@underdog-protocol/types";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import { HiOutlineChevronLeft } from "react-icons/hi2";

const ProjectView = () => {
    const router = useRouter();
    const projectId = useMemo(
        () => parseInt(router.query.store as string),
        [router]
    );

    const [Nfts, setNfts] = useState();

    console.log("Routeer", router, projectId)

    const { data } = useProject({
        params: { projectId },
        query: { limit: 10, page: 1 },
    });

    console.log("data", data)

    useEffect(() => {
        if (data) {
            const { nfts } = data;
            setNfts(nfts);
        }

    }, [data]);

    if (!data) return <LoadingPage />;

    return (
        <div>
            <div className="space-y-4 flex flex-col items-center bg-light-200 py-2">
                <Container>
                    <Link href="/allstores">
                        <Button type="link">
                            <HiOutlineChevronLeft className="h-10 stroke-gray-700	 w-10 text-dark" />
                        </Button>
                    </Link>
                </Container>

            </div>

            <Container className="py-4">

                <div className="flex lg:flex-row md:flex-col px-8 items-center">
                    <div className="flex-1 ">
                        <img src={data.image} className="max-w-sm mx-auto my-8 shadow-2xl rounded-xl" />
                    </div>

                    <div className="space-y-4 flex-1 py-8">
                        <div className="space-y-2">
                            <div className="text-lg text-left text-slate-500">
                                Store Details:
                            </div>
                            <Header title={data.name} size="4xl" />
                            <PublicKeyLink
                                publicKey={data.mintAddress}
                                showExplorer
                                network={process.env.NEXT_PUBLIC_NETWORK as NetworkEnum}
                            />
                        </div>

                        {data.description && (
                            <Header
                                title="Description"
                                description={data.description}
                                size="3xl"
                            />
                        )}
                    </div>
                </div>


                {Nfts ? (
                    <div className=" mt-8">
                        {Nfts.totalResults > 0 && (
                            <div className="space-y-4">
                                <Header title="Products" size="2xl" />
                                <div className="space-y-2 grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1  gap-8">
                                    {Nfts.results.map((nft) => {
                                        console.log("Nft details", nft);
                                        return (
                                            // <div className="flex justify-between">
                                            //     <PublicKeyLink publicKey={nft.ownerAddress} showExplorer />
                                            //     <PublicKeyLink publicKey={nft.mintAddress} showXray />
                                            // </div>
                                            <div
                                                key={nft.id}
                                                // href={`/nfts/${nft.id}`}
                                                className="relative rounded-md"
                                            >
                                                <div
                                                    className="rounded-xl border 	cursor-pointer	p-3 flex flex-col ">
                                                    <div className="border-b-2">
                                                        <img className="m-auto w-[200px] h-[200px] object-contain" src={nft.image} alt={nft.name} />
                                                    </div>
                                                    <div className="mt-4">
                                                        <div className="text-xs text-left text-slate-500	">Product Details</div>
                                                        <div className="mt-3">
                                                            <div className="text-2xl	">{nft.name}</div>
                                                            <div className="text-xs">{nft.description}</div>
                                                        </div>
                                                    </div>

                                                    <div className="flex gap-2 mt-4">
                                                        <div >Mint Address: </div>
                                                        <div>
                                                            {
                                                                nft.mintAddress.substring(0, 10) + '....'
                                                            }
                                                        </div>
                                                    </div>



                                                    <div className="flex my-4 items-center">
                                                        <div className="mr-1">Status: </div>
                                                        <div
                                                            style={{
                                                                borderColor: nft.status === 'confirmed' ? '#16a34a' : '#b91c1c',
                                                                backgroundColor: nft.status === 'confirmed' ? '#16a34a' : '#b91c1c',

                                                            }}
                                                            className="border rounded-lg px-4 py-1 text-sm capitalize text-white ">{nft.status}</div>
                                                    </div>

                                                    {nft.attributes?.paymentslink && (
                                                        <Card className="p-8 space-y-4">
                                                            {/* <Header title={`${nft.attributes.price} USDC`} size="2xl" /> */}

                                                            <div className="flex items-center justify-between">
                                                                <div>Amount: </div>
                                                                <div className="text-2xl">${nft.attributes.price} USDC</div>
                                                            </div>


                                                            <Button
                                                                className="text-lg text-left text-white-500 bg-blue-800	"
                                                                type="primary"
                                                                block
                                                            >
                                                                <Link href={nft.attributes?.paymentslink}>
                                                                    <a target="_blank">
                                                                        Buy Now
                                                                    </a>
                                                                </Link>
                                                            </Button>
                                                        </Card>
                                                    )}




                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <div>Loading....</div>
                )}





            </Container>
        </div>
    );
}

export default ProjectView;