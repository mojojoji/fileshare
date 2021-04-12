import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import { useParams } from 'react-router';
import { useStore } from '../stores';
import { Box, Button } from '@chakra-ui/react';

const Receiver = observer(() => {
  const { remoteId }: { remoteId?: string } = useParams();

  const store = useStore();
  const { connect } = store;

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

  return (
    <Box>
      Receiving from: {remoteId}
      <Box>
        {!connect.fileMeta && <Box>No File available</Box>}

        {connect.fileMeta && (
          <Box>
            File Selected
            <Box>Filename : {connect.fileMeta.name}</Box>
            <Box>Type : {connect.fileMeta.type}</Box>
            <Box>Size : {connect.fileMeta.size}</Box>
          </Box>
        )}
        <Button onClick={handleDownloadClick}>Download</Button>
      </Box>
    </Box>
  );
});

export default Receiver;
