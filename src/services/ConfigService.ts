import yaml from "yaml";
import fs from "fs";

export default class ConfigService {
  public static getConfig(): any {
    try {
      // Define the default values
      const defaults = {
        main: {
          interval: "15m",
        },
        mqtt: {
          ha_discovery: true,
          connectionUri: "mqtt://localhost:1883",
          topic: "mqdockerup",
          clientId: "mqdockerup",
          username: "ha",
          password: "12345678",
          connectTimeout: 60,
          protocolVersion: 5,
          qos: 2,
          retain: false,
        },
      };

      // Parse the config file
      const config = yaml.parse(fs.readFileSync("config.yaml", "utf8"));

      // Override the config values with the environment variables
      for (const key of Object.keys(config)) {
        config[key] = process.env[key] ?? config[key];
      }

      // Override the main values with the environment variables
      for (const key of Object.keys(config.main)) {
        config.main[key] =
          process.env[`MAIN_${key.toUpperCase()}`] ?? config.main[key];
      }

      // Override the mqtt values with the environment variables
      for (const key of Object.keys(config.mqtt)) {
        config.mqtt[key] =
          process.env[`MQTT_${key.toUpperCase()}`] ?? config.mqtt[key];
      }

      // Merge the config values with the default values
      return Object.assign(defaults, config);
    } catch (e) {
      console.log(e);
    }
  }
}
