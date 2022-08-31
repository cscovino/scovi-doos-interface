import { useState } from "react";
import {
  Stack,
  Heading,
  Text,
  Table,
  Thead,
  Tr,
  Th,
  Td,
  Tbody,
  Button,
  Tag,
  useToast,
} from "@chakra-ui/react";
import { useWeb3React } from "@web3-react/core";
import { useParams } from "react-router-dom";
import RequestAccess from "../components/RequestAccess";
import ScoviDooCard from "../components/ScoviDooCard";
import { useScoviDooData } from "../hooks/useScoviDoosData";
import Loading from "../components/Loading";
import useScoviDoos from "../hooks/useScoviDoos";

const ScoviDoo = () => {
  const { active, account, library } = useWeb3React();
  const { tokenId } = useParams();
  const { loading, scoviDoo, update } = useScoviDooData(tokenId);
  const scoviDoosContract = useScoviDoos();
  const toast = useToast();
  const [transfering, setTransfering] = useState(false);

  const transfer = () => {
    const address = prompt('Ingresa: ');
    const isAddress = library.utils.isAddress(address);
    
    if (!isAddress) {
      toast({
        title: "Dirección inválida",
        description: "La dirección no es una dirección de Ethereum",
        status: "error",
      });
    } else {
      setTransfering(true);
      scoviDoosContract.methods
        .safeTransferFrom(scoviDoo.owner, address, scoviDoo.tokenId)
        .send({ from: account })
        .on("transactionHash", (txHash: string) => {
          toast({
            title: "Transacción enviada",
            description: txHash,
            status: "info",
          });
        })
        .on("receipt", () => {
          setTransfering(false);
          toast({
            title: "Transacción confirmada",
            description: `El ScoviDoo ahora pertenece a ${address}`,
            status: "success",
          });
        })
        .on("error", (error: Error) => {
          setTransfering(false);
          toast({
            title: "Transacción fallida",
            description: error.message,
            status: "error",
          });
          update();
        });
    }
  };

  if (!active) return <RequestAccess />;

  if (loading) return <Loading />;

  return (
    <Stack
      spacing={{ base: 8, md: 10 }}
      py={{ base: 5 }}
      direction={{ base: "column", md: "row" }}
    >
      <Stack>
        <ScoviDooCard
          mx={{
            base: "auto",
            md: 0,
          }}
          name={scoviDoo.name}
          image={scoviDoo.image}
        />
        <Button
          onClick={transfer}
          disabled={account !== scoviDoo.owner}
          isLoading={transfering}
          colorScheme="green"
        >
          {account !== scoviDoo.owner ? "No eres el dueño" : "Transferir"}
        </Button>
      </Stack>
      <Stack width="100%" spacing={5}>
        <Heading>{scoviDoo.name}</Heading>
        <Text fontSize="xl">{scoviDoo.description}</Text>
        <Text fontWeight={600}>
          DNA:
          <Tag ml={2} colorScheme="green">
            {scoviDoo.dna}
          </Tag>
        </Text>
        <Text fontWeight={600}>
          Owner:
          <Tag ml={2} colorScheme="green">
            {scoviDoo.owner}
          </Tag>
        </Text>
        <Table size="sm" variant="simple">
          <Thead>
            <Tr>
              <Th>Atributo</Th>
              <Th>Valor</Th>
            </Tr>
          </Thead>
          <Tbody>
            {Object.entries(scoviDoo.attributes).map(([_, data]) => (
              <Tr key={(data as any).trait_type}>
                <Td>{(data as any).trait_type}</Td>
                <Td>
                  <Tag>{(data as any).value}</Tag>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Stack>
    </Stack>
  );
};

export default ScoviDoo;
