import React from 'react';
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
import { Flex, Heading, Link, Spacer } from '@chakra-ui/react';

export default function App() {
  return (
    <Router>
      <Box>
        <Flex as="nav">
          <Heading as="h1" size="md">
            File Share
          </Heading>
          <Spacer />
          <Box>
            <Link as={RouterLink} to="/send">
              Send
            </Link>
            <Link as={RouterLink} to="/receive">
              Receive
            </Link>
          </Box>
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
    </Router>
  );
}
