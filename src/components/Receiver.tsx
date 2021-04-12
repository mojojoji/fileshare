import { observer } from 'mobx-react-lite';
import React, { useEffect } from 'react';
import { useParams } from 'react-router';
import { useStore } from '../stores';
import { Box, Button, Center, Flex, Link } from '@chakra-ui/react';
import QrReader from 'react-qr-reader';
import { useHistory, Link as RouterLink } from 'react-router-dom';

const Receiver = observer(() => {
  const { remoteId }: { remoteId?: string } = useParams();

  const store = useStore();
  const { connect } = store;

  const history = useHistory();

  useEffect(() => {
    if (remoteId && connect.id) {
      connect.connectToRemote(remoteId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connect.id, remoteId]);

  const handleDownloadClick = () => {
    console.log('Download click');
    connect.sendFileDownloadRequest();
  };

  const handleQRScan = (data: string | null) => {
    if (data) {
      console.log('Qr data', data);
      const path = data;
      const remoteIdFromQr = path.substring(path.lastIndexOf('/') + 1).trim();
      if (remoteIdFromQr.length > 0) {
        console.log('Qr Remite', remoteIdFromQr);
        history.push(`/receive/${remoteIdFromQr}`);
      }
    }
  };

  const handleQRError = (error: Error) => {
    console.log('Error', error);
  };

  return (
    <Box>
      <Center flexDir="column">
        {!remoteId && (
          <Box mb={5}>
            <QrReader
              delay={300}
              onError={handleQRError}
              onScan={handleQRScan}
              style={{ width: '300px', height: '300px' }}
            />
          </Box>
        )}

        {remoteId && connect.fileMeta && (
          <Flex mb={5} flexDirection="column">
            <Box mb={5}>
              File Selected
              <Box>Filename : {connect.fileMeta.name}</Box>
              <Box>Type : {connect.fileMeta.type}</Box>
              <Box>Size : {connect.fileMeta.size}</Box>
            </Box>
            <Button onClick={handleDownloadClick}>Download</Button>
          </Flex>
        )}

        {remoteId && !connect.fileMeta && (
          <Flex mb={5} flexDirection="column" alignItems="center">
            <Box>Could not get file</Box>
            <Link as={RouterLink} to="/receive/" py={5}>
              <Button>Retry</Button>
            </Link>
          </Flex>
        )}
      </Center>
    </Box>
  );
});

export default Receiver;
