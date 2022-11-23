PP.SaveUtils = {
    save: function (id, value) {
        if (value != null) {
            localStorage.setItem(id, value);
        }
    },
    has: function (id) {
        return PP.SaveUtils.loadString(id, null) != null;
    },
    delete: function (id) {
        return localStorage.removeItem(id);
    },
    clear: function () {
        return localStorage.clear();
    },
    load: function (id, defaultValue = null) {
        return PP.SaveUtils.loadString(id, defaultValue);
    },
    loadString: function (id, defaultValue = null) {
        let item = localStorage.getItem(id);

        if (item == null) {
            item = defaultValue;
        }

        return item;
    },
    loadNumber: function (id, defaultValue = null) {
        let item = PP.SaveUtils.loadString(id);

        if (item != null) {
            return Number(item);
        }

        return defaultValue;
    },
    loadBool: function (id, defaultValue = null) {
        let item = PP.SaveUtils.loadString(id);

        if (item == "true") {
            return true;
        } else if (item == "false") {
            return false;
        }

        return defaultValue;
    }
};