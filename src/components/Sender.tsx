import React, { useEffect, useState } from 'react';

import { Box, Button, Link } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import { useStore } from '../stores';
import QRCode from 'qrcode.react';

const Sender = observer(() => {
  const [file, setFile] = useState<File | null>(null);
  const store = useStore();
  const { connect } = store;

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
    <Box>
      Test: {connect.id}
      <Box>
        {!connect.fileMeta && <Box>No File selected</Box>}

        {connect.fileMeta && (
          <Box>
            File Selected
            <Box>Filename : {connect.fileMeta.name}</Box>
            <Box>Type : {connect.fileMeta.type}</Box>
            <Box>Size : {connect.fileMeta.size}</Box>
          </Box>
        )}
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
