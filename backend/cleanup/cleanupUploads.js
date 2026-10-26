const fs = require('fs')
const path = require('path')

const uploadsDir = path.join(__dirname, '..', 'uploads')
const maxAgeDays = parseInt(process.env.UPLOAD_MAX_AGE_DAYS || '30', 10)

const cutoff = Date.now() - maxAgeDays * 24 * 60 * 60 * 1000

const run = async () => {
  if (!fs.existsSync(uploadsDir)) {
    console.log('Uploads dir not found, nothing to clean')
    return
  }
  const files = fs.readdirSync(uploadsDir)
  let removed = 0
  for (const f of files) {
    const p = path.join(uploadsDir, f)
    try {
      const stat = fs.statSync(p)
      if (stat.mtimeMs < cutoff) {
        fs.unlinkSync(p)
        removed++
      }
    } catch (e) { console.error('Error checking file', p, e.message) }
  }
  console.log('Cleanup complete, removed files:', removed)
}

run()
