import { useMemo } from "react";
import { Contract } from "web3-eth-contract";
import { useWeb3React } from "@web3-react/core";
import { ScoviDoosArtifact } from "../config/scovidoos.artifact";

const { address, abi } = ScoviDoosArtifact;

const useScoviDoos = (): Contract => {
  const { active, library, chainId } = useWeb3React();

  const scoviDoos = useMemo(() => {
    if (active && chainId) return new library.eth.Contract(abi, address[chainId]);
  }, [active, chainId, library?.eth?.Contract]);

  return scoviDoos;
};

export default useScoviDoos;
