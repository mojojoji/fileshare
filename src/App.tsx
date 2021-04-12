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
import { Flex, Heading, Link, Spacer } from '@chakra-ui/react';

function MenuItem(props: { to: string; children: ReactNode }) {
  return (
    <Link as={RouterLink} to={props.to} p={3} display="inline-block">
      {props.children}
    </Link>
  );
}

export default function App() {
  return (
    <Router>
      <Box>
        <Flex
          as="nav"
          borderBottomWidth="1px"
          borderBottomStyle="solid"
          borderColor="gray.200"
          px={5}
          mb={5}
        >
          <Heading as="h1" size="md" alignItems="center" display="flex">
            File Share
          </Heading>
          <Spacer />
          <Box>
            <MenuItem to="/send">Send</MenuItem>
            <MenuItem to="/receive">Receive</MenuItem>
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
