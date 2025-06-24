import { AppRegistry } from "react-native";
import App from "./App";

if (module.hot) {
  module.hot.accept();
}

const appName = "MyAlarm";

AppRegistry.registerComponent(appName, () => App);

AppRegistry.runApplication(appName, {
  initialProps: {},
  rootTag: document.getElementById("root"),
});
