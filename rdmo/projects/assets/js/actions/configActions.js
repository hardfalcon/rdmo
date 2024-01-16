import { UPDATE_CONFIG } from './types'

export function updateConfig(path, value) {
  return {type: UPDATE_CONFIG, path, value}
}
