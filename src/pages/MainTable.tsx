import {
  Box,
  Button,
  HStack,
  Input,
  Spinner,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { I18n, useI18nState } from "../store/useI18nState";
import { useCallback, useMemo, useState } from "react";
import { useMutation } from "react-query";
import { autocompleteI18nObject } from "../api/autocompleteI18nObject";

export const MainTable = () => {
  const { i18n, addTranslation, addKey, reset, setI18n } = useI18nState();
  const [newKey, setNewKey] = useState("");
  const [pauseAutocomplete, setPauseAutocomplete] = useState(false);

  const handleAddKey = useCallback(() => {
    if (newKey) {
      addKey(newKey.toLowerCase().split(" ").join("-"));
      setNewKey("");
    }
  }, [newKey, addKey]);

  console.log(i18n);

  const setChatGPTPause = () => {
    setPauseAutocomplete(true);
    setTimeout(() => {
      setPauseAutocomplete(false);
    }, 10000);
  };

  const { mutate, isLoading } = useMutation({
    mutationFn: async () => await autocompleteI18nObject(i18n),
    onSuccess: (data: I18n) => {
      console.log("success", data);
      setI18n(data);
      setChatGPTPause();
    },
    onError: (error) => {
      console.error(error);
      setChatGPTPause();
    },
  });

  const autocomplete = useCallback(() => {
    mutate();
  }, [mutate]);

  const autocompleteButtonText = useMemo(() => {
    if (isLoading) {
      return <Spinner />;
    }
    return pauseAutocomplete ? "need to recharge ChatGPT..." : "Autogenerate";
  }, [isLoading, pauseAutocomplete]);

  return (
    <Box>
      <Table>
        <Thead>
          <Tr>
            <Th>Key</Th>
            {Object.entries(i18n).map(([language]) => (
              <Th key={language}>{language}</Th>
            ))}
          </Tr>
        </Thead>
        <Tbody>
          {Object.keys(i18n.english).map((tag) => (
            <Tr key={tag}>
              <Td>{tag}</Td>
              {Object.entries(i18n).map(([language, translations]) => (
                <Td key={language}>
                  <Input
                    value={translations[tag] || ""}
                    onChange={(e) => {
                      addTranslation(language, tag, e.target.value);
                    }}
                  ></Input>
                </Td>
              ))}
            </Tr>
          ))}
          <Tr>
            <Td>
              <Input
                value={newKey}
                onChange={(e) => setNewKey(e.target.value)}
              ></Input>
            </Td>
            <Td>
              <Button
                onClick={handleAddKey}
                colorScheme="green"
                disabled={!newKey}
              >
                Add key
              </Button>
            </Td>
            {Array.from(Array(Object.keys(i18n).length - 1).keys()).map(
              (index) => (
                <Td key={index} />
              )
            )}
          </Tr>
        </Tbody>
      </Table>
      <HStack>
        <Button onClick={autocomplete} colorScheme="purple" m={4}>
          {autocompleteButtonText}
        </Button>
        <Button
          onClick={reset}
          colorScheme="red"
          m={4}
          disabled={pauseAutocomplete}
        >
          Reset
        </Button>
      </HStack>
    </Box>
  );
};
