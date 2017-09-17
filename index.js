import fs from 'fs'
let collections = []
let labels = []

let files = fs.readdirSync('./src')
files = files.filter((file) => file.endsWith('.json'))

files.forEach((file) => {
  const data = fs.readFileSync(`./src/${file}`, 'utf8')
  const json = JSON.parse(data)

  // Removes extra IDs in collections
  if (json.collections) {
    const collections = json.collections
    const allLabelIds = json.labels.map(label => label.id)

    collections.forEach((coll, index) => {
      const collIds = coll.label_ids
      const includedIds = collIds.filter(id => !allLabelIds.includes(id))

      json.collections[index].label_ids = includedIds
    })
  }

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
