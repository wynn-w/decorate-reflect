import "reflect-metadata";
import {
  Controler,
  Get,
  Injectable,
  IpcInvoke,
  Module,
} from "./utils/decorator";
import { DecoratorTextEnum, IpcEventEnum } from "./utils/enums";
import { factory } from "./utils/factory";

@Injectable("DemoService")
export class DemoService {
  ping() {
    console.log("ping");
  }
}
@Injectable("AddService")
export class AddService {
  add() {
    console.log("add");
  }
}

@Module({
  providers: [DemoService],
  controllers: [DemoControler],
})
@Controler("/demo")
export class DemoControler {
  constructor(
    private readonly demoservice: DemoService,
    private readonly addservice: AddService
  ) {}
  @IpcInvoke(IpcEventEnum.GET_TYPE)
  getType() {}
  @IpcInvoke(IpcEventEnum.PING)
  ping() {
    return this.demoservice.ping();
  }
}
export class DemoModule {}

const controllers = [DemoControler];
for (const ctlor of controllers) {
  const controller = factory(ctlor);
  const proto = DemoControler.prototype;
  const funcs = Object.getOwnPropertyNames(proto).filter(
    (item) => typeof controller[item] === "function" && item !== "constructor"
  );

  funcs.forEach((fnName: string) => {
    let event = Reflect.getMetadata(
      DecoratorTextEnum.IPC_INVOKE,
      proto,
      fnName
    );
    if (event) {
      console.log(controller[fnName]);
      // 填写分发逻辑
    }
  });
}
