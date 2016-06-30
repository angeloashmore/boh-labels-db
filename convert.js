import { readFileSync } from 'fs'
import yaml from 'js-yaml'
import uuid from 'node-uuid'
import json from 'format-json'
import { flatten, intersection, isEqual, uniq } from 'lodash'

const files = process.argv.slice(2)

const convertLabels = (filePath) => {
  const data = yaml.safeLoad(readFileSync(filePath, 'utf-8'))

  const labels = Object.entries(data.labels).map(([key, data]) => {
    const metadataEntries = Object.entries(data)
                                  .filter(([k]) => !k.startsWith('_'))

    let metadata = {}
    metadataEntries.forEach(([k, v]) => metadata[k] = v)

    return {
      id: uuid.v4(),
      key,
      upc: data._upc,
      tag_color: data._tag_color,
      category: data._category.join(' '),
      metadata
    }
  })

  return labels
}

const labels = flatten(files.map(convertLabels))

const categories = uniq(labels.map((label) => label.category)).map((x) => x.split(' '))
const collectionKey = intersection(...categories).join(' ')

const collections = [
  {
    id: uuid.v4(),
    key: collectionKey,
    label_ids: labels.map((label) => label.id)
  }
]

console.log(json.plain({ collections, labels }))
