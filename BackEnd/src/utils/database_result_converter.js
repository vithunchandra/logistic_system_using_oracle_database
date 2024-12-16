function convertToArray(results){
    return results.length > 0 ? results : []   
}

function convertToSingleObject(results){
    return results.length > 0 ? results[0] : undefined
}

export {convertToArray, convertToSingleObject}