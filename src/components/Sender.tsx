import React, { useEffect, useState } from 'react';

import { Box, Button, Link } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import { useStore } from '../stores';
import QRCode from 'qrcode.react';

const Sender = observer(() => {
  const [file, setFile] = useState<File | null>(null);
  const store = useStore();
  const { connect } = store;

  useEffect(() => {
    sendFile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connect.isRemoteReady]);

  const sendFile = () => {
    if (connect.isRemoteReady && file) {
      connect.sendFile(file);
    }
  };

  const handleFileChange = (e: Event) => {
    const input = e.target as HTMLInputElement;
    const files = input.files;
    if (files && files.length > 0) {
      setFile(files[0]);
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
    <Box>
      Test: {connect.id}
      <Box>
        <Box>File Selected: {file ? file.name : 'No file selected'}</Box>
        <Button onClick={handleUploadClick}>Select file</Button>
      </Box>
      {file && connect.id && (
        <Box>
          <QRCode value={receiverUrl} />
          <Link href={receiverUrl} isExternal>
            {receiverUrl}
          </Link>
          {connect.isRemoteReady && <Box>Remote ready, sending file</Box>}
        </Box>
      )}
    </Box>
  );
});

export default Sender;
