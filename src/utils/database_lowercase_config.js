function databaseLowercaseConfig(metaData) {
    // Tells the database to return column names in lowercase
    metaData.name = metaData.name.toLowerCase();
}

export {databaseLowercaseConfig}