import React, { ReactNode } from 'react';
import './App.css';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link as RouterLink,
} from 'react-router-dom';
import Receiver from './components/Receiver';
import Sender from './components/Sender';
import { Box } from '@chakra-ui/layout';
import {
  Center,
  Button,
  Flex,
  Heading,
  Link,
  ButtonGroup,
} from '@chakra-ui/react';

function MenuItem(props: {
  to: string;
  children: ReactNode;
  active?: boolean;
}) {
  const { to, children, active = false } = props;
  return (
    <Button
      as={RouterLink}
      to={to}
      w={120}
      _active={{
        backgroundColor: 'gray.400',
      }}
    >
      {children}
    </Button>
  );
}

export default function App() {
  return (
    <Router>
      <Center w="100%">
        <Box
          flexDirection="column"
          boxShadow="base"
          p="6"
          rounded="md"
          bg="white"
          w={400}
          minH={500}
        >
          <Heading as="h1" size="lg" textAlign="center" mb={5}>
            File Share
          </Heading>
          <Flex as="nav" mb={5} justifyContent="center">
            <ButtonGroup
              spacing={5}
              border="1px"
              borderColor="gray.200"
              p={3}
              borderRadius={10}
            >
              <MenuItem to="/send">Send</MenuItem>
              <MenuItem to="/receive">Receive</MenuItem>
            </ButtonGroup>
          </Flex>

          <Switch>
            <Route path="/send">
              <Sender />
            </Route>
            <Route path="/receive/:remoteId">
              <Receiver />
            </Route>
            <Route path="/receive">
              <Receiver />
            </Route>
            <Route path="/">
              <Sender />
            </Route>
          </Switch>
        </Box>
      </Center>
    </Router>
  );
}
