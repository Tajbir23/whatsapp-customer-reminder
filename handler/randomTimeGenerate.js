const randomTImeGenerate = async () => {
    // randomly 1-3 মিনিট + random milliseconds delay
    const randomMinutes = Math.floor(Math.random() * 3) + 1 // 1 থেকে 3
    const randomSeconds = Math.floor(Math.random() * 60) // 0 থেকে 59 seconds
    const randomMilliseconds = Math.floor(Math.random() * 1000) // 0 থেকে 999 ms
    const delayMs = (randomMinutes * 60000) + (randomSeconds * 1000) + randomMilliseconds

    const totalSeconds = Math.floor(delayMs / 1000)
    console.log(`⏳ Waiting ${randomMinutes}m ${randomSeconds}s ${randomMilliseconds}ms (${totalSeconds}s total) before next message...`)
    return delayMs
}

module.exports = randomTImeGenerate