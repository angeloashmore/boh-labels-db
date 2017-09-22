import fs from 'fs'
import path from 'path'
import uuid from 'node-uuid'
import json from 'format-json'

const newUUIDs = filepath => {
  const file = require(filepath, { encoding: 'utf-8' })

  const uuids = []

  file.labels = file.labels.map(label => {
    const id = uuid.v4()

    label.id = id
    uuids.push(id)

    return label
  })

  file.collections = file.collections.map(collection => {
    collection.id = uuid.v4()
    collection.label_ids = uuids

    return collection
  })

  fs.writeFileSync(filepath, json.plain(file))
}

if (process.argv[2] === 'all') {
  const dir = path.join(process.cwd(), 'src')
  const filepaths = fs.readdirSync(dir)
  filepaths.forEach(filepath => newUUIDs(path.join(process.cwd(), 'src', filepath)))
} else {
  const filepath = path.join(process.cwd(), process.argv[2])
  newUUIDs(filepath)
}
