import { requestTypeList } from "./constants";

export type ClassType<T = any> = new (...args: any[]) => T;

export type RequestType = (typeof requestTypeList)[number];