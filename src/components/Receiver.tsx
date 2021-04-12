import { Box } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import { useParams } from 'react-router';
import { useStore } from '../stores';

const Receiver = observer(() => {
  const { remoteId }: { remoteId?: string } = useParams();

  const store = useStore();
  const { connect } = store;

  useEffect(() => {
    if (remoteId) {
      connect.connect(remoteId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connect.id, remoteId]);

  return <Box>Receiving from: {remoteId}</Box>;
});

export default Receiver;
