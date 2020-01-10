import { useEffect, useState, useCallback } from 'react';
import YAML from 'yaml';
import { useFlexgetAPI } from 'core/api';
import { Method } from 'utils/fetch';
import { useGlobalInfo } from 'core/status/hooks';

interface RawConfigResp {
  rawConfig: string;
}

interface MessageResponse {
  message: string;
}

export const useGetConfig = () => {
  const [get, getRequest] = useFlexgetAPI<RawConfigResp>('/server/raw_config');
  const [post, postRequest] = useFlexgetAPI<MessageResponse>('/server/raw_config', Method.Post);
  const [config, setConfig] = useState('');
  const pushInfo = useGlobalInfo();

  useEffect(() => {
    const fn = async () => {
      const resp = await getRequest();
      if (resp.ok) {
        setConfig(atob(resp.data.rawConfig));
      }
    };

    fn();
  }, [getRequest]);

  const saveConfig = useCallback(
    async (v: string) => {
      const resp = await postRequest({ rawConfig: btoa(v) });
      if (resp.ok) {
        setConfig(v);
        pushInfo(resp.data.message);
      }
      return resp;
    },
    [postRequest, pushInfo],
  );

  return [{ config, state: { get, post } }, saveConfig] as const;
};

export const useGetVariables = () => {
  const [get, getRequest] = useFlexgetAPI('/variables');
  const [post, postRequest] = useFlexgetAPI('/variables', Method.Put);
  const [variables, setVariables] = useState('');
  const pushInfo = useGlobalInfo();

  useEffect(() => {
    const fn = async () => {
      const resp = await getRequest();
      if (resp.ok) {
        setVariables(YAML.stringify(resp.data));
      }
    };

    fn();
  }, [getRequest]);

  const saveVariables = useCallback(
    async (v: string) => {
      const resp = await postRequest(YAML.parse(v));
      if (resp.ok) {
        setVariables(v);
        pushInfo('Variables successfully saved');
      }
      return resp;
    },
    [postRequest, pushInfo],
  );

  return [{ variables, state: { get, post } }, saveVariables] as const;
};