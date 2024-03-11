import { AxiosResponse } from "axios";
import axiosInstance from "../config/axios";
import appendOptionalHeaders from "../utils/axiosHelper";
import { AxiosHeaders } from "../interfaces/axios/IAxiosHeaders";
import { Environment } from "../enums/Enums";
import { IMonitorGroupListByUser } from "../interfaces/IMonitorGroupListByUser";
import { IMonitor } from "../interfaces/IMonitor";

const responseBody = (response: AxiosResponse) => response.data;

const requests = {
  get: (url: string, headers?: AxiosHeaders) =>
    axiosInstance.monitoring.get(url, { headers }).then(responseBody),
  post: (url: string, body?: Object, headers?: AxiosHeaders, config?: Object) =>
    axiosInstance.monitoring
      .post(url, body, { headers, ...config })
      .then(responseBody),
  put: (url: string, body: Object, headers?: AxiosHeaders) =>
    axiosInstance.monitoring.put(url, body, { headers }).then(responseBody),
};

const MonitorService = {
  get: async (id: Environment, headers?: AxiosHeaders): Promise<IMonitor[]> =>
    await requests.get(
      `Monitor/monitorListByMonitorGroupIds/${id}`,
      appendOptionalHeaders(headers)
    ),
  getMonitorGroupListByUser: async (
    id: Environment,
    headers?: AxiosHeaders
  ): Promise<IMonitorGroupListByUser[]> =>
    await requests.get(
      `MonitorGroup/monitorGroupListByUser/${id}`,
      appendOptionalHeaders(headers)
    ),
};

export default MonitorService;
