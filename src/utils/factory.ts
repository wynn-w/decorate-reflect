import { DecoratorTextEnum } from "./enums";
const ExistInjectableMap = new Map<string, any>();
export function factory(constructor: any) {
  console.log(constructor);
  const paramtypes = Reflect.getMetadata("design:paramtypes", constructor);
  console.log(222111, paramtypes);
  const services = paramtypes?.map((service: any) => {
    const name = Reflect.getOwnMetadata(DecoratorTextEnum.SERVICE, service);
    if (!ExistInjectableMap.has(name)) {
      ExistInjectableMap.set(name, service);
    }
    const item = ExistInjectableMap.get(name);
    // const item = ExistInjectable[name] || factory(service);
    // ExistInjectable[name] = item;
    return item;
  });

  return new constructor(...services);
}
