import * as React from 'react';
import { hot } from 'react-hot-loader';
import store from 'store';
import history from 'core/history';
import { StylesProvider } from '@material-ui/styles';
import { Provider } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import { ConnectedRouter } from 'connected-react-router';
import { MuiThemeProvider } from '@material-ui/core/styles';
import { Global, css } from '@emotion/core';
import theme from 'theme';
import PrivateRoute from 'core/routes/components/PrivateRoute';
import Layout from 'core/layout';
import Routes from 'core/routes';
import { createAsyncComponent } from 'utils/loading';
import registerHistory from 'plugins/history';
import registerLog from 'plugins/log';
import registerSeries from 'plugins/series';
import registerPendingList from 'plugins/pending-list';

registerHistory();
registerLog();
registerSeries();
registerPendingList();

const globals = css`
  html {
    font-size: 10px;
  }

  body {
    height: 100%;
    width: 100%;
    font-size: 1.6rem;
    background-color: ${theme.palette.grey['200']};
    font-family: 'Roboto';
  }

  a {
    text-decoration: none;
  }

  * {
    box-sizing: border-box;
  }

  *:focus {
    outline: none;
  }
`;

const Home = createAsyncComponent(() => import('core/home'));
const Login = createAsyncComponent(() => import('core/auth'));

const Root = () => (
  <div>
    <Global styles={globals} />
    <StylesProvider injectFirst>
      <Provider store={store}>
        <ConnectedRouter history={history}>
          <MuiThemeProvider theme={theme}>
            <div>
              <Switch>
                <Route path="/login" exact component={Login} />
                <Route
                  render={() => (
                    <Layout>
                      <Switch>
                        <PrivateRoute path="/" exact component={Home} />
                        <Route render={() => <Routes />} />
                      </Switch>
                    </Layout>
                  )}
                />
              </Switch>
            </div>
          </MuiThemeProvider>
        </ConnectedRouter>
      </Provider>
    </StylesProvider>
  </div>
);

export default hot(module)(Root);