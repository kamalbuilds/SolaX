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
import { useMemo } from "react";
import { HiOutlineChevronLeft } from "react-icons/hi2";

const ProjectView = () => {
    const router = useRouter();
    const projectId = useMemo(
        () => parseInt(router.query.store as string),
        [router]
    );

    console.log("Routeer", router, projectId)

    const { data } = useProject({
        params: { projectId },
        query: { limit: 10, page: 1 },
    });

    console.log("data", data)

    if (!data) return <LoadingPage />;

    return (
        <div>
            <div className="space-y-4 flex flex-col items-center bg-light-200 py-8">
                <Container>
                    <Link href="/">
                        <Button type="link">
                            <HiOutlineChevronLeft className="h-10 w-10 text-dark" />
                        </Button>
                    </Link>
                </Container>

                <img src={data.image} className="max-w-sm mx-auto my-16 shadow-2xl" />
            </div>

            <Container className="py-16">
                <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-4">
                        <div className="space-y-2">
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

                    <div className="space-y-8">
                        {data.attributes?.paymentLink && (
                            <Card className="p-8 space-y-4">
                                <Header title="0.1 SOL" size="2xl" />
                                <Button
                                    type="primary"
                                    block
                                    onClick={() =>
                                        window.open(data.attributes?.paymentLink as string)
                                    }
                                >
                                    Buy now
                                </Button>
                            </Card>
                        )}
                        {data.nfts.totalResults > 0 && (
                            <div className="space-y-4">
                                <Header title="Supporters" size="2xl" />
                                <div className="space-y-2">
                                    {data.nfts.results.map((nft) => (
                                        <div className="flex justify-between">
                                            <PublicKeyLink publicKey={nft.ownerAddress!} />
                                            <PublicKeyLink publicKey={nft.mintAddress} showXray />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </Container>
        </div>
    );
}

export default ProjectView;