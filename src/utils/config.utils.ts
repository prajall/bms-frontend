import * as fs from "fs";
import * as path from "path";

const CONFIG_PATH = path.join(__dirname, "../../config.json");

export const readConfig = () => {
  try {
    const configData = fs.readFileSync(CONFIG_PATH, "utf8");
    return JSON.parse(configData);
  } catch (error) {
    console.error("Error reading config file:", error);
    return {};
  }
};

// This function will also create a new field if it doesn't exist
export const updateConfig = (key: string, value: any): boolean => {
  try {
    const config = readConfig();
    config[key] = value;

    fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2));
    return true;
  } catch (error) {
    console.error("Error updating config file:", error);
    return false;
  }
};

export const getConfigValue = (key: string): any => {
  try {
    const config = readConfig();

    if (!(key in config)) {
      return null;
    }

    return config[key];
  } catch (error) {
    console.error("Error getting config value:", error);
    return null;
  }
};
