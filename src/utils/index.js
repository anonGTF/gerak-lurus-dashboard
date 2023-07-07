import { format } from "date-fns"

export const formatDate = (date) => {
  return format(date, 'HH:mm dd MMMM yyyy')
}