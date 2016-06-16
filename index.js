import fs from 'fs'
let collections = []
let labels = []

let files = fs.readdirSync('./src')
files = files.filter((file) => file.endsWith('.json'))

files.forEach((file) => {
  const data = fs.readFileSync(`./src/${file}`, 'utf8')
  const json = JSON.parse(data)

  collections = collections.concat(json.collections)
  labels = labels.concat(json.labels)
})

fs.access('./build', fs.R_OK | fs.W_OK, (err) => {
  if (err) {
    fs.mkdirSync('./build')
  }

  fs.writeFile('build/collections.json', JSON.stringify(collections))
  fs.writeFile('build/labels.json', JSON.stringify(labels))
})
