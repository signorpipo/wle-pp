export function save(id, value) {
    if (value != null) {
        localStorage.setItem(id, value);
    }
}

export function has(id) {
    return SaveUtils.loadString(id, null) != null;
}

export function remove(id) {
    return localStorage.removeItem(id);
}

export function clear() {
    return localStorage.clear();
}

export function load(id, defaultValue = null) {
    return SaveUtils.loadString(id, defaultValue);
}

export function loadString(id, defaultValue = null) {
    let item = localStorage.getItem(id);

    if (item == null) {
        item = defaultValue;
    }

    return item;
}

export function loadNumber(id, defaultValue = null) {
    let item = SaveUtils.loadString(id);

    if (item != null) {
        return Number(item);
    }

    return defaultValue;
}

export function loadBool(id, defaultValue = null) {
    let item = SaveUtils.loadString(id);

    if (item == "true") {
        return true;
    } else if (item == "false") {
        return false;
    }

    return defaultValue;
}

export let SaveUtils = {
    save,
    has,
    remove,
    clear,
    load,
    loadString,
    loadNumber,
    loadBool
};