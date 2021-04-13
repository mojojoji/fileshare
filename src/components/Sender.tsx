import React, { useEffect, useState } from 'react';

import { Box, Button, Link, Flex, Center, Icon, Text } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import { useStore } from '../stores';
import QRCode from 'qrcode.react';
import { FaFile } from 'react-icons/fa';

const Sender = observer(() => {
  const store = useStore();
  const { connect } = store;

  const handleFileChange = (e: Event) => {
    const input = e.target as HTMLInputElement;
    const selectedFiles = input.files;
    if (selectedFiles && selectedFiles.length > 0) {
      const selectedFile = selectedFiles[0];
      connect.setFileToSend(selectedFile);
    }
  };

  const handleUploadClick = () => {
    const fileSelector = document.createElement('input');
    fileSelector.setAttribute('type', 'file');
    fileSelector.addEventListener('change', handleFileChange);
    fileSelector.click();
  };

  const receiverUrl = `${window.location.origin}/receive/${connect.id}`;

  return (
    <Flex flexDirection="column">
      <Flex justifyContent="center" flexDirection="column">
        {!connect.fileMeta && (
          <Box textAlign="center">
            <Button onClick={handleUploadClick} mb={5}>
              Select file
            </Button>
          </Box>
        )}

        {connect.fileMeta && connect.fileToSend && (
          <Flex
            mb={5}
            boxShadow="xs"
            rounded="md"
            fontSize="sm"
            color="gray.600"
            flexDir="column"
            p={3}
          >
            <Center mb={5}>
              <Center mr={5}>
                <Icon as={FaFile} boxSize={8} />
              </Center>
              <Box>
                <Text fontWeight="semibold" fontSize="md">
                  {connect.fileMeta.name}
                </Text>
                <Text fontSize="sm">
                  {(connect.fileMeta.size / 1024).toFixed(2)} KB
                </Text>
              </Box>
            </Center>
            <Center mb={5}>
              <QRCode value={receiverUrl} size={250} />
            </Center>
            <Link href={receiverUrl} isExternal as={Button}>
              Link
            </Link>
          </Flex>
        )}
      </Flex>
    </Flex>
  );
});

export default Sender;
