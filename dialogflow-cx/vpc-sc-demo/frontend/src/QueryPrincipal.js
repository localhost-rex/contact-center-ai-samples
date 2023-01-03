// Copyright 2022 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import React from 'react';
import {useEffect, useRef} from 'react';
import {QueryClient, QueryClientProvider, useQuery} from 'react-query';
import axios from 'axios';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Login from '@mui/icons-material/Login';
import Logout from '@mui/icons-material/Logout';

function GetPrincipal(props) {
  const {data} = useQuery(props.endpoint, () =>
    axios.get(props.endpoint).then(res => res.data)
  );
  const tooltipTitle = useRef(null);
  const href = useRef(null);
  const loginEnabled = useRef(false);
  const principal = useRef(null);
  useEffect(() => {
    if (data) {
      props.dataModel.projectData.principal.set(data.principal);
      principal.current = data ? data.principal : '';
      const queryStr = new URLSearchParams(
        props.dataModel.queryParams
      ).toString();

      if (
        principal.current === '' ||
        principal.current === null ||
        principal.current === undefined
      ) {
        tooltipTitle.current = 'Login';
        href.current = `http://${window.location.host}/session?${queryStr}`;
        loginEnabled.current = true;
      } else {
        tooltipTitle.current = 'Logout';
        href.current = `http://${window.location.host}/logout?${queryStr}`;
        loginEnabled.current = false;
      }
    }
  });

  return (
    <div>
      <TextField
        sx={{mx: 2, width: 350, color: 'red'}}
        label={'Principal'}
        variant="outlined"
        value={principal.current === null ? '' : principal.current}
        placeholder={'Principal'}
        disabled={true}
        InputLabelProps={{shrink: principal.current}}
        InputProps={{
          notched: false,
          style: {
            backgroundColor: loginEnabled.current ? '#ffcdd2' : 'transparent',
          },
          endAdornment: (
            <Tooltip
              title={tooltipTitle.current}
              disableInteractive
              arrow
              placement="top"
            >
              <InputAdornment position="end">
                <IconButton
                  edge="end"
                  variant="outlined"
                  href={href.current}
                  onClick={() => {
                    props.dataModel.loginRedirect.set(true);
                  }}
                >
                  {loginEnabled.current ? <Logout /> : <Login />}
                </IconButton>
              </InputAdornment>
            </Tooltip>
          ),
        }}
      />
    </div>
  );
}

function QueryPrincipal(props) {
  const queryClient = new QueryClient();
  return (
    <div>
      <QueryClientProvider client={queryClient}>
        <GetPrincipal endpoint="/get_principal" dataModel={props.dataModel} />
      </QueryClientProvider>
    </div>
  );
}

export {QueryPrincipal};