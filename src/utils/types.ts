import { requestTypeList } from "./constants";

export type ClassType<T = any> = new (...args: any) => T;

export type RequestType = (typeof requestTypeList)[number];
export type ModulePropsType = {
  controllers?: any[];
  providers?: any[];
  injects?: any[];
  imports?: any[];
};
