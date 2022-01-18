import useSWR from 'swr'
import { SelectOption } from './slideshow'

export const useSlideshowOptions = () => {
  return useSWR<{ slideshowOptions: SelectOption[] }>(`/api/slideshowOptions`, {
    suspense: true,
  })
}
