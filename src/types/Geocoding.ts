import { Geometry } from './Geometry'

export type GeoCoding = {
  features: {
    geometry: Geometry
    properties: {
      id: string
      label: string
    }
  }[]
}
