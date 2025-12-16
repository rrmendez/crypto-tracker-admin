/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * https://github.com/you-dont-need/You-Dont-Need-Lodash-Underscore?tab=readme-ov-file#_flatten
 * https://github.com/you-dont-need-x/you-dont-need-lodash
 */

export function flattenArray<T>(list: T[], key = "children"): T[] {
  let children: T[] = [];

  const flatten = list?.map((item: any) => {
    if (item[key] && item[key].length) {
      children = [...children, ...item[key]];
    }
    return item;
  });

  return flatten?.concat(children.length ? flattenArray(children, key) : children);
}

// ----------------------------------------------------------------------

export function flattenDeep(array: any): any[] {
  const isArray = array && Array.isArray(array);

  if (isArray) {
    return array.flat(Infinity);
  }
  return [];
}

// ----------------------------------------------------------------------

export function orderBy<T>(array: T[], properties: (keyof T)[], orders?: ("asc" | "desc")[]): T[] {
  return array.slice().sort((a, b) => {
    for (let i = 0; i < properties.length; i += 1) {
      const property = properties[i];
      const order = orders && orders[i] === "desc" ? -1 : 1;

      const aValue = a[property];
      const bValue = b[property];

      if (aValue < bValue) return -1 * order;
      if (aValue > bValue) return 1 * order;
    }
    return 0;
  });
}

// ----------------------------------------------------------------------

export function keyBy<T>(
  array: T[],
  key: keyof T
): {
  [key: string]: T;
} {
  return (array || []).reduce((result, item) => {
    const keyValue = key ? item[key] : item;

    return { ...result, [String(keyValue)]: item };
  }, {});
}

// ----------------------------------------------------------------------

export function sumBy<T>(array: T[], iteratee: (item: T) => number): number {
  return array.reduce((sum, item) => sum + iteratee(item), 0);
}

// ----------------------------------------------------------------------

export function isEqual(a: any, b: any): boolean {
  if (a === null || a === undefined || b === null || b === undefined) {
    return a === b;
  }

  if (typeof a !== typeof b) {
    return false;
  }

  if (typeof a === "string" || typeof a === "number" || typeof a === "boolean") {
    return a === b;
  }

  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) {
      return false;
    }

    return a.every((item, index) => isEqual(item, b[index]));
  }

  if (typeof a === "object" && typeof b === "object") {
    const keysA = Object.keys(a!);
    const keysB = Object.keys(b!);

    if (keysA.length !== keysB.length) {
      return false;
    }

    return keysA.every((key) => isEqual(a[key], b[key]));
  }

  return false;
}

// ----------------------------------------------------------------------

function isObject(item: any) {
  return item && typeof item === "object" && !Array.isArray(item);
}

export const merge = (target: any, ...sources: any[]): any => {
  if (!sources.length) return target;

  const source = sources.shift();

  for (const key in source) {
    if (isObject(source[key])) {
      if (!target[key]) Object.assign(target, { [key]: {} });
      merge(target[key], source[key]);
    } else {
      Object.assign(target, { [key]: source[key] });
    }
  }

  return merge(target, ...sources);
};

// ----------------------------------------------------------------------

export function isOnOther(item: any, container: any) {
  if (isObject(container) || isObject(item)) return false;

  if (Array.isArray(container)) {
    if (typeof item === "string") {
      return container.includes(item);
    }

    if (Array.isArray(item)) {
      return container.some((element) => item.includes(element));
    }

    return false;
  }

  if (typeof container === "string" && typeof item === "string") {
    return container.includes(item);
  }

  return false;
}

// ------------------------------------------------------------------------------

export const byteToKb = (byte: number): string => {
  const mb = byte / 1024;
  return mb.toFixed(2);
};

// ------------------------------------------------------------------------------

export const getExtension = (url: string): string => {
  const filename = url.substring(url.lastIndexOf("/") + 1);
  return filename.substring(filename.lastIndexOf(".") + 1).toLowerCase();
};

// ------------------------------------------------------------------------------

export const getMessageError = (error: any) => {
  if (typeof error === "string") return error;

  if (error.statusCode === 500) return error.name;

  return error.message;
};

// ----------------------------------------------------------------------

export const formatDateTime = (datetime: string): string => {
  //This function format the datetime to YYYY-MM-DD HH-MM-SS
  const date = new Date(datetime);
  const year = date.getFullYear();
  const month = ("0" + (date.getMonth() + 1)).slice(-2);
  const day = ("0" + date.getDate()).slice(-2);
  const hours = ("0" + date.getHours()).slice(-2);
  const minutes = ("0" + date.getMinutes()).slice(-2);
  const seconds = ("0" + date.getSeconds()).slice(-2);
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};
