function repeatValues(matches){
    const azsCounter = new Map()
    let haveRepeat = false

    for (let AZSId in matches){
        for (let terminal of matches[AZSId].terminals.split(', ')){
            if(azsCounter.has(terminal)) {
                haveRepeat = true
                break
            }
            else azsCounter.set(terminal, 1)
        }
    }
    const result = []
    if (haveRepeat){
        let maxDate = new Date('2000-01-01')
        for (let matchId in matches){
            const match = matches[matchId]
            if (new Date(match.updatedAt) > maxDate)
                maxDate = match.updatedAt
        }

        for (let matchId in matches){
            const match = matches[matchId]
            if (match.updatedAt !== maxDate)
                result.push([match.updatedAt, match.terminals])
        }
    }
    return result
}

module.exports = {repeatValues}