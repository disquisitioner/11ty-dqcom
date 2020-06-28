module.exports = function (themes, id) {
        return themes.find((t) => t.id === id)
    }