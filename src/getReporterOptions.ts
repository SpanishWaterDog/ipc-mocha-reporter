import { Options } from "./types/options";

export const getReporterOptions = (options?: {
  reporterOptions: Partial<Options>;
}): Partial<Options> => {
  if (!options) {
    return {};
  }
  if (options.reporterOptions) {
    return options.reporterOptions;
  }

  return Object.keys(options)
    .filter(function (key) {
      return key.indexOf("reporterOptions.") === 0;
    })
    .reduce(function (reporterOptions, key) {
      reporterOptions[key.substring("reporterOptions.".length)] = options[key];
      return reporterOptions;
    }, {});
};
