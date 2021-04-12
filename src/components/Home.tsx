import { Container } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import Sender from './Sender';

const Home = observer(() => {
  return (
    <Container>
      <Sender />
    </Container>
  );
});

export default Home;
