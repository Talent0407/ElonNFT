import { useContractWrite, usePrepareContractWrite } from "wagmi";
import Image from "next/image";
import { Button } from "@chakra-ui/react";
import Head from "next/head";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
} from "@chakra-ui/react";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { WalletConnectConnector } from "wagmi/connectors/walletConnect";
import { CoinbaseWalletConnector } from "wagmi/connectors/coinbaseWallet";
import { signIn } from "next-auth/react";
import { useAccount, useConnect, useSignMessage, useDisconnect } from "wagmi";
import { useAuthRequestChallengeEvm } from "@moralisweb3/next";
import { useEffect, useState } from "react";
import ABI from "./api/abi.json";

function HomePage() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [amount, setAmount] = useState("");
  const [connectWallet, setConnect] = useState(false);
  const { connectAsync } = useConnect();
  const { disconnectAsync } = useDisconnect();
  const { signMessageAsync } = useSignMessage();
  const { requestChallengeAsync } = useAuthRequestChallengeEvm();
  const { isConnected } = useAccount();
  const { config } = usePrepareContractWrite({
    addressOrName: "0x15e72b00b783bbfe0d423814d5828d68b4720e7b",
    contractInterface: ABI,
    functionName: "store",
    args: [parseInt(amount)],
    enabled: Boolean(amount),
    // overrides: {
    //   from: "0xA0Cf798816D4b9b9866b5330EEa46a18382f251e",
    //   value: ethers.utils.parseEther("0.01"),
    // },
  });

  const connect = () => {
      setConnect(isConnected);
  };
  const { write, isLoading, isError, isSuccess } = useContractWrite(config);

  useEffect(() => {
    console.log("---------------- called connect --------------")
    connect();
  }, [isConnected]);

  const handleAuth = async () => {
    if (connectWallet) {
      await disconnectAsync();
    }

    const { account, chain } = await connectAsync({
      connector: new MetaMaskConnector(),
    });

    const { message } = await requestChallengeAsync({
      address: account,
      chainId: chain.id,
    });

    const signature = await signMessageAsync({ message });

    // redirect user after success authentication to '/user' page
    const { url } = await signIn("moralis-auth", {
      message,
      signature,
      redirect: false,
      callbackUrl: "/user",
    });
    /**
     * instead of using signIn(..., redirect: "/user")
     * we get the url from callback and push it to the router to avoid page refreshing
     */
    onClose();
  };

  const walletConnectHandleAuth = async () => {
    if (connectWallet) {
      await disconnectAsync();
    }

    const { account, chain } = await connectAsync({
      connector: new WalletConnectConnector({ options: { qrcode: true } }),
    });

    const { message } = await requestChallengeAsync({
      address: account,
      chainId: chain.id,
    });

    const signature = await signMessageAsync({ message });

    // redirect user after success authentication to '/user' page
    const { url } = await signIn("moralis-auth", {
      message,
      signature,
      redirect: false,
      callbackUrl: "/user",
    });
    /**
     * instead of using signIn(..., redirect: "/user")
     * we get the url from callback and push it to the router to avoid page refreshing
     */
    setConnect(true)
    onClose();
  };

  const coinBaseHandleAuth = async () => {
    if (connectWallet) {
      await disconnectAsync();
    }

    const { account, chain } = await connectAsync({
      connector: new CoinbaseWalletConnector({
        options: {
          appName: "amazing.finance",
        },
      }),
    });

    const userData = { address: account, chainId: chain.id, network: "evm" };

    const { message } = await requestChallengeAsync(userData);

    const signature = await signMessageAsync({ message });

    // redirect user after success authentication to '/user' page
    const { url } = await signIn("moralis-auth", {
      message,
      signature,
      redirect: false,
      callbackUrl: "/user",
    });
    /**
     * instead of using signIn(..., redirect: "/user")
     * we get the url from callback and push it to the router to avoid page refreshing
     */
    onClose();
  };

  return (
    <div>
      <Head>
        <title>ELON AI ART</title>
        <meta name="description" content="ELON AI COLLECTIBLE ART" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="bg">
        <div className="row">
          <div className="col-12 col-lg-5 d-none d-lg-flex flex-column vh-100">
            <div className="mt-auto mb-3 fs-2 fw-bold d-flex flex-column align-items-center text-white mt-2">
              <div className="text-elon-primary elon fs-1 text-white">8888</div>
              <div className="d-flex flex-column align-items-center">
                <div className="ms-3 font-1 lh-sm">Uniquely AI</div>
                <div className="ms-3 font-1 lh-sm">
                  {" "}
                  Generated Collectible NFTs
                </div>
              </div>
            </div>
          </div>
          <div className="col-12 col-lg-7">
            <div className="row gallery p-2 pe-4 d-flex justify-content-center">
              <div className="display-5 fw-bold d-flex flex-column align-items-center text-white my-5 my-lg-4">
                <div className="d-flex align-items-center">
                  <div className="text-elon-primary elon">ELON</div>
                  <div className="ms-3 font-1">AI</div>
                </div>
                <div>COLLECTIBLE ART</div>
              </div>
              <div className="col-4 col-sm-3 mb-3">
                <img
                  className="img-fluid rounded-1 shadow"
                  src="img/elon-1.png"
                  alt="elon"
                />
              </div>
              <div className="col-4 col-sm-3 mb-3">
                <img
                  className="img-fluid rounded-1 shadow"
                  src="img/elon-2.png"
                  alt="elon"
                />
              </div>
              <div className="col-4 col-sm-3 mb-3">
                <img
                  className="img-fluid rounded-1 shadow"
                  src="img/elon-3.png"
                  alt="elon"
                />
              </div>
              <div className="col-4 col-sm-3 mb-3">
                <img
                  className="img-fluid rounded-1 shadow"
                  src="img/elon-4.png"
                  alt="elon"
                />
              </div>
              <div className="col-4 col-sm-3 mb-3">
                <img
                  className="img-fluid rounded-1 shadow"
                  src="img/elon-5.png"
                  alt="elon"
                />
              </div>
              <div className="col-4 col-sm-3 mb-3">
                <img
                  className="img-fluid rounded-1 shadow"
                  src="img/elon-6.png"
                  alt="elon"
                />
              </div>
              <div className="col-4 col-sm-3 mb-3">
                <img
                  className="img-fluid rounded-1 shadow"
                  src="img/elon-7.png"
                  alt="elon"
                />
              </div>
              <div className="col-4 col-sm-3 mb-3">
                <img
                  className="img-fluid rounded-1 shadow"
                  src="img/elon-8.png"
                  alt="elon"
                />
              </div>

              {!connectWallet ? (
                <div className="my-3 text-center">
                  <Button className="mint" onClick={onOpen}>
                    Connect wallet
                  </Button>
                </div>
              ) : (
                <div className="my-3">
                  <FormControl
                    isInvalid={amount && amount !== "" && parseInt(amount) > 10}
                    className="text-center mint_container"
                  >
                    <FormLabel className="text-white">
                      NFT MINT AMOUNT
                    </FormLabel>
                    <div className="d-flex">
                      <div className="me-2">
                        <Input
                          type="number"
                          className="text-white text-cetner"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                        />
                        <FormErrorMessage>
                          Max amount per transaction is 10.
                        </FormErrorMessage>
                      </div>
                      <Button
                        colorScheme="blue"
                        onClick={() => {
                          console.log("call");
                          write?.();
                          console.log("end");
                        }}
                        isLoading={isLoading}
                      >
                        MINT {amount}
                      </Button>
                    </div>

                    {isError && <FormLabel>Mint Failed</FormLabel>}
                    {isSuccess && <FormLabel>Mint success</FormLabel>}
                  </FormControl>
                </div>
              )}
              <div className="mt-1 text-center">
                <a
                  className="text-white on-hover-zoom"
                  target={"_blank"}
                  href="https://twitter.com/CollectElon"
                >
                  Find us on
                  <svg
                    className="ms-1 d-inline"
                    xmlns="http://www.w3.org/2000/svg"
                    width="30"
                    height="30"
                    viewBox="0 0 24 24"
                    fill="#ffffff"
                  >
                    <path d="M19.633 7.997c.013.175.013.349.013.523 0 5.325-4.053 11.461-11.46 11.461-2.282 0-4.402-.661-6.186-1.809.324.037.636.05.973.05a8.07 8.07 0 0 0 5.001-1.721 4.036 4.036 0 0 1-3.767-2.793c.249.037.499.062.761.062.361 0 .724-.05 1.061-.137a4.027 4.027 0 0 1-3.23-3.953v-.05c.537.299 1.16.486 1.82.511a4.022 4.022 0 0 1-1.796-3.354c0-.748.199-1.434.548-2.032a11.457 11.457 0 0 0 8.306 4.215c-.062-.3-.1-.611-.1-.923a4.026 4.026 0 0 1 4.028-4.028c1.16 0 2.207.486 2.943 1.272a7.957 7.957 0 0 0 2.556-.973 4.02 4.02 0 0 1-1.771 2.22 8.073 8.073 0 0 0 2.319-.624 8.645 8.645 0 0 1-2.019 2.083z"></path>
                  </svg>
                </a>
              </div>

              <div className="col-12 col-lg-5 d-flex d-lg-none flex-column">
                <div className="mt-3 mb-3">
                  <div className="fs-2 fw-bold d-flex flex-column align-items-center text-white mt-2">
                    <div className="text-elon-primary elon">MINST STARTS</div>
                    <div className="ms-3 font-1 lh-1">DEC 22 2022</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Select connection method</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                flexDirection: "column",
                justifyContent: "space-between",
                width: "100%",
                height: "150px",
              }}
            >
              <Button colorScheme="teal" variant="outline" onClick={handleAuth}>
                Metamask
              </Button>
              <Button
                colorScheme="teal"
                variant="outline"
                onClick={walletConnectHandleAuth}
              >
                Wallet Connect
              </Button>
              <Button
                colorScheme="teal"
                variant="outline"
                onClick={coinBaseHandleAuth}
              >
                Coinbase
              </Button>
            </div>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}

export default HomePage;
