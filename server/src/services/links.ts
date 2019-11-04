import moment from 'moment';
import v5 from 'uuid/v5';

export const generateProjectLink = (projectId: string | number) => {
  const date = moment.utc().format('LL')
  return v5(`${projectId}-${date}`, v5.URL);
}