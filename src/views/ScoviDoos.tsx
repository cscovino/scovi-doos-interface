import { ChangeEvent, FormEvent, useState } from "react";
import { useWeb3React } from "@web3-react/core";
import {
  Grid,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Input,
  Button,
  FormHelperText,
  FormControl,
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import { Link, useNavigate, useLocation } from "react-router-dom";
import ScoviDooCard from "../components/ScoviDooCard";
import Loading from "../components/Loading";
import RequestAccess from "../components/RequestAccess";
import { useScoviDoosData } from "../hooks/useScoviDoosData";

const ScoviDoos = () => {
  const { search } = useLocation();
  const [address, setAddress] = useState(new URLSearchParams(search).get("address"));
  const [submitted, setSubmitted] = useState(true);
  const [validAddress, setValidAddress] = useState(true);
  const { active, library } = useWeb3React();
  const { scoviDoos, loading } = useScoviDoosData({
    owner: submitted && validAddress ? address : null,
  });
  const navigate = useNavigate();

  const handleAddressChange = ({ target: { value } }: ChangeEvent<HTMLInputElement>) => {
    setAddress(value);
    setSubmitted(false);
    setValidAddress(false);
  };

  const submit = (event: FormEvent) => {
    event.preventDefault();

    if (address) {
      const isValid = library.utils.isAddress(address);
      setValidAddress(isValid);
      setSubmitted(true);
      if (isValid) navigate(`/scovi-doos?address=${address}`);
    } else {
      navigate("/scovi-doos");
    }
  };

  if (!active) return <RequestAccess />;

  return (
    <>
      <form onSubmit={submit}>
        <FormControl>
          <InputGroup mb={3}>
            <InputLeftElement
              pointerEvents="none"
              children={<SearchIcon color="gray.300" />}
            />
            <Input
              isInvalid={false}
              value={address ?? ""}
              onChange={handleAddressChange}
              placeholder="Buscar por dirección"
            />
            <InputRightElement width="5.5rem">
              <Button type="submit" h="1.75rem" size="sm">
                Buscar
              </Button>
            </InputRightElement>
          </InputGroup>
          {submitted && !validAddress && (
            <FormHelperText>Dirección inválida</FormHelperText>
          )}
        </FormControl>
      </form>
      {loading ? (
        <Loading />
      ) : (
        <Grid templateColumns="repeat(auto-fill, minmax(250px, 1fr))" gap={6}>
          {scoviDoos.map(({ name, image, tokenId }) => (
            <Link key={tokenId} to={tokenId.toString()}>
              <ScoviDooCard image={image} name={name} />
            </Link>
          ))}
        </Grid>
      )}
    </>
  );
};

export default ScoviDoos;
