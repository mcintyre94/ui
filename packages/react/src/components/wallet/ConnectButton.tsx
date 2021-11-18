import { Icon } from "@chakra-ui/icons";
import {
  Button,
  Divider,
  Flex,
  Image,
  Stack,
  Text,
  Tooltip,
} from "@chakra-ui/react";
import { formatEther } from "@ethersproject/units";
import React, { useEffect, useMemo, useState } from "react";
import { FiAlertTriangle } from "react-icons/fi";
import { IoWalletOutline } from "react-icons/io5";
import { useSwitchNetwork } from "../../hooks/useSwitchNetwork";
import { useWeb3 } from "../../hooks/useWeb3";
import { shortenAddress } from "../../utils/shortenAddress";

export const ConnectButton: React.FC<{
  onOpen: () => void;
  isOpen: boolean;
}> = ({ onOpen, isOpen, ...props }) => {
  const { address, provider, chainId, error, getNetworkMetadata } = useWeb3();
  const { switchError } = useSwitchNetwork();
  const [renderBalance, setRenderBalance] = useState("");

  useEffect(() => {
    const getBalance = async () => {
      if (address) {
        const balance = await provider?.getBalance(address);
        setRenderBalance(formatEther(balance || 0).slice(0, 6));
      } else {
        setRenderBalance("0.0");
      }
    };

    getBalance();
  }, [provider, address]);

  const networkMetadata = useMemo(() => {
    if (chainId) {
      return getNetworkMetadata(chainId);
    }
  }, [chainId, getNetworkMetadata]);

  return (
    <Tooltip
      zIndex={-1}
      hasArrow
      isOpen={!isOpen && (!!error || !!switchError)}
      label={
        switchError
          ? switchError.message
          : error
          ? error.message
          : address
          ? "Manage your connected wallet"
          : "Connect your wallet to get started"
      }
    >
      {address ? (
        <Flex
          borderRadius="25px"
          borderWidth="1px"
          borderColor="gray.300"
          padding="5px"
          height="50px"
          align="center"
          onClick={onOpen}
          cursor="pointer"
          _hover={{
            borderColor: "#5CC4FF",
          }}
          {...props}
        >
          <Stack flexShrink={0} direction="row" align="center" pr={3}>
            {networkMetadata?.iconUrl && (
              <Image
                height="40px"
                width="40px"
                borderRadius="25px"
                src={networkMetadata.iconUrl}
              />
            )}
            <Stack textAlign="left" justify="flex-start" spacing={0}>
              <Text size="label.md" color="heading" lineHeight={1}>
                {shortenAddress(address)}
              </Text>
              <Text color="gray.500" fontSize="12px" lineHeight={1}>
                {networkMetadata?.chainName}
              </Text>
            </Stack>
          </Stack>
          <Divider
            borderColor="gray.300"
            flexShrink={0}
            orientation="vertical"
          />
          <Text
            flexShrink={0}
            px={3}
            fontSize="12px"
            color="#0098EE"
            lineHeight="14px"
          >
            {renderBalance}
            {networkMetadata && networkMetadata.symbol.length > 2 && <br />}
            {networkMetadata?.symbol}
          </Text>
        </Flex>
      ) : (
        <Button
          px={6}
          borderRadius="8px"
          leftIcon={
            error || switchError ? (
              <Icon as={FiAlertTriangle} />
            ) : (
              <Icon as={IoWalletOutline} />
            )
          }
          onClick={onOpen}
          iconSpacing={3}
          colorScheme={error || switchError ? "red" : "blue"}
          {...props}
        >
          {error || switchError ? "Network Error" : "Connect Wallet"}
        </Button>
      )}
    </Tooltip>
  );
};
