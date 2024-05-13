import "reflect-metadata";

type xxType<T = any> = new (...args: any[]) => T;
// 不带参
function animal(target: xxType, context?: DecoratorContext) {
  // console.log(target);
  return class extends target {
    code: "" | undefined;
  };
}
// 带参
function animal1<T extends xxType>(type: string = "") {
  return (target: T, context?: DecoratorContext): T => {
    return class extends target {
      type: string = type;
    };
  };
}
function getter(target: any, key: string): any {
  console.log("getter..", key, target, target[key]); // getter.. name {} undefined
}
function logger(msg: string) {
  return (value: any, key: string): any => {
    return (initialValue: string) => {
      console.log("Hijinking log", msg); // 未执行
      return initialValue;
    };
  };
}
@animal1("humanben")
class Person {
  private type: string = "";
  @logger("inject")
  @getter
  name: string = "init";
  constructor({ name = "" }) {
    this.name = name;
  }
  getType() {
    return this.type;
  }
}
const person = new Person({ name: "xiaoming" });
console.log(person.getType());
console.log("print person.name", person.name);
Reflect.defineMetadata("class", "person", Person);
console.log(Reflect.getMetadata("class", Person));
