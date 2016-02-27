
if (!Object.prototype.test_prototype_entry) {
    Object.prototype.test_prototype_entry =
        "Don't use for..in to enumerate Object properties, as users are free to " +
        "add entries to the Object prototype, for example for polyfills. " +
        "You should instead use\n" +
        "  for (let i in xs) { if (!xs.hasOwnProperty(i)) continue; var x = xs[i]; ... }";
}

if (!Array.prototype.test_prototype_entry) {
    Array.prototype.test_prototype_entry =
        "Don't use for..in to enumerate Array properties, as users are free to " +
        "add entries to the Array prototype, for example for polyfills. " +
        "You should instead use\n" +
        "  for (let i in xs) { if (!xs.hasOwnProperty(i)) continue; var x = xs[i]; ... }";
}
