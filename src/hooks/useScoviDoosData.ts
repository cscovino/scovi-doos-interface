import { useWeb3React } from "@web3-react/core";
import { useCallback, useEffect, useState } from "react";
import { Contract } from "web3-eth-contract";
import useScoviDoos from "./useScoviDoos";

const getScoviDooData = async ({ scoviDoosContract, tokenId }: { scoviDoosContract: Contract, tokenId: number }) => {
  const [
    tokenURI,
    dna,
    owner,
    avatarColor,
    hairColor,
    backgroundColor,
    patternType,
    earsType,
    hairType,
    muzzleType,
    eyesType,
    browsType,
    isRound,
    isBlackout,
  ] = await Promise.all([
    scoviDoosContract.methods.tokenURI(tokenId).call(),
    scoviDoosContract.methods.tokenDNA(tokenId).call(),
    scoviDoosContract.methods.ownerOf(tokenId).call(),
    scoviDoosContract.methods.getAvatarColor(tokenId).call(),
    scoviDoosContract.methods.getHairColor(tokenId).call(),
    scoviDoosContract.methods.getBackgroundColor(tokenId).call(),
    scoviDoosContract.methods.getPatternType(tokenId).call(),
    scoviDoosContract.methods.getEarsType(tokenId).call(),
    scoviDoosContract.methods.getHairType(tokenId).call(),
    scoviDoosContract.methods.getMuzzleType(tokenId).call(),
    scoviDoosContract.methods.getEyesType(tokenId).call(),
    scoviDoosContract.methods.getBrowsType(tokenId).call(),
    scoviDoosContract.methods.getIsRound(tokenId).call(),
    scoviDoosContract.methods.getIsBlackout(tokenId).call(),
  ]);

  const responseMetadata = await fetch(tokenURI);
  const metadata = await responseMetadata.json();

  return {
    tokenId,
    attributes: {
      avatarColor,
      hairColor,
      backgroundColor,
      patternType,
      earsType,
      hairType,
      muzzleType,
      eyesType,
      browsType,
      isRound,
      isBlackout,
    },
    tokenURI,
    dna,
    owner,
    ...metadata,
  };
};

// Plural
const useScoviDoosData = ({ owner }: { owner: string | null }) => {
  const [scoviDoos, setScoviDoos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const scoviDoosContract = useScoviDoos();
  const { library } = useWeb3React();

  const update = useCallback(async () => {
    if (scoviDoosContract) {
      setLoading(true);

      let tokenIds;
      
      if (!library.utils.isAddress(owner)) {
        const totalSupply = await scoviDoosContract.methods.totalSupply().call();
        tokenIds = new Array(Number(totalSupply)).fill(0).map((_, index) => index);
      } else {
        const balanceOf = await scoviDoosContract.methods.balanceOf(owner).call();
        const tokenIdsOfOwner = new Array(Number(balanceOf)).fill(0).map((_, index) => (
          scoviDoosContract.methods.tokenOfOwnerByIndex(owner, index).call()
        ));
        tokenIds = await Promise.all(tokenIdsOfOwner);
      }

      const scoviDoosPromise = tokenIds.map((tokenId) =>
        getScoviDooData({ tokenId, scoviDoosContract })
      );

      const scovis = await Promise.all(scoviDoosPromise);

      setScoviDoos(scovis);
      setLoading(false);
    }
  }, [scoviDoosContract, owner, library?.utils]);

  useEffect(() => {
    update();
  }, [update]);

  return {
    loading,
    scoviDoos,
    update,
  };
};

// Singular
const useScoviDooData = (tokenId: string | undefined) => {
  const [scoviDoo, setScoviDoo] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const scoviDoosContract = useScoviDoos();

  const update = useCallback(async () => {
    if (scoviDoosContract && tokenId) {
      setLoading(true);

      const toSet = await getScoviDooData({ tokenId: +tokenId, scoviDoosContract });
      setScoviDoo(toSet);

      setLoading(false);
    }
  }, [scoviDoosContract, tokenId]);

  useEffect(() => {
    update();
  }, [update]);

  return {
    loading,
    scoviDoo,
    update,
  };
};

export { useScoviDoosData, useScoviDooData };
