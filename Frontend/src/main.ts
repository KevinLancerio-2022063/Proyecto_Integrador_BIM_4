import { bootstrapApplication } from "@angular/platform-browser";
import { appConfig } from "./app/app.config";
import { App } from "./app/app";

// Inicializa la aplicación con la configuración y el componente raíz
bootstrapApplication(App, appConfig).catch((err) =>
  console.error(err)
);