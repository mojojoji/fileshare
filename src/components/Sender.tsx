import React, { useState } from 'react';

import { Box, Button, Link, Flex, Center } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import { useStore } from '../stores';
import QRCode from 'qrcode.react';
import { useResizeDetector } from 'react-resize-detector';

const Sender = observer(() => {
  const [file, setFile] = useState<File | null>(null);
  const store = useStore();
  const { connect } = store;

  const { width = 128, height = 128, ref } = useResizeDetector();
  const qrSize = Math.min(width, 300);

  const handleFileChange = (e: Event) => {
    const input = e.target as HTMLInputElement;
    const selectedFiles = input.files;
    if (selectedFiles && selectedFiles.length > 0) {
      setFile(selectedFiles[0]);
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
    <Flex px={10} flexDirection="column">
      <Flex justifyContent="center" flexDirection="column">
        <Button onClick={handleUploadClick} mb={5}>
          Select file
        </Button>
        {!connect.fileMeta && <Box textAlign="center">No File selected</Box>}

        {connect.fileMeta && (
          <Box mx="auto" mb={5}>
            <Box>Filename : {connect.fileMeta.name}</Box>
            <Box>Type : {connect.fileMeta.type}</Box>
            <Box>Size : {connect.fileMeta.size}</Box>
          </Box>
        )}
      </Flex>
      {file && connect.id && (
        <Box>
          <Center padding={5} ref={ref}>
            <QRCode value={receiverUrl} size={qrSize} />
          </Center>

          <Center padding={5}>
            <Link href={receiverUrl} isExternal>
              {receiverUrl}
            </Link>
          </Center>
          {connect.isRemoteReady && <Box>Remote ready, sending file</Box>}
        </Box>
      )}
    </Flex>
  );
});

export default Sender;
