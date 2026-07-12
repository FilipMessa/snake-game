export type KeyValueStorage = Pick<Storage, "getItem" | "setItem">;
export type ReportStorageError = (message: string, error: unknown) => void;

type JsonStorageOptions<
  Value,
  LoadArguments extends ReadonlyArray<unknown>,
> = Readonly<{
  defaultValue: Value;
  key: string;
  loadErrorMessage: string;
  restore(value: unknown, ...loadArguments: LoadArguments): Value;
  saveErrorMessage: string;
}>;

export interface JsonStorage<
  Value,
  LoadArguments extends ReadonlyArray<unknown>,
> {
  load(...loadArguments: LoadArguments): Value;
  save(value: Value): void;
}

export function createJsonStorage<
  Value,
  LoadArguments extends ReadonlyArray<unknown>,
>(
  storage: KeyValueStorage,
  reportError: ReportStorageError,
  options: JsonStorageOptions<Value, LoadArguments>,
): JsonStorage<Value, LoadArguments> {
  let hasReportedLoadError = false;
  let hasReportedSaveError = false;

  return {
    load(...loadArguments): Value {
      try {
        const serializedValue = storage.getItem(options.key);

        if (serializedValue === null) {
          return options.defaultValue;
        }

        return options.restore(JSON.parse(serializedValue), ...loadArguments);
      } catch (error) {
        if (!hasReportedLoadError) {
          hasReportedLoadError = true;
          reportError(options.loadErrorMessage, error);
        }

        return options.defaultValue;
      }
    },
    save(value): void {
      try {
        storage.setItem(options.key, JSON.stringify(value));
      } catch (error) {
        if (!hasReportedSaveError) {
          hasReportedSaveError = true;
          reportError(options.saveErrorMessage, error);
        }
      }
    },
  };
}
